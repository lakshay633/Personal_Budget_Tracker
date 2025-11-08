# 🧾 Personal Budget Tracker

A **web-based application** that helps users track **income, expenses, and budgets**, categorize transactions, and visualize spending patterns through interactive charts.

---

## 📘 **Project Overview**

This project aims to provide an easy-to-use personal finance tool that allows users to:

- Record income and expenses.
- Categorize transactions (e.g., food, bills, travel, savings).
- Set and manage monthly budgets.
- Generate spending reports and visual insights.

Built using:
- **Backend:** Django REST Framework (DRF), PostgreSQL/SQLite, JWT authentication  
- **Frontend:** React.js, Chart.js (for visualizations), Axios, and Styled Components

---

## ⚙️ **Tech Stack**

| Layer | Technology |
|--------|-------------|
| Backend | Django, Django REST Framework |
| Database | SQLite (default) / PostgreSQL |
| Authentication | JWT (via `djangorestframework-simplejwt`) |
| Frontend | React, Chart.js, Axios, React Router |
| Dev Tools | VS Code, Git, GitHub |

---

## 🗂️ **Project Structure**

```
Personal_Budget_Tracker/
│
├── budget-tracker-backend/       # Django backend
│   ├── core/                     # Project settings and root URLs
│   ├── users/                    # User registration and authentication
│   ├── transactions/             # Income and expense management
│   ├── budgets/                  # Budget setting and tracking
│   ├── requirements.txt          # Python dependencies
│   └── manage.py
│
├── budget-tracker-frontend/      # React frontend
│   ├── src/
│   │   ├── api/                  
│   │   ├── components/           # React UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Dashboard, Reports, Login, Register and other pages
│   │   ├── styles/               # CSS styles
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## 🧑‍💻 **Setup Instructions**

### 🐍 Backend Setup (Django)

1. **Unzip the project:**
   ```bash
   unzip Personal_Budget_Tracker-main.zip
   cd Personal_Budget_Tracker-main/budget-tracker-backend
   ```

2. **Create & activate a virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate       # On Windows
   source venv/bin/activate    # On macOS/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

   Server will start at:  
   👉 `http://127.0.0.1:8000/`

---

### ⚛️ Frontend Setup (React)

1. **Navigate to the frontend folder:**
   ```bash
   cd ../budget-tracker-frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm run dev
   ```

   App will be live at:  
   👉 `http://localhost:5173/`

---

## 🔐 **Authentication Flow**

JWT (JSON Web Token) authentication is used for secure user login.

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/register/` | POST | Register a new user |
| `/` (or `/login/`) | POST | Obtain JWT access + refresh tokens |
| `/tokenrefresh/` | POST | Refresh access token |

Example:
```json
POST /register/
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@123",
  "password2": "Test@123"
}
```

---

## 📊 **API Endpoints**

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/register/` | POST | Register new user |
| `/` | POST | Login and get JWT tokens |
| `/tokenrefresh/` | POST | Refresh JWT |
| `/transactions/` | GET | Fetch all transactions (with filters) |
| `/transactions/` | POST | Add new transaction |
| `/budgets/` | GET | Fetch budget details |
| `/budgets/` | POST | Set a new budget |
| `/reports/` | GET | Generate spending reports and summaries |

---

## 🧠 **Features**

✅ Income & Expense Tracking  
✅ Categorized Transactions  
✅ Monthly Budget Planning  
✅ JWT Authentication  
✅ Dynamic Spending Reports  
✅ Responsive React UI with Charts  

---

## 🧩 **Testing**

Run all backend tests:
```bash
python manage.py test
```

Tests include:
- User registration and login
- Transaction creation and retrieval
- Budget management

---

## 🧱 **Best Practices Implemented**

- Custom **exception handler** (`exceptions.py`)
- Full **modular app structure** (`users`, `transactions`, `budgets`)
- **JWT authentication**
- **Unit tests** for critical APIs
- **Security**: password hashing & validation
- **Performance optimization** with queryset filters
- **PEP8 compliant** and documented code

---

## 📸 **Visual Overview**

- **Dashboard:** Displays charts for income vs. expenses  
- **Transactions Page:** List, filter, and add new transactions  
- **Budgets Page:** Define monthly limits and monitor spending  
- **Reports Page:** Graphical analysis of your spending behavior  
