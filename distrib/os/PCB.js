///<reference path="../globals.ts" />
/*
Process Control Block prototype.
Includes important details about each process loaded into memory
*/
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(processState, pid, programCounter, baseRegister, limitRegister) {
            if (processState === void 0) { processState = "New"; }
            if (pid === void 0) { pid = _PCBContainer.length; }
            if (programCounter === void 0) { programCounter = 0; }
            if (baseRegister === void 0) { baseRegister = _PCBContainer.length * 256; }
            if (limitRegister === void 0) { limitRegister = baseRegister + 255; }
            this.processState = processState;
            this.pid = pid;
            this.programCounter = programCounter;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            _PCBContainer.push(this); //Push the object into the array	
        }
        PCB.prototype.init = function () {
            this.processState = "New";
            this.pid = _PCBContainer.length;
            this.programCounter = 0;
            this.baseRegister = _PCBContainer.length * 256;
            this.limitRegister = this.baseRegister + 255;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
