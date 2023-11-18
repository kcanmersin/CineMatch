import requests
from django.http import JsonResponse

def activate_user(request, uid, token):
    # Assuming your Djoser activation endpoint is /auth/users/activation/
    activation_url = 'http://127.0.0.1:8000/auth/users/activation/'

    # Create a dictionary with uid and token
    data = {
        'uid': uid,
        'token': token,
    }

    # Send a POST request to the activation endpoint
    response = requests.post(activation_url, json=data)

    # Check the response and return the result
    if response.status_code == 200:
        return JsonResponse({'message': 'User activated successfully'})
    else:
        return JsonResponse({'error': 'Failed to activate user'}, status=response.status_code)
