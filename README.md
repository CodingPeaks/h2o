# H2O - HTTP to ONVIF Proxy

Currently in development.

!!! ALPHA !!! 

####################### USAGE #######################

1. Start the server

      node h2o.js
      
   This will scan your network for ONVIF devices and will list them when it's done.
      
2. Connect to an ONVIF camera

      ```
      curl "http://{SERVERIP}:{PORT}/?action=connect&ip={CAMIPADDRESS}&user={CAMUSERNAME}&pass={CAMPASSWORD}"
      ```
      
3. Control it!

      ```
      curl "http://{SERVERIP}:{PORT}/?action=move&movement=right"
      ```
      
You can also quickly test this program simply by starting the server and writing in to the browser address bar

      http://{SERVERIP}:{PORT}?action=connect&ip={CAMIPADDRESS}&user={CAMUSERNAME}&pass={CAMPASSWORD}

[ Coming soon: installation script ]

Let us know your thoughts!

####################################################

Credits (Thanks to):

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
