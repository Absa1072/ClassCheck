const express = require('express');
const router = express.Router();
const db = require('../database/db'); 
const { transporter } = require('./server');

// UC3: Absence Inform 
router.post('/absenceinform', (req, res) => {
    const { netID, date } = req.body;

    if (!netID || !date) {
        return res.status(400).json({ error: 'Missing netID or date parameter' });
    }

    const studentQuery = `
        SELECT name, email
        FROM UserProfile
        WHERE net_id = ?
    `;

    db.query(studentQuery, [netID], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch student details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found for given netID' });
        }

        const student = results[0];
        const studentName = student.name;
        const studentEmail = student.email;

        const mailOptions = {
            from: 'your-email@gmail.com',  // replace with your Gmail
            to: studentEmail,
            subject: `Absence Notification for ${studentName}`,
            text: `STUDENT NAME: ${studentName} absent on ${date}. Please reach out to your teacher if you think this was a mistake.`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Absence email sent successfully' });
        } catch (error) {
            console.error('Error sending absence email:', error);
            res.status(500).json({ error: 'Failed to send absence email' });
        }
    });
});



// UC2: Create Attendance Reports
router.get('/attendance/reports', (req, res) => {
  const { classId, date } = req.query;

  if (!classId || !date) {
    return res.status(400).json({ error: 'Missing classID or date parameter' });
  }

  const query = `
    SELECT 
      u.name AS studentName,
      u.net_id AS netID,
      a.attendance_date AS date,
      a.status AS attendanceStatus,
      a.checkin_time AS checkinTime,
      a.geolocation_lat AS latitude,
      a.geolocation_lng AS longitude
    FROM AttendanceRecord a
    JOIN UserProfile u ON a.student_id = u.user_id
    WHERE a.class_id = ? AND a.attendance_date = ?
  `;

  db.query(query, [classId, date], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Failed to fetch attendance records' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this class and date' });
    }

    res.status(200).json({
      message: `Attendance report for class ID ${classId} on ${date}`,
      report: results
    });
  });
});

module.exports = router;
