///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

module TSOS {
	export class DeviceDriverFileSystem extends DeviceDriver {

		constructor(public formatted: boolean = false
			){
			super();
			this.driverEntry = this.krnKbdDriverEntry;
		}

		public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        }

        public computeZeros(input){
        	// When rebuilding a value for the key return how many 0's are needed
        	var i = input.length;
        	var result = input;
        	for(i; i<65;i++){
        		result = result + 0;
        	}
        	return result;
        }

        public format(){
        	// Initialize all the keys for the Tracks, Sectors, and Blocks
        	for(var i = 0; i < 256; i++){
                var key = i.toString(8);
                var value = "0000000000000000000000000000000000000000000000000000000000000000";
                // Each key is a number from 0-254 in octal, the value will always be 64 0's on initializtion
                sessionStorage.setItem(key, value);
            }
            this.formatted = true;
        }

        public nextAvailableFileNameIndex(){
        	// Returns the next available space for a file name, if full return 0
        	for(var i = 1; i < 64; i++){
        		var key = i.toString(8);
        		var value = sessionStorage.getItem(key).toString();
        		if(value.charAt(0) == '0'){
        			return key;
        		}
        	}
        	return "0";
        }

        public nextAvailableDataLocale(){
        	// Find the next available space for data
        	for(var i = 64; i < 256; i++){
        		var key = i.toString(8);
        		var value = sessionStorage.getItem(key).toString();
        		if(value.charAt(0) == '0'){
        			value = "1" + value.substring(1, value.length);
        			sessionStorage.setItem(key, value);
        			return key;
        		}
        	}
        }

        public createFileName(filename, fileIndex){
        	// Split the input by character
        	var preProcessedFileName = filename.split("");
        	var processedFileName = "";
        	// Make the output value equal to the Hex Equivalent
        	for(var i = 0; i < preProcessedFileName.length; i++){
        		preProcessedFileName[i] = preProcessedFileName[i].charCodeAt(0).toString(16);
				processedFileName = processedFileName + preProcessedFileName[i];         	
        	}
        	processedFileName = "1" + this.nextAvailableDataLocale() + processedFileName;
        	processedFileName = this.computeZeros(processedFileName);
        	sessionStorage.setItem(fileIndex,processedFileName);
        }

        public ls(){
        	// Iterate through the directory
        	for(var i = 1; i < 64; i++){
        		var key = i.toString(8);
        		var value = sessionStorage.getItem(key).toString();
        		// Find every file name in the directory that's in use
        		if(value.charAt(0) == '1'){
        			var result = "";
        			var j = 4;
        			// Parse the name and convert it from hex to string values
        			while(value.charAt(j) != '0' && j != value.length){
        				var temp = value.charAt(j) + value.charAt(j+1);
        				temp = String.fromCharCode(parseInt(temp,16));
        				result = result + temp;
        				j += 2;
        			}
        			_StdOut.putText(result);
        			_StdOut.advanceLine();
        		} else {
        			continue;
        		}
        	}
        	_StdOut.putText("*Files Found")
        }
	}
}