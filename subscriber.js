var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://192.168.1.100')

client.on('connect', function(){
  client.subscribe('myTopic')
})

client.on('message', function(topic, message){
  context = message.toString();
  console.log(context)
})
