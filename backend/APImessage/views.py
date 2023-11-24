from rest_framework import generics
from rest_framework import permissions
from .models import Message
from .serializers import MessageSerializer
from django.db import models
from accounts.models import UserAccount

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the current user from the request
        user = self.request.user

        # Get the sender and receiver IDs from the query parameters
        sender_id = self.request.query_params.get('sender', None)
        receiver_id = self.request.query_params.get('receiver', None)

        queryset = Message.objects.filter(
            (models.Q(sender=user, receiver_id=receiver_id) | models.Q(sender_id=sender_id, receiver=user))
        )

        return queryset

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageReplyView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        queryset = Message.objects.filter(
            models.Q(sender=user) | models.Q(receiver=user)
        )

        return queryset
    

from rest_framework import serializers


class MessageSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        sender = self.request.user
        receiver_email = serializer.validated_data['receiver']

        #print("sender: ", sender)
        #print("receiver_email: ", receiver_email)

        # Check if the receiver is blocked by the sender
        if sender.blocked_users.filter(email=receiver_email).exists():
            raise serializers.ValidationError("You cannot send a message to a blocked user.")

        # Check if the sender is blocked by the receiver
        try:
            receiver = UserAccount.objects.get(email=receiver_email)
            if receiver.blocked_users.filter(username=sender.username).exists():
                raise serializers.ValidationError("You cannot send a message because you are blocked by the receiver.")
        except UserAccount.DoesNotExist:
            raise serializers.ValidationError(f"User with email '{receiver_email}' does not exist.")
        
        # Set the sender to the current user before saving the message
        serializer.save(sender=sender)



# class MessageSendView(generics.CreateAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         sender = self.request.user
#         receiver_username = serializer.validated_data['receiver']

#         # Check if the receiver is blocked by the sender
#         if sender.blocked_users.filter(username=receiver_username).exists():
#             raise serializers.ValidationError("You cannot send a message to a blocked user.")

#         # Check if the sender is blocked by the receiver
#         try:
#             receiver = UserAccount.objects.get(username=receiver_username)
#             if receiver.blocked_users.filter(username=sender.username).exists():
#                 raise serializers.ValidationError("You cannot send a message because you are blocked by the receiver.")
#         except:
#             raise serializers.ValidationError("Receiver does not exist.")
#         #  except UserAccount.DoesNotExist:
#         #     raise serializers.ValidationError("Receiver does not exist.")

#         # Set the sender to the current user before saving the message
#         serializer.save(sender=sender)

