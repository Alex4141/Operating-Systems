///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.isExecuting = true;
            for (var i = 0; i <= 10; i++) {
                //Handlers for STA and LDA op codes
                //TODO: Making sure completed op code isn't repeated
                switch (_Memory.addressSpace[i]) {
                    case "A9":
                        this.Acc = parseInt(_Memory.addressSpace[i + 1], 16);
                        _Kernel.krnTrace('A9: Accumulator loaded');
                        break;
                    case "AD":
                        var value = parseInt(_Memory.addressSpace[i + 1], 16);
                        this.Acc = parseInt(_Memory.addressSpace[value], 16);
                        _Kernel.krnTrace('AD: Accumulator loaded');
                        break;
                    case "8D":
                        var value = parseInt(_Memory.addressSpace[i + 1], 16);
                        _Memory.addressSpace[value] = this.Acc.toString(16).toUpperCase();
                        _Kernel.krnTrace('8D: Accumulator stored');
                        break;
                    default:
                        break;
                }
                this.isExecuting = false;
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
