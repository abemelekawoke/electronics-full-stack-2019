from django.urls import path
from .views import *

app_name = 'setups'

urlpatterns = [
    path('v1/partners/', PartnerListView.as_view(), name='partner-list'),
    path('v1/announcements/', AnnouncementBarListView.as_view(), name='announcement-list'),
]