# Inventory Management System

A full-stack inventory management application with React frontend and FastAPI backend.

## What This Does

This app lets you manage product inventory with a simple UI. You can add, view, update, and delete products. All data is stored in a PostgreSQL database.

## Tech Stack

**Backend:**
- FastAPI - Python web framework
- PostgreSQL - Database
- SQLAlchemy - Database ORM
- Pydantic - Data validation

**Frontend:**
- React 18
- Axios - API calls
- React Scripts - Build tool

## Project Structure

```
FastAPI_Demo/
├── main.py          # API routes
├── models.py        # Pydantic schemas
├── db_models.py     # Database models
├── db_config.py     # DB connection
├── .gitignore
├── README.md
└── frontend/
    ├── public/
    ├── src/
    └── package.json
```

## Database Schema

**Product Table:**
- `id` - Product ID
- `name` - Product name
- `description` - Product details
- `price` - Price
- `quantity` - Stock quantity

## API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/products` | Get all products |
| GET | `/products/{id}` | Get product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

**Example API Call:**
```json
POST /products
{
  "id": 5,
  "name": "Mouse",
  "description": "Wireless mouse",
  "price": 29.99,
  "quantity": 50
}
```

## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
```

2. **Create PostgreSQL database:**
```bash
psql -U postgres
CREATE DATABASE inventorydb;
\q
```

3. **Update database password in `db_config.py`:**
```python
db_url = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/inventorydb"
```

4. **Run backend:**
```bash
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000

### Frontend Setup

1. **Install Node.js dependencies:**
```bash
cd frontend
npm install
```

2. **Start frontend:**
```bash
npm start
```
Frontend runs at: http://localhost:3000

### How It Works Together

- Frontend makes API calls to backend using Axios
- `proxy` setting in `package.json` forwards requests to `http://localhost:8000`
- Backend handles database operations and returns JSON
- Frontend displays data in UI

## Features

✅ Full CRUD operations  
✅ React-based user interface  
✅ REST API with FastAPI  
✅ PostgreSQL database persistence  
✅ Auto-creates tables on startup  
✅ Includes sample data  
✅ CORS enabled for frontend  

## Sample Data

App starts with 4 products:
- Laptop - $999.99 (10 in stock)
- Smartphone - $699.99 (25 in stock)
- Headphones - $199.99 (15 in stock)
- Monitor - $399.99 (8 in stock)

## Known Issues

⚠️ Database credentials hardcoded in code  
⚠️ Manual ID entry required when creating products  
⚠️ No pagination (loads all products)  
⚠️ No input validation for negative prices/quantities  
⚠️ CORS allows all origins (development mode)  

## Future Improvements

- Environment variables for sensitive data
- Auto-generate product IDs
- Add search and filter functionality
- Pagination for large datasets
- Image upload for products
- User authentication
- Form validation on frontend
- Loading states and error messages in UI

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

Built with React + FastAPI 🚀