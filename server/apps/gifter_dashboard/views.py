from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model
from apps.company_dashboard.serializers import BoxSetupSerializer, BoxSerializer, DashboardSerializer, GiftSerializer, GiftSetupSerializer, NotificationSerializer, ShowNotificationSerializer
from apps.gft.models import Box, Company, CompanyUser, Gift, Notification
from apps.gft.permissions import APIPermissionValidator
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class DashboardView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_user_dashboard"]

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=DashboardSerializer,
                examples=[
                    OpenApiExample(
                        name="Dashboard Data",
                        value={
                            "total_boxes_owned": 5,
                            "boxes_received": 3,
                            "gift_boxes_opened": 2,
                            "weekdays": [1, 2, 3, 4, 5, 6, 7],
                            "gifts_given": [0, 1, 0, 0, 1, 0, 1],
                            "gifts_received": [1, 0, 2, 1, 0, 0, 1],
                        }
                    )
                ]
            ),
            401: OpenApiResponse(
                response={"detail": "Not allowed"},
                description="Unauthorized access",
                examples=[
                    OpenApiExample(
                        name="Unauthorized",
                        value={"detail": "Not allowed"}
                    )
                ]
            )
        },
        description="Returns the dashboard data for the user.",
        tags=["Gifter"]
    )
    def get(self, request, *args, **kwargs):
        if request.user.user_type == "company" or request.user.user_type == "super_admin":
            return Response({"detail": "Not allowed"}, status=status.HTTP_401_UNAUTHORIZED)
        
        gift_boxes = Box.objects.filter(user=request.user)
        gift_boxes_received = Box.objects.filter(receiver_email=request.user.email)
        boxes_received = gift_boxes_received.count()
        total_boxes_owned = gift_boxes.count()
        gift_boxes_opened = Gift.objects.filter(user=request.user, opened=True).count()

        # Get the number of gifts received everyday for the last 7 days
        days = 7
        now = timezone.now()
        gift_sent_counts = []
        gift_received_counts = []

        for i in range(days):
            start_date = now - timedelta(days=i+1)
            end_date = now - timedelta(days=i)
            sent_count = Gift.objects.filter(box_model__user=request.user, created_at__range=(start_date, end_date)).count()
            received_count = Gift.objects.filter(box_model__receiver_email=request.user.email, created_at__range=(start_date, end_date)).count()
            gift_sent_counts.append(sent_count)
            gift_received_counts.append(received_count)

        gift_sent_counts.reverse()
        gift_received_counts.reverse()

        context = {
            "total_boxes_owned": total_boxes_owned,
            "boxes_received": boxes_received,
            "gift_boxes_opened": gift_boxes_opened,
            "weekdays": list(range(1, days+1)),
            "gifts_given": gift_sent_counts,
            "gifts_received": gift_received_counts,
        }

        serializer = DashboardSerializer(context)
        return Response(serializer.data, status=status.HTTP_200_OK)


dashboard_api_view = DashboardView.as_view()


class SetupGiftBoxView(generics.GenericAPIView):
    serializer_class = BoxSetupSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_box"]

    @extend_schema(
        request=BoxSetupSerializer,
        description="Sets up a box (from gifter perspective).",
        responses={200: BoxSerializer},
        tags=["Gifter"],
    )
    def put(self, request, box_id, *args, **kwargs):
        gift_box = get_object_or_404(Box, id=box_id)
        if gift_box.is_setup:
            return Response({'message': 'Gift box is already set up.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BoxSetupSerializer(
            gift_box, data=request.data, context={'request': request})
        
        receiver = User.objects.filter(
            Q(email=gift_box.receiver_email) | Q(mobile=f"+{gift_box.receiver_phone}")
        ).first()

        # senders cannot be receiver
        if gift_box.receiver_email:
            if receiver and receiver.email == request.user.email:
                return Response({'message': 'Sender cannot be the receiver.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if gift_box.receiver_phone:
            if receiver and receiver.mobile == f"+{request.user.mobile}":
                return Response({'message': 'Sender cannot be the receiver.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # check if the person setting up the box is a company
        if request.user.user_type == "company":
            return Response({'message': 'Company cannot be the receiver.'}, status=status.HTTP_400_BAD_REQUEST)

        # Associate user with the company (using get_or_create to handle duplicates)
        with transaction.atomic():
            company_user = gift_box.box_campaign.company.owner
            company = Company.objects.get(owner=company_user)
            CompanyUser.objects.get_or_create(company=company, user=request.user)

            if serializer.is_valid():
                serializer.save(user=request.user, is_setup=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @extend_schema(
        responses={200: BoxSerializer},
        description="Returns the details of a box to be setup.",
        tags=["Gifter"],
    )
    def get(self, request, box_id, *args, **kwargs):
        gift_box = get_object_or_404(Box, id=box_id)
        serializer = BoxSerializer(gift_box)
        return Response(serializer.data, status=status.HTTP_200_OK)


setup_gift_box_api_view = SetupGiftBoxView.as_view()


class SetupGiftsView(generics.GenericAPIView):
    serializer_class = GiftSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_gift"]

    @extend_schema(
        request=GiftSetupSerializer(many=True),
        description="Updates gifts for a gift box.",
        responses={200: GiftSerializer(many=True)},
        tags=["Gifter"],
    )
    def put(self, request, box_id, *args, **kwargs):
        gift_box = get_object_or_404(Box, id=box_id, user=request.user)
        if not gift_box.is_setup:
            return Response({'message': 'Gift box is not set up.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if gift_box.is_company_setup:
            return Response({'message': 'Gift box is already set up by the company.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        gifts = []
        for gift_data in data:
            gift_id = gift_data.get('id')
            gift = get_object_or_404(Gift, id=gift_id, box_model=gift_box)
            serializer = GiftSerializer(
                gift, data=gift_data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                gifts.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Gifts updated successfully.', 'results': gifts}, status=status.HTTP_200_OK)


setup_gifts_api_view = SetupGiftsView.as_view()


class ViewBoxGiftsView(generics.GenericAPIView):
    serializer_class = GiftSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_box"]

    @extend_schema(
        request=GiftSerializer,
        responses={200: GiftSerializer(many=True)},
        description="Returns the gifts for a box.",
        tags=["Gifter"],
    )
    def get(self, request, box_id, *args, **kwargs):
        box = get_object_or_404(Box, id=box_id)
        authorized = False
        
        # Check if the request user is the owner
        if box.user == request.user:
            authorized = True
        
        # Check if the request user is the receiver
        elif request.user.email == box.receiver_email or getattr(request.user, 'mobile', None) == box.receiver_phone:
            authorized = True
        else:
            authorized = False

        if not authorized:
            return Response({"detail": "Unauthorized to view this box gifts"}, status=status.HTTP_403_FORBIDDEN)

        gifts = Gift.objects.filter(box_model=box).order_by('open_date')
        serializer = GiftSerializer(gifts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


view_box_gifts_api_view = ViewBoxGiftsView.as_view()


class EditBoxView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_box"]
    serializer_class = BoxSetupSerializer

    @extend_schema(
        request=BoxSetupSerializer,
        responses={200: BoxSerializer},
        description="Edits a gift box.",
        tags=["Gifter"],
    )
    def put(self, request, box_id, *args, **kwargs):
        box = get_object_or_404(Box, id=box_id, user=request.user)
        serializer = BoxSetupSerializer(box, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


edit_box_api_view = EditBoxView.as_view()


class BoxSentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_box"]

    @extend_schema(
        responses={200: BoxSerializer(many=True)},
        description="Returns the boxes sent by the user.",
        tags=["Gifter"],
    )
    def get(self, request, *args, **kwargs):
        if request.user.user_type == "company":
            return Response({"detail": "Not allowed"}, status=status.HTTP_401_UNAUTHORIZED)
        
        gift_boxes = Box.objects.filter(user=request.user)
        serializer = BoxSerializer(gift_boxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

box_sent_api_view = BoxSentView.as_view()


class BoxReceivedView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_box"]

    @extend_schema(
        responses={200: BoxSerializer(many=True)},
        description="Returns the boxes received by the user.",
        tags=["Gifter"],
    )
    def get(self, request, *args, **kwargs):
        if request.user.user_type == "company":
            return Response({"detail": "Not allowed"}, status=status.HTTP_401_UNAUTHORIZED)
        
        gift_boxes = Box.objects.filter(receiver_email=request.user.email)
        serializer = BoxSerializer(gift_boxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

box_received_api_view = BoxReceivedView.as_view()


class NotificationsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["view_notification"]
    serializer_class = NotificationSerializer

    @extend_schema(
        request=NotificationSerializer,
        responses={200: ShowNotificationSerializer(many=True)},
        description="Returns the notifications for the user.",
        tags=["Gifter"],
    )
    def get(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(
            user=request.user).order_by('-timestamp')
        serializer = ShowNotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


notifications_api_view = NotificationsView.as_view()


class MarkNotificationReadView(generics.GenericAPIView):
    serializer_class = NotificationSerializer

    @extend_schema(
        request=NotificationSerializer,
        responses={200: NotificationSerializer},
        description="Marks a notification as read.",
        tags=["Gifter"],
    )
    def get(self, request, notification_id, *args, **kwargs):
        notification = get_object_or_404(
            Notification, id=notification_id, user=request.user)
        notification.read = True
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response({'message': 'Notification marked as read.', "results": serializer.data}, status=status.HTTP_200_OK)


mark_notification_read_api_view = MarkNotificationReadView.as_view()
