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
    port: 3600, //Change depending on port used
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

app.post('/loginsubmit', (req, res) => {
    const { email, password } = req.body;
    // Add your authentication logic here, for example:
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});