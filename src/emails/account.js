const sgMail = require('@sendgrid/mail');
const APIKEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(APIKEY);

sgMail.send({
    to: 'camhuy165@gmail.com',
    from: 'sendgridemail@huygcam.tech',
    subject: 'This is my first creation',
    text: 'I hope this one acctually get to you effortlessly'
})