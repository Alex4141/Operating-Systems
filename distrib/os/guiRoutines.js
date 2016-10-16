///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var guiRoutines = (function () {
        function guiRoutines() {
        }
        guiRoutines.prototype.updateMemoryDisplay = function () {
            // TS lacks a way to access individual table cells
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
                // The display for the starting location in memory
                if (leadingValue == 8 || leadingValue == 0) {
                    zeroIndex.appendChild(document.createTextNode("0x000" + leadingValue.toString(16)));
                }
                else {
                    zeroIndex.appendChild(document.createTextNode("0x00" + leadingValue.toString(16)));
                }
            }
        };
        guiRoutines.prototype.updateCpuDisplay = function () {
            // Documentation for TS lacks a way to access individual table cells
            // So we're gonna have to update the display like this (sadnessssss)
            // Object for the table we're going to access
            var table = document.getElementById("cpuDisplay");
            var currentInstruction = _Memory.addressSpace[_CPU.PC];
            // Delete the entire row of data values
            table.deleteRow(1);
            // Add a new row, where the last one was
            var updatedRow = table.insertRow(1);
            // Push new cells to fill up the row
            var zValue = updatedRow.insertCell(0);
            var yValue = updatedRow.insertCell(0);
            var xValue = updatedRow.insertCell(0);
            var accValue = updatedRow.insertCell(0);
            var irValue = updatedRow.insertCell(0);
            var pcValue = updatedRow.insertCell(0);
            // Update the new cells with the appropriate values
            zValue.appendChild(document.createTextNode(_CPU.Zflag.toString()));
            yValue.appendChild(document.createTextNode(_CPU.Yreg.toString()));
            xValue.appendChild(document.createTextNode(_CPU.Xreg.toString()));
            accValue.appendChild(document.createTextNode(_CPU.Acc.toString()));
            irValue.appendChild(document.createTextNode(currentInstruction));
            pcValue.appendChild(document.createTextNode(_CPU.PC.toString()));
        };
        return guiRoutines;
    }());
    TSOS.guiRoutines = guiRoutines;
})(TSOS || (TSOS = {}));
