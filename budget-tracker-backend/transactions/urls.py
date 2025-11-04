from django.urls import path
from .views import *

urlpatterns = [
    path("", TransactionListCreateView.as_view(), name="transactions"),
    path("<int:pk>/", TransactionRetrieveUpdateDeleteView.as_view(), name="transaction-detail"),
    path("reports/", ReportsView.as_view(), name="reports"),

]
