///<reference path="../globals.ts" />
/*
Implementation of Memory Manager
i.e. the exclusive access to memory
*/
var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager(partitionOneEmpty, partitionTwoEmpty, partitionThreeEmpty, memoryBase, memoryLimit) {
            if (partitionOneEmpty === void 0) { partitionOneEmpty = true; }
            if (partitionTwoEmpty === void 0) { partitionTwoEmpty = true; }
            if (partitionThreeEmpty === void 0) { partitionThreeEmpty = true; }
            if (memoryBase === void 0) { memoryBase = 0; }
            if (memoryLimit === void 0) { memoryLimit = 0; }
            this.partitionOneEmpty = partitionOneEmpty;
            this.partitionTwoEmpty = partitionTwoEmpty;
            this.partitionThreeEmpty = partitionThreeEmpty;
            this.memoryBase = memoryBase;
            this.memoryLimit = memoryLimit;
        }
        memoryManager.prototype.memoryFull = function () {
            if (this.partitionOneEmpty == false && this.partitionTwoEmpty == false && this.partitionThreeEmpty == false) {
                return true;
            }
            else {
                return false;
            }
        };
        memoryManager.prototype.loadMemory = function (PCB, input) {
            var memoryLocation = PCB.baseRegister;
            var inputSegements = 0;
            while (inputSegements < input.length) {
                // Switch case for special cases, otherwise put op code in memory
                switch (input[inputSegements]) {
                    case "0":
                        _Memory.addressSpace[memoryLocation] = "00";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "A":
                        _Memory.addressSpace[memoryLocation] = "0A";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "B":
                        _Memory.addressSpace[memoryLocation] = "0B";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "C":
                        _Memory.addressSpace[memoryLocation] = "0C";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "D":
                        _Memory.addressSpace[memoryLocation] = "0D";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "E":
                        _Memory.addressSpace[memoryLocation] = "0E";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "F":
                        _Memory.addressSpace[memoryLocation] = "0F";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "1":
                        _Memory.addressSpace[memoryLocation] = "01";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "2":
                        _Memory.addressSpace[memoryLocation] = "02";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "3":
                        _Memory.addressSpace[memoryLocation] = "03";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "4":
                        _Memory.addressSpace[memoryLocation] = "04";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "5":
                        _Memory.addressSpace[memoryLocation] = "05";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "6":
                        _Memory.addressSpace[memoryLocation] = "06";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "7":
                        _Memory.addressSpace[memoryLocation] = "07";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "8":
                        _Memory.addressSpace[memoryLocation] = "08";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    case "9":
                        _Memory.addressSpace[memoryLocation] = "09";
                        memoryLocation++;
                        inputSegements++;
                        break;
                    default:
                        _Memory.addressSpace[memoryLocation] = input[inputSegements];
                        memoryLocation++;
                        inputSegements++;
                        break;
                }
            }
        };
        memoryManager.prototype.resetMemory = function () {
            for (var i = 0; i <= 767; i++) {
                _Memory.addressSpace[i] = "00";
            }
            this.partitionOneEmpty = true;
            this.partitionTwoEmpty = true;
            this.partitionThreeEmpty = true;
        };
        memoryManager.prototype.resetPartition = function (base) {
            var limit = base + 255;
            for (var i = base; i <= limit; i++) {
                _Memory.addressSpace[i] = "00";
            }
            if (base == 0) {
                this.partitionOneEmpty = true;
            }
            else if (base == 256) {
                this.partitionTwoEmpty = true;
            }
            else {
                this.partitionThreeEmpty = true;
            }
        };
        memoryManager.prototype.storeAccumulator = function (memoryLocation) {
            var location = memoryLocation;
            switch (_CPU.Acc) {
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
        };
        memoryManager.prototype.addressIncrementor = function (memoryLocation, value) {
            var incrementedValue = value + 1;
            var resultValue = incrementedValue.toString(16).toUpperCase();
            _Memory.addressSpace[memoryLocation] = resultValue;
        };
        memoryManager.prototype.updateBaseAndLimit = function (base, limit) {
            this.memoryBase = base;
            this.memoryLimit = limit;
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
