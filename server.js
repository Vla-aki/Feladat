const express = require('express'); //Express szerver importálása
const sqlite3 = require('sqlite3').verbose(); //SQLite importálása
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database('users.db');

app.use(cors());
app.use(express.json());

// Statikus fájlok kiszolgálása a /public mappából
app.use(express.static(path.join(__dirname, 'public')));

// Főoldal kiszolgálása (form.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});


// Tábla létrehozása, ha nem létezik
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        konyv_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cim TEXT,
        szerzo TEXT,
        kiado TEXT,
        kiadasi_ev INTEGER,
        isbn TEXT
    )
`);

// POST kérés fogadása
app.post('/users', async (req, res) => {
    const { cim, szerzo, kiado, kiadasi_ev, isbn } = req.body;

    const stmt = `INSERT INTO users (cim, szerzo, kiado, kiadasi_ev, isbn) VALUES (?, ?, ?, ?, ?)`;

    db.run(stmt, [cim, szerzo, kiado, kiadasi_ev, isbn], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Adatmentési hiba');
        }
        res.status(200).json({ message: 'Sikeres mentés', id: this.lastID });
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Adatlekérési hiba');
        }
        res.json(rows);
    });
});


// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);
});