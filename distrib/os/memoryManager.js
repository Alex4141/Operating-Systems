///<reference path="../globals.ts" />
/*
Implementation of Memory Manager
i.e. the exclusive access to memory
*/
var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
        }
        memoryManager.prototype.loadMemory = function (base, limit, input) {
            for (var i = base; i <= limit; i++) {
                if (i <= (input.length - 1)) {
                    _Memory.addressSpace[i] = input[i];
                }
            }
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
