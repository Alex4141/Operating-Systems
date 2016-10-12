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

            var base = _PCBContainer[0].baseRegister;
            var limit = _PCBContainer[0].memorySegementAmount;

            while(base < limit){
                switch(_Memory.addressSpace[base]){
                    case "A9":
                        this.opCodeA9(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                        break;
                    case "AD":
                        this.opCodeAD(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "8D":
                        this.opCode8D(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "6D":
                        this.opCode6D(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "A2":
                        this.opCodeA2(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                        break;
                    case "AE":
                        this.opCodeAE(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "A0":
                        this.opCodeA0(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                        break;
                    case "AC":
                        this.opCodeAC(base+1);
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
                        this.opCodeEC(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 3;
                        break;
                    case "D0":
                        var baseAdd = this.opCodeD0(base+1);
                        this.Yreg = baseAdd;
                        base += 2;
                        break;
                    case "EE":
                        this.opCodeEE(base+1);
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base += 2;
                    case "FF":
                        this.opCodeFF();
                        this.updateDisplay(base);
                        _MemoryManager.updateMemoryDisplay();
                        base++;
                        break;
                    default:
                        //This is a placeholder
                        //After all the op codes are working need to change this
                        (<HTMLInputElement> document.getElementById("statusArea")).value = "Bug";
                        this.PC += 1;
                        this.updateDisplay(base);
                        base++;
                        break;
                }
            }

            _PCBContainer.pop();
        }

        
        public opCodeA9(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Acc = value;
            this.PC += 2;
        }

        public opCodeAD(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                this.Acc = value;    
                this.PC += 3;    
            } else {
                alert("OP CODE ERROR: AD");
            }
        }

        public opCode8D(memoryLocation){
            var memory = memoryLocation;
            var location = parseInt(_Memory.addressSpace[memory],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                //_Memory.addressSpace[location] = this.Acc.toString(16);
                _MemoryManager.storeAccumulator(location);
                this.PC += 3;
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
                this.PC += 3;
            } else {
                alert("OP CODE ERROR: 6D")
            }
        }

        public opCodeA2(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Xreg = value;
            this.PC += 2;   
        }

        public opCodeAE(memoryLocation){
            var memory= memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
             if(_Memory.addressSpace[memory+1] == "00"){
                this.Xreg = value;    
                this.PC += 3;    
            } else {
                alert("OP CODE ERROR: AE");
            }
        }

        public opCodeA0(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Yreg = value;
            this.PC += 2;    
        }

        public opCodeAC(memoryLocation){
            var memory= memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
             if(_Memory.addressSpace[memory+1] == "00"){
                this.Yreg = value;    
                this.PC += 3;    
            } else {
                alert("OP CODE ERROR: AC");
            }
        }

        public opCodeEA(){
            this.PC += 1;
            return;
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
                this.PC += 3;
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
                var total = branchBy + memory;
                while(total > 255){
                    total = total - 256;
                }
                this.PC += 2;
                return total;
            } else {
                this.PC += 2;
                return memory + 1;
            }
        }

        public opCodeEE(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                _MemoryManager.addressIncrementor(addressPointer, value);
                this.PC += 2;
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
