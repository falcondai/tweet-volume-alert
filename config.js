// shared configs
exports.symbols = {
  MSFT: 'Microsoft',
  AAPL: 'Apple',
  GOOG: 'Google',
  FB: 'Facebook',
  AMZN: 'Amazon',
  ZNGA: 'Zynga',
  YHOO: 'Yahoo',
  IBM: 'IBM',
  ORCL: 'Oracle',
  TSLA: 'Tesla'
};

exports.uiSettings = {
  batchSize: 'production' == process.env.NODE_ENV ? 4 : 1,
  queueDepth: 'production' == process.env.NODE_ENV ? 32 : 4
};