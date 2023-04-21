router.post('/', async (req, res) => {
    try {
        const student = req.body;
        pool.query('SELECT * FROM time_slots WHERE id = ?', [student.time_slot], (error, result) => {
            console.log(result.length === 0)
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

                    pool.query('SELECT id FROM students WHERE first_name = ? AND last_name = ? AND project_title = ? AND email = ? AND phone_number = ? AND time_slot = ?', [student.first_name, student.last_name, student.project_title, student.email, student.phone_number, student.time_slot], (error, result) => {

                        if (result.length > 0) {
                            pool.query('DELETE FROM students WHERE id = ?', [result[0]]);
                            pool.query('UPDATE time_slots SET available_seats = available_seats + 1 WHERE id = ?', [student.time_slot]);
                        }

                        pool.query('INSERT INTO students (id, first_name, last_name, project_title, email, phone_number, time_slot) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [student.id, student.first_name, student.last_name, student.project_title, student.email, student.phone_number, student.time_slot],
                            (error, result) => {
                                if (error) {
                                    res.status(500).json({ message: 'Internal Sever Error' });
                                }
                                else {
                                    pool.query('UPDATE time_slots SET available_seats = available_seats - 1 WHERE id = ?', [timeSlot.id], (error, result) => {
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