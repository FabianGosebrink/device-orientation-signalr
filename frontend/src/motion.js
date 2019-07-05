var signalRConnection = null;
var logoId = 'imgLogo';

function setTextOnElement(elementId, textToSet) {
  document.getElementById(elementId).innerHTML = textToSet;
}

function deviceOrientationHandler(eventData) {
  var gamma = eventData.gamma;
  var beta = eventData.beta;
  var alpha = eventData.alpha;

  if (signalRConnection.state === 1) {
    signalRConnection
      .invoke('MySuperDuperAction', { alpha, beta, gamma })
      .catch(err => console.error(err.toString()));
  }

  setTextOnElement('gamma', Math.round(gamma));
  setTextOnElement('beta', Math.round(beta));
  setTextOnElement('alpha', Math.round(alpha));
}

function turnLogo(beta, gamma) {
  var logo = document.getElementById(logoId);
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
    console.log(signalRConnection.state);
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
