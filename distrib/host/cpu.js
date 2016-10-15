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
            var instructionLocation = 1;
            switch (_Memory.addressSpace[this.PC]) {
                case "A9":
                    this.opCodeA9(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 2;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "AD":
                    this.opCodeAD(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "8D":
                    this.opCode8D(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "6D":
                    this.opCode6D(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "A2":
                    this.opCodeA2(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 2;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "AE":
                    this.opCodeAE(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "A0":
                    this.opCodeA0(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 2;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "AC":
                    this.opCodeAC(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "EA":
                    this.opCodeEA();
                    this.updateDisplay(this.PC);
                    this.PC += 1;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "00":
                    this.opCode00();
                    this.updateDisplay(this.PC);
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "EC":
                    this.opCodeEC(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "D0":
                    var correctLocation = this.opCodeD0(this.PC + instructionLocation);
                    document.getElementById("statusArea").value = correctLocation.toString();
                    this.updateDisplay(this.PC);
                    this.PC = correctLocation;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "EE":
                    this.opCodeEE(this.PC + instructionLocation);
                    this.updateDisplay(this.PC);
                    this.PC += 3;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                case "FF":
                    var output = this.opCodeFF();
                    if (this.Xreg == 1) {
                        _StdOut.putText(output);
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }
                    else if (this.Xreg == 2) {
                        _StdOut.putText(output);
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }
                    this.updateDisplay(this.PC);
                    this.PC += 1;
                    _MemoryManager.updateMemoryDisplay();
                    break;
                default:
                    alert("Invalid OP Code" + _Memory.addressSpace[this.PC]);
                    this.isExecuting = false;
                    this.updateDisplay(this.PC);
                    _MemoryManager.updateMemoryDisplay();
                    break;
            }
            //this.isExecuting = false;
        };
        Cpu.prototype.opCodeA9 = function (memoryLocation) {
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory], 16);
            this.Acc = value;
        };
        Cpu.prototype.opCodeAD = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Acc = value;
            }
            else {
                alert("OP CODE ERROR: AD");
            }
        };
        Cpu.prototype.opCode8D = function (memoryLocation) {
            var memory = memoryLocation;
            var location = parseInt(_Memory.addressSpace[memory], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                //_Memory.addressSpace[location] = this.Acc.toString(16);
                while (location > 255) {
                    location = location - 256;
                }
                _MemoryManager.storeAccumulator(location);
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
            }
            else {
                alert("OP CODE ERROR: 6D");
            }
        };
        Cpu.prototype.opCodeA2 = function (memoryLocation) {
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory], 16);
            this.Xreg = value;
        };
        Cpu.prototype.opCodeAE = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Xreg = value;
            }
            else {
                alert("OP CODE ERROR: AE");
            }
        };
        Cpu.prototype.opCodeA0 = function (memoryLocation) {
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory], 16);
            this.Yreg = value;
        };
        Cpu.prototype.opCodeAC = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                this.Yreg = value;
            }
            else {
                alert("OP CODE ERROR: AC");
            }
        };
        Cpu.prototype.opCodeEA = function () {
            return;
        };
        Cpu.prototype.opCode00 = function () {
            this.isExecuting = false;
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
            }
            else {
                alert("OP CODE ERROR: EC");
            }
        };
        Cpu.prototype.opCodeD0 = function (memoryLocation) {
            // This is the array index where branching starts
            var memory = memoryLocation;
            // This is the value that memory branches by
            var branchBy = parseInt(_Memory.addressSpace[memory], 16);
            if (this.Zflag == 0) {
                var total = branchBy + memory + 1;
                while (total > 255) {
                    total = total - 256;
                }
                return total;
            }
            else {
                total = this.PC + 2;
                return total;
            }
        };
        Cpu.prototype.opCodeEE = function (memoryLocation) {
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory], 16);
            var value = parseInt(_Memory.addressSpace[addressPointer], 16);
            if (_Memory.addressSpace[memory + 1] == "00") {
                _MemoryManager.addressIncrementor(addressPointer, value);
            }
            else {
                alert("OP CODE ERROR: EE");
            }
        };
        Cpu.prototype.opCodeFF = function () {
            var upperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var upperCaseHexValue = 65;
            var lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
            var lowerCaseHexValue = 97;
            // If the X Register is 1 output the value of the Y register as a string
            if (this.Xreg == 1) {
                var output = this.Yreg.toString();
                return output;
            }
            else if (this.Xreg == 2) {
                var output = "";
                var startingPoint = this.Yreg;
                var doneParsing = false;
                while (doneParsing == false) {
                    var currentNum = parseInt(_Memory.addressSpace[startingPoint], 16);
                    if (currentNum > 64 && currentNum < 90) {
                        var index = currentNum - upperCaseHexValue;
                        output += upperCaseAlphabet.charAt(index);
                        startingPoint++;
                    }
                    else if (currentNum > 96 && currentNum < 122) {
                        var index = currentNum - lowerCaseHexValue;
                        output += lowerCaseAlphabet.charAt(index);
                        startingPoint++;
                    }
                    else if (currentNum == 32) {
                        output += " ";
                        startingPoint++;
                    }
                    else {
                        doneParsing = true;
                    }
                }
                return output;
            }
            else {
                return;
            }
        };
        Cpu.prototype.updateDisplay = function (instruction) {
            // Documentation for TS lacks a way to access individual table cells
            // So we're gonna have to update the display like this (sadnessssss)
            // Object for the table we're going to access
            var table = document.getElementById("cpuDisplay");
            var currInstruction = _Memory.addressSpace[instruction];
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
