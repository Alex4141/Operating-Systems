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
                    if (_MemoryManager.partitionThreeEmpty != true) {
                        // Take the process in partition 3 of memory and "roll in" to disk
                        var forDisk = _Memory.addressSpace.splice(512);
                        _krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
                        // Reset the third Partition
                        _MemoryManager.resetPartition(512);
                    }
                    // Get the Process residing in disk and "roll out" to memory
                    var key = _ReadyQueue.q[0].locationInMemory;
                    var forMainMemory = _krnFileDriver.rollOut(key, _ReadyQueue.q[0].memorySegementAmount);
                    _MemoryManager.loadMemory(_ReadyQueue.q[0], forMainMemory);
                    // Data Editing to ensure correctness of swappable process and partition
                    _ReadyQueue.q[0].processInMemory = false;
                    _ReadyQueue.q[0].locationInMemory = "";
                    _PartitionThreePCB = _ReadyQueue.q[0];
                    // Delete the data for the "rolled out" process to make space for other stuff
                    _krnFileDriver.deleteFileName(key);
                    _krnFileDriver.deleteContent(key);
                    _GuiRoutines.updateHardDriveDisplay();
                    // Set the mm partition three empty to false here
                    _MemoryManager.partitionThreeEmpty = false;
                    _GuiRoutines.updateMemoryDisplay();
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
