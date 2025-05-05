const express = require('express');
const app = express();
const routes = require('./routes');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ClassCheckMail@gmail.com',
        pass: 'qpncibsiedepdwke'
    }
});

app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
