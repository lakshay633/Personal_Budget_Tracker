from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date

class ReportsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # filters optional: month/year
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        qs = Transaction.objects.filter(user=user)
        if month:
            qs = qs.filter(date__month=int(month))
        if year:
            qs = qs.filter(date__year=int(year))

        # totals by type
        totals_by_type = qs.values("type").annotate(total=Sum("amount"))
        # totals by category
        totals_by_category = qs.values("category").annotate(total=Sum("amount")).order_by("-total")
        # month-to-date income and expense
        this_month = date.today().month
        this_year = date.today().year
        monthly_totals = Transaction.objects.filter(user=user, date__month=this_month, date__year=this_year).values("type").annotate(total=Sum("amount"))

        return Response({
            "totals_by_type": list(totals_by_type),
            "totals_by_category": list(totals_by_category[:20]),
            "monthly_totals": list(monthly_totals),
        })

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["type", "category", "date"]
    search_fields = ["category"]
    ordering_fields = ["date", "amount"]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related("user")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
