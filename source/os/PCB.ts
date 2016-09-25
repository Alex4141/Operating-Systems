///<reference path="../globals.ts" />

/*
Process Control Block prototype.
Includes important details about each process loaded into memory
*/

module TSOS {
	export class PCB {
		constructor(public processState: string = "New",
					public pid: number = _PCBContainer.length,
					public programCounter: number = 0,
					public baseRegister: number = _PCBContainer.length * 256,
					public limitRegister: number = baseRegister + 255){	
					_PCBContainer.push(this);			//Push the object into the array	
		
		}

		public init(): void {
			this.processState = "New";
			this.pid = _PCBContainer.length;
			this.programCounter = 0;
			this.baseRegister = _PCBContainer.length * 256;
			this.limitRegister = this.baseRegister + 255;			
		}
	}
}