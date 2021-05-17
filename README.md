
H2O - HTTP to ONVIF Proxy
=======================

Application in Node JS that allows you to interact with IP Cameras through the use of the SOAP protocol and the ONVIF standard using the HTTP API.

Just install the dependencies, start application and it is ready to use!


Requirements
============
* nodejs >= 8.0.0
* npm >= 4.0.0


## 📎 Menu
- 🔨 [Installation](#installation)
- 🚀 [Usage](#usage)
- 📷 [Screenshot](#screenshot)
- 📙 [Documentation](#documentation)
- 👷‍♂️ [Contributing](#contributing)  
- 🐛 [Known Bugs](https://github.com/CodingPeaks/h2o/issues)

🔨 Installation
============

    bash install.sh

🚀 Usage
=====

**1. Start the server** 🚀

	node h2o.js

This will scan your network for ONVIF devices and will list them when it's done.
    
**2. Connect to an ONVIF camera** 👀

	curl "http://{SERVERIP}:{PORT}/?action=connect&ip={CAMIPADDRESS}&user={CAMUSERNAME}&pass={CAMPASSWORD}"

You can also quickly test this program simply by starting the server and writing in to the browser address bar

![JSON Token Replace](https://raw.githubusercontent.com/CodingPeaks/h2o/master/img/urlconn.png)

**3. Control it!** 💣

	curl "http://{SERVERIP}:{PORT}/?action=move&movement=right"

📷 Screenshot
=====

 📙 Documentation
=====

👷‍♂️ Contributing 
=======
<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/anAverageSlavGuy"><img src="https://avatars.githubusercontent.com/u/55255040?v=4" width="100px" alt=""/><br /><sub><b>Yevgeniy Shavlay</b></sub></a><br /><a href="https://github.com/anAverageSlavGuy" title="Code">💻</a> <a href="https://github.com/anAverageSlavGuy" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/CodingPeaks"><img src="https://avatars.githubusercontent.com/u/39136442?v=4" width="100px" alt=""/><br /><sub><b>Marco Nardone</b></sub></a><br /><a href="https://github.com/CodingPeaks" title="Code">💻</a> <a href="https://github.com/CodingPeaks" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Credits
=======

NODE ONVIF - Futomi 
[https://github.com/futomi/node-onvif]

node-rtsp-stream-jsmpeg - Zveroslav 
[https://github.com/Zveroslav/node-rtsp-stream-jsmpeg]

node-ip - indutny 
[https://github.com/indutny/node-ip]

node-url - defunctzombie 
[https://github.com/defunctzombie/node-url]

console.table - bahmutov 
[https://github.com/bahmutov/console.table]
