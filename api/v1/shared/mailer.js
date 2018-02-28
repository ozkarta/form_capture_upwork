let nodemailer = require('nodemailer');
let config = require('./config/config').gmail;


let transporter = nodemailer.createTransport(config['colincampbellupwork@gmail.com']);

// setup email data with unicode symbols
let mailOptions = {
    from: `Form Capture Administration <${config['colincampbellupwork@gmail.com'].auth.user}>`, // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
};


module.exports.sendMail = (to, subject, text, html) => {
    if (to) {
        mailOptions.to = to;
    } else {
        delete mailOptions.to;
    }

    if (subject) {
        mailOptions.subject = subject;
    } else {
        delete mailOptions.subject;
    }

    if (text) {
        mailOptions.text = text;
    } else {
        delete mailOptions.text;
    }

    if (html) {
        mailOptions.html = html;
    } else {
        delete mailOptions.html;
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

};