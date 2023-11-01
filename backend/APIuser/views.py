from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response  
from rest_framework import status  

class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class UserView(APIView):  
  
    def get(self, request, *args, **kwargs):  
        result = CustomUser.objects.all()  
        serializers = CustomUserSerializer(result, many=True)  
        return Response({'status': 'success', "users":serializers.data}, status=200)  
  
    def post(self, request):  
        serializer = CustomUserSerializer(data=request.data)  
        if serializer.is_valid():  
            serializer.save()  
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)  
        else:  
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  
