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
			if(_CurrentPCB.quantum == 0){
				return true;
			} else {
				return false;
			}
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
			_CurrentPCB.PCstate = _CPU.PC;
			_CurrentPCB.AccState = _CPU.Acc;
			_CurrentPCB.XregState = _CPU.Xreg;
			_CurrentPCB.YregState = _CPU.Yreg;
			_CurrentPCB.ZflagState = _CPU.Zflag;
		}

		public loadCPUState(){
			/*
			Load all of the contents of the PCB
			for the currently executing process
			to the CPU
			*/
			_CPU.PC = _CurrentPCB.PCstate;
			_CPU.Acc = _CurrentPCB.AccState;
			_CPU.Xreg = _CurrentPCB.XregState;
			_CPU.Yreg = _CurrentPCB.YregState;
			_CPU.Zflag = _CurrentPCB.ZflagState;
		}

		public contextSwitch(){
			if(_ReadyQueue.getSize() > 1){
				this.saveCPUState();
				
				// Pop the current process from the Ready Queue
				var temp = _ReadyQueue.dequeue();
				// Set the current process to the top of the Ready Queue
				_CurrentPCB = _ReadyQueue[0];
				// Push the unfinished process back on the Ready Queue
				_ReadyQueue.enqueue(temp);
				
				this.loadCPUState();
			}
		}

	}
}