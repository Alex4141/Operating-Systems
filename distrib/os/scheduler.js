///<reference path="../globals.ts" />
/*
CPU Scheduler prototype
*/
var TSOS;
(function (TSOS) {
    var scheduler = (function () {
        function scheduler(quantum, multipleProcessesRunning) {
            if (quantum === void 0) { quantum = 6; }
            if (multipleProcessesRunning === void 0) { multipleProcessesRunning = false; }
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
                    _ReadyQueue.enqueue(temp);
                }
                else {
                    _MemoryManager.resetPartition(temp.baseRegister);
                }
                this.loadCPUState();
                // If the Ready Queue only has a single process after the context switch
                if (_ReadyQueue.getSize() == 1) {
                    _CPUScheduler.multipleProcessesRunning = false;
                }
            }
        };
        return scheduler;
    }());
    TSOS.scheduler = scheduler;
})(TSOS || (TSOS = {}));
