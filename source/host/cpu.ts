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
            
            /* 
            Decrease the quantum regardless of singular process, or
            multiple processes. If only one process, when it hits 0
            reset the quantum
            */
            _ReadyQueue.q[0].quantum -= 1;
            if(_CPUScheduler.multipleProcessesRunning == false){
                if(_ReadyQueue.q[0].quantum == 0){
                    _ReadyQueue.q[0].quantum = _CPUScheduler.quantum;
                }
            }

            /* 
            Increase the Turnaround time of the current process
            If a second and third process are running, increase their wait time and turnaround time
            */
            _ReadyQueue.q[0].tTime += 1;
            for(var i = 1; i < _ReadyQueue.getSize(); i++){
                _ReadyQueue.q[i].waitTime += 1;
                _ReadyQueue.q[i].tTime += 1;
            }

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
                    // Complete execution of a process among several processes
                    if(_CPUScheduler.multipleProcessesRunning == true){
                        _ReadyQueue.q[0].processComplete = true;
                        _ReadyQueue.q[0].quantum = 0;
                    } else {
                        // Complete execution for a singular process
                        this.opCode00();
                        _MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
                        _StdOut.putText("PID " + _ReadyQueue.q[0].pid + " Wait Time: " + _ReadyQueue.q[0].waitTime.toString() + " Turnaround Time: " + _ReadyQueue.q[0].tTime.toString());
                     	_StdOut.advanceLine();
                     	_StdOut.putText(">");
                        _ReadyQueue.dequeue();
                    }
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
                    if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}        
            	}
        	}

        
        public opCodeA9(memoryLocation){
            var memory = memoryLocation;
            var value = parseInt(_Memory.addressSpace[memory],16);
            this.Acc = value;
        }

        public opCodeAD(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);
            
            // Make sure the operation isn't trying to access a memory location > 255
            if(addressPointer > 255){
                alert("Illegal memory access attempt. Process Halted.");
                if(_ReadyQueue.getSize() > 1){
                	_ReadyQueue.q[0].processComplete = true;
                    _ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            } else {
                addressPointer = addressPointer + _ReadyQueue.q[0].baseRegister; 
           
           		var value = parseInt(_Memory.addressSpace[addressPointer],16);
            	if(_Memory.addressSpace[memory+1] == "00"){
                	this.Acc = value;        
            	} else {
                	alert("OP CODE ERROR: AD");
                	if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}
        		}
        	}
        }

        public opCode8D(memoryLocation){
            var memory = memoryLocation;
            var location = parseInt(_Memory.addressSpace[memory],16) + _ReadyQueue.q[0].baseRegister;
            if(_Memory.addressSpace[memory+1] == "00"){
                //_Memory.addressSpace[location] = this.Acc.toString(16);
                while(location > _ReadyQueue.q[0].limitRegister){
                    location = location - 256;
                }  
                _MemoryManager.storeAccumulator(location);
            } else {
                alert("OP CODE ERROR: 8D");
                if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            }
        }

        public opCode6D(memoryLocation){
            var memory = memoryLocation;
            var addressPointer = parseInt(_Memory.addressSpace[memory],16);

            if(addressPointer > 255){
                alert("Illegal memory access attempt. Process Halted.");
                if(_ReadyQueue.getSize() > 1){
                	_ReadyQueue.q[0].processComplete = true;
                    _ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            } else {
                addressPointer = addressPointer + _ReadyQueue.q[0].baseRegister; 
           
           		var value = parseInt(_Memory.addressSpace[addressPointer],16);
            	if(_Memory.addressSpace[memory+1] == "00"){
                	this.Acc += value;
            	} else {
                	alert("OP CODE ERROR: 6D");
                	if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}
            	}
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

            if(addressPointer > 255){
                alert("Illegal memory access attempt. Process Halted.");
                if(_ReadyQueue.getSize() > 1){
                	_ReadyQueue.q[0].processComplete = true;
                    _ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            } else {
                addressPointer = addressPointer + _ReadyQueue.q[0].baseRegister; 
           
           		var value = parseInt(_Memory.addressSpace[addressPointer],16);
             	if(_Memory.addressSpace[memory+1] == "00"){
                	this.Xreg = value;    
            	} else {
                	alert("OP CODE ERROR: AE");
                	if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}
            	}
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

            if(addressPointer > 255){
                alert("Illegal memory access attempt. Process Halted.");
                if(_ReadyQueue.getSize() > 1){
                	_ReadyQueue.q[0].processComplete = true;
                    _ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            } else {
                addressPointer = addressPointer + _ReadyQueue.q[0].baseRegister; 
           
           		var value = parseInt(_Memory.addressSpace[addressPointer],16);
             	if(_Memory.addressSpace[memory+1] == "00"){
                	this.Yreg = value;    
            	} else {
                	alert("OP CODE ERROR: AC");
                	if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}
            	}
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
            
            if(addressPointer > 255){
                alert("Illegal memory access attempt. Process Halted.");
                if(_ReadyQueue.getSize() > 1){
                	_ReadyQueue.q[0].processComplete = true;
                    _ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            } else {
                addressPointer = addressPointer + _ReadyQueue.q[0].baseRegister; 
           
           		var value = parseInt(_Memory.addressSpace[addressPointer],16);
            	if(_Memory.addressSpace[memory+1] == "00"){
                	if(value == this.Xreg){
                    	this.Zflag = 1;
                	} else {
                    	this.Zflag = 0;
                	}
            	} else {
                	alert("OP CODE ERROR: EC");
                	if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}                
            	}
        	}
        }

        public opCodeD0(memoryLocation){
            // This is the array index where branching starts
            var memory = memoryLocation;
            // This is the value that memory branches by
            var branchBy = parseInt(_Memory.addressSpace[memory],16);
            if(this.Zflag == 0){
                var total = branchBy + memory + 1;
                while(total > _ReadyQueue.q[0].limitRegister){
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

            if(addressPointer > 255){
                alert("Illegal memory access attempt. Process Halted.");
                if(_ReadyQueue.getSize() > 1){
                	_ReadyQueue.q[0].processComplete = true;
                    _ReadyQueue.q[0].quantum = 0;
                } else {
                	this.isExecuting = false;
                	_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
					_ReadyQueue.dequeue();
                }
            } else {
                addressPointer = addressPointer + _ReadyQueue.q[0].baseRegister; 
           
           		var revisedAddress = addressPointer;
            	var value = parseInt(_Memory.addressSpace[addressPointer],16);
            	if(_Memory.addressSpace[memory+1] == "00"){
                	_MemoryManager.addressIncrementor(revisedAddress, value);
            	} else {
                	alert("OP CODE ERROR: EE");
                	if(_ReadyQueue.getSize() > 1){
                		_ReadyQueue.q[0].processComplete = true;
                    	_ReadyQueue.q[0].quantum = 0;
                	} else {
                		this.isExecuting = false;
                		_MemoryManager.resetPartition(_ReadyQueue.q[0].baseRegister);
						_ReadyQueue.dequeue();
                	}
            	}
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
                    var currentNum = parseInt(_Memory.addressSpace[startingPoint + _ReadyQueue.q[0].baseRegister],16);
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
