///<reference path="../globals.ts" />

/*
Implementation of Memory Manager
i.e. the exclusive access to memory
*/

module TSOS {
	export class memoryManager {
		
		constructor(){
		}

		public loadMemory(base, limit, input): void {
			for(var i = base; i <= limit; i++){
				if(i <= (input.length -1)){
					_Memory.addressSpace[i] = input[i];
				}
			}
		}


	}
}