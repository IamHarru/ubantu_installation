const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./drive.db');

db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
       
    )`);

    // Files table
    db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_name TEXT,
    stored_name TEXT,
    mime_type TEXT,
    size INTEGER,
    path TEXT,
    user_id INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id))
`);
});

module.exports = db;
