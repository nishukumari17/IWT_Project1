const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "photography_db"
});

// Check connection
db.connect(err => {
    if (err) {
        console.log("MySQL Connection Error:", err);
    } else {
        console.log("MySQL Connected!");
    }
});

// INSERT ROUTE (matching your table)
app.post("/book", (req, res) => {
    const { full_name, email, phone, service, date, message } = req.body;

    const query = `
        INSERT INTO bookings (full_name, email, phone, service, date, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [full_name, email, phone, service, date, message],
        (err, result) => {
            if (err) {
                console.log("Database Insert Error:", err);
                res.status(500).send("Database Error");
            } else {
                res.send("Booking Saved Successfully!");
            }
        }
    );
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});


// Get All Bookings
app.get("/bookings", (req, res) => {
    db.query("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).send("Database Error");
        res.json(rows);
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM bookings WHERE id=?", [id], (err) => {
        if (err) return res.status(500).send("Delete failed");
        res.send("Booking deleted");
    });
});

app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { date } = req.body;

    db.query(
        "UPDATE bookings SET date=? WHERE id=?", 
        [date, id],
        (err) => {
            if (err) return res.status(500).send("Update failed");
            res.send("Booking updated");
        }
    );
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM admin_user WHERE username=? AND password=?",
        [username, password],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false });

            if (rows.length > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        }
    );
});

