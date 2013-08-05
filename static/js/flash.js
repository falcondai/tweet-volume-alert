var flash = function () {
  var flash = {
    version: '0.0.0',
    titles: [$('title').text()],
    titleIndex: 0,
    intervalId: null,
    interval: 1000,
    element: $('title'),
  };

  // getter/setter
  flash.baseTitle = function (title) {
    if (arguments.length == 0)
      return this.titles[0];
    this.titles[0] = title;
  }

  // low-level methods
  flash.pause = function() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  flash.next = function() {
    this.titleIndex = (this.titleIndex + 1) % this.titles.length;
    this.element.text(this.titles[this.titleIndex]);
  };

  // high-level methods
  flash.cycle = function() {
    this.pause();
    this.intervalId = setInterval(function() { flash.next(); }, this.interval);
  };

  flash.restore = function() {
    this.pause();
    this.titles.splice(1, this.titles.length-1);
    this.element.text(this.titles[0]);
  };

  flash.flash = function(newTitles) {
    if (!this.intervalId)
      this.titles[0] = $('title').text();
    if (typeof titles == 'string')
      this.titles.push(newTitles);
    else
      this.titles = this.titles.concat(newTitles);
    this.cycle();
  };

  return flash;
}();