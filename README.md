# Star Wars Character CRUD Application

A lightweight, responsive web application for managing Star Wars characters. The project features an interactive HTML/CSS/JavaScript frontend and a PHP backend communicating with a PostgreSQL database.

---

## 🚀 Features

- **Read (Retrieve)**: Dynamically lists all characters stored in the database.
- **Create (Add)**: Create new Star Wars characters manually using a customized form (Name, Height, and Gender).
- **Update (Edit)**: Edit existing characters' attributes inline using intuitive prompts.
- **Delete (Remove)**: Delete character entries securely with a confirmation prompt.
- **SWAPI API Integration**: Automatically pull and populate your database with character data in bulk from the public [Star Wars API (SWAPI)](https://swapi.dev/).

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (including custom Google Fonts and FontAwesome icons), and asynchronous JavaScript (Fetch API).
- **Backend**: PHP (Modular CRUD endpoints).
- **Database**: PostgreSQL with PHP Data Objects (PDO) for secure, prepared SQL executions.

---

## 📂 Project Structure

```text
├── README.md                 # Project documentation
└── starwars/                 # Main application directory
    ├── index.html            # Main user interface
    ├── style.css             # Custom styles and responsive layouts
    ├── js/
    │   └── script.js         # Frontend application logic and API integrations
    └── php/
        ├── db.php            # Database connection establishment (PDO)
        ├── create.php        # Create record endpoint
        ├── read.php          # Retrieve records endpoint
        ├── update.php        # Update record endpoint
        └── delete.php        # Delete record endpoint
```

---

## ⚙️ Requirements

1. **PHP** 7.4 or higher with the `pdo_pgsql` extension enabled.
2. **PostgreSQL** database server.
3. Web server (e.g., Apache, Nginx, or PHP's built-in CLI server).

---

## 🔌 Setup & Installation

### 1. Database Setup

1. Log in to your PostgreSQL server and create a database named `home` (or modify connection credentials in [db.php](file:///Users/home/Desktop/htdocs/starwars/php/db.php)):
   ```sql
   CREATE DATABASE home;
   ```

2. Inside your database, create the `characters` table with the following schema:
   ```sql
   CREATE TABLE characters (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       height VARCHAR(50),
       gender VARCHAR(50)
   );
   ```

### 2. Configure Backend Credentials

Verify or update the connection settings in the database helper script at [db.php](file:///Users/home/Desktop/htdocs/starwars/php/db.php):
```php
$host = 'localhost';
$port = '5432';
$dbname = 'home';
$user = 'home';
$password = 'YOUR_PASSWORD'; // Set your PostgreSQL password here
```

### 3. Run the Application

If you have PHP installed locally, you can start the built-in development server from the repository root:
```bash
php -S localhost:8000
```

Once started, navigate to:
[http://localhost:8000/starwars/index.html](http://localhost:8000/starwars/index.html)

---

## 🌐 API Integrations

- **SWAPI**: Clicking **Pobierz z API** fetches records from `https://swapi.dev/api/people/` and persists them into your PostgreSQL database.
- **Local JSON Endpoints**: All list retrieval and operations utilize JSON communication headers (`Content-Type: application/json`).
