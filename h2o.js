const onvif = require('node-onvif');
const Stream = require('./src/node-rtsp-stream-jsmpeg.js')
const http = require('http');
const url = require('url');
const fs = require('fs');
var ip = require("ip");
var tb = require("console.table");
const fileHTML = fs.readFileSync('test/controls.html');
var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
global.pippo = {};
var loading;
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
loading();
onvif.startProbe().then((device_list) => {
	clearInterval(loading);
	device_list.forEach((device) => {
		var cam_xaddr = device.xaddrs[0];
		var cam_ip = cam_xaddr.match(r);
		discover_result[cam_ip] = cam_xaddr;
	});

	console.table("Onvif device scan result: " + device_list.length + " device(s) found:\n", discover_result);
	console.log("\x1b[32mREADY\x1b[0m\n");
}).catch((error) => {
	console.error(error);
});

const server = http.createServer((req, res) => {

	if (req.url != '/favicon.ico') {
		params = url.parse(req.url, true).query;

		switch (params.action) {
		case 'move':
			if (connected) {
				var direction = params.movement;
				console.log("Sending ONVIF command: "+direction);
				pippo = direction_lib[direction];
				//console.log(pippo);
				device.ptzMove({
					'speed': pippo
				}).catch((error) => {
					console.error(error);
				});
			} else {
				console.log("Device is not connected");
			}
			break;
		case 'connect':
		
			if(connected){
				stream.stop();
				console.log("Stream stopped");
			}
		
			console.log("Connecting...");
			var user = params.user;
			var pass = params.pass;
			var ip = params.ip;
			var xaddr = discover_result[ip];

			if (xaddr) {

				console.log("Connecting to " + xaddr);

				device = new onvif.OnvifDevice({
					xaddr: xaddr,
					user: user,
					pass: pass
				});

				device.init().then(() => {
					console.log("device inited");
					stream_url = device.getUdpStreamUrl();
					//console.log(stream_url);
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
				console.log("xaddress not found!");
				connected = false;
			}

			break;
		default:
			console.log("Command not recognized.");
			break;
		}
	}

	res.writeHead(200, {
		'Content-Type': 'text/html'
	});

	res.end(fileHTML);
});

const callback = () => {
	const address = server.address().address;
	const port = server.address().port;
	console.log('\x1b[33m%s\x1b[0m', "Server started at http://"+address+":"+port)
}

server
	.listen(
		8070,
		ip.address(),
		callback
	)

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
