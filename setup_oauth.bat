@echo off
REM Setup script for Parrot Advert OAuth (Third-Party Login)
REM 
REM This script helps configure Google and Facebook OAuth credentials
REM for the Parrot Advert Electronics Store.
REM
REM Prerequisites:
REM 1. Google OAuth: Go to https://console.cloud.google.com/
REM    - Create a project
REM    - Enable Google+ API or Google People API
REM    - Create OAuth 2.0 credentials (Client ID and Secret)
REM    - Add redirect URI: http://localhost:8000/auth/google/login/callback/
REM
REM 2. Facebook OAuth: Go to https://developers.facebook.com/
REM    - Create an app
REM    - Add Facebook Login product
REM    - Add redirect URI: http://localhost:8000/auth/facebook/login/callback/
REM

echo ============================================
echo Parrot Advert OAuth Setup
echo ============================================
echo.

echo First, let's set up the Site configuration...
python manage.py setup_social_apps --site-domain "localhost:8000" --site-name "Parrot Advert"
echo.

echo ============================================
echo To configure OAuth credentials, run:
echo ============================================
echo.
echo Google OAuth:
echo   python manage.py setup_social_apps --google-client-id "YOUR_CLIENT_ID" --google-secret "YOUR_SECRET"
echo.
echo Facebook OAuth:
echo   python manage.py setup_social_apps --facebook-client-id "YOUR_APP_ID" --facebook-secret "YOUR_SECRET"
echo.
echo Both at once:
echo   python manage.py setup_social_apps --google-client-id "YOUR_CLIENT_ID" --google-secret "YOUR_SECRET" --facebook-client-id "YOUR_APP_ID" --facebook-secret "YOUR_SECRET"
echo.

pause

