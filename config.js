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

if ('production' == process.env.NODE_ENV) {
  exports.uiSettings = {
    batchSize: 4,
    queueDepth: 32
  };
}

if ('development' == process.env.NODE_ENV) {
  exports.uiSettings = {
    batchSize: 1,
    queueDepth: 4
  };
}