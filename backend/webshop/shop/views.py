from . models import Product

from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import render
from django.db import transaction



User = get_user_model()

@transaction.atomic
def populate_database(request):
    if request.method == "POST":
        try:
            # Clear existing data
            User.objects.all().delete()
            Product.objects.all().delete()

            # Create users and products
            for i in range(6):
                username = f"testuser{i+1}"
                email = f"{username}@shop.aa"
                password = f"pass{i+1}"
                
                user = User.objects.create_user(
                    username=username, email=email, password=password)

                if i < 3:
                    for j in range(10):
                        Product.objects.create(
                            title=f"product {j+1}",
                            description=f"description for product {j+1}",
                            price=f"{(j+1)*10}.00",
                            seller=user
                        )

            return JsonResponse({"message": "Database populated with test data"})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
    
    
    
def landing_page(request):
    context = {}
    return render(request, 'landing_page.html', context)