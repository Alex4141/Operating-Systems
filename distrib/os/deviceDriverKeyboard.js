///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this);
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode == 8) ||
                (keyCode == 9) ||
                (keyCode == 38) ||
                (keyCode == 40) ||
                (keyCode == 13)) {
                if (isShifted) {
                    chr = this.shiftHandler(keyCode, chr);
                    _KernelInputQueue.enqueue(chr);
                }
                else {
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
            }
            else if (keyCode == 32) {
                if (!isShifted) {
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
            }
            else if (_UniqueKeys.indexOf(keyCode) > -1) {
                if (isShifted) {
                    chr = this.shiftHandler(keyCode, chr);
                    _KernelInputQueue.enqueue(chr);
                }
                else {
                    chr = this.keyHandler(keyCode, chr);
                    _KernelInputQueue.enqueue(chr);
                }
            }
        };
        DeviceDriverKeyboard.prototype.keyHandler = function (keyCode, chr) {
            switch (keyCode) {
                case 186:
                    chr = String.fromCharCode(59);
                    break;
                case 187:
                    chr = String.fromCharCode(61);
                    break;
                case 188:
                    chr = String.fromCharCode(44);
                    break;
                case 189:
                    chr = String.fromCharCode(45);
                    break;
                case 190:
                    chr = String.fromCharCode(46);
                    break;
                case 191:
                    chr = String.fromCharCode(47);
                    break;
                case 192:
                    chr = String.fromCharCode(96);
                    break;
                case 219:
                    chr = String.fromCharCode(91);
                    break;
                case 221:
                    chr = String.fromCharCode(93);
                    break;
                case 222:
                    chr = String.fromCharCode(39);
                    break;
                default:
                    break;
            }
            return chr;
        };
        DeviceDriverKeyboard.prototype.shiftHandler = function (keyCode, chr) {
            switch (keyCode) {
                case 48:
                    chr = String.fromCharCode(41);
                    break;
                case 49:
                    chr = String.fromCharCode(33);
                    break;
                case 50:
                    chr = String.fromCharCode(64);
                    break;
                case 51:
                    chr = String.fromCharCode(35);
                    break;
                case 52:
                    chr = String.fromCharCode(36);
                    break;
                case 53:
                    chr = String.fromCharCode(37);
                    break;
                case 54:
                    chr = String.fromCharCode(94);
                    break;
                case 55:
                    chr = String.fromCharCode(38);
                    break;
                case 56:
                    chr = String.fromCharCode(42);
                    break;
                case 57:
                    chr = String.fromCharCode(40);
                    break;
                case 186:
                    chr = String.fromCharCode(58);
                    break;
                case 187:
                    chr = String.fromCharCode(43);
                    break;
                case 188:
                    chr = String.fromCharCode(60);
                    break;
                case 189:
                    chr = String.fromCharCode(95);
                    break;
                case 190:
                    chr = String.fromCharCode(62);
                    break;
                case 191:
                    chr = String.fromCharCode(63);
                    break;
                case 192:
                    chr = String.fromCharCode(126);
                    break;
                case 219:
                    chr = String.fromCharCode(123);
                    break;
                case 221:
                    chr = String.fromCharCode(125);
                    break;
                case 222:
                    chr = String.fromCharCode(34);
                    break;
                default:
                    break;
            }
            return chr;
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
