import os
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.views.decorators.http import require_GET


def serve_react_build(request):
    """
    Serve the pre-built React frontend from the build folder.
    """
    react_build_dir = getattr(settings, 'REACT_BUILD_DIR', None)
    if react_build_dir:
        index_file = os.path.join(react_build_dir, 'index.html')
        if os.path.exists(index_file):
            with open(index_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Replace relative URLs with absolute URLs pointing to Django static
                static_url = settings.STATIC_URL if hasattr(settings, 'STATIC_URL') else '/static/'
                content = content.replace('href="/static/', f'href="{static_url}')
                content = content.replace('src="/static/', f'src="{static_url}')
                content = content.replace('src="/logo.PNG', f'src="{static_url}logo.PNG')
                content = content.replace('href="/logo.PNG', f'href="{static_url}logo.PNG')
                content = content.replace('href="/manifest.json', f'href="{static_url}manifest.json')
                
                return HttpResponse(content, content_type='text/html')
    
    # Fallback if React build not found
    return HttpResponse("Welcome to Parrot Advert - Electronics Store!")


def home(request):
    """
    Home view that serves the React frontend.
    """
    return serve_react_build(request)


@require_GET
def check_user(request):
    """
    API endpoint to check if user is authenticated via Django session.
    Returns user email if authenticated, otherwise returns 401.
    """
    if request.user.is_authenticated:
        return JsonResponse({
            'email': request.user.email,
            'username': request.user.username,
        })
    return JsonResponse({'error': 'Not authenticated'}, status=401)


def logout_view(request):
    """
    Custom logout view that handles both GET and POST requests.
    Logs out the user and redirects to home page.
    """
    from django.contrib.auth import logout
    
    if request.user.is_authenticated:
        logout(request)
    
    # Check if it's an AJAX request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'message': 'Logged out successfully'})
    
    # Redirect to home for regular requests
    from django.shortcuts import redirect
    return redirect('/')
