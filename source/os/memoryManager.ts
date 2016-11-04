///<reference path="../globals.ts" />

/*
Implementation of Memory Manager
i.e. the exclusive access to memory
*/

module TSOS {
	export class memoryManager {
		
		constructor(public partitionOneEmpty = true,
					public partitionTwoEmpty = true,
					public partitionThreeEmpty = true,
					public memoryBase = 0,
					public memoryLimit = 0){
		}

		public memoryFull(): boolean {
			if(this.partitionOneEmpty == false && this.partitionTwoEmpty == false && this.partitionThreeEmpty == false){
				return true;
			} else {
				return false;
			}
		}

		public loadMemory(PCB, input): void {
			var memoryLocation = PCB.baseRegister;
			var inputSegements = 0;
				while(inputSegements < input.length){
					// Switch case for special cases, otherwise put op code in memory
					switch(input[inputSegements]){
					case "0":
						_Memory.addressSpace[memoryLocation] = "00";
						memoryLocation++; inputSegements++;
						break;
					case "A":
						_Memory.addressSpace[memoryLocation] = "0A";
						memoryLocation++; inputSegements++;
						break;
					case "B":
						_Memory.addressSpace[memoryLocation] = "0B";
						memoryLocation++; inputSegements++;
						break;
					case "C":
						_Memory.addressSpace[memoryLocation] = "0C";
						memoryLocation++; inputSegements++;
						break;
					case "D":
						_Memory.addressSpace[memoryLocation] = "0D";
						memoryLocation++; inputSegements++;
						break;
					case "E":
						_Memory.addressSpace[memoryLocation] = "0E";
						memoryLocation++; inputSegements++;
						break;
					case "F":
						_Memory.addressSpace[memoryLocation] = "0F";
						memoryLocation++; inputSegements++;
						break;
					case "1":
						_Memory.addressSpace[memoryLocation] = "01";
						memoryLocation++; inputSegements++;
						break;
				    case "2":
						_Memory.addressSpace[memoryLocation] = "02";
						memoryLocation++; inputSegements++;
						break;
					case "3":
						_Memory.addressSpace[memoryLocation] = "03";
						memoryLocation++; inputSegements++;
						break;
					case "4":
						_Memory.addressSpace[memoryLocation] = "04";
						memoryLocation++; inputSegements++;
						break;
					case "5":
						_Memory.addressSpace[memoryLocation] = "05";
						memoryLocation++; inputSegements++;
						break;
					case "6":
						_Memory.addressSpace[memoryLocation] = "06";
						memoryLocation++; inputSegements++;
						break;
					case "7":
						_Memory.addressSpace[memoryLocation] = "07";
						memoryLocation++; inputSegements++;
						break;
					case "8":
						_Memory.addressSpace[memoryLocation] = "08";
						memoryLocation++; inputSegements++;
						break;
					case "9":
						_Memory.addressSpace[memoryLocation] = "09";
						memoryLocation++; inputSegements++;
						break;
					default:
						_Memory.addressSpace[memoryLocation] = input[inputSegements];
						memoryLocation++; inputSegements++;
						break;
					}
				
			}
		}

		public resetMemory(){
			for(var i = 0; i <= 767; i++){
				_Memory.addressSpace[i] = "00";
			}
			this.partitionOneEmpty = true;
			this.partitionTwoEmpty = true;
			this.partitionThreeEmpty = true;
		}

		public resetPartition(base){
			var limit = base + 255;
			for(var i = base; i <= limit; i++){
				_Memory.addressSpace[i] = "00";
			}

			if(base == 0){
				this.partitionOneEmpty = true;
			} else if(base == 256){
				this.partitionTwoEmpty = true;
			}  else {
				this.partitionThreeEmpty = true;
			}
		}

		public storeAccumulator(memoryLocation){
			var location = memoryLocation;

			switch(_CPU.Acc){
				case 0:
					_Memory.addressSpace[location] = "00";
					break;
				case 10:
					_Memory.addressSpace[location] = "0A";
					break;
				case 11:
					_Memory.addressSpace[location] = "0B";
					break;
				case 12:
					_Memory.addressSpace[location] = "0C";
					break;
				case 13:
					_Memory.addressSpace[location] = "0D";
					break;
				case 14:
					_Memory.addressSpace[location] = "0E";
					break;
				case 15:
					_Memory.addressSpace[location] = "0F";
					break;
				case 1:
					_Memory.addressSpace[location] = "01";
					break;
				case 2:
					_Memory.addressSpace[location] = "02";
					break;
				case 3:
					_Memory.addressSpace[location] = "03";
					break;
				case 4:
					_Memory.addressSpace[location] = "04";
					break;
				case 5:
					_Memory.addressSpace[location] = "05";
					break;
				case 6:
					_Memory.addressSpace[location] = "06";
					break;
				case 7:
					_Memory.addressSpace[location] = "07";
					break;
				case 8:
					_Memory.addressSpace[location] = "08";
					break;
				case 9:
					_Memory.addressSpace[location] = "09";
					break;
				default:
					_Memory.addressSpace[location] = _CPU.Acc.toString(16).toUpperCase();
					break;
			}
		}

		public addressIncrementor(memoryLocation, value){
			var incrementedValue = value + 1;
			var resultValue = incrementedValue.toString(16).toUpperCase();
			_Memory.addressSpace[memoryLocation] = resultValue; 
		}

		public updateBaseAndLimit(base, limit){
			this.memoryBase = base;
			this.memoryLimit = limit;
		}
	}
}