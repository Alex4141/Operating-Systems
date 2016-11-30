///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="PCB.ts" />
///<reference path="queue.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Returns the current date.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // whereami
            sc = new TSOS.ShellCommand(this.shellLocale, "whereami", "- Returns your location.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // reverse <string>
            sc = new TSOS.ShellCommand(this.shellReverse, "reverse", "<string> - Reverses the inputted string.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Updates the status of the OS");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // bsod
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Blue screen of death for kernel error");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Verifies that the Program Input is valid hex");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<int> - Runs the program loaded into memory");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearMemory, "clearmem", "- Clears all partitions of memory");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // ps
            sc = new TSOS.ShellCommand(this.shellProcessDisplay, "ps", "- Shows all active processes");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- Reset the quantum for Round Robin Scheduling");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Executes all programs in memory");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- Terminates an active process");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            // format - Initializes all of the Tracks, their Sectors, their blocks
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Formats the disk");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _CPU.isExecuting = false;
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the the current version of the OS.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown shuts down the OS.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears all the previous information from the screen.");
                        break;
                    case "man":
                        _StdOut.putText("Man provides the manual definition for commands' information.");
                        break;
                    case "trace":
                        _StdOut.putText("Traces turns on (or off) the log");
                        break;
                    case "rot13":
                        _StdOut.putText("Rot13 returns the ROT-13 encryption of the input string");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt sets the value of the input prompt.");
                        break;
                    case "date":
                        _StdOut.putText("Date provides the current date");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami gives you your location on campus, then teleports you (Potentially)");
                        break;
                    case "reverse":
                        _StdOut.putText("Reverse returns the result of reversing the input string");
                        break;
                    case "status":
                        _StdOut.putText("Status updates the status of the OS to the input string");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD returns the blue screen of death error message");
                        break;
                    case "load":
                        _StdOut.putText("Load a program into a valid memory partition");
                        break;
                    case "run":
                        _StdOut.putText("Run a program load into memory");
                        break;
                    case "clearmem":
                        _StdOut.putText("Clear all partitions of memory");
                        break;
                    case "ps":
                        _StdOut.putText("Show all processes actively running");
                        break;
                    case "quantum":
                        _StdOut.putText("Change the quantum of the Round Robin Scheduler");
                        break;
                    case "runall":
                        _StdOut.putText("Run all the programs loaded into memory");
                        break;
                    case "kill":
                        _StdOut.putText("Kill a process that is actively running");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            var date = new Date().toString();
            _StdOut.putText(date);
        };
        Shell.prototype.shellLocale = function (args) {
            var locations = ["Hancock", "Lowell Thomas", "Dyson", "Donnelly", "Cannavino Library", "New Science Building"];
            var yourLocation = locations[Math.floor(Math.random() * locations.length)];
            _StdOut.putText(yourLocation);
        };
        Shell.prototype.shellReverse = function (args) {
            var initialString = "";
            for (var argument in args) {
                initialString += args[argument] + " ";
            }
            var toArray = initialString.split("");
            var reversedString = "";
            for (var i = toArray.length - 1; i >= 0; i--) {
                reversedString += toArray[i];
            }
            _StdOut.putText(reversedString);
        };
        Shell.prototype.shellStatus = function (args) {
            var status = "";
            for (var argument in args) {
                status += args[argument] + " ";
            }
            document.getElementById("statusArea").value = status;
            _StdOut.putText("Status: " + status);
        };
        Shell.prototype.shellBSOD = function (args) {
            _Kernel.krnTrapError("BSOD");
        };
        Shell.prototype.shellLoad = function (args) {
            var inputMatch = document.getElementById("taProgramInput");
            //Check that our input is valid hex
            if (inputMatch.value.match('[^A-F0-9\\s]') || inputMatch.value.length == 0) {
                _StdOut.putText("Invalid Input");
            }
            else {
                // Check to see if all memory partitions are full
                if (_MemoryManager.memoryFull() == true) {
                    _StdOut.putText("All memory partitions allocated");
                }
                else {
                    // Create a new Process Control Block, because this process is valid
                    var newProcess = new TSOS.PCB();
                    newProcess.processState = "Ready";
                    //Make an array of the input split it by space
                    var forMemory = document.getElementById("taProgramInput").value.split(" ");
                    newProcess.memorySegementAmount = forMemory.length;
                    _GuiRoutines.updatePCBDisplay();
                    // Load Memory with the validated input.
                    _MemoryManager.loadMemory(newProcess, forMemory);
                    _StdOut.putText("New process created. PID: " + newProcess.pid);
                    _GuiRoutines.updateMemoryDisplay();
                }
            }
        };
        Shell.prototype.shellRun = function (args) {
            // Get the process that was ran
            var processSelected = args[0];
            var selectedPCB;
            // Make sure the PCB with the pid is in the Resident Queue
            for (var i = 0; i < _ResidentQueue.getSize(); i++) {
                if (_ResidentQueue.q[i].pid == processSelected) {
                    // Get the specific PCB so we can use it's attributes
                    selectedPCB = _ResidentQueue.q[i];
                    // Remove the selectedPCB from it's location in the Resident Queue
                    _ResidentQueue.q.splice(i, 1);
                }
            }
            if (selectedPCB != null) {
                if (_CPU.isExecuting == true) {
                    /*
                    If a process is already executing
                    Enqueue the process to Ready Queue
                    Indicate that multiple processes are running
                    */
                    _ReadyQueue.enqueue(selectedPCB);
                    _StdOut.putText("Executing process " + selectedPCB.pid);
                    _CPUScheduler.multipleProcessesRunning = true;
                }
                else {
                    /*
                    If no processes are already executing
                    Enqueue the process to the Ready Queue
                    Set the PC and start execution
                    */
                    _ReadyQueue.enqueue(selectedPCB);
                    _StdOut.putText("Executing process " + selectedPCB.pid);
                    _MemoryManager.updateBaseAndLimit(selectedPCB.baseRegister, selectedPCB.limitRegister);
                    _CPU.PC = selectedPCB.baseRegister;
                    _CPU.isExecuting = true;
                    selectedPCB.processState = "Running";
                }
            }
            else {
                // Otherwise it's an invalid Process ID
                _StdOut.putText("Invalid PID");
            }
        };
        Shell.prototype.shellClearMemory = function () {
            // Clear the queues
            if (_ReadyQueue.isEmpty() != true || _ResidentQueue.isEmpty() != true) {
                while (_ReadyQueue.getSize() != 0) {
                    _ReadyQueue.dequeue();
                }
                while (_ResidentQueue.getSize() != 0) {
                    _ResidentQueue.dequeue();
                }
            }
            // Reset memory
            _MemoryManager.resetMemory();
            // If CPU was executing not anymore, likewise for multiple processes
            _CPU.isExecuting = false;
            _CPUScheduler.multipleProcessesRunning = false;
            _StdOut.putText("Reseting memory...");
            _GuiRoutines.updateMemoryDisplay();
        };
        Shell.prototype.shellProcessDisplay = function () {
            if (_ReadyQueue.getSize() == 0) {
                _StdOut.putText("No active processes");
            }
            else {
                _StdOut.putText("Active Processes: ");
                for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                    _StdOut.putText("PID: " + _ReadyQueue.q[i].pid.toString() + " ");
                }
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            var newQuantum = args[0];
            if (newQuantum < 1) {
                _StdOut.putText("Invalid quantum");
            }
            else {
                _CPUScheduler.setQuantum(newQuantum);
                _StdOut.putText("Quantum set to " + newQuantum);
            }
        };
        Shell.prototype.shellRunAll = function () {
            // No processes currently executing or waiting to be executed
            if (_ResidentQueue.getSize() == 0 && _ReadyQueue.getSize() == 0) {
                _StdOut.putText("No processes to be ran");
            }
            else if (_ResidentQueue.getSize() > 0) {
                // Get the processes from the Resident List, move them to Ready Queue
                while (_ResidentQueue.getSize() != 0) {
                    _CPUScheduler.scheduleProcess(_ResidentQueue.q[0]);
                    _ResidentQueue.dequeue();
                }
                // If the CPU is already executing, just indicate multiple processes are running
                if (_CPU.isExecuting == true) {
                    _CPUScheduler.multipleProcessesRunning = true;
                }
                else if (_ReadyQueue.getSize() == 1) {
                    // If the CPU wasn't already running and the Ready Queue only has 1 process, it's a regular run
                    var startingProcess = _ReadyQueue.q[0];
                    _CPU.PC = startingProcess.baseRegister;
                    _MemoryManager.updateBaseAndLimit(startingProcess.baseRegister, startingProcess.limitRegister);
                    _CPU.isExecuting = true;
                }
                else {
                    // In this case the CPU wasn't already executing and there are multiple processes
                    var startingProcess = _ReadyQueue.q[0];
                    _CPUScheduler.multipleProcessesRunning = true;
                    _CPU.PC = startingProcess.baseRegister;
                    _MemoryManager.updateBaseAndLimit(startingProcess.baseRegister, startingProcess.limitRegister);
                    _ReadyQueue.q[0].processState = "Running";
                    _CPU.isExecuting = true;
                }
                // Print the processes to be executed
                for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                    _StdOut.putText("Executing PID: " + _ReadyQueue.q[i].pid.toString());
                    if (i != _ReadyQueue.getSize() - 1) {
                        _StdOut.advanceLine();
                    }
                }
            }
            else {
                _StdOut.putText("All processes already running");
            }
        };
        Shell.prototype.shellKill = function (args) {
            // There's no processes running
            if (_ReadyQueue.getSize() == 0) {
                _StdOut.putText("No processes to kill");
            }
            else {
                var selectedProcess = args[0];
                var pidFound = false;
                // Preserve the state of the CPU
                _CPUScheduler.saveCPUState();
                // Stop executing so the Ready Queue doesn't move
                _CPU.isExecuting = false;
                for (var i = 0; i <= _ReadyQueue.getSize() - 1; i++) {
                    if (_ReadyQueue.q[i].pid == selectedProcess) {
                        // If the Argument matches a PID in the Ready Queue reset the partition and remove it from the queue
                        _MemoryManager.resetPartition(_ReadyQueue.q[i].baseRegister);
                        _ReadyQueue.q.splice(i, 1);
                        pidFound = true;
                        _StdOut.putText("Killing process " + selectedProcess);
                    }
                }
                // If we never found the PID
                // Load the CPU state, go back to executing
                if (pidFound == false) {
                    _StdOut.putText(selectedProcess + " is not an active process");
                    _CPUScheduler.loadCPUState();
                    _CPU.isExecuting = true;
                }
                else {
                    // If there's one or no process left, turn off multiple processing
                    if (_ReadyQueue.getSize() <= 1) {
                        _CPUScheduler.multipleProcessesRunning = false;
                    }
                    // If we have any processes remaining, continue CPU execution
                    if (_ReadyQueue.getSize() > 0) {
                        _CPUScheduler.loadCPUState();
                        _CPU.isExecuting = true;
                    }
                }
            }
        };
        Shell.prototype.shellFormat = function () {
            // Call the proper Device Driver's format function
            _krnFileDriver.format();
            _StdOut.putText("Hard Drive formatted");
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
