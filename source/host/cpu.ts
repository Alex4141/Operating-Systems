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
        }

        public storeAccumulator(location){
            _Memory.addressSpace[location] = this.Acc.toString(16).toUpperCase();
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
                _Memory.addressSpace[location] = this.Acc.toString(16);
                this.PC += 3;
            } else {
                alert("OP CODE ERROR: 8D");
            }
        }
    }
}
