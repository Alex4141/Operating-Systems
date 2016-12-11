///<reference path="../globals.ts" />

/*
Process Control Block prototype.
Includes important details about each process loaded into memory
*/

module TSOS {
	export class PCB {
		constructor(public processState: string = "New",
					public pid: number = _TotalProcesses,
					public programCounter: number = 0,
					public baseRegister: number = 0,
					public limitRegister: number = 0,
					public memorySegementAmount: number = 0,
					/*
					These vars below will be important later on when switching between processes
					But for now, less prevalent on current project
					Load CPU state below before switching between PCB's on the queue 
					*/
					public PCstate: number = 0,
					public AccState: number = 0,
					public XregState: number = 0,
					public YregState: number = 0,
					public ZflagState: number = 0,
					public quantum: number = _CPUScheduler.quantum,
					public processComplete: boolean = false,
					public waitTime: number = 0,
					public tTime: number = 0,
					public priority: number = 10,
					public processInMemory: boolean = false,
					public locationInMemory: string = ""){	
					this.paritionCheck();				// Assign the PCB the right base and limit registers
					_ResidentQueue.enqueue(this);		// Push the PCB into the Resident Queue
					this.PCstate = this.baseRegister;	// Change the PC to the proper location
					_PCBContainer.push(this);			// TODO implement the ready queue so I can get rid of this Push the object into the array
					_TotalProcesses++;					// Increment the total number of processes	
		
		}

		public paritionCheck(){
			/* Check to see which partitions are empty
			Copy the appropriate base and limit to the current PCB
			Set the partition to full too.
			*/
			if(_MemoryManager.partitionOneEmpty == true){
				this.setBaseAndLimit(0, 255);
				_MemoryManager.partitionOneEmpty = false;
			} else if(_MemoryManager.partitionTwoEmpty == true){
				this.setBaseAndLimit(256, 511);
				_MemoryManager.partitionTwoEmpty = false;
			} else if(_MemoryManager.partitionThreeEmpty == true){
				this.setBaseAndLimit(512, 767);
				_MemoryManager.partitionThreeEmpty = false;
			}
		}

		public setBaseAndLimit(baseVal, limitVal): void{
			this.baseRegister = baseVal;
			this.limitRegister = limitVal;
		} 
	}
}