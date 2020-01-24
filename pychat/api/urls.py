from django.urls import path
from .views import *


urlpatterns = [
    path("create_user/", CreateUser.as_view(), name='create_user'),
    path("room/<int:pk>/send_message/", SendMessage.as_view(), name='send_message'),
    path("room/<int:pk>/messages/", MessageList.as_view(), name="all_messages"),
    path("token/", GetToken.as_view(), name="get_token"),
    path("room/create/", CreateRoom.as_view(), name="create_room"),
    path("room/<int:pk>/", GetRoom.as_view(), name="get_room"),
    path("room/my/", GetMyRooms.as_view(), name="my_rooms"),
    path("room/<int:pk>/add_user/<str:username>/", AddUserToRoom.as_view(), name="add_user_to_room")
]
