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
                    // Switch case for special cases, otherwise put op code in memory
                    switch (input[i]) {
                        case "A":
                            _Memory.addressSpace[i] = "0A";
                            break;
                        case "B":
                            _Memory.addressSpace[i] = "0B";
                            break;
                        case "C":
                            _Memory.addressSpace[i] = "0C";
                            break;
                        case "D":
                            _Memory.addressSpace[i] = "0D";
                            break;
                        case "E":
                            _Memory.addressSpace[i] = "0E";
                            break;
                        case "F":
                            _Memory.addressSpace[i] = "0F";
                            break;
                        case "1":
                            _Memory.addressSpace[i] = "01";
                            break;
                        case "2":
                            _Memory.addressSpace[i] = "02";
                            break;
                        case "3":
                            _Memory.addressSpace[i] = "03";
                            break;
                        case "4":
                            _Memory.addressSpace[i] = "04";
                            break;
                        case "5":
                            _Memory.addressSpace[i] = "05";
                            break;
                        case "6":
                            _Memory.addressSpace[i] = "06";
                            break;
                        case "7":
                            _Memory.addressSpace[i] = "07";
                            break;
                        case "8":
                            _Memory.addressSpace[i] = "08";
                            break;
                        case "9":
                            _Memory.addressSpace[i] = "09";
                            break;
                        default:
                            _Memory.addressSpace[i] = input[i];
                            break;
                    }
                }
            }
        };
        memoryManager.prototype.resetMemory = function () {
            for (var i = 0; i <= 255; i++) {
                _Memory.addressSpace[i] = "00";
            }
        };
        memoryManager.prototype.storeAccumulator = function (memoryLocation) {
            var location = memoryLocation;
            switch (_CPU.Acc) {
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
        };
        memoryManager.prototype.addressIncrementor = function (memoryLocation, value) {
            var incrementedValue = value + 1;
            var resultValue = incrementedValue.toString(16).toUpperCase();
            _Memory.addressSpace[memoryLocation] = resultValue;
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
