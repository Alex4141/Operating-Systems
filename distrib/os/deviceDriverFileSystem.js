///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem(formatted) {
            if (formatted === void 0) { formatted = false; }
            _super.call(this);
            this.formatted = formatted;
            this.driverEntry = this.krnKbdDriverEntry;
        }
        DeviceDriverFileSystem.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        };
        DeviceDriverFileSystem.prototype.computeZeros = function (input) {
            // When rebuilding a value for the key return how many 0's are needed
            var i = input.length;
            var result = input;
            for (i; i < 65; i++) {
                result = result + 0;
            }
            return result;
        };
        DeviceDriverFileSystem.prototype.computeNZeros = function (input) {
            var result = "";
            for (input; input < 64; input++) {
                result += "0";
            }
            return result;
        };
        DeviceDriverFileSystem.prototype.format = function () {
            // Initialize all the keys for the Tracks, Sectors, and Blocks
            for (var i = 0; i < 256; i++) {
                var key = i.toString(8);
                var value = "0000000000000000000000000000000000000000000000000000000000000000";
                // Each key is a number from 0-254 in octal, the value will always be 64 0's on initializtion
                sessionStorage.setItem(key, value);
            }
            this.formatted = true;
        };
        DeviceDriverFileSystem.prototype.nextAvailableFileNameIndex = function () {
            // Returns the next available space for a file name, if full return 0
            for (var i = 1; i < 64; i++) {
                var key = i.toString(8);
                var value = sessionStorage.getItem(key).toString();
                if (value.charAt(0) == '0') {
                    return key;
                }
            }
            return "0";
        };
        DeviceDriverFileSystem.prototype.nextAvailableDataLocale = function () {
            // Find the next available space for data
            for (var i = 64; i < 256; i++) {
                var key = i.toString(8);
                var value = sessionStorage.getItem(key).toString();
                if (value.charAt(0) == '0') {
                    value = "1" + value.substring(1, value.length);
                    sessionStorage.setItem(key, value);
                    return key;
                }
            }
            return "0";
        };
        DeviceDriverFileSystem.prototype.createFileName = function (filename, fileIndex) {
            // Split the input by character
            var preProcessedFileName = filename.split("");
            var processedFileName = "";
            // Make the output value equal to the Hex Equivalent
            for (var i = 0; i < preProcessedFileName.length; i++) {
                preProcessedFileName[i] = preProcessedFileName[i].charCodeAt(0).toString(16);
                processedFileName = processedFileName + preProcessedFileName[i];
            }
            processedFileName = "1" + this.nextAvailableDataLocale() + processedFileName;
            processedFileName = this.computeZeros(processedFileName);
            sessionStorage.setItem(fileIndex, processedFileName);
        };
        DeviceDriverFileSystem.prototype.ls = function () {
            // Iterate through the directory
            for (var i = 1; i < 64; i++) {
                var key = i.toString(8);
                var value = sessionStorage.getItem(key).toString();
                // Find every file name in the directory that's in use
                if (value.charAt(0) == '1') {
                    var result = "";
                    var j = 4;
                    // Parse the name and convert it from hex to string values
                    while (value.charAt(j) != '0' && j != value.length) {
                        var temp = value.charAt(j) + value.charAt(j + 1);
                        temp = String.fromCharCode(parseInt(temp, 16));
                        result = result + temp;
                        j += 2;
                    }
                    _StdOut.putText(result);
                    _StdOut.advanceLine();
                }
                else {
                    continue;
                }
            }
            _StdOut.putText("*Files Found");
        };
        DeviceDriverFileSystem.prototype.fileExists = function (filename) {
            // Go through the possible file names
            for (var i = 1; i < 64; i++) {
                var key = i.toString(8);
                var value = sessionStorage.getItem(key).toString();
                // If the file exists check it's content for a match
                if (value.charAt(0) == '1') {
                    var result = "";
                    var j = 4;
                    while (value.charAt(j) != '0' && j != value.length) {
                        var temp = value.charAt(j) + value.charAt(j + 1);
                        temp = String.fromCharCode(parseInt(temp, 16));
                        result = result + temp;
                        j += 2;
                    }
                    // Compare the param filename to our result
                    if (filename == result) {
                        return key;
                    }
                }
            }
            return "0";
        };
        DeviceDriverFileSystem.prototype.writeFile = function (content, key) {
            // Remove the quotations around the content
            content = content.substring(1, content.length - 1);
            // Get the file address we're going to write to
            var value = sessionStorage.getItem(key).toString();
            var address = value.charAt(1) + value.charAt(2) + value.charAt(3);
            //TODO Add to the top some function to clear exisiting then rewrite
            // Split the content into 60 character chunks
            var contentChunks = content.match(/.{1,60}/g);
            var currKey = address;
            for (var i = 0; i < contentChunks.length; i++) {
                // Convert the chunk of ASCII text to Hex
                var contentToHex = "";
                var currentChunk = contentChunks[i];
                for (var j = 0; j < currentChunk.length; j++) {
                    contentToHex += currentChunk.charCodeAt(j).toString(16);
                }
                // Check if this is the last index of data that needs to be input
                // If so just take our current address (key) and compute it's value
                if (i == contentChunks.length - 1) {
                    var zeros = (contentToHex.length / 2) + 4;
                    contentToHex = "1000" + contentToHex + this.computeNZeros(zeros);
                    sessionStorage.setItem(currKey, contentToHex);
                }
                else {
                    // Get the link to locate the next index of where the content should be written
                    var nextDataLocale = this.nextAvailableDataLocale();
                    // Check to see if we have space for it
                    if (nextDataLocale != "0") {
                        var zeros = (contentToHex.length / 2) + 4;
                        contentToHex = "1" + nextDataLocale + contentToHex + this.computeNZeros(zeros);
                        sessionStorage.setItem(currKey, contentToHex);
                        currKey = nextDataLocale;
                    }
                }
            }
        };
        DeviceDriverFileSystem.prototype.readFile = function (startingIndex) {
            // Get the value at this key
            var value = sessionStorage.getItem(startingIndex).toString();
            var result = "";
            var j = 4;
            // While the value isn't a placeholder or finished convert the value from Hex to ASCII
            while (value.charAt(j) != '0' && j != value.length) {
                var temp = value.charAt(j) + value.charAt(j + 1);
                temp = String.fromCharCode(parseInt(temp, 16));
                result = result + temp;
                j += 2;
            }
            // Print the result stored text
            _StdOut.putText(result);
            // Check if the file is pointing to another index with content
            // If so recursively call this function with that index
            var nextIndex = value.charAt(1) + value.charAt(2) + value.charAt(3);
            if (nextIndex != "000") {
                this.readFile(nextIndex);
            }
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
