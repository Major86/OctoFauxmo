#!/usr/bin/python

#import modules
import RPi.GPIO as GPIO
import sys
#Set to pin connected to relay
pin = 18
usage = "start|stop"
try:
  GPIO.setwarnings(False)
  GPIO.setmode(GPIO.BCM)
  GPIO.setup(pin,GPIO.OUT)
  # check arguments and act
  if sys.argv[1] == "start":
    GPIO.output(pin,0)
  elif sys.argv[1] == "stop":
    GPIO.output(pin,1)
  else :
    print usage
except:
  print "error"

