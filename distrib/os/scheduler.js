///<reference path="../globals.ts" />
/*
CPU Scheduler prototype
*/
var TSOS;
(function (TSOS) {
    var scheduler = (function () {
        function scheduler(scheduleType, quantum, multipleProcessesRunning) {
            if (scheduleType === void 0) { scheduleType = "rr"; }
            if (quantum === void 0) { quantum = 6; }
            if (multipleProcessesRunning === void 0) { multipleProcessesRunning = false; }
            this.scheduleType = scheduleType;
            this.quantum = quantum;
            this.multipleProcessesRunning = multipleProcessesRunning;
        }
        scheduler.prototype.checkTurnCompletion = function () {
            if (_ReadyQueue.q[0].quantum == 0) {
                return true;
            }
            else {
                return false;
            }
        };
        scheduler.prototype.getSchedulingAlgorithm = function () {
            return this.scheduleType;
        };
        scheduler.prototype.setSchedulingAlgorithm = function (newAlgorithm) {
            this.scheduleType = newAlgorithm;
        };
        scheduler.prototype.scheduleProcess = function (PCB) {
            _ReadyQueue.enqueue(PCB);
        };
        scheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
        };
        scheduler.prototype.saveCPUState = function () {
            /*
            Load all of the contents of the CPU
            in it's current state to the PCB of the
            currently executng process
            */
            _ReadyQueue.q[0].PCstate = _CPU.PC;
            _ReadyQueue.q[0].AccState = _CPU.Acc;
            _ReadyQueue.q[0].XregState = _CPU.Xreg;
            _ReadyQueue.q[0].YregState = _CPU.Yreg;
            _ReadyQueue.q[0].ZflagState = _CPU.Zflag;
        };
        scheduler.prototype.loadCPUState = function () {
            /*
            Load all of the contents of the PCB
            for the currently executing process
            to the CPU
            */
            _CPU.PC = _ReadyQueue.q[0].PCstate;
            _CPU.Acc = _ReadyQueue.q[0].AccState;
            _CPU.Xreg = _ReadyQueue.q[0].XregState;
            _CPU.Yreg = _ReadyQueue.q[0].YregState;
            _CPU.Zflag = _ReadyQueue.q[0].ZflagState;
        };
        scheduler.prototype.contextSwitch = function () {
            if (_ReadyQueue.getSize() > 1) {
                this.saveCPUState();
                // Pop the current process from the Ready Queue
                var temp = _ReadyQueue.dequeue();
                // Push the unfinished process back on the Ready Queue, reset the quantum
                if (temp.processComplete == false) {
                    temp.quantum = this.quantum;
                    temp.processState = "Ready";
                    _ReadyQueue.enqueue(temp);
                }
                else {
                    _StdOut.putText("PID " + temp.pid + " Wait Time: " + temp.waitTime.toString() + " Turnaround Time: " + temp.tTime.toString());
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                    _MemoryManager.resetPartition(temp.baseRegister);
                }
                // If the scheduler is Priority, sort the PCB's before pulling the next one
                if (_CPUScheduler.scheduleType == "priority") {
                    this.prioritySwap();
                }
                // If the current PCB has it's program in memory
                if (_ReadyQueue.q[0].processInMemory == true) {
                    // Take the process in partition 3 of memory and "roll in" to disk
                    var forDisk = _Memory.addressSpace.slice(512);
                    _krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
                    _GuiRoutines.updateHardDriveDisplay();
                    _MemoryManager.resetPartition(512);
                    // Take the process in memory, and "roll out" to memory
                    var key = _ReadyQueue.q[0].locationInMemory;
                    var check = _krnFileDriver.rollOut(key, _ReadyQueue.q[0].memorySegementAmount);
                    alert(check);
                    _GuiRoutines.updateHardDriveDisplay();
                }
                _ReadyQueue.q[0].processState = "Running";
                this.loadCPUState();
                _MemoryManager.updateBaseAndLimit(_ReadyQueue.q[0].baseRegister, _ReadyQueue.q[0].limitRegister);
                // If the Ready Queue only has a single process after the context switch
                if (_ReadyQueue.getSize() == 1) {
                    _CPUScheduler.multipleProcessesRunning = false;
                }
            }
        };
        scheduler.prototype.prioritySwap = function () {
            // Swap the head of the Queue with the lowest
            var highestPriorityProcess = _ReadyQueue.q[0];
            var index = 0;
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                if (_ReadyQueue.q[i].priority < highestPriorityProcess.priority) {
                    highestPriorityProcess = _ReadyQueue.q[i];
                    index = i;
                }
            }
            var temp = _ReadyQueue.q[0];
            _ReadyQueue.q[0] = highestPriorityProcess;
            _ReadyQueue.q[index] = temp;
        };
        return scheduler;
    }());
    TSOS.scheduler = scheduler;
})(TSOS || (TSOS = {}));
/*

// If the current PCB has it's program in memory
                if(_ReadyQueue.q[0].processInMemory == true){
                    // Take the process in partition 3 of memory and "roll in" to disk
                    var forDisk = _Memory.addressSpace.slice(512);
                    //for(var k = 0; k < forDisk.length; k++){
                        //(<HTMLTextAreaElement>document.getElementById("taProgramInput")).value = (<HTMLTextAreaElement>document.getElementById("taProgramInput")).value + " " + forDisk[k];
                    //}
                    _krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
                    _GuiRoutines.updateHardDriveDisplay();
                
                    
                    // Take the process in memory, and "roll out" to memory
                    _MemoryManager.resetPartition(512);
                    var results = [];
                    _ReadyQueue.q[0] = _PartitionThreePCB
                    _krnFileDriver.rollOut(results, _PartitionThreePCB, _PartitionThreePCB.locationInMemory);
                    

                    _GuiRoutines.updateHardDriveDisplay();
                }
*/ 
