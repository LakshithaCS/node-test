const express = require('express');
const db = require('./database');

const router = express.Router();

router.get('/all', (req, res) => {
    db.query('SELECT * FROM time_slots', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving available time slots');
        } else {
            res.status(200).json(results);
        }
    });
});

router.post('/add', (req, res) => {
    const { date, start_time, end_time, available_seats } = req.body;

    db.query('INSERT INTO time_slots (date, start_time, end_time, available_seats) VALUES (?, ?, ?, ?)', [date, start_time, end_time, available_seats], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error creating new time slot');
        } else {
            res.status(200).send(`New time slot created with ID ${results.insertId}`);
        }
    });
});

module.exports = router;
