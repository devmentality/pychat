from django.urls import path
from .views import *


urlpatterns = [
    path("create_user/", CreateUser.as_view(), name='create_user'),
    path("send/", SendMessage.as_view(), name='send_message'),
    path("messages/", MessageList.as_view(), name="all_messages"),
    path("token/", GetToken.as_view(), name="get_token")
]
