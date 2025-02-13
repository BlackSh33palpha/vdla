const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;
const cors = require("cors");


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));


// Database Connection
const db = mysql.createConnection({
    host: "localhost", // Replace with your database host
    user: "root",      // Replace with your MySQL username
    password: "",      // Replace with your MySQL password
    database: "registration_db", // Replace with your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
});

// Registration API
app.post("/register", (req, res) => {
    const { name, surname, email, username, password } = req.body;

    if (!name || !surname || !email || !username || !password) {
        return res.status(400).send("All fields are required.");
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send("Error hashing password.");

        // Insert into database
        const query = "INSERT INTO users (name, surname, email, username, password) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [name, surname, email, username, hash], (error, results) => {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(400).send("Email or Username already exists.");
                }
                return res.status(500).send("Database error.");
            }
            // Redirect to Login.html on success
            res.status(200).send("Success"); // Inform the client-side of success
        });
    });
});

// POST route for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).send('Database query error');
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (error, match) => {
                if (error) return res.status(500).send('Password comparison error');
                if (match) {
                    res.sendFile(path.join(__dirname, 'public', 'VDLA.html'));
                } else {
                    res.status(401).send('Invalid password');
                }
            });
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Logout Route
app.get('/logout', (req, res) => {
    // If using sessions, destroy the session
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Failed to destroy session:', err);
                res.status(500).send('Failed to log out');
            } else {
                // Redirect to Login.html after successful logout
                res.redirect('/Login.html');
            }
        });
    } else {
        // Redirect to Login.html if no session exists
        res.redirect('/Login.html');
    }
});


// Serve static files (like VDLA.html)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});