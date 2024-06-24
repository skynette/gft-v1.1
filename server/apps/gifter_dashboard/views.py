from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.company_dashboard.serializers import BoxSerializer, NotificationSerializer, ShowNotificationSerializer
from apps.gft.models import Box, Notification
from apps.gft.permissions import APIPermissionValidator
from drf_spectacular.utils import extend_schema


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
