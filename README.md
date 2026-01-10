# Inventory Management System

A simple REST API to manage product inventory using FastAPI and PostgreSQL.

## What This Does

This is a backend API that lets you add, view, update, and delete products from an inventory database. It automatically creates the database tables and adds some sample products when you first run it.

## Tech Stack

- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - For talking to the database
- **Pydantic** - For validating data

## Project Files

```
├── main.py          # API routes and main logic
├── models.py        # Pydantic models for validation
├── db_models.py     # Database table definitions
└── db_config.py     # Database connection
```

## Database Structure

**Product Table:**
- `id` - Product ID (number)
- `name` - Product name (text)
- `description` - Product details (text)
- `price` - Price (decimal)
- `quantity` - Stock quantity (number)

## API Endpoints

**Get all products:**
```
GET /products
```

**Get one product:**
```
GET /products/{id}
```

**Add new product:**
```
POST /products
Body: {"id": 5, "name": "Mouse", "description": "Wireless mouse", "price": 29.99, "quantity": 50}
```

**Update product:**
```
PUT /products/{id}
Body: {"id": 1, "name": "Updated Name", "description": "New desc", "price": 899.99, "quantity": 5}
```

**Delete product:**
```
DELETE /products/{id}
```

## Setup Instructions

### 1. Install Python packages
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
```

### 2. Create PostgreSQL database
```bash
psql -U postgres
CREATE DATABASE inventorydb;
\q
```

### 3. Update database password
Open `db_config.py` and change the password if needed:
```python
db_url = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/inventorydb"
```

### 4. Run the application
```bash
uvicorn main:app --reload
```

### 5. Test it
- API runs at: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

## Sample Data

When you first run the app, it automatically adds 4 products:
- Laptop - $999.99
- Smartphone - $699.99
- Headphones - $199.99
- Monitor - $399.99

## What Works

✅ Create, read, update, delete products  
✅ Data is saved in PostgreSQL database  
✅ Auto-creates tables on startup  
✅ Returns proper error messages  

## Known Issues

⚠️ Database password is in the code (should use environment variables)  
⚠️ You have to manually provide product ID when creating  
⚠️ No pagination (returns all products at once)  
⚠️ Price and quantity can be negative  

## Possible Improvements

- Use environment variables for database credentials
- Auto-generate product IDs
- Add search and filter options
- Add pagination for large product lists
- Add product categories
- Add timestamps (created_at, updated_at)

---

Made with FastAPI 🚀