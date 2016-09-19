var SerialPort = require("serialport");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dataArray = [];

var portName = process.argv[2],
portConfig = {
	baudRate: 9600,
	parser: SerialPort.parsers.readline("\n")
};

var printAverage = function(inputArray ){
    var tempDict = {};
    for (var ii = 0; ii < inputArray.length; ii++) {
	var data = inputArray[ii];
	var value = data.substring(data.length-6, data.length)
	var id = data.substring(0, data.length-6)
	tempDict[id] = value;
    };
    var sum = 0;
    Object.keys(tempDict).forEach(function(key) {
	sum = sum + parseFloat(tempDict[key]);
    });
    var displayTemp = sum/(Object.keys(tempDict).length);
    //io.emit("chat message", "Average Temperature: " + displayTemp.toFixed(2) + "\xB0 C");
    io.emit("chat message",{message: "Average Temperature: " + displayTemp.toFixed(2) + "\xB0 C", temp: tempDict})
    dataArray=[];
};

var sp;
sp = new SerialPort.SerialPort(portName, portConfig);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    sp.write(msg + "\n");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp.on("open", function () {
    console.log('open');
    setInterval(function(){printAverage(dataArray);}, 2000);
  sp.on('data', function(data) {
      console.log('data received: ' + data);
      dataArray.push(data);
  });
});

