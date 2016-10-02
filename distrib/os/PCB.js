///<reference path="../globals.ts" />
/*
Process Control Block prototype.
Includes important details about each process loaded into memory
*/
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(processState, pid, programCounter, baseRegister, limitRegister, memorySegementAmount, 
            /*
            These vars below will be important later on when switching between processes
            But for now, less prevalent on current project
            Load CPU state below before switching between PCB's on the queue
            */
            PCstate, AccState, XregState, YregState, ZflagState) {
            if (processState === void 0) { processState = "New"; }
            if (pid === void 0) { pid = _PCBContainer.length; }
            if (programCounter === void 0) { programCounter = 0; }
            if (baseRegister === void 0) { baseRegister = _PCBContainer.length * 256; }
            if (limitRegister === void 0) { limitRegister = baseRegister + 255; }
            if (memorySegementAmount === void 0) { memorySegementAmount = 0; }
            if (PCstate === void 0) { PCstate = 0; }
            if (AccState === void 0) { AccState = 0; }
            if (XregState === void 0) { XregState = 0; }
            if (YregState === void 0) { YregState = 0; }
            if (ZflagState === void 0) { ZflagState = 0; }
            this.processState = processState;
            this.pid = pid;
            this.programCounter = programCounter;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            this.memorySegementAmount = memorySegementAmount;
            this.PCstate = PCstate;
            this.AccState = AccState;
            this.XregState = XregState;
            this.YregState = YregState;
            this.ZflagState = ZflagState;
            _PCBContainer.push(this); //Push the object into the array	
        }
        PCB.prototype.init = function () {
            this.processState = "New";
            this.pid = _PCBContainer.length;
            this.programCounter = 0;
            this.baseRegister = _PCBContainer.length * 256;
            this.limitRegister = this.baseRegister + 255;
            this.PCstate = 0;
            this.AccState = 0;
            this.XregState = 0;
            this.YregState = 0;
            this.ZflagState = 0;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
