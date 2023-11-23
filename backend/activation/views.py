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
    
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render


@csrf_exempt
def reset_password_confirm(request, uid, token):
    # Assuming your Djoser reset password confirmation endpoint is /auth/users/reset_password_confirm/
    reset_password_confirm_url = 'http://127.0.0.1:8000/auth/users/reset_password_confirm/'

    # Check if it's a GET request to render a form or a POST request to handle the password reset
    if request.method == 'GET':
        # Render a form for the user to input the new password
        return render(request, 'reset_password_confirm.html', {'uid': uid, 'token': token})
    elif request.method == 'POST':
        # Get the new password from the POST request
        new_password = request.POST.get('new_password')

        # Create a dictionary with uid, token, and new_password
        data = {
            'uid': uid,
            'token': token,
            'new_password': new_password,
        }

        # Send a POST request to the reset password confirmation endpoint
        response = requests.post(reset_password_confirm_url, json=data)

        # Check the response and return the result
        if response.status_code == 200:
            return JsonResponse({'message': 'Password reset successfully'})
        else:
            return JsonResponse({'error': 'Failed to reset password'}, status=response.status_code)