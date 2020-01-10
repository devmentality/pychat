from django.shortcuts import render


def index(request):
    return render(request, 'app.html')


def login(request):
    return render(request, 'login.html')