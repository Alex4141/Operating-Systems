///<reference path="../globals.ts" />

/*
CPU Scheduler prototype
*/

module TSOS {
	export class scheduler {
		constructor(public quantum: number = 6,
					public multipleProcessesRunning: boolean = false){
		}

		public checkTurnCompletion(){
			if(_ReadyQueue.q[0].quantum == 0){
				return true;
			} else {
				return false;
			}
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
					_ReadyQueue.enqueue(temp);
				} else {
					_MemoryManager.resetPartition(temp.baseRegister);
				}
				
				this.loadCPUState();

				// If the Ready Queue only has a single process after the context switch
				if(_ReadyQueue.getSize() == 1){
					_CPUScheduler.multipleProcessesRunning = false;
				}
			}
		}

	}
}