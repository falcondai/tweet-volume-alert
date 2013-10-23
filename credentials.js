// emails and credentials, consider to change the example values to sensical ones to send email notifications

exports.email = {
  sender: 'production' == process.env.NODE_ENV ? {
    user: 'production@email.com',
    pass: 'password'
  } : {
    user: 'development@email.com',
    pass: 'password'
  },
  from: 'production' == process.env.NODE_ENV ? 'TwiThinks Alerts <production@email.com>' : 'TwiThinks Alert Dev <development@email.com>',
  replyToEmail: 'production' == process.env.NODE_ENV ? 'TwiThinks Alerts <production@email.com>' : 'TwiThinks Alert Dev <development@email.com>',
  recipients: 'production' == process.env.NODE_ENV ? ['prod-recipient@email.com'] : ['dev-recipient@email.com']
};
