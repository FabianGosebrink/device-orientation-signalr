if ('DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', deviceOrientationHandler, false);
} else {
  document.getElementById('logoContainer').innerText =
    'Device Orientation API not supported.';
}

let connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:5001/motion')
  .configureLogging(signalR.LogLevel.Information)
  .build();

connection.on('motionUpdated', data => {
  console.log(data);
});

connection.start().then(function() {
  console.log('connected');
});

function deviceOrientationHandler(eventData) {
  var gamma = eventData.gamma;
  var beta = eventData.beta;
  var alpha = eventData.alpha;

  connection
    .invoke('MySuperDuperAction', { alpha, beta, gamma })
    .catch(err => console.error(err.toString()));

  document.getElementById('doTiltLR').innerHTML = Math.round(gamma);
  document.getElementById('doTiltFB').innerHTML = Math.round(beta);
  document.getElementById('doDirection').innerHTML = Math.round(alpha);

  var logo = document.getElementById('imgLogo');
  logo.style.webkitTransform =
    'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
  logo.style.MozTransform = 'rotate(' + gamma + 'deg)';
  logo.style.transform =
    'rotate(' + gamma + 'deg) rotate3d(1,0,0, ' + beta * -1 + 'deg)';
}
