const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'instiweb.help@gmail.com',
        pass: 'instiwebpass'
    }
});

module.exports = {
    send: (options, callback) => {
        transporter.sendMail(options, callback);
    }
};