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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately. 
            const instructionLocation = 1;

            switch(_Memory.addressSpace[this.PC]){
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
                    (<HTMLInputElement> document.getElementById("statusArea")).value = correctLocation.toString();
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
                    break;
                default:
                    alert("Invalid OP Code" + _Memory.addressSpace[this.PC]);
                    this.isExecuting = false;
                    this.updateDisplay(this.PC);
                    _MemoryManager.updateMemoryDisplay();
                    break;        
            }
            //this.isExecuting = false;
        }

        
        public opCodeA9(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Acc = value;
        }

        public opCodeAD(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                this.Acc = value;        
            } else {
                alert("OP CODE ERROR: AD");
            }
        }

        public opCode8D(memoryLocation){
            var memory = memoryLocation;
            var location = parseInt(_Memory.addressSpace[memory],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                //_Memory.addressSpace[location] = this.Acc.toString(16);
                while(location > 255){
                    location = location - 256;
                }    
                _MemoryManager.storeAccumulator(location);
            } else {
                alert("OP CODE ERROR: 8D");
            }
        }

        public opCode6D(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                this.Acc += value;
            } else {
                alert("OP CODE ERROR: 6D")
            }
        }

        public opCodeA2(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Xreg = value;  
        }

        public opCodeAE(memoryLocation){
            var memory= memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
             if(_Memory.addressSpace[memory+1] == "00"){
                this.Xreg = value;    
            } else {
                alert("OP CODE ERROR: AE");
            }
        }

        public opCodeA0(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Yreg = value;
        }

        public opCodeAC(memoryLocation){
            var memory= memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
             if(_Memory.addressSpace[memory+1] == "00"){
                this.Yreg = value;    
            } else {
                alert("OP CODE ERROR: AC");
            }
        }

        public opCodeEA(){
            return;
        }

        public opCode00(){
            this.isExecuting = false;
        }

        public opCodeEC(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                if(value == this.Xreg){
                    this.Zflag = 1;
                } else {
                    this.Zflag = 0;
                }
            } else {
                alert("OP CODE ERROR: EC");                
            }
        }

        public opCodeD0(memoryLocation){
            // This is the array index where branching starts
            var memory = memoryLocation;
            // This is the value that memory branches by
            var branchBy = parseInt(_Memory.addressSpace[memory],16);
            if(this.Zflag == 0){
                var total = branchBy + memory + 1;
                while(total > 255){
                    total = total - 256;
                }
                return total;
            } else {
                total = this.PC + 2;
                return total;
            }
        }

        public opCodeEE(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                _MemoryManager.addressIncrementor(addressPointer, value);
            } else {
                alert("OP CODE ERROR: EE");
            }
        }

        public opCodeFF(){
            this.PC += 1;
            return;
        }

        public updateDisplay(instruction){
            // Documentation for TS lacks a way to access individual table cells
            // So we're gonna have to update the display like this (sadnessssss)
            
            // Object for the table we're going to access
            var table = (<HTMLTableElement> document.getElementById("cpuDisplay"));
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
        }

    }
}
