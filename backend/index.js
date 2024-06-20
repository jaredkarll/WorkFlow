const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8800;

app.use(cors());
app.use(bodyParser.json());

const connectDB = mysql.createPool({
    host: 'localhost',
    port: 3600, // Change depending on port used
    user: 'root',
    password: '',
    database: 'workflow'
});

connectDB.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
    connection.release();
});

// Fetch users
app.get('/users', (req, res) => {
    const { email } = req.query;
    connectDB.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            res.status(200).json(results);
        }
    );
});

// User signup
app.post('/signupsubmit', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    connectDB.query(
        'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, password],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// User login
app.post('/loginsubmit', (req, res) => {
    const { email, password } = req.body;
    connectDB.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            if (results.length > 0) {
                return res.status(200).json({ message: 'Login successful', user: results[0] });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    );
});

// Fetch announcements
app.get('/announcements', (req, res) => {
    connectDB.query('SELECT a.*, u.first_name, u.last_name FROM announcements a LEFT JOIN users u ON a.author_id = u.id ORDER BY date DESC', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// Create announcement
app.post('/announcements', (req, res) => {
    const { title, content, authorId } = req.body;

    connectDB.query(
        'INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)',
        [title, content, authorId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            res.status(201).json({ message: 'Announcement created successfully' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
