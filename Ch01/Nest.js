var SerialPort = require("serialport");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');
var math = require('mathjs');


var dataArray = [];

var portName = process.argv[2],
portConfig = {
	baudRate: 9600,
	parser: SerialPort.parsers.readline("\n")
};
function getDateTime() {
    var curt     = new Date();
    var year    = curt.getFullYear();
    var month   = curt.getMonth()+1;
    var day     = curt.getDate();
    var hour    = curt.getHours();
    var minute  = curt.getMinutes();
    var second  = curt.getSeconds();
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }
    var time = hour+':'+minute+':'+second;
     return time;
}
var printAverage = function(inputArray ){

    var tempDict = {};
    for (var ii = 0; ii < inputArray.length; ii++) {
	var data = inputArray[ii];
	var value = data.substring(data.length-6, data.length)
	var id = data.substring(0, data.length-6)
	tempDict[id] = value;
	inputArray[ii] = value;
    };
    console.log(tempDict)
    var sum = 0;
    Object.keys(tempDict).forEach(function(key) {
	sum = sum + parseFloat(tempDict[key]);
    });
    
 
    var displayTemp = sum/(Object.keys(tempDict).length);
    try{ 
	    //insert into db
	    var max = math.max.apply(null,inputArray);
	    var min = math.min.apply(null,inputArray);
	    console.log(displayTemp,max,min);
	    db.serialize(function(){
	
	    	db.run("CREATE TABLE IF NOT EXISTS temp (datetime TEXT, avgtemp REAL, hightemp REAL, lowtemp REAL)"); //}
		var stmt = db.prepare("INSERT INTO temp VALUES(?,?,?,?)");
		stmt.run(getDateTime(), displayTemp, max, min);
		stmt.finalize();
		});
    }catch(e){
	console.log("An error has occured",e)
    }
    
    //db.close();
    //io.emit("chat message", "Average Temperature: " + displayTemp.toFixed(2) + "\xB0 C");
    io.emit("chat message",{message: "Average Temperature at " + getDateTime() +":" + displayTemp.toFixed(2) + "\xB0 C", temp: tempDict})
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
