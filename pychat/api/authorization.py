from rest_framework import permissions


class RoomUserPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, room):
        return room.users.filter(pk=request.user.pk).first() is not None


class RoomCreatorPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, room):
        return room.creator == request.user
