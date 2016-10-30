///<reference path="../globals.ts" />

/*
CPU Scheduler prototype
*/

module TSOS {
	export class scheduler {
		constructor(public quantum: number = 6){
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
	}
}