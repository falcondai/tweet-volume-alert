// shared configs
exports.symbols = {
  MSFT: 'Microsoft',
  TSLA: 'Tesla',
  AAPL: 'Apple',
  GOOG: 'Google',
  AMZN: 'Amazon',
  FB: 'Facebook',
  ZNGA: 'Zynga',
  YHOO: 'Yahoo',
  IBM: 'IBM',
  ORCL: 'Oracle',
};

exports.ui = {
  batchSize: 'production' == process.env.NODE_ENV ? 4 : 1,
  queueDepth: 'production' == process.env.NODE_ENV ? 16 : 4,
};

exports.server = {
  port: 8000,
};

exports.googleAnalytics = {
  code: 'production' == process.env.NODE_ENV ? 'UA-43036107-1' : 'UA-43036107-2',
  domain: 'production' == process.env.NODE_ENV ? 'stock.twithinks.com' : 'none',
};