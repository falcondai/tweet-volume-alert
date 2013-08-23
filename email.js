var nodemailer = require('nodemailer'),
    credentials = require('./credentials').email,
    jade = require('jade'),
    smtp = nodemailer.createTransport('SMTP', {
      service: 'gmail',
      auth: {
        user: credentials.sender.user,
        pass: credentials.sender.pass
      }
    });

function send(subject, html, callback) {
  var mail = {
      from: credentials.from,
      replyTo: credentials.replyToEmail,
      subject: subject,
      generateTextFromHTML: true,
      html: html,
    };

  if ('production' == process.env.NODE_ENV) {
    mail.bcc = credentials.recipients;
  } else {
    mail.to = credentials.recipients;
  }

  smtp.sendMail(mail, callback);
}

function sendAlert(fields, callback) {
  jade.renderFile(__dirname + '/views/alertEmail.jade', fields, function (err, html) {
    send('TwiThinks: ' + fields.symbol +' Alert', html, callback);
  });
}

exports.sendAlert = sendAlert;