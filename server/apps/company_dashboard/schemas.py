from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiExample,
    OpenApiParameter,
    OpenApiTypes,
)
from .serializers import CampaignSerializer, CampaignDetailSerializer, CreateCampaignSerializer

campaign_list_schema = extend_schema(
    responses={
        200: OpenApiResponse(
            response=CampaignSerializer(many=True),
            description="Successful operation",
        ),
        401: OpenApiResponse(
            response={"application/json": {}},
            description="Unauthorized",
            examples=[
                OpenApiExample(
                    name="Unauthorized",
                    value={"detail": "Authentication credentials were not provided."},
                )
            ],
        ),
        403: OpenApiResponse(
            response={"application/json": {}},
            description="Forbidden",
            examples=[
                OpenApiExample(
                    name="Forbidden",
                    value={
                        "detail": "You do not have permission to perform this action."
                    },
                )
            ],
        ),
    },
    description="Retrieve all campaigns for the authenticated company.",
    tags=["Company Area"],
)

campaign_detail_schema = extend_schema(
    responses={
        200: OpenApiResponse(
            response=CampaignDetailSerializer,
            description="Retrieve a campaign for the authenticated company.",
            examples=[
                OpenApiExample(
                    name="Success",
                    value={
                        "id": "12345",
                        "company": 1,
                        "name": "Sample Campaign",
                        "company_boxes": 1,
                        "duration": 30,
                        "num_boxes": 100,
                        "header_image": "http://example.com/media/campaigns/headers/sample_header.png",
                        "open_after_a_day": True
                    }
                )
            ]
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    name="Bad Request",
                    value={"detail": "Invalid input."}
                )
            ],
        ),
        401: OpenApiResponse(
            response={"application/json": {}},
            description="Unauthorized",
            examples=[
                OpenApiExample(
                    name="Unauthorized",
                    value={"detail": "Authentication credentials were not provided."},
                )
            ],
        ),
        403: OpenApiResponse(
            response={"application/json": {}},
            description="Forbidden",
            examples=[
                OpenApiExample(
                    name="Forbidden",
                    value={
                        "detail": "You do not have permission to perform this action."
                    },
                )
            ],
        ),
        404: OpenApiResponse(
            response={"application/json": {}},
            description="Not Found",
            examples=[
                OpenApiExample(
                    name="Not Found",
                    value={"detail": "Not found."},
                )
            ],
        ),
        500: OpenApiResponse(
            description="Server Error",
            examples=[
                OpenApiExample(
                    name="Server Error",
                    value={"detail": "An error occurred on the server."}
                )
            ],
        ),
    },
    description="Retrieve a campaign for the authenticated company.",
    tags=["Company Area"],
    parameters=[
        OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH),
    ]
)


campaign_create_schema = extend_schema(
    request=CreateCampaignSerializer,
    responses={
        201: OpenApiResponse(
            response=CreateCampaignSerializer,
            description="Campaign created successfully",
            examples=[
                OpenApiExample(
                    name="Success",
                    value={
                        "detail": "Campaign created successfully.",
                        "campaign": {
                            "id": "BVNe8NP6y8",
                            "company": 1,
                            "name": "API",
                            "company_boxes": 1,
                            "duration": 3,
                            "num_boxes": 1,
                            "header_image": "/mediafiles/image/header.png",
                            "open_after_a_day": True
                        }
                    }
                )
            ]
        ),
        400: OpenApiResponse(description='Bad Request'),
        500: OpenApiResponse(description="Server Error"),
    },
    description="Create a new campaign for the authenticated company.",
    tags=["Company Area"],
)