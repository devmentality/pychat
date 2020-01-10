from django.urls import path
from .views import index, login


urlpatterns = [
    path("login/", login, name='login'),
    path("", index, name='index'),
]