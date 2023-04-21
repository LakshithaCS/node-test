const express = require('express');
const pool = require('./database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const student = req.body;
    pool.query('SELECT * FROM time_slots WHERE id = ?', [student.time_slot], (error, result) => {
      if (error) {
        return res.status(400).json({ message: 'Time slot does not exist' });
      }
      else if (result.length === 0) {
        return res.status(400).json({ message: 'Time slot does not exist' });
      }

      else {
        if (result[0].available_seats == 0) {
          return res.status(400).json({ message: 'Time slot is fully booked' });
        }
        else {

          pool.query('SELECT * FROM students WHERE first_name = ? AND last_name = ? AND project_title = ? AND email = ? AND phone_number = ?', [student.first_name, student.last_name, student.project_title, student.email, student.phone_number], (error, result) => {

            if (result.length > 0) {
              pool.query('DELETE FROM students WHERE id = ?', [result[0].id]);
              pool.query('UPDATE time_slots SET available_seats = available_seats + 1 WHERE id = ?', [result[0].time_slot]);
            }

            const id = uuidv4(); // Generate unique UUID for student
            student.id = id;

            pool.query('INSERT INTO students (id, first_name, last_name, project_title, email, phone_number, time_slot) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [student.id, student.first_name, student.last_name, student.project_title, student.email, student.phone_number, student.time_slot],
              (error, result) => {
                if (error) {
                  res.status(500).json({ message: 'Internal Sever Error' });
                }
                else {
                  pool.query('UPDATE time_slots SET available_seats = available_seats - 1 WHERE id = ?', [student.time_slot], (error, result) => {
                    if (error) {
                      res.status(500).json({ message: 'Internal Sever Error' });
                    }
                    else {
                      res.status(200).json({ message: 'Student registered successfully' });
                    }
                  });
                }
              }
            );

          })

        }


      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/all', (req, res) => {
  pool.query('SELECT * FROM students', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving students');
    } else {
      res.status(200).json(results);
    }
  });
});

router.post('/is_exist', (req, res) => {

  const student = req.body;

  pool.query('SELECT * FROM students WHERE first_name = ? AND last_name = ? AND project_title = ? AND email = ? AND phone_number = ? ',
    [student.first_name, student.last_name, student.project_title, student.email, student.phone_number],
    (error, result) => {
      if (error) {
        res.status(500).send('Error retrieving students');
      } else {
        res.status(200).json(result.length !== 0);
      }

    });
});

module.exports = router;
