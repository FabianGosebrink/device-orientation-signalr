var signalRConnection = null;

function deviceOrientationHandler(eventData) {
  var gamma = eventData.gamma;
  var beta = eventData.beta;
  var alpha = eventData.alpha;

  signalRConnection
    .invoke('MySuperDuperAction', { alpha, beta, gamma })
    .catch(err => console.error(err.toString()));

  document.getElementById('doTiltLR').innerHTML = Math.round(gamma);
  document.getElementById('doTiltFB').innerHTML = Math.round(beta);
  document.getElementById('doDirection').innerHTML = Math.round(alpha);
}

function turnLogo(beta, gamma) {
  var logo = document.getElementById('imgLogo');
  logo.style.webkitTransform =
    'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
  logo.style.MozTransform = 'rotate(' + gamma + 'deg)';
  logo.style.transform =
    'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
}

function establishSignalR() {
  signalRConnection = createSignalConnection(
    'https://motiondevice.azurewebsites.net/motion'
  );

  signalRConnection.on('motionUpdated', data => {
    console.log(data);

    turnLogo(data.beta, data.gamma);
  });

  signalRConnection.start().then(function() {
    console.log('connected');
  });
}

function createSignalConnection(url) {
  return new signalR.HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(signalR.LogLevel.Information)
    .build();
}

if ('DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', deviceOrientationHandler, false);
  establishSignalR();
} else {
  document.getElementById('logoContainer').innerText =
    'Device Orientation API not supported.';
}
