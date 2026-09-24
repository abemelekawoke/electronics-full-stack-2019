from django.shortcuts import redirect


def google_login_token_view(request):
    """Handle the /auth/google/login/token/ URL - redirect to Google OAuth"""
    # Redirect directly to allauth's OAuth endpoint
    return redirect('http://localhost/auth/google/login/')

