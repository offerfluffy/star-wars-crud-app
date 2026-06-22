# 🌌 Star Wars Holonet Archive (CRUD)

A premium, responsive Star Wars Holonet Character Registry application. The project features a sci-fi themed, responsive glassmorphism UI built with Vanilla HTML/CSS/JavaScript (ES6 Modules) and a modular PHP/PostgreSQL backend.

---

## 🚀 Features

- **Rejestr Postaci (Read)**: Dynamically lists all characters registered in the Holonet, displayed in a responsive grid.
- **Dodaj Nową Postać (Create)**: Add a character manually with their Name, Height, Gender, Faction, and an optional Custom Image URL.
- **Edycja Wpisu (Update)**: Edit any existing record using an interactive glassmorphism modal dialog.
- **Usuwanie Wpisu (Delete)**: Remove character records with a standard verification flow.
- **Automated Faction & Avatar Engine**:
  - Automatically classifies characters into **Factions**: *Zakon Jedi* (Jedi Order), *Imperium Sithów* (Sith Empire), *Sojusz Rebeliantów* (Rebel Alliance), *Imperium Galaktyczne* (Galactic Empire), *Droidy* (Droids), or *Łowcy Nagród* (Bounty Hunters).
  - Dynamically fetches, caches, and injects custom SVG badges for each faction.
  - Automatically detects the correct faction based on name keywords (e.g., "Luke" -> Jedi, "Vader" -> Sith, "R2" -> Droid) or falls back to gender-based defaults.
  - Supports custom image URLs, falling back to faction SVGs automatically on image load failure.
- **SWAPI Sync**: Perform bulk-imports of classic Star Wars characters in one click from the public Star Wars API (SWAPI mirror at `swapi.py4e.com`).

---

## 🛠️ Technology Stack

- **Frontend**:
  - Vanilla HTML5 & CSS3 with CSS variables.
  - Custom typography (Google Fonts: *Inter* & *Orbitron*).
  - FontAwesome 6 icons.
  - Asynchronous modular Javascript (ES6 Modules).
- **Backend**:
  - Modular PHP CRUD endpoints.
  - PostgreSQL database.
  - PHP Data Objects (PDO) for secure, parameterized database queries.

---

## 📂 Project Structure

```text
├── README.md                     # Project documentation
└── starwars/                     # Main application directory
    ├── index.html                # Main UI (Polish language)
    ├── style.css                 # Custom styles (Animations, Glassmorphism, Space background)
    ├── assets/                   # Faction SVG badges
    │   ├── bounty_hunter.svg
    │   ├── droid.svg
    │   ├── empire.svg
    │   ├── jedi.svg
    │   ├── rebel.svg
    │   └── sith.svg
    ├── js/                       # Modular ES6 JavaScript
    │   ├── app.js                # Application entrypoint & event listeners
    │   ├── api.js                # Network requests (PHP Endpoints & SWAPI)
    │   ├── factions.js           # Factions metadata & keyword detection engine
    │   └── ui.js                 # DOM rendering & UI interaction handlers
    └── php/                      # Backend PHP Endpoints
        ├── db.php                # Database connection helper (PDO)
        ├── create.php            # Create record endpoint
        ├── read.php              # Fetch all records endpoint
        ├── update.php            # Update record endpoint
        └── delete.php            # Delete record endpoint
```

---

## ⚙️ Requirements

1. **PHP** 7.4 or higher with the `pdo_pgsql` extension enabled.
2. **PostgreSQL** database server.
3. Web server (e.g. Apache, Nginx, or PHP's built-in CLI server).

---

## 🔌 Setup & Installation

### 1. Database Setup

1. Log in to your PostgreSQL server and create a database named `home` (or customize the credentials in [db.php](file:///Users/home/Desktop/htdocs/starwars/php/db.php)):
   ```sql
   CREATE DATABASE home;
   ```

2. Inside your database, create the `characters` table with the following schema:
   ```sql
   CREATE TABLE characters (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       height VARCHAR(50),
       gender VARCHAR(50),
       image_url VARCHAR(255)
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

Once started, navigate to the application:
👉 [http://localhost:8000/starwars/index.html](http://localhost:8000/starwars/index.html)

---

## 🌐 API Integrations

- **SWAPI**: Clicking **Pobierz z API SWAPI** fetches character records from `https://swapi.py4e.com/api/people/` and persists them into the PostgreSQL database.
- **Local JSON Endpoints**: Communication with backend PHP files is handled using JSON content/headers.
