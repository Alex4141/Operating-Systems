///<reference path="../globals.ts" />

/*
CPU Scheduler prototype
*/

module TSOS {
	export class scheduler {
		constructor(public quantum: number = 6){
		}

		public setQuantum(newQuantum: number){
			this.quantum = newQuantum;
		}
	}
}