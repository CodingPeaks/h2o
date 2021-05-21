const onvif = require('node-onvif');
const Stream = require('./src/node-rtsp-stream-jsmpeg.js')
const http = require('http');
const url = require('url');
const fs = require('fs');
const readline = require("readline");
var ip = require("ip");
const express = require('express');
const app = express()
var os_nics = require('os').networkInterfaces();
var tb = require("console.table");
const fileHTML = fs.readFileSync('test/index.html');
var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
const HTTP_PORT = 8070;
global.pippo = {};
var loading;
var myArgs = process.argv.slice(2);

var ifname = "";

switch (myArgs[0]) {
case '-i':
	ifname = myArgs[1];
    break;
default:
    console.log('Sorry, that is not something I know how to do.');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(` __________
< Si vede? >
 ----------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`)

console.log("\n------------------------------------");
console.log("H2O - HTTP to ONVIF Proxy Server 1.0");

delete os_nics.lo;

if(Object.keys(os_nics).length > 1 && ifname == ""){

	//console.log("\nMultiple network intefaces detected, which one do you want me to use?\n");

	const interfaces = [];

	for(var i = 0; i < Object.keys(os_nics).length; i++){
		var ifname = Object.keys(os_nics)[i];
		var ip_address = getIpFromInterfaceName(ifname);
		var temp = [];
		temp["Interface name"] = ifname;
		temp["Ip address"] = ip_address;
		interfaces.push(temp);
	}

	console.table("\nMultiple network intefaces detected, which one do you want me to use?\n", interfaces);

	rl.question("Network interface name: ", function(name) {
		main(name.toLowerCase());
	    rl.close();
	});

}else{
	if(ifname == ""){
		ifname = Object.keys(os_nics)[0];
	}
	main(ifname);
}

function getIpFromInterfaceName(ifname){
	for(var i = 0; i < Object.keys(os_nics).length; i++){
		if(ifname == Object.keys(os_nics)[i]){
			var ip_address = Object.values(os_nics)[i][0]['address'];
			return ip_address;
		}
	}
}

function loading() {
	loading = (function () {
		var h = ['|', '/', '-', '\\'];
		var i = 0;

		return setInterval(() => {
			i = (i > 3) ? 0 : i;
			process.stdout.write('Searching for Onvif devices: ' + h[i] + '\r');
			i++;
		}, 300);
	})();
}

function main(name){

const bound_address = getIpFromInterfaceName(name);

console.log(`Interface \"${name}\" selected, binding to ${bound_address}\n`);

global.direction_lib = {
	"up": {
		"x": 0,
		"y": 1,
		"z": 0
	},
	"right": {
		"x": 1.0,
		"y": 0.0,
		"z": 0.0
	},
	"left": {
		"x": -1.0,
		"y": 0.0,
		"z": 0.0
	},
	"down": {
		"x": 0.0,
		"y": -1.0,
		"z": 0.0
	},
	"leftup": {
		"x": -1.0,
		"y": 1.0,
		"z": 0.0
	},
	"rightup": {
		"x": 1.0,
		"y": 1.0,
		"z": 0.0
	},
	"rightdown": {
		"x": 1.0,
		"y": -1.0,
		"z": 0.0
	},
	"leftdown": {
		"x": -1.0,
		"y": -1.0,
		"z": 0.0
	},
	"zoomin": {
		"x": 0.0,
		"y": 0.0,
		"z": 1.0
	},
	"zoomout": {
		"x": 0.0,
		"y": 0.0,
		"z": -1.0
	},
	"stop": {
		"x": 0.0,
		"y": 0.0,
		"z": 0.0
	}
};

global.params;
global.device;
global.stream_url;
global.stream;
global.connected = false;

var discover_result = {};
var discover_result_table = [];

loading();

onvif.startProbe({bind_address: bound_address}).then((device_list) => {
		clearInterval(loading);

		device_list.forEach((device) => {
			var cam_xaddr = device.xaddrs[0];
			var cam_ip = cam_xaddr.match(r);
			var temp = {};
			temp["name"] = device.name;
			temp["address"] = cam_xaddr.match(r)[0];
			temp["xaddr"] = device.xaddrs[0];
			discover_result_table.push(temp);
			discover_result[cam_ip] = cam_xaddr;
		});

		console.table("Onvif device scan result: " + device_list.length + " device(s) found:\n", discover_result_table);
		console.log("\x1b[32mREADY\x1b[0m\n");
}).catch((error) => {
		console.error(error);
});


app.use(express.static('test'));

app.get('/', (req, res) => {
    res.send();
});

app.get('/list', (req, res) => {
	console.log("Listing ONVIF devices");
    res.send(JSON.stringify(discover_result_table));
});

app.get('/connect/:ip/:user/:pass', function (req, res) {
	if(connected){
		stream.stop();
		console.log("Stream stopped");
	}
		
	var user = req.params.user;
	var pass = req.params.pass;
	var ip = req.params.ip;
	console.log(discover_result);
	var xaddr = discover_result[ip];

	if (xaddr) {

		console.log("Connecting to " + xaddr);

		device = new onvif.OnvifDevice({
			xaddr: xaddr,
			user: user,
			pass: pass
		});

		device.init().then(() => {
			var msg = "Device inited";
			console.log(msg);
			stream_url = device.getUdpStreamUrl().split("rtsp://");
			stream_url = "rtsp://" + user + ":" + pass + "@" + stream_url[1];

			connected = true;
					
			const options = {
				name: 'streamName',
				url: stream_url,
				wsPort: 9999
			}

			stream = new Stream(options);
			stream.start();					
					
		});

	} else {
		var msg = "Xaddress not found!";
		connected = false;
	}

	console.log(msg);
  	res.send(msg);
});

app.get('/move/:direction', function (req, res) {
	var direction = req.params.direction;
	if (connected) {
		console.log("Sending ONVIF command: "+direction);
		pippo = direction_lib[direction];
		var msg = 'Moving camera to '+direction;
		device.ptzMove({
			'speed': pippo
		}).catch((error) => {
			console.error(error);
		});
			
	} else {
		var msg = "Device is not connected";
	}

	console.log(msg);
  	res.send(msg);
});

app.get('/stop', function (req, res) {
	if (connected) {
		console.log("Sending ONVIF command: Stop");
		pippo = direction_lib['stop'];
		var msg = 'Stopping camera';
		device.ptzMove({
			'speed': pippo
		}).catch((error) => {
			console.error(error);
		});
			
	} else {
		var msg = "Device is not connected";
	}

	console.log(msg);
  	res.send(msg);
});


app.listen(HTTP_PORT, () => console.log('\x1b[33m%s\x1b[0m', "Server started at http://"+bound_address+":"+HTTP_PORT));



}
	
