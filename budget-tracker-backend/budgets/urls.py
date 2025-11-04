from django.urls import path
from .views import BudgetListView, BudgetCreateView

urlpatterns = [
    path("", BudgetListView.as_view(), name="budgets"),
    path("create/", BudgetCreateView.as_view(), name="budget-create"),
]
