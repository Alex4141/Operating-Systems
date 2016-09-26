/*
Implementation of Main Memory
*/

module TSOS {
	export class coreMemory {
		constructor(public addressSpace: string[] = []){	
			
			for(var i = 0; i <= 767; i++){
				this.addressSpace.push("00");
			}

		}
	}
}