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
        memoryManager.prototype.updateMemoryDisplay = function () {
            // Once again TS lacks a way to access individual table cells
            // So once again, the long way to update memory
            var table = document.getElementById("memoryDisplay");
            // Delete every single row of data
            for (var i = 0; i < 32; i++) {
                table.deleteRow(0);
            }
            for (var i = 0; i < 32; i++) {
                // Add a new row into the table
                var newRow = table.insertRow(i);
                // 9 Cells to repopulate the rows
                var eightIndex = newRow.insertCell(0);
                var sevenIndex = newRow.insertCell(0);
                var sixIndex = newRow.insertCell(0);
                var fiveIndex = newRow.insertCell(0);
                var fourIndex = newRow.insertCell(0);
                var threeIndex = newRow.insertCell(0);
                var twoIndex = newRow.insertCell(0);
                var oneIndex = newRow.insertCell(0);
                var zeroIndex = newRow.insertCell(0);
                var leadingValue = i * 8;
                // Load up the cells with the proper memory address location
                eightIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 7]));
                sevenIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 6]));
                sixIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 5]));
                fiveIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 4]));
                fourIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 3]));
                threeIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 2]));
                twoIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8) + 1]));
                oneIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i * 8)]));
                if (leadingValue == 8 || leadingValue == 0) {
                    zeroIndex.appendChild(document.createTextNode("0x000" + leadingValue.toString(16)));
                }
                else {
                    zeroIndex.appendChild(document.createTextNode("0x00" + leadingValue.toString(16)));
                }
            }
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
