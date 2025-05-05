const express = require('express');
const router = express.Router();
const db = require('../database/db'); 
const nodemailer = require('nodemailer');

// UC3: Absence Inform 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ClassCheckMail@gmail.com',
        pass: 'qpncibsiedepdwke'  
    }
});

router.post('/api/absenceinform', async (req, res) => {
    const { email, date } = req.body;

    if (!email || !date) {
        return res.status(400).json({ error: 'Missing email or date' });
    }

    const mailOptions = {
        from: 'ClassCheckMail@gmail.com',
        to: email,
        subject: 'ClassCheck Absence Notification',
        text: `STUDENT EMAIL: ${email} was absent on ${date}. Please reach out to your teacher if you think this was a mistake.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Absence email sent to ${email}`);
        res.status(200).json({ message: 'Absence email sent successfully' });
    } catch (error) {
        console.error('Error sending absence email:', error);
        res.status(500).json({ error: 'Failed to send absence email' });
    }
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
