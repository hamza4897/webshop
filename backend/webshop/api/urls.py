from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter # type: ignore
from rest_framework.authtoken.views import obtain_auth_token # type: ignore

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/create/', ProductCreateView.as_view(), name='product-create'),
    path('change-password/', ChangePasswordView.as_view(),
         name='change-password'),
    path('myItems/', UserInventoryView.as_view(), name='user-inventory'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('cart/', CartView.as_view(), name="view-cart"),
    path('products/<int:pk>/update/',ProductUpdateView.as_view(), name='product-update'),
    path('product/<int:productId>/', ProductView.as_view(), name='product details'),
    path('populate-db/', PopulateDatabaseView.as_view(), name='populate-db'),
    path('checkout/', CheckoutView.as_view(), name='pay'),  

]
