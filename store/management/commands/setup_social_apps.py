"""
Management command to set up Social Applications for OAuth login.
This command creates the required SocialApp entries in the database.

Usage:
    python manage.py setup_social_apps --google-client-id YOUR_CLIENT_ID --google-secret YOUR_SECRET
    python manage.py setup_social_apps --facebook-client-id YOUR_CLIENT_ID --facebook-secret YOUR_SECRET
    python manage.py setup_social_apps --google-client-id ... --google-secret ... --facebook-client-id ... --facebook-secret ...
"""
from django.core.management.base import BaseCommand, CommandError
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from allauth.socialaccount.providers.google.provider import GoogleProvider
from allauth.socialaccount.providers.facebook.provider import FacebookProvider


class Command(BaseCommand):
    help = 'Set up Social Applications for OAuth login (Google/Facebook)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--google-client-id',
            type=str,
            help='Google OAuth Client ID',
        )
        parser.add_argument(
            '--google-secret',
            type=str,
            help='Google OAuth Client Secret',
        )
        parser.add_argument(
            '--facebook-client-id',
            type=str,
            help='Facebook OAuth App ID',
        )
        parser.add_argument(
            '--facebook-secret',
            type=str,
            help='Facebook OAuth App Secret',
        )
        parser.add_argument(
            '--site-domain',
            type=str,
            default='localhost',
            help='Site domain for OAuth callbacks (default: localhost)',
        )
        parser.add_argument(
            '--site-name',
            type=str,
            default='Parrot Advert',
            help='Site name (default: Parrot Advert)',
        )

    def handle(self, *args, **options):
        google_client_id = options.get('google_client_id')
        google_secret = options.get('google_secret')
        facebook_client_id = options.get('facebook_client_id')
        facebook_secret = options.get('facebook_secret')
        site_domain = options.get('site_domain')
        site_name = options.get('site_name')

        # Set up the Site
        self.stdout.write(f'Setting up site: {site_domain}...')
        site, created = Site.objects.update_or_create(
            id=1,
            defaults={
                'domain': site_domain,
                'name': site_name
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created new site: {site_name} ({site_domain})'))
        else:
            self.stdout.write(f'Updated existing site: {site_name} ({site_domain})')

        # Set up Google OAuth
        if google_client_id and google_secret:
            self.stdout.write('Setting up Google OAuth...')
            app, created = SocialApp.objects.update_or_create(
                provider=GoogleProvider.id,
                name='Google',
                defaults={
                    'client_id': google_client_id,
                    'secret': google_secret,
                }
            )
            app.sites.add(site)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Google OAuth app: {google_client_id[:20]}...'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated Google OAuth app: {google_client_id[:20]}...'))
        elif google_client_id or google_secret:
            self.stdout.write(self.style.WARNING('Warning: Both --google-client-id and --google-secret are required for Google OAuth'))

        # Set up Facebook OAuth
        if facebook_client_id and facebook_secret:
            self.stdout.write('Setting up Facebook OAuth...')
            app, created = SocialApp.objects.update_or_create(
                provider=FacebookProvider.id,
                name='Facebook',
                defaults={
                    'client_id': facebook_client_id,
                    'secret': facebook_secret,
                }
            )
            app.sites.add(site)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Facebook OAuth app: {facebook_client_id[:20]}...'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated Facebook OAuth app: {facebook_client_id[:20]}...'))
        elif facebook_client_id or facebook_secret:
            self.stdout.write(self.style.WARNING('Warning: Both --facebook-client-id and --facebook-secret are required for Facebook OAuth'))

        # Display current status
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=== Social Apps Setup Complete ==='))
        self.stdout.write('')
        self.stdout.write('Current Social Applications:')
        
        for app in SocialApp.objects.all():
            self.stdout.write(f'  - {app.name} ({app.provider})')
            self.stdout.write(f'    Client ID: {app.client_id}')
            self.stdout.write(f'    Sites: {", ".join([s.domain for s in app.sites.all()])}')
        
        self.stdout.write('')
        self.stdout.write('OAuth Redirect URLs to register with providers:')
        self.stdout.write(f'  Google: http://{site_domain}/api/auth/google/login/callback/')
        self.stdout.write(f'  Facebook: http://{site_domain}/auth/facebook/login/callback/')
        self.stdout.write('')
        
        if not google_client_id and not facebook_client_id:
            self.stdout.write(self.style.WARNING('No OAuth credentials provided. Use command-line arguments to add them.'))
            self.stdout.write('Example:')
            self.stdout.write('  python manage.py setup_social_apps \\')
            self.stdout.write('    --google-client-id="your-google-client-id" \\')
            self.stdout.write('    --google-secret="your-google-secret"')

