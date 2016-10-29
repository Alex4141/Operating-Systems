///<reference path="../globals.ts" />
/*
CPU Scheduler prototype
*/
var TSOS;
(function (TSOS) {
    var scheduler = (function () {
        function scheduler(quantum) {
            if (quantum === void 0) { quantum = 6; }
            this.quantum = quantum;
        }
        scheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
        };
        return scheduler;
    }());
    TSOS.scheduler = scheduler;
})(TSOS || (TSOS = {}));
