///<reference path="../globals.ts" />
///<reference path="canvastext.ts" />
///<reference path="shell.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public lineWrapLocations = []) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    _CommandHistory.push(this.buffer);
                    _CommandCycle = 0;
                    this.buffer = "";
                } else if(chr === String.fromCharCode(8)){
                     _StdOut.popText();
                } else if(chr == String.fromCharCode(9)){
                    var re = new RegExp("^" + this.buffer);
                    for(var commands in _AllCommands){
                        if(_AllCommands[commands].match(re) && re.toString() != "/^/" && _AllCommands[commands] != re.toString()){
                            while(this.buffer != ""){
                                _StdOut.popText();
                            }
                            var temp = _AllCommands[commands].split("");
                            for(var ch in temp){
                                _StdOut.putText(temp[ch]);
                                this.buffer += temp[ch];
                            }
                        }
                    }
                } else if(chr == String.fromCharCode(38)){
                    this.shiftForward();    
                } else if (chr == String.fromCharCode(40)){
                    this.shiftBack();
                } else {
                    if(this.currentXPosition > _Canvas.width){
                       this.lineWrapLocations.push(this.currentXPosition); 
                        this.advanceLine();
                    }
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                    
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public popText(): void {
            if(this.buffer != ""){
                if(this.currentXPosition <= 5){
                    this.currentYPosition -= _DefaultFontSize + 
                                         _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                         _FontHeightMargin;
                    this.currentXPosition = this.lineWrapLocations[this.lineWrapLocations.length - 1];
                    this.lineWrapLocations.pop();
                }
                var toRemove = this.buffer.slice(-1);
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, toRemove); 
                _DrawingContext.clearRect(this.currentXPosition - offset, this.currentYPosition - 14, _Canvas.width, _Canvas.height);
                this.currentXPosition = this.currentXPosition - offset;
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
            }
         }

        public shiftForward(): void {

            while(this.buffer != ""){
                _StdOut.popText();
            }

            _CommandCycle++;
            
            if(_CommandCycle > _CommandHistory.length){
                _CommandCycle = _CommandHistory.length;
            }

            if(_CommandHistory.length > 0 && _CommandCycle <= _CommandHistory.length){
                var getCommand = _CommandHistory[_CommandHistory.length - _CommandCycle].split("");
                for(var ch in getCommand){
                    _StdOut.putText(getCommand[ch]);
                    this.buffer += getCommand[ch];
                }
            }   
        } 
        
        public shiftBack(){
            
            while(this.buffer != ""){
                _StdOut.popText();
            }

            if(_CommandCycle <= 0){
                _CommandCycle = 0;
            } else {
                _CommandCycle--;
            }

            if(_CommandHistory.length > 0 && _CommandCycle <= _CommandHistory.length && _CommandCycle > 0){
                var getCommand = _CommandHistory[_CommandHistory.length - _CommandCycle].split("");
                for(var ch in getCommand){
                    _StdOut.putText(getCommand[ch]);
                    this.buffer += getCommand[ch];
                }
            } 
        }

        public advanceLine(): void {
            this.currentXPosition = 1;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // Scrolls when the Y position to put next command is greater than the Canvas (ie not visible)
            if(this.currentYPosition > _Canvas.height) {
                var currentState = _DrawingContext.getImageData(0,20,_Canvas.width,_Canvas.height);
                this.clearScreen();
                this.currentYPosition -= (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin);
                _DrawingContext.putImageData(currentState,0,0);
            }
        }
    }
 }