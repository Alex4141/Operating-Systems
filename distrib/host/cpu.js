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
            var base = _PCBContainer[0].baseRegister;
            var limit = _PCBContainer[0].memorySegementAmount;
            while (base < limit) {
                switch (_Memory.addressSpace[base]) {
                    case "A9":
                        this.opCodeA9(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                        break;
                    case "AD":
                        this.opCodeAD(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "8D":
                        this.opCode8D(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "6D":
                        this.opCode6D(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "A2":
                        this.opCodeA2(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                        break;
                    case "AE":
                        this.opCodeAE(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "A0":
                        this.opCodeA0(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                        break;
                    case "AC":
                        this.opCodeAC(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "EA":
                        this.opCodeEA();
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base++;
                        break;
                    case "00":
                        _MemoryManager.updateMemoryDisplay();
                        base = limit;
                        break;
                    case "EC":
                        this.opCodeEC(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "EE":
                        this.opCodeEE(base + 1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                    case "FF":
                        this.opCodeFF();
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base++;
                        break;
                    default:
                        //This is a placeholder
                        //After all the op codes are working need to change this
                        this.PC += 1;
                        this.updateDisplay(base);
                        base++;
                        break;
                }
            }
        };
        Cpu.prototype.opCodeA9 = function (memoryLocation) {
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory], 16);
            this.Acc = value;
            this.PC += 2;
        };
        Cpu.prototype.opCodeAD = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Acc = value;
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: AD");
            }
        };
        Cpu.prototype.opCode8D = function (memoryLocation) {
            var memory = memoryLocation;
            var location = parseInt(_Memory.addressSpace[memory], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                _Memory.addressSpace[location] = this.Acc.toString(16);
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: 8D");
            }
        };
        Cpu.prototype.opCode6D = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Acc += value;
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: 6D");
            }
        };
        Cpu.prototype.opCodeA2 = function (memoryLocation) {
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory], 16);
            this.Xreg = value;
            this.PC += 2;
        };
        Cpu.prototype.opCodeAE = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Xreg = value;
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: AE");
            }
        };
        Cpu.prototype.opCodeA0 = function (memoryLocation) {
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory], 16);
            this.Yreg = value;
            this.PC += 2;
        };
        Cpu.prototype.opCodeAC = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Yreg = value;
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: AC");
            }
        };
        Cpu.prototype.opCodeEA = function () {
            this.PC += 1;
            return;
        };
        Cpu.prototype.opCodeEC = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                if (value == this.Xreg) {
                    this.Zflag = 1;
                }
                else {
                    this.Zflag = 0;
                }
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: EC");
            }
        };
        Cpu.prototype.opCodeEE = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16) + 1;
            if (_Memory.addressSpace[memory + 1] == "00") {
                _Memory.addressSpace[addressPointer] = value.toString(16);
                this.PC += 3;
            }
            else {
                alert("OP CODE ERROR: EE");
            }
        };
        Cpu.prototype.opCodeFF = function () {
            this.PC += 1;
            return;
        };
        Cpu.prototype.updateDisplay = function (instruction) {
            // Documentation for TS lacks a way to access individual table cells
            // So we're gonna have to update the display like this (sadnessssss)
            // Object for the table we're going to access
            var table = document.getElementById("cpuDisplay");
            var currInstruction = instruction;
            // Delete the entire row of data values
            table.deleteRow(1);
            // Add a new row, where the last one was
            var updatedRow = table.insertRow(1);
            // Push new cells to fill up the row
            var zValue = updatedRow.insertCell(0);
            var yValue = updatedRow.insertCell(0);
            var xValue = updatedRow.insertCell(0);
            var accValue = updatedRow.insertCell(0);
            var irValue = updatedRow.insertCell(0);
            var pcValue = updatedRow.insertCell(0);
            // Update the new cells with the appropriate values
            zValue.appendChild(document.createTextNode(_CPU.Zflag.toString()));
            yValue.appendChild(document.createTextNode(_CPU.Yreg.toString()));
            xValue.appendChild(document.createTextNode(_CPU.Xreg.toString()));
            accValue.appendChild(document.createTextNode(_CPU.Acc.toString()));
            irValue.appendChild(document.createTextNode(currInstruction));
            pcValue.appendChild(document.createTextNode(_CPU.PC.toString()));
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
