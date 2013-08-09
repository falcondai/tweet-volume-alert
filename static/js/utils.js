function getPref (key, defaultValue) {
  if (localStorage.getItem(key) == undefined 
    && arguments.length > 1)
    localStorage.setItem(key, defaultValue);
  return localStorage.getItem(key);
}

function setPref (key, value) {
  localStorage.setItem(key, value);
}

function loadAudio (ctx, url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  // decode asynchronously
  request.onload = function() {
    ctx.decodeAudioData(request.response, function(buf) {
      callback(buf);
    });
  }
  request.send();
}

function playAudio(ctx, buffer) {
  var source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}

function normalizeApis () {
  draftApis.normalize(['Notifications', 'AudioContext', 'localStorage'], function (missing) {
    if (missing.length > 0) {
      alert('Some HTML5 APIs are not supported in this browser, the notification functionality will be limited.');
      console.log(missing);
    }
  });
}

function initAudio() {
  var audio = {
    ready: false
  };
  if (window.AudioContext) {
    audio.ctx = new window.AudioContext();
    // awesome chime from freesound.org
    loadAudio(audio.ctx, '/sound/80921__justinbw__buttonchime02up.wav', function (buffer) {
      audio.chime = buffer;
      console.log('chime buffer loaded.');
      audio.ready = true;
    });
  }
  return audio;
}
