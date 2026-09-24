from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Connects existing users to their social accounts automatically 
        if the email addresses match, bypassing the signup form.
        """
        # 1. If the social account is already connected to a user, move on
        if sociallogin.is_existing:
            return

        # 2. Get the email from the social account
        # We check both extra_data and the verified email list for robustness
        email = sociallogin.account.extra_data.get('email')
        if not email and sociallogin.email_addresses:
            email = sociallogin.email_addresses[0].email

        if not email:
            return

        # 3. Check if a user with this email already exists
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            
            # 4. Link the social account to the existing user
            sociallogin.connect(request, user)
            
        except User.DoesNotExist:
            # No existing user, let allauth proceed with normal auto-signup
            pass