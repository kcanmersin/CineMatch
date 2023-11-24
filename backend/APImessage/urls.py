# urls.py
from django.urls import path
from .views import MessageListCreateView, MessageDetailView, MessageReplyView, MessageSendView

urlpatterns = [
    path('message/', MessageListCreateView.as_view(), name='message-list-create'),
    path('message/<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
    path('message/<int:pk>/reply/', MessageReplyView.as_view(), name='message-reply'),
    path('message/send/', MessageSendView.as_view(), name='message-send'),
]
