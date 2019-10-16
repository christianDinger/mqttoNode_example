var request = require('request');
var url = `http://api.openweathermap.org/data/2.5/weather?q=Berlin&APPID=0fa4a8a7275821f8bc9fb279f6bb363c`;

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.1.100');
var message = '';

client.on('connect', function(){
  setInterval(function() {

    var line = '-------------------------------------------------';
    var roomTemp = getRandomRoomTemp(16, 24).toFixed(2).toString();
    var roomTempMsg = `${roomTemp}° Celsius Raumtemperatur.`;
    var note = '';
    var celsius;

    request(url, function(err, response, body) {
        if(err) {
          console.log('error: ', err);
        } else {
          var weather = JSON.parse(body);
          celsius = (weather.main.temp - 273).toFixed(2);
          message = `${celsius}° Celsius in Berlin, Deutschland.`; 
        }
    });

    if (roomTemp < 20) {
        if((celsius > roomTemp) && ((celsius - roomTemp) > 5)) {
            note = 'Öffne das Fenster.';
        } else {
            note = 'Schalte die Heizung ein.';
        }
    }

    if (roomTemp > 22) {
        if ((roomTemp > celsius) && ((roomTemp - celsius) > 5)) {
            note = 'Öffne das Fenster.';
        } else {
            note = 'Schalte Klimaanlage ein.'
        }
    }

    console.log(line);
    console.log(message);
    console.log(roomTempMsg);
    console.log(note);
    console.log(line);
      
    client.publish('myTopic', line, {qos:0, retain: true});  
    client.publish('myTopic', roomTempMsg, {qos:0, retain: true});
    client.publish('myTopic', message, {qos:0, retain: true});
    client.publish('myTopic', note, {qos:0, retain: true});
    client.publish('myTopic', line, {qos:0, retain: true});  
   }, 10000)
});

//helpper function to simulate roomTempSensor
function getRandomRoomTemp(min, max) { 
    return Math.random() * (max - min + 1) + min;
}