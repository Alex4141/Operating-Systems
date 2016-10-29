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
                    this.PC += 2;
                    break;
                case "AD":
                    this.opCodeAD(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "8D":
                    this.opCode8D(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "6D":
                    this.opCode6D(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "A2":
                    this.opCodeA2(this.PC + instructionLocation);
                    this.PC += 2;
                    break;
                case "AE":
                    this.opCodeAE(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "A0":
                    this.opCodeA0(this.PC + instructionLocation);
                    this.PC += 2;
                    break;
                case "AC":
                    this.opCodeAC(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "EA":
                    this.opCodeEA();
                    this.PC += 1;
                    break;
                case "00":
                    this.opCode00();
                    /* Since the process is now over, reset the partition it was in
                    Dequeue the process from the Ready Queue
                    */
                    _MemoryManager.resetPartition(_CurrentPCB.baseRegister);
                    _ReadyQueue.dequeue();
                    break;
                case "EC":
                    this.opCodeEC(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "D0":
                    var correctLocation = this.opCodeD0(this.PC + instructionLocation);
                    this.PC = correctLocation;
                    break;
                case "EE":
                    this.opCodeEE(this.PC + instructionLocation);
                    this.PC += 3;
                    break;
                case "FF":
                    var output = this.opCodeFF();
                    if(this.Xreg == 1){

                        // Put the number and advance to the next line
                        _StdOut.putText(output);
                        _StdOut.advanceLine();
                        _StdOut.putText(">");

                        // Accounting for the change of position while handling input
                        _Console.buffer = "";
                    } else if(this.Xreg == 2){
                        // Put the number and advance to the next line
                        _StdOut.putText(output);
                        _StdOut.advanceLine();
                        _StdOut.putText(">");

                        // Accounting for the change of position while handling input
                        _Console.buffer = "";                        
                    }
                    this.PC += 1;
                    break;
                default:
                    alert("Invalid OP Code" + _Memory.addressSpace[this.PC]);
                    this.isExecuting = false;
                    break;        
            }
        }

        
        public opCodeA9(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Acc = value;
        }

        public opCodeAD(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                this.Acc = value;        
            } else {
                alert("OP CODE ERROR: AD");
                this.isExecuting = false;
            }
        }

        public opCode8D(memoryLocation){
            var memory = memoryLocation;
            var location = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            (<HTMLInputElement> document.getElementById("statusArea")).value = location.toString();
            if(_Memory.addressSpace[memory+1] == "00"){
                //_Memory.addressSpace[location] = this.Acc.toString(16);
                while(location > _CurrentPCB.limitRegister){
                    location = location - 256;
                }  
                _MemoryManager.storeAccumulator(location);
            } else {
                alert("OP CODE ERROR: 8D");
                this.isExecuting = false;
            }
        }

        public opCode6D(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                this.Acc += value;
            } else {
                alert("OP CODE ERROR: 6D");
                this.isExecuting = false;
            }
        }

        public opCodeA2(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Xreg = value;  
        }

        public opCodeAE(memoryLocation){
            var memory= memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
             if(_Memory.addressSpace[memory+1] == "00"){
                this.Xreg = value;    
            } else {
                alert("OP CODE ERROR: AE");
                this.isExecuting = false;
            }
        }

        public opCodeA0(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Yreg = value;
        }

        public opCodeAC(memoryLocation){
            var memory= memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
             if(_Memory.addressSpace[memory+1] == "00"){
                this.Yreg = value;    
            } else {
                alert("OP CODE ERROR: AC");
                this.isExecuting = false;
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
            var addressPointer = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                if(value == this.Xreg){
                    this.Zflag = 1;
                } else {
                    this.Zflag = 0;
                }
            } else {
                alert("OP CODE ERROR: EC");
                this.isExecuting = false;                
            }
        }

        public opCodeD0(memoryLocation){
            // This is the array index where branching starts
            var memory = memoryLocation;
            // This is the value that memory branches by
            var branchBy = parseInt(_Memory.addressSpace[memory],16);
            if(this.Zflag == 0){
                var total = branchBy + memory + 1;
                while(total > _CurrentPCB.limitRegister){
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
            var addressPointer = parseInt(_Memory.addressSpace[memory],16) + _CurrentPCB.baseRegister;
            var value = parseInt(_Memory.addressSpace[addressPointer],16);
            if(_Memory.addressSpace[memory+1] == "00"){
                _MemoryManager.addressIncrementor(addressPointer, value);
            } else {
                alert("OP CODE ERROR: EE");
                this.isExecuting = false;
            }
        }

        public opCodeFF(){
            const upperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const upperCaseHexValue = 65;

            const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
            const lowerCaseHexValue = 97;
            // If the X Register is 1 output the value of the Y register as a string
            if(this.Xreg == 1){
                var output = this.Yreg.toString();
                return output;
            // If the X Register is 2 output the character equivalent    
            } else if(this.Xreg == 2){

               var output = "";
               var startingPoint = this.Yreg;
               var doneParsing = false;

                while(doneParsing == false){
                    var currentNum = parseInt(_Memory.addressSpace[startingPoint + _CurrentPCB.baseRegister],16);
                    if(currentNum > 64 && currentNum < 90){
                       var index = currentNum - upperCaseHexValue;
                       output += upperCaseAlphabet.charAt(index);
                       startingPoint++;
                    } else if(currentNum > 96 && currentNum < 122){
                        var index = currentNum - lowerCaseHexValue;
                        output += lowerCaseAlphabet.charAt(index);
                        startingPoint++;
                    } else if(currentNum == 32){
                        output += " ";
                        startingPoint++;
                    } else {
                       doneParsing = true;
                    }
                }
               return output;
            } else {
                return;
            }
        }
    }
}
