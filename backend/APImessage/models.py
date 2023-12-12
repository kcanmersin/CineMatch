from django.db import models
from accounts.models import UserAccount

class Message(models.Model):
    sender = models.ForeignKey(UserAccount, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(UserAccount, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    parent_message = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
