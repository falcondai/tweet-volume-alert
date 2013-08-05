var draftApis = function () {
  var draftApis = {
    version: '0.0.0',
    apiVendorNames: {
      Notifications: ['webkitNotifications'],
      AudioContext: ['webkitAudioContext'],
    },
  };

  draftApis.normalize = function (apis, notify) {
    if (typeof apis == 'string')
      apis = [apis];
    if (arguments.length == 0)
      apis = Object.keys(this.apiVendorNames);

    var missing = [];
    for (var i in apis) {
      var canonicalName = apis[i];
      if (this.apiVendorNames[canonicalName]) {
        var vendorNames = this.apiVendorNames[canonicalName];
        for (var i in vendorNames) {
          window[canonicalName] = window[canonicalName] || window[vendorNames[i]];
          if (window[canonicalName])
            break;
        }
      }
      if (!window[canonicalName]) {
        missing.push(canonicalName);
      }
    }
    if (!notify) {
      var message = 'The following draft HTML5 APIs are not supported in your browser: ';
      for (var i in missing) {
        message += missing[i] + ', ';
      }
      if (missing.length > 0)
        alert(message);
      return ;
    }
    return notify(missing);
  };

  return draftApis;
}();