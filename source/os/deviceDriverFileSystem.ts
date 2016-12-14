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

        public computeNZeros(input){
        	var result = "";
        	for(input; input < 64; input++){
        		result += "0";
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
            _GuiRoutines.updateHardDriveDisplay();
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
        			var newValue = "1" + value.substring(1, value.length);
        			sessionStorage.setItem(key, newValue);
        			return key;
        		}
        	}
        	return "0";
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

        	// Put a "1" for in use, the TSB, the filename, and leftover zeros
        	var zeros = 4 + (processedFileName.length/2); 
        	var tsb = this.nextAvailableDataLocale();
        	processedFileName = "1" + tsb + processedFileName + this.computeNZeros(zeros);  
        	sessionStorage.setItem(fileIndex,processedFileName);

        	//Lastly clear the content of the TSB if something existed prior
        	this.deleteContent(tsb);
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

        public fileExists(filename){
        	// Go through the possible file names
        	for(var i = 1; i < 64; i++){
        		var key = i.toString(8);
        		var value = sessionStorage.getItem(key).toString();
        		// If the file exists check it's content for a match
        		if(value.charAt(0) == '1'){
        			var result = "";
        			var j = 4;
        			while(value.charAt(j) != '0' && j != value.length){
        				var temp = value.charAt(j) + value.charAt(j+1);
        				temp = String.fromCharCode(parseInt(temp,16));
        				result = result + temp;
        				j += 2;
        			}
        			// Compare the param filename to our result
        			if(filename == result){
        				return key;
        			}
        		}
        	}
        	return "0";
        }


        public writeFile(content, key){
        	// Remove the quotations around the content
        	content = content.substring(1, content.length - 1);
        	
        	// Get the file address we're going to write to
        	var value = sessionStorage.getItem(key).toString();
        	var address = value.charAt(1) + value.charAt(2) + value.charAt(3);
        	
        	//TODO Add to the top some function to clear exisiting then rewrite

        	// Split the content into 60 character chunks
        	var contentChunks = content.match(/.{1,60}/g);
        	
        	var currKey = address;	
        	for(var i = 0; i < contentChunks.length; i++){
        		// Convert the chunk of ASCII text to Hex
        		var contentToHex = ""
        		var currentChunk = contentChunks[i];
        		for(var j = 0; j < currentChunk.length; j++){
        			contentToHex += currentChunk.charCodeAt(j).toString(16);
        		}
        		// Check if this is the last index of data that needs to be input
        		// If so just take our current address (key) and compute it's value
        		if(i == contentChunks.length - 1){
        			var zeros = (contentToHex.length/2) + 4;
        			contentToHex = "1000" + contentToHex + this.computeNZeros(zeros);
        			sessionStorage.setItem(currKey,contentToHex);
        		} else {
        			// Get the link to locate the next index of where the content should be written
        			var nextDataLocale = this.nextAvailableDataLocale();
        			// Check to see if we have space for it
        			if(nextDataLocale != "0"){
        				var zeros = (contentToHex.length/2) + 4;
        				contentToHex = "1" + nextDataLocale + contentToHex + this.computeNZeros(zeros);
        				sessionStorage.setItem(currKey,contentToHex);
        				currKey = nextDataLocale;
        			}
        			// TODO scenario where we run out of space as we're writing
        		} 
        	}
        }

        public readFile(startingIndex){
        	// Get the value at this key
        	var value = sessionStorage.getItem(startingIndex).toString();

        	var result = "";
        	var j = 4;

        	// While the value isn't a placeholder or finished convert the value from Hex to ASCII
        	while(value.charAt(j) != '0' && j != value.length){
        		var temp = value.charAt(j) + value.charAt(j+1);
        		temp = String.fromCharCode(parseInt(temp,16));
        		result = result + temp;
        		j += 2;
        	}

        	// Print the result stored text
        	_StdOut.putText(result);

        	// Check if the file is pointing to another index with content
        	// If so recursively call this function with that index
        	var nextIndex = value.charAt(1) + value.charAt(2) + value.charAt(3);
        	if(nextIndex != "000"){
        		this.readFile(nextIndex);	
        	}
        }

        public deleteFileName(key){
        	// Get the content of the key
        	var value = sessionStorage.getItem(key).toString();

        	// Get the index of where content is written
        	var contentKey = value.charAt(1) + value.charAt(2) + value.charAt(3);
        	// Call the helper function to free up the TSB locations as available
        	this.freeSpace(contentKey);

        	// Reset the value for the filename
        	var newValue = "0000000000000000000000000000000000000000000000000000000000000000";
        	sessionStorage.setItem(key, newValue);
        }

        public freeSpace(key){
        	// Get the content of the key
        	var value = sessionStorage.getItem(key).toString();

        	// Start by grabbing the TSB locale of where content is written next in the file
        	var contentKey = value.charAt(1) + value.charAt(2) + value.charAt(3);

        	// Unset the value from used "1" to unused "0"
        	var setToUnused = "0" + value.substring(1);
        	sessionStorage.setItem(key, setToUnused);

        	// Check if content is extended to another block, make the necessary call
        	if(contentKey != "000"){
        		this.freeSpace(contentKey);
        	}
        }

        public deleteContent(key){
			// Get the content of the key
        	var value = sessionStorage.getItem(key).toString();

        	// Start by grabbing the TSB locale of where content is written next in the file
        	var contentKey = value.charAt(1) + value.charAt(2) + value.charAt(3);

        	// Reset the value for the filename
        	var newValue = value.charAt(0) + "000000000000000000000000000000000000000000000000000000000000000";
        	sessionStorage.setItem(key, newValue);

       		// Check if content is extended to another block, make the necessary call
        	if(contentKey != "000"){
        		this.deleteContent(contentKey);
        	}	
        }

        public rollIn(inputArray, pcb){
            var content = "";
 
            for(var i = 0; i < pcb.memorySegementAmount; i++){
                switch(inputArray[i]){
                    case "0":
                        inputArray[i] = "00";
                        content = content + inputArray[i];
                    break;
                    case "A":
                        inputArray[i] = "0A";
                        content = content + inputArray[i];
                    break;
                    case "B":
                        inputArray[i] = "0B";
                        content = content + inputArray[i];
                    break;
                    case "C":
                        inputArray[i] = "0C";
                        content = content + inputArray[i];
                    break;
                    case "D":
                        inputArray[i] = "0D";
                        content = content + inputArray[i];
                    break;
                    case "E":
                        inputArray[i] = "0E";
                        content = content + inputArray[i];
                    break;
                    case "F":
                        inputArray[i] = "0F";
                        content = content + inputArray[i];
                    break;
                    case "1":
                        inputArray[i] = "01";
                        content = content + inputArray[i];
                    break;
                    case "2":
                        inputArray[i] = "02";
                        content = content + inputArray[i];
                    break;
                    case "3":
                        inputArray[i] = "03";
                        content = content + inputArray[i];
                    break;
                    case "4":
                        inputArray[i] = "04";
                        content = content + inputArray[i];
                    break;
                    case "5":
                        inputArray[i] = "05";
                        content = content + inputArray[i];
                    break;
                    case "6":
                        inputArray[i] = "06";
                        content = content + inputArray[i];
                    break;
                    case "7":
                        inputArray[i] = "07";
                        content = content + inputArray[i];
                    break;
                    case "8":
                        inputArray[i] = "08";
                        content = content + inputArray[i];
                    break;
                    case "9":
                        inputArray[i] = "09";
                        content = content + inputArray[i];
                    break;
                    default:
                        // This is a subtle fix to a problem that occurrs when a program is a full 256 bytes
                        if(inputArray[i].length > 2){
                            inputArray[i] = inputArray[i].charAt(1) + inputArray[i].charAt(2);
                        }
                        content = content + inputArray[i];
                    break;
                }
            }            
                
            var contentChunks = content.match(/.{1,120}/g);

            var currKey = this.nextAvailableDataLocale();
            pcb.locationInMemory = currKey;
            pcb.processInMemory = true;

            for(var j = 0; j < contentChunks.length; j++){
                var nthContentChunk = contentChunks[j];
                if(j == contentChunks.length - 1){
                    //var zeros = (nthContentChunk.length/2) + 4;
                    nthContentChunk = "1000" +nthContentChunk; // + this.computeNZeros(zeros);
                    sessionStorage.setItem(currKey, nthContentChunk);
                } else {
                    if(currKey != "0"){
                        var next = this.nextAvailableDataLocale();
                        //var zeros = (nthContentChunk.length/2) + 4;
                        nthContentChunk = "1" + next + nthContentChunk; // + this.computeNZeros(zeros);
                        sessionStorage.setItem(currKey,nthContentChunk);
                        currKey = next; //Reset the next available location for this
                    }
                }
            }
	    }

        public rollOut(key, len){
            
            // Get the value of the key
            var value = sessionStorage.getItem(key).toString();

            // Remove the control characters
            var curr = value.substring(4);

            // Split it up by every two characters
            var results = curr.match(/.{1,2}/g);
            
            var newIndex = value.charAt(1) + value.charAt(2) + value.charAt(3);
            if(newIndex != "000"){
                var trim = results.length - len;
                var forConcat = this.rollOut(newIndex, trim);
                results = results.concat(forConcat);
                return results;
            } else {
                if(results.length > len){
                    var trim = results.length - len;
                    results = results.slice(0, trim);
                }
                return results;
            }
        }


    }
}


