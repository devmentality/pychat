from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import api.routing
from api.authentication import WebsocketAuthMiddleware

application = ProtocolTypeRouter({
    'websocket': WebsocketAuthMiddleware(
        URLRouter(
            api.routing.websocket_urlpatterns
        )
    )
})
