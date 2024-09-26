from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField # type: ignore
from django.contrib.auth.models import User

# Create your models here.


class Product(models.Model):
    STATUS_CHOICES = [
        ('on-sale', 'On Sale'),
        ('sold', 'Sold')
    ]
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    price = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )
    date_added = models.DateField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='on-sale')
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='items_for_sale')
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL,null=True, blank=True, related_name='purchased_items')


    def __str__(self):
        return self.title


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('completed', 'completed')
    ]
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

    @property
    def get_total_cart_items(self):
        orderItems = self.orderitem_set.all()
        return orderItems.count()


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='order_items')
    price_at_purchase = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )

    def __str__(self):
        return f"OrderItem {self.id} for Order {self.order.id}"


class Cart(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='cart')

    def __str__(self):
        return f"Cart of {self.user.username}"

    @property
    def get_cart_total(self):
        cart_items = self.items.all()
        total = sum([item.product.price for item in cart_items])
        return total


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price_at_addition = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.title} in cart of {self.cart.user.username}"

