from django.urls import path
from .views import *


urlpatterns = [
    path("create_user/", create_user, name='create_user'),
    path("send/", send_message, name='send_message'),
    path("messages/", all_messages, name="all_messages"),
    path("token/", get_token, name="get_token")
]