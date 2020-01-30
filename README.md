Summary
===

This write up is meant to serve as a companion to the Thingiverse writeup explaining how to integrate your smart home controller with Octoprint and control basic functions on your printer. 

This writup assumes you have followed the standard Octoprint install guide and are running as the pi user. 

Power Scripts
---


### powerPrinter.py
The first script powerPrinter.py is used to control the cycling of the relay connected to your printer. 

<strong>Installation</strong><br>
Install this script into the */home/pi/scripts* folder. This folder will already exist if you have setup Octoprint to stream video. If not, create this folder.

<strong>Configuration</strong><br>
Set the pin variable in this script to the same RaspberryPi pin connected to your relay. 

<strong>Test</strong>
Ensure the script is executeable and test. 

    chmod +x /home/pi/scripts/powerPrinter.py
    /home/pi/scripts/powerPrinter.py start
    /home/pi/scripts/powerPrinter.py stop

The relay should turn on then off. 

### powerPrinter 
The second script powerPrinter calls the first script and handles additional logic like turning off power to the USB ports which prevents powering of the printers motherboard and LCD screen when the printer is off. 

<strong>Installation</strong><br>
Place this script in the same folder as the first script. Ensure it is executeable and test. 

<strong>Configuration</strong><br>
Unless you changed paths or names no configuration should be required.
Any additional logic desired at run time should also be added to this script or to the emulation script. 

<strong>Test</strong><br>

    chmod +x /home/pi/scripts/powerPrinter
    /home/pi/scripts/powerPrinter start
    /home/pi/scripts/powerPrinter stop

The printer should turn off and then back on. The LCD screen should not be powered while the pinter is off. 

### Config.yaml
This script will add commands to the Octoprint menu allowing the scripts to be run from the Octoprint interface. 

<strong>Configuration</strong><br>
Add the following lines to the */home/pi/.octoprint/config.yaml* under the system section.

    - action: printeron
      command: /home/pi/scripts/powerPrinter start
      name: Turn On Printer
    - action: printeroff
      command: /home/pi/scripts/powerPrinter stop
      confirm: true
      name: Turn Off Printer
 

Emulation Script
--- 
This script will create a virtual WeMo device allowing communication with your smart home controller. 


<strong>Installation</strong><br>
Create a folder to hold the node modules and emulation script. 
Install the dependencies and copy the octoFauxmo.js script there. 

    cd ~
    mkdir ./octofauxmo
    cd ./octofauxmo
    npm install node-fauxmo

<strong>Configuration</strong><br>
Assign port numbers and names to each virtual device. See comments in the configuration section for details.

Important: Each device needs it's own tcp port number relative to the controller. Port numbers may not be reused even across different client devices. 

i.e.

    var dev1pin=18; //relay pin
    name: 'Test Device',
    port: 11201,
    
<strong>Test</strong><br>

    node octofomo.js
   
Say "Alexa, Find new devices" 
Your device should be descovered. 

Run At Boot
---

Add the lines below to your cron file via: 
    
    crontab -e

then add the text from cronjob.txt to the bottom of this file. 

Appendix
===

RaspberryPi GPIO
---
[![pinout.jpg](https://i.postimg.cc/HW07P3W5/pinout.jpg)](https://postimg.cc/bdJJZxtN)
