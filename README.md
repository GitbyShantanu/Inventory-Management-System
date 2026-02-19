# 📦 Inventory Management System

> A production-ready REST API for managing product inventory — built with **FastAPI**, powered by **SQLAlchemy**, and deployed on **Render** with **PostgreSQL**.

---

## 🚀 Live API

🔗 **Base URL:** `https://your-app.onrender.com`  
📖 **Swagger Docs:** `https://your-app.onrender.com/docs`  
📄 **ReDoc:** `https://your-app.onrender.com/redoc`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | FastAPI |
| **Language** | Python 3.11+ |
| **ORM** | SQLAlchemy |
| **Validation** | Pydantic v2 |
| **Dev Database** | SQLite |
| **Prod Database** | PostgreSQL (Render) |
| **Deployment** | Render |

---

## ✨ Features

- ✅ Full **CRUD** operations for inventory products
- 🔍 **Search** products by name
- 📄 **Pagination** for efficient data retrieval
- ✏️ **Partial updates** with PATCH support
- 🧪 **Auto-generated API docs** via Swagger UI & ReDoc
- 🔒 **Pydantic validation** on all request/response models
- 🌐 **PostgreSQL** in production, **SQLite** in development

---

## 📁 Project Structure

```
inventory-management/
│
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # DB engine & session setup
│   ├── models.py             # SQLAlchemy ORM models
│   ├── schemas.py            # Pydantic request/response schemas
│   └── routers/
│       └── products.py       # Product API routes
│
├── requirements.txt          # Python dependencies
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/GitbyShantanu/Inventory-Management-System.git
cd inventory-management
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the development server

```bash
uvicorn backend.main:app --reload
```

API will be running at: `http://127.0.0.1:8000`

---

## 🗄️ Database Configuration

### Development (SQLite)

No setup needed. SQLite file is auto-created locally.

```python
DATABASE_URL = "sqlite:///./inventory.db"
```

### Production (PostgreSQL on Render)

```env
DATABASE_URL=postgresql://user:password@host/dbname
```

---

## 📡 API Endpoints

| Method | Endpoint                  | Description                     |
|---|---------------------------|---------------------------------|
| `GET` | `/`                       | Greet (Root test endpoint)      |
| `GET` | `/products`               | Get all products (with pagination) |
| `GET` | `/products/{id}`          | Get a single product by ID      |
| `GET` | `/products?search=laptop` | Search products by name         |
| `POST` | `/products`               | Create a new product            |
| `PUT` | `/products/{id}`          | Update a product (full)         |
| `PATCH` | `/products/{id}`          | Update a product (partial)      |
| `DELETE` | `/products/{id}`          | Delete a product                |

---

## 📦 Request & Response Examples

### ➕ Create Product — `POST /products`

**Request Body:**

```json
{
  "name": "Laptop",
  "description": "A high performance laptop",
  "price": 999.99,
  "quantity": 112
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "A high performance laptop",
  "price": 999.99,
  "quantity": 112
}
```

---

### 📋 Get All Products — `GET /products?page=1&limit=10`

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "A high performance laptop",
    "price": 999.99,
    "quantity": 112
  }
]
```

---

### 🔍 Search Products — `GET /products?search=monitor`

Returns all products where **name** matches the search term.

---

### ✏️ Partial Update — `PATCH /products/{id}`

**Request Body:**

```json
{
  "price": 899.99,
  "quantity": 90
}
```

---

## 🧪 Testing the API

Visit the auto-generated Swagger UI:

```
http://localhost:8000/docs
```

Test all endpoints directly from the browser — no Postman needed.

---

## 🚢 Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Build Command:** `pip install -r requirements.txt`
4. Set **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variable:** `DATABASE_URL = your_postgresql_connection_string`
6. Render auto-deploys on every push to `main` 🎉

---

## 📋 Requirements

```
fastapi
uvicorn
sqlalchemy
pydantic
psycopg2-binary
python-dotenv
```

---

## 👨‍💻 Author

**Shantanu Deshmukh**  
[GitHub](https://github.com/GitbyShantanu) • [LinkedIn](http://www.linkedin.com/in/shantanu-deshmukh-18482322b)

---

