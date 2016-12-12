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
            PCstate, AccState, XregState, YregState, ZflagState, quantum, processComplete, waitTime, tTime, priority, processInMemory, locationInMemory) {
            if (processState === void 0) { processState = "New"; }
            if (pid === void 0) { pid = _TotalProcesses; }
            if (programCounter === void 0) { programCounter = 0; }
            if (baseRegister === void 0) { baseRegister = 0; }
            if (limitRegister === void 0) { limitRegister = 0; }
            if (memorySegementAmount === void 0) { memorySegementAmount = 0; }
            if (PCstate === void 0) { PCstate = 0; }
            if (AccState === void 0) { AccState = 0; }
            if (XregState === void 0) { XregState = 0; }
            if (YregState === void 0) { YregState = 0; }
            if (ZflagState === void 0) { ZflagState = 0; }
            if (quantum === void 0) { quantum = _CPUScheduler.quantum; }
            if (processComplete === void 0) { processComplete = false; }
            if (waitTime === void 0) { waitTime = 0; }
            if (tTime === void 0) { tTime = 0; }
            if (priority === void 0) { priority = 10; }
            if (processInMemory === void 0) { processInMemory = false; }
            if (locationInMemory === void 0) { locationInMemory = ""; }
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
            this.quantum = quantum;
            this.processComplete = processComplete;
            this.waitTime = waitTime;
            this.tTime = tTime;
            this.priority = priority;
            this.processInMemory = processInMemory;
            this.locationInMemory = locationInMemory;
            this.paritionCheck(); // Assign the PCB the right base and limit registers
            _ResidentQueue.enqueue(this); // Push the PCB into the Resident Queue
            this.PCstate = this.baseRegister; // Change the PC to the proper location
            _PCBContainer.push(this); // TODO implement the ready queue so I can get rid of this Push the object into the array
            _TotalProcesses++; // Increment the total number of processes	
        }
        PCB.prototype.paritionCheck = function () {
            /* Check to see which partitions are empty
            Copy the appropriate base and limit to the current PCB
            Set the partition to full too.
            */
            if (_MemoryManager.partitionOneEmpty == true) {
                this.setBaseAndLimit(0, 255);
                _MemoryManager.partitionOneEmpty = false;
            }
            else if (_MemoryManager.partitionTwoEmpty == true) {
                this.setBaseAndLimit(256, 511);
                _MemoryManager.partitionTwoEmpty = false;
            }
            else if (_MemoryManager.partitionThreeEmpty == true) {
                this.setBaseAndLimit(512, 767);
                _PartitionThreePCB = this;
                _MemoryManager.partitionThreeEmpty = false;
            }
            else {
                this.setBaseAndLimit(512, 767);
            }
        };
        PCB.prototype.setBaseAndLimit = function (baseVal, limitVal) {
            this.baseRegister = baseVal;
            this.limitRegister = limitVal;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
