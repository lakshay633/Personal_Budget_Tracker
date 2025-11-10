from rest_framework import generics, permissions
from .models import Budget
from .serializers import BudgetSerializer

#View to list all budgets for the logged-in user
class BudgetListView(generics.ListAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    #Restrict access to budgets of logged-in user only
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

#View to create a new budget
class BudgetCreateView(generics.CreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    #Set the user when creating a budget
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
