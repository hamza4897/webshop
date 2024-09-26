from django.urls import path, include
from .views import *



urlpatterns = [
    path('',landing_page, name="landing page"),
    path('populate_database/', populate_database, name ="populate_database"),
]