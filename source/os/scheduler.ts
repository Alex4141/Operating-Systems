///<reference path="../globals.ts" />

/*
CPU Scheduler prototype
*/

module TSOS {
	export class scheduler {
		constructor(public scheduleType: string = "rr",
					public quantum: number = 6,
					public multipleProcessesRunning: boolean = false){
		}

		public checkTurnCompletion(){
			if(_ReadyQueue.q[0].quantum == 0){
				return true;
			} else {
				return false;
			}
		}

		public getSchedulingAlgorithm(){
			return this.scheduleType;
		}

		public setSchedulingAlgorithm(newAlgorithm: string){
			this.scheduleType = newAlgorithm;
		}

		public scheduleProcess(PCB: TSOS.PCB){
			_ReadyQueue.enqueue(PCB);
		}

		public setQuantum(newQuantum: number){
			this.quantum = newQuantum;
		}

		public saveCPUState(){
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
		}

		public loadCPUState(){
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
		}

		public contextSwitch(){
			if(_ReadyQueue.getSize() > 1){
				this.saveCPUState();
				
				// Pop the current process from the Ready Queue
				var temp = _ReadyQueue.dequeue();
				// Push the unfinished process back on the Ready Queue, reset the quantum
				if(temp.processComplete == false){
					temp.quantum = this.quantum;
					temp.processState = "Ready";
					_ReadyQueue.enqueue(temp);
				} else {
					 _StdOut.putText("PID " + temp.pid + " Wait Time: " + temp.waitTime.toString() + " Turnaround Time: " + temp.tTime.toString());
                     _StdOut.advanceLine();
                     _StdOut.putText(">");
					_MemoryManager.resetPartition(temp.baseRegister);
				}
				
				// If the scheduler is Priority, sort the PCB's before pulling the next one
				if(_CPUScheduler.scheduleType == "priority"){
					this.prioritySwap();
				}

				// If the current PCB has it's program in memory
				if(_ReadyQueue.q[0].processInMemory == true){
					// Take the process in partition 3 of memory and "roll in" to disk
					var forDisk = _Memory.addressSpace.splice(512);
					_krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
					_GuiRoutines.updateHardDriveDisplay();

					// Reset the third Partition
					_MemoryManager.resetPartition(512);

					// Get the Process residing in memory
					var key = _ReadyQueue.q[0].locationInMemory;
					var forMainMemory = _krnFileDriver.rollOut(key, _ReadyQueue.q[0].memorySegementAmount);
					_MemoryManager.loadMemory(_ReadyQueue.q[0], forMainMemory);
					_ReadyQueue.q[0].processInMemory = false;
					_ReadyQueue.q[0].locationInMemory = "";
					_PartitionThreePCB = _ReadyQueue.q[0];
					// Set the mm partition three empty to false here
					_GuiRoutines.updateMemoryDisplay();
				}

				_ReadyQueue.q[0].processState = "Running";
				this.loadCPUState();
				_MemoryManager.updateBaseAndLimit(_ReadyQueue.q[0].baseRegister,_ReadyQueue.q[0].limitRegister);

				// If the Ready Queue only has a single process after the context switch
				if(_ReadyQueue.getSize() == 1){
					_CPUScheduler.multipleProcessesRunning = false;
				}
			}
		}

		public prioritySwap(){
			// Swap the head of the Queue with the lowest
			var highestPriorityProcess = _ReadyQueue.q[0];
			var index = 0;
			for(var i = 0; i < _ReadyQueue.getSize(); i++){
				if(_ReadyQueue.q[i].priority < highestPriorityProcess.priority){
					highestPriorityProcess = _ReadyQueue.q[i];
					index = i;
				}
			}

			var temp = _ReadyQueue.q[0];
			_ReadyQueue.q[0] = highestPriorityProcess
			_ReadyQueue.q[index] = temp;
		}
	}
}


/*


					// Take the process in partition 3 of memory and "roll in" to disk
					var forDisk = _Memory.addressSpace.splice(512);
					_krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
					_GuiRoutines.updateHardDriveDisplay();

					// Reset the third Partition
					_MemoryManager.resetPartition(512);

					// Get the Process residing in memory
					var key = _ReadyQueue.q[0].locationInMemory;
					var forMainMemory = _krnFileDriver.rollOut(key, _ReadyQueue.q[0].memorySegementAmount);

					_MemoryManager.loadMemory(_ReadyQueue.q[0], forMainMemory);
					_ReadyQueue.q[0].processInMemory = false;
					_ReadyQueue.q[0].locationInMemory = "";
					_PartitionThreePCB = _ReadyQueue.q[0];
					// Set the mm partition three empty to false here
					_GuiRoutines.updateMainMemoryDisplay();
				}

// If the current PCB has it's program in memory
				if(_ReadyQueue.q[0].processInMemory == true){
					// Take the process in partition 3 of memory and "roll in" to disk
					var forDisk = _Memory.addressSpace.slice(512);
					_krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
					_GuiRoutines.updateHardDriveDisplay();
					_MemoryManager.resetPartition(512);

					// Take the process in memory, and "roll out" to memory
					var key = _ReadyQueue.q[0].locationInMemory;
					var toLoad = _krnFileDriver.rollOut(key, _ReadyQueue.q[0].memorySegementAmount);
					_MemoryManager.loadMemory(_ReadyQueue.q[0], toLoad);
					_ReadyQueue.q[0].processInMemory = false;
					_ReadyQueue.q[0].locationInMemory = "";
					_PartitionThreePCB = _ReadyQueue.q[0];
					_GuiRoutines.updateMemoryDisplay();
				}




// If the current PCB has it's program in memory
				if(_ReadyQueue.q[0].processInMemory == true){
					// Take the process in partition 3 of memory and "roll in" to disk
					var forDisk = _Memory.addressSpace.slice(512);
					//for(var k = 0; k < forDisk.length; k++){
						//(<HTMLTextAreaElement>document.getElementById("taProgramInput")).value = (<HTMLTextAreaElement>document.getElementById("taProgramInput")).value + " " + forDisk[k]; 
					//}
					_krnFileDriver.rollIn(forDisk, _PartitionThreePCB);
					_GuiRoutines.updateHardDriveDisplay();
				
					
					// Take the process in memory, and "roll out" to memory
					_MemoryManager.resetPartition(512);
					var results = [];
					_ReadyQueue.q[0] = _PartitionThreePCB
					_krnFileDriver.rollOut(results, _PartitionThreePCB, _PartitionThreePCB.locationInMemory);
					

					_GuiRoutines.updateHardDriveDisplay();
				}

				_ReadyQueue.q[0].processInMemory = false; _PartitionThreePCB = _ReadyQueue.q[0];
					_MemoryManager.partitionThreeEmpty = false;
*/