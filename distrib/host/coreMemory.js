/*
Implementation of Main Memory
*/
var TSOS;
(function (TSOS) {
    var coreMemory = (function () {
        function coreMemory(addressSpace) {
            if (addressSpace === void 0) { addressSpace = []; }
            this.addressSpace = addressSpace;
            for (var i = 0; i <= 255; i++) {
                this.addressSpace.push("00");
            }
        }
        return coreMemory;
    }());
    TSOS.coreMemory = coreMemory;
})(TSOS || (TSOS = {}));
