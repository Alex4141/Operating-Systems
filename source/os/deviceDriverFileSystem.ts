///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

module TSOS {
	export class DeviceDriverFileSystem extends DeviceDriver {

		constructor(){
			super();
			this.driverEntry = this.krnKbdDriverEntry;
		}

		public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        }

        public format(){
        	// Initialize all the keys for the Tracks, Sectors, and Blocks
        	for(var i = 0; i < 256; i++){
                var file = i.toString(8);
                var value = "0000000000000000000000000000000000000000000000000000000000000000";
                // Each key is a number from 0-254 in octal, the value will always be 64 0's on initializtion
                sessionStorage.setItem(file, value);
            }
        }
	}
}