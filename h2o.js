const onvif = require('node-onvif');
const http = require('http');
const url = require('url');
const fs = require('fs');
var ip = require("ip");
const fileHTML = fs.readFileSync('controls.html');
var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
global.pippo = {};
var loading;

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
global.connected = false;

var discover_result = {};
loading();
onvif.startProbe().then((device_list) => {
	clearInterval(loading);
	console.log("Onvif device scan result: " + device_list.length + " device(s) found.");
	console.log("\x1b[32m", "• READY", "\x1b[0m");
	device_list.forEach((device) => {
		var cam_xaddr = device.xaddrs[0];
		var cam_ip = cam_xaddr.match(r);
		discover_result[cam_ip] = cam_xaddr;
	});

	//console.log(discover_result);

}).catch((error) => {
	console.error(error);
});

const server = http.createServer((req, res) => {

	if (req.url != '/favicon.ico') {
		params = url.parse(req.url, true).query;

		switch (params.action) {
		case 'move':
			if (connected) {
				console.log("Moving...");
				var direction = params.movement;
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
					//setInterval( snap, 100);
					connected = true;
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
	console.log(`Server started at http://${address}:${port}`);
}

server
	.listen(
		8070,
		ip.address(),
		callback
	)

function snap() {
	dev.fetchSnapshot().then((res) => {
		fs.writeFileSync('/var/www/html/snapshot.jpg', res.body, {
			encoding: 'binary'
		});
	}).catch((error) => {
		console.error(error);
	});
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