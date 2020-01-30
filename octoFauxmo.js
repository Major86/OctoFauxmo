/* This script modified from sample
 * https://github.com/lspiehler/node-fauxmo#readme
 *
 * Goal: Deliver a script which can completes all aspects
 * of setup and execution OR be integrated with outside
 * scripts such as those used with Octoprint or other 
 * third party services
 * */

/* ToDo:
 *
 * Add outside config
 *
 */

'use strict';

/* Dependencies */
const fs = require('fs'); //read from gpio
const FauxMo = require('node-fauxmo'); //emulator
/* Toggle debug messages on/off */
const debug = 0;

/*Dictionary to convert  0/1 
* to args for other scripts */
const dict = { 1: "start", 0: "stop" };


/* Variables for device 1 */
var dev1status = 0; //default status: off
var dev1pin=18; //relay pin

/* Function to ensure that pins and 
* associated files are ready for use
*/
function setupPin(pin){
  const {exec} = require('child_process');

  var f = '/sys/class/gpio/export';
  exec('echo '+pin+' >> '+ f,(err,stdout,stderr)=>{
    if (err) {
      //console.log(err);
      //console.log(stdout);
      //console.log(stderr);
     return 1;
    } else {
      //console.log(stdout);
      return 0;
    }
  });

}

/*Ensure the pin is ready for use*/
setupPin(dev1pin);

/* Function to invert values
*  Relays are cycled from the ground side
*  so to turn the relay off 
*  the pin is switched HI */
function flip(val){
  if (val==0){return 1;}else{return 0;}
}

/* Handlers for device 1 */
/* This function will read use the sysfs method of obtaining
*  the output pin state. While better than assumption 
*  relays can still stick, use caution */
var dev1statushandler = function() {
    if (debug==1){console.log('dev1statushandler run '+ dev1status);}
	var file = '/sys/class/gpio/gpio'+dev1pin+'/value';	
	fs.readFile(file,'utf8',(err,data)=>{
		if (err){
			console.log(err);
		} else {
      if ( debug == 1) {
        console.log('dev1statushandler fsread: ' + data);
      }
      dev1status = flip(data);
		}
	});
    return dev1status;
}
var dev1handler = function(action) {
  if (debug==1){console.log('dev1handler run '+action);}
  const {exec}=require('child_process');
  exec('/home/pi/scripts/powerPrinter ' + dict[action], 
  (err, stdout, stderr) =>{
    if (err) {
      console.log(err);
    } else {
      /*Uncomment for verbose logging*/ 
			//console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
      //date the status*/
      dev1status=action;
    }
  }); 
	dev1status = action;
}

/* Register devices and handlers */
let fauxMo = new FauxMo(
{
  devices: [
  {
    name: 'Test Device',
    port: 11201,
    handler: function(action) {
      console.log('Fake Device 1:', action);
      dev1handler(action);
    },
      statusHandler: function(callback) {
      callback(dev1statushandler());
    }
  }
  ]
});

if (debug==1){console.log('Main script run');}
