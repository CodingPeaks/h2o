#!/bin/bash

function installsyspkg(){

	PACKAGE="$1"

	echo -ne "Installing $PACKAGE..."
	apt-get -y install "$PACKAGE" > /dev/null 2>&1

	if [ $? -ne 0 ]; then
	    echo "FAIL"
	    exit 1
	else
		echo "done"
	fi	

}

function installnodepkg(){

	PACKAGE="$1"

	echo -ne "Installing package $PACKAGE..."
	npm install "$PACKAGE" > /dev/null 2>&1

	if [ $? -ne 0 ]; then
	    echo "FAIL"
	    exit 1
	else
		echo "done"
	fi	

}

echo "This script will install all the required software to run h2o.js"
read -p "Press enter to continue or CTRL+C to abort"

echo "Running apt update..."
apt-get update > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "There was an error running apt update, exiting"
    exit 1
else
	echo "Packages list updated"
fi

installsyspkg ffmpeg
installsyspkg nodejs
installsyspkg npm

echo "All required system packages have been installed, installing node packages..."

installnodepkg ws
installnodepkg node-onvif
installnodepkg ip
installnodepkg console.table
installnodepkg http-shutdown
installnodepkg express

echo "Replacing node-onvif.js..."

cp src/node-onvif.js node_modules/node-onvif/lib/

echo "DONE"
