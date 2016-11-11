var SerialPort = require("serialport");
var express=require('express');
var app = express();
var xbee_api = require('xbee-api');
var ml = require('machine_learning');
var xbee_11_rssi = 0;
var xbee_12_rssi = 0;
var xbee_13_rssi = 0;
var xbee_14_rssi = 0;
var rssi_total =[];
var http = require('http').Server(app);
var io = require('socket.io')(http); 
app.use(express.static('src'));

var C = xbee_api.constants;
var XBeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var portName = process.argv[2];

var sampleDelay = 2000;


//Note that with the XBeeAPI parser, the serialport's "data" event will not fire when messages are received!
var portConfig = {
	baudRate: 9600,
  parser: XBeeAPI.rawParser()
};

var sp;
sp = new SerialPort.SerialPort(portName, portConfig);


//Create a packet to be sent to all other XBEE units on the PAN.
// The value of 'data' is meaningless, for now.
var RSSIRequestPacket = {
  type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
  destination64: "000000000000ffff",
  broadcastRadius: 0x01,
  options: 0x00,
  data: "test"
}

var requestRSSI = function(){
  sp.write(XBeeAPI.buildFrame(RSSIRequestPacket));
}

sp.on("open", function () {
  console.log('open');
  requestRSSI();
  setInterval(requestRSSI, sampleDelay);
});

XBeeAPI.on("frame_object", function(frame) {


//  console.log("Beacon ID"+frame.type );
  //console.log(frame.type);
  if (frame.type >= 140){

    if (frame.data[1] == 11)
      { xbee_11_rssi = frame.data[0];}
    if (frame.data[1] == 12)
      { xbee_12_rssi = frame.data[0];}
    if (frame.data[1] == 13)
      { xbee_13_rssi = frame.data[0];}
    if (frame.data[1] == 14)
     { xbee_14_rssi = frame.data[0];}
//console.log("Beacon ID: " + frame.data[1] + ", RSSI: " + (frame.data[0]));
rssi_total =[xbee_11_rssi,xbee_12_rssi,xbee_13_rssi,xbee_14_rssi];
    console.log(rssi_total);

  }
});

var fifth_y_data_corridor_1 =
[ [ 52, 80, 83, 49 ],
  [ 53, 77, 82, 43 ],
  [ 65, 75, 80, 51 ],
  [ 64, 70, 86, 56 ],
  [ 62, 80, 81, 47 ],
  [ 62, 80, 88, 45 ],
  [ 54, 76, 85, 41 ],
  [ 51, 70, 80, 49 ],
  [ 57, 77, 78, 54 ],
  [ 52, 69, 93, 58 ],
  [ 55, 70, 255, 45 ],
  [ 56, 76, 91, 49 ],
  [ 56, 71, 74, 50 ],
  [ 57, 72, 255, 56 ],
  [ 59, 78, 85, 54 ],
  [ 57, 68, 85, 49 ],
  [ 62, 77, 81, 51 ],
  [ 57, 71, 86, 64 ],
  [ 54, 69, 90, 46 ],
  [ 53, 66, 82, 61 ],
  [ 70, 77, 94, 55 ],
  [ 58, 82, 93, 54 ],
  [ 60, 70, 88, 50 ],
  [ 63, 75, 89, 73 ],
  [ 53, 69, 88, 51 ],
  [ 57, 68, 90, 58 ],
  [ 57, 71, 94, 56 ],
  [ 56, 76, 96, 57 ],
  [ 54, 70, 93, 57 ],
  [ 66, 80, 91, 58 ],
  [ 60, 68, 97, 54 ],
  [ 61, 64, 95, 58 ],
  [ 57, 70, 93, 59 ],
  [ 73, 65, 95, 62 ],
  [ 66, 70, 92, 57 ],
  [ 54, 255, 98, 66 ],
  [ 67, 65, 96, 66 ],
  [ 51, 62, 93, 61 ],
  [ 68, 67, 96, 70 ],
  [ 48, 70, 95, 67 ],
  [ 51, 69, 97, 60 ],
  [ 53, 66, 96, 64 ],
  [ 57, 63, 95, 61 ],
  [ 55, 64, 97, 67 ],
  [ 51, 83, 96, 63 ],
  [ 48, 70, 96, 61 ],
  [ 51, 68, 98, 58 ],
  [ 57, 69, 98, 65 ],
  [ 53, 67, 95, 69 ],
  [ 53, 61, 94, 67 ],
  [ 64, 68, 98, 66 ],
  [ 52, 67, 98, 75 ],
  [ 49, 73, 98, 69 ],
  [ 54, 71, 98, 58 ],
  [ 51, 61, 98, 64 ],
  [ 54, 67, 98, 65 ],
  [ 55, 66, 97, 75 ],
  [ 48, 60, 97, 71 ],
  [ 50, 58, 97, 64 ],
  [ 64, 68, 97, 70 ],
  [ 53, 78, 97, 81 ],
  [ 53, 69, 98, 72 ],
  [ 50, 65, 98, 71 ],
  [ 48, 65, 98, 73 ],
  [ 51, 64, 98, 75 ],
  [ 49, 69, 98, 67 ],
  [ 57, 69, 98, 76 ],
  [ 53, 61, 98, 70 ],
  [ 62, 68, 98, 74 ],
  [ 52, 59, 98, 66 ],
  [ 52, 70, 98, 80 ],
  [ 54, 56, 98, 67 ],
  [ 55, 67, 98, 70 ],
  [ 52, 62, 98, 77 ],
  [ 51, 63, 98, 76 ],
  [ 49, 63, 98, 70 ],
  [ 57, 60, 98, 74 ],
  [ 56, 69, 98, 78 ],
  [ 53, 59, 98, 70 ],
  [ 43, 60, 98, 73 ],
  [ 45, 60, 98, 67 ],
  [ 52, 64, 98, 80 ],
  [ 45, 74, 98, 69 ],
  [ 46, 56, 98, 78 ],
  [ 49, 73, 98, 73 ],
  [ 48, 65, 98, 69 ],
  [ 42, 58, 98, 70 ],
  [ 43, 60, 98, 67 ],
  [ 49, 60, 98, 70 ],
  [ 53, 61, 98, 72 ],
  [ 46, 58, 98, 67 ],
  [ 49, 51, 98, 73 ],
  [ 45, 51, 98, 69 ],
  [ 42, 62, 98, 69 ],
  [ 43, 55, 98, 73 ],
  [ 59, 56, 98, 70 ],
  [ 46, 52, 98, 73 ],
  [ 48, 55, 98, 67 ],
  [ 54, 51, 98, 75 ],
  [ 46, 67, 98, 80 ],
  [ 52, 49, 98, 69 ],
  [ 39, 61, 98, 73 ],
  [ 58, 53, 98, 69 ],
  [ 42, 52, 98, 78 ],
  [ 39, 54, 98, 83 ],
  [ 37, 52, 98, 84 ],
  [ 40, 55, 98, 74 ],
  [ 49, 49, 98, 79 ],
  [ 40, 47, 98, 75 ],
  [ 39, 44, 98, 67 ],
  [ 48, 46, 98, 75 ],
  [ 48, 40, 98, 86 ],
  [ 47, 41, 98, 84 ],
  [ 44, 52, 98, 70 ],
  [ 49, 54, 98, 74 ],
  [ 45, 41, 98, 82 ],
  [ 38, 46, 98, 80 ],
  [ 41, 41, 98, 69 ],
  [ 35, 45, 98, 67 ],
  [ 39, 43, 98, 75 ] ];

var fifth_y_result_corridor_1 = [ 0,  0,0,0,0,0,
  1,  1,  1,1,1,1,
  2,  2,  2,2,2,2,
  3,  3,  3,3,3,3,
  4,  4,  4,4,4,4,
  5,  5,  5,5,5,5,
  6,  6,  6,6,6,6,
  7,  7,  7,7,7,7,
  8,  8,  8,8,8,8,
  9,  9,  9,9,9,9,
  10,  10,  10,10,10,10,
  11,  11,  11,11,11,11,
  12,  12,  12,12,12,12,
  13,  13,  13,13,13,13,
  14,  14,  14,14,14,14,
  15,  15,  15,15,15,15,
  16,  16,  16,16,16,16,
  17,  17,  17,17,17,17,
  18,  18,  18,18,18,18,
  19,  19,  19,19,19,19]

var fifth_y_data_corridor_2 = [[ 77, 63, 85, 54 ],
  [ 69, 63, 70, 52 ],
  [ 71, 61, 72, 60 ],
  [ 81, 60, 60, 54 ],
  [ 78, 67, 77, 61 ],
  [ 75, 76, 70, 61 ],
  [ 72, 65, 68, 57 ],
  [ 65, 73, 71, 58 ],
  [ 76, 68, 89, 60 ],
  [ 81, 76, 71, 62 ],
  [ 79, 72, 69, 68 ],
  [ 82, 59, 63, 57 ],
  [ 72, 66, 69, 65 ],
  [ 75, 62, 68, 71 ],
  [ 79, 63, 70, 61 ],
  [ 72, 69, 81, 67 ],
  [ 72, 78, 80, 62 ],
  [ 70, 61, 70, 61 ],
  [ 73, 66, 75, 60 ],
  [ 76, 64, 72, 58 ],
  [ 75, 59, 80, 63 ],
  [ 72, 73, 81, 65 ],
  [ 75, 77, 75, 74 ],
  [ 75, 58, 69, 58 ],
  [ 73, 63, 80, 63 ],
  [ 66, 67, 74, 74 ],
  [ 72, 69, 73, 59 ],
  [ 71, 72, 76, 61 ],
  [ 77, 66, 76, 66 ],
  [ 76, 66, 79, 64 ],
  [ 69, 74, 78, 64 ],
  [ 75, 65, 87, 60 ],
  [ 71, 61, 80, 79 ],
  [ 74, 62, 78, 74 ],
  [ 73, 71, 76, 64 ],
  [ 71, 60, 86, 72 ],
  [ 75, 60, 89, 60 ],
  [ 73, 59, 93, 67 ],
  [ 71, 66, 89, 67 ],
  [ 71, 69, 78, 67 ],
  [ 76, 60, 79, 70 ],
  [ 75, 61, 83, 72 ],
  [ 82, 65, 87, 69 ],
  [ 70, 67, 78, 69 ],
  [ 67, 62, 88, 67 ],
  [ 67, 60, 84, 66 ],
  [ 75, 79, 87, 59 ],
  [ 72, 65, 84, 71 ],
  [ 81, 63, 76, 68 ],
  [ 65, 58, 85, 77 ],
  [ 68, 59, 255, 69 ],
  [ 66, 61, 81, 76 ],
  [ 74, 65, 95, 67 ],
  [ 65, 66, 84, 68 ],
  [ 70, 55, 85, 74 ],
  [ 69, 61, 91, 76 ],
  [ 74, 60, 255, 75 ],
  [ 77, 54, 93, 77 ],
  [ 61, 57, 90, 73 ],
  [ 67, 57, 80, 72 ],
  [ 71, 66, 93, 72 ],
  [ 62, 51, 92, 77 ],
  [ 63, 55, 255, 77 ],
  [ 71, 51, 90, 69 ],
  [ 76, 61, 82, 69 ],
  [ 62, 56, 84, 70 ],
  [ 68, 74, 88, 74 ],
  [ 56, 56, 89, 72 ],
  [ 63, 55, 79, 67 ],
  [ 57, 54, 98, 78 ],
  [ 73, 59, 90, 78 ],
  [ 61, 54, 86, 75 ],
  [ 79, 58, 88, 76 ],
  [ 61, 54, 93, 76 ],
  [ 65, 58, 92, 69 ],
  [ 73, 57, 84, 79 ],
  [ 60, 55, 85, 71 ],
  [ 69, 51, 86, 76 ],
  [ 61, 63, 83, 79 ],
  [ 78, 54, 92, 79 ],
  [ 60, 51, 92, 73 ],
  [ 59, 51, 92, 71 ],
  [ 62, 57, 83, 75 ],
  [ 60, 59, 88, 255 ],
  [ 56, 56, 89, 76 ],
  [ 59, 54, 93, 77 ],
  [ 57, 50, 91, 77 ],
  [ 62, 51, 89, 77 ],
  [ 63, 53, 88, 72 ],
  [ 63, 56, 92, 71 ],
  [ 53, 63, 90, 72 ],
  [ 74, 52, 96, 82 ],
  [ 54, 48, 88, 85 ],
  [ 54, 45, 92, 84 ],
  [ 54, 61, 90, 87 ],
  [ 60, 44, 94, 73 ],
  [ 57, 57, 94, 75 ],
  [ 50, 47, 87, 76 ],
  [ 53, 45, 90, 72 ],
  [ 62, 48, 90, 81 ],
  [ 55, 58, 90, 79 ],
  [ 62, 49, 89, 76 ],
  [ 51, 46, 89, 76 ],
  [ 59, 38, 89, 72 ],
  [ 60, 39, 91, 73 ],
  [ 49, 43, 91, 83 ],
  [ 53, 51, 90, 76 ],
  [ 51, 59, 92, 77 ],
  [ 49, 46, 94, 77 ],
  [ 55, 45, 96, 79 ],
  [ 56, 47, 96, 76 ],
  [ 44, 47, 89, 83 ],
  [ 51, 55, 91, 84 ],
  [ 49, 51, 96, 79 ],
  [ 63, 42, 96, 81 ],
  [ 43, 41, 96, 76 ],
  [ 43, 42, 94, 75 ],
  [ 55, 42, 91, 77 ],
  [ 48, 52, 90, 83 ],
  [ 69, 49, 96, 82 ] ];

var fifth_x_data_corridor_1 = fifth_y_data_corridor_1;
var fifth_x_data_corridor_2 = fifth_y_data_corridor_2;

var fifth_y_result_corridor_2 = [ 0,  0,0,0,0,0,
  1,  1,  1,1,1,1,
  2,  2,  2,2,2,2,
  3,  3,  3,3,3,3,
  4,  4,  4,4,4,4,
  5,  5,  5,5,5,5,
  6,  6,  6,6,6,6,
  7,  7,  7,7,7,7,
  8,  8,  8,8,8,8,
  9,  9,  9,9,9,9,
  10,  10,  10,10,10,10,
  11,  11,  11,11,11,11,
  12,  12,  12,12,12,12,
  13,  13,  13,13,13,13,
  14,  14,  14,14,14,14,
  15,  15,  15,15,15,15,
  16,  16,  16,16,16,16,
  17,  17,  17,17,17,17,
  18,  18,  18,18,18,18,
  19,  19,  19,19,19,19]

var fifth_x_result_corridor_1 = [0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0,
 0]

var fifth_x_result_corridor_2 = [6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6,
 6]

// Final Training data
//var y_data = y_data_corridor_1 .concat(y_data_corridor_2).concat(y_data_short_ends).concat(x_data_corridor_2)
//var y_result = y_result_corridor.concat(y_result_corridor).concat(y_result_short_ends).concat(x_result_corridor_2)
//var x_data = x_data_elevator_end.concat(x_data_window_end).concat(x_data_corridor_1)
//var x_result = x_result_elevator_end.concat(x_result_window_end).concat(x_result_corridor_1)
var y_data =  fifth_y_data_corridor_1.concat(fifth_y_data_corridor_2)
var y_result = fifth_y_result_corridor_1.concat(fifth_y_result_corridor_2)
var x_data = fifth_x_data_corridor_1.concat(fifth_x_data_corridor_2);
var x_result = fifth_x_result_corridor_1.concat(fifth_x_result_corridor_2)

function predict(input,knn){
        var predicted = knn.predict({
                x: input,
                k: 3,
                weightf : {type : "none"},//'gaussian', sigma : 10.0},
                distance : {type : 'euclidean'}
        });
        return predicted
}

var x_knn = new ml.KNN({
    data : x_data,
    result : x_result
});

var y_knn = new ml.KNN({
    data : y_data,
    result : y_result
});

function send(x_predicted,y_predicted){
        io.emit('data',{x:x_predicted,y:y_predicted});
}

var x_predicted;
var y_predicted;

function predict_and_send(){
	console.log(rssi_total);
	x_predicted= predict(rssi_total,x_knn);
	x_predicted = 0;
	y_predicted = predict(rssi_total,y_knn);
	console.log(x_predicted,y_predicted);
	io.emit('data',{x:x_predicted,y:y_predicted});        
}


//var x_predicted = x_knn.predict({
//        x: x_input,
//        k: 3,
//        weightf : {type : 'gaussian', sigma : 10.0},
//        distance : {type : 'euclidean'}
//});
//
//
//
//
//var y_predicted = y_knn.predict({
//        x: y_input,
//        k: 3,
//        weightf : {type : 'gaussian', sigma : 10.0},
//        distance : {type : 'euclidean'}
//});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('update',function(msg){
        console.log(msg);
        sp.write(msg);
        });
});


setInterval(predict_and_send,2000);

http.listen(3000, function(){
  console.log('listening on *:3000');
});


// Webpage with LED status
app.get('/', function(req, res){
    res.sendFile('index.html' , { root : __dirname});
});

