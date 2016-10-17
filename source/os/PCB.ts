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
					public baseRegister: number = _PCBContainer.length * 256,
					public limitRegister: number = baseRegister + 255,
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
					public ZflagState: number = 0){	
					_PCBContainer.push(this);			// Push the object into the array
					_TotalProcesses++;					// Increment the total number of processes	
		
		}
	}
}