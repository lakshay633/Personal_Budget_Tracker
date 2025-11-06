from django.urls import path
from .views import BudgetListView, BudgetCreateView, BudgetRetrieveUpdateDeleteView

urlpatterns = [
    path("", BudgetListView.as_view(), name="budgets"),
    path("create/", BudgetCreateView.as_view(), name="budget-create"),
    path("<int:pk>/", BudgetRetrieveUpdateDeleteView.as_view(), name="budget-detail"),
]
