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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // date
            sc = new ShellCommand(this.shellDate,
                                    "date",
                                    "- Returns the current date.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // whereami
            sc = new ShellCommand(this.shellLocale,
                                    "whereami",
                                    "- Returns your location.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // reverse <string>
            sc = new ShellCommand(this.shellReverse,
                                    "reverse",
                                    "<string> - Reverses the inputted string.");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // status <string>
            sc = new ShellCommand(this.shellStatus,
                                    "status",
                                    "<string> - Updates the status of the OS");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // bsod
            sc = new ShellCommand(this.shellBSOD,
                                    "bsod",
                                    "- Blue screen of death for kernel error");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);


            // load
            sc = new ShellCommand(this.shellLoad,
                                    "load",
                                    "- Verifies that the Program Input is valid hex");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command); 

            // run
            sc = new ShellCommand(this.shellRun,
                                    "run",
                                    "<int> - Runs the program loaded into memory");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // clearmem
            sc = new ShellCommand(this.shellClearMemory,
                                    "clearmem",
                                    "- Clears all partitions of memory");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);


            // ps
            sc = new ShellCommand(this.shellProcessDisplay,
                                    "ps",
                                    "- Shows all active processes");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);


            // quantum
            sc = new ShellCommand(this.shellQuantum,
                                    "quantum",
                                    "- Reset the quantum for Round Robin Scheduling");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // runall
            sc = new ShellCommand(this.shellRunAll,
                                    "runall",
                                    "- Executes all programs in memory");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                                    "kill",
                                    "- Terminates an active process");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // format - Initializes all of the Tracks, their Sectors, their blocks
            sc = new ShellCommand(this.shellFormat,
                                    "format",
                                    "- Formats the disk");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // create - Create filenames 
            sc = new ShellCommand(this.shellCreate,
                                    "create",
                                    "- Creates a new file name");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // ls - list all the files on disk
            sc = new ShellCommand(this.shellList,
                                    "ls",
                                    "- List all the files on list");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // write  - Write content to a file
            sc = new ShellCommand(this.shellWrite,
                                    "write",
                                    "- Write content to a file");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            // read - Read the content of a file
            sc = new ShellCommand(this.shellRead,
                                    "read",
                                    "- read the content of a file");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);


            // delete - Delete the content of a file
            sc = new ShellCommand(this.shellDelete,
                                    "delete",
                                    "- delete the content of a file");
            this.commandList[this.commandList.length] = sc;
            _AllCommands.push(sc.command);

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
             _CPU.isExecuting = false;
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args) {
            var date: string = new Date().toString();
            _StdOut.putText(date);
        }

        public shellLocale(args) {
            var locations: string[] = ["Hancock", "Lowell Thomas", "Dyson", "Donnelly", "Cannavino Library", "New Science Building"];
            var yourLocation: string = locations[Math.floor(Math.random() * locations.length)];
            _StdOut.putText(yourLocation);    
        }

        public shellReverse(args) {
            var initialString = "";
            
            for(var argument in args){
                initialString += args[argument] + " ";
            }
            
            var toArray: string[] = initialString.split("");
            var reversedString: string = "";

            for(var i: number = toArray.length - 1; i >= 0; i--){
                reversedString += toArray[i];
            }

            _StdOut.putText(reversedString);
        }

        public shellStatus(args) {
            var status: string = "";

            for(var argument in args){
                status += args[argument] + " ";
            }

            (<HTMLInputElement> document.getElementById("statusArea")).value = status;
            _StdOut.putText("Status: " + status);   
        }

        public shellBSOD(args){
            _Kernel.krnTrapError("BSOD");
        }

        public shellLoad(args){

           var inputMatch = (<HTMLTextAreaElement>document.getElementById("taProgramInput"));
           
           //Check that our input is valid hex
           if(inputMatch.value.match('[^A-F0-9\\s]') || inputMatch.value.length == 0) {
                _StdOut.putText("Invalid Input");
            } else {
                    // Check to see if all memory partitions are full
                    if(_MemoryManager.memoryFull() == true){
                        _StdOut.putText("All memory partitions allocated");
                    } else {

                        // Create a new Process Control Block, because this process is valid
                        var newProcess = new PCB();
                        newProcess.processState = "Ready";
                        //Make an array of the input split it by space
                        var forMemory = (<HTMLTextAreaElement>document.getElementById("taProgramInput")).value.split(" ");
                        newProcess.memorySegementAmount = forMemory.length;
                        _GuiRoutines.updatePCBDisplay();

                        // Load Memory with the validated input.
                        _MemoryManager.loadMemory(newProcess, forMemory);
                        _StdOut.putText("New process created. PID: " + newProcess.pid);
                        _GuiRoutines.updateMemoryDisplay();
                    }
            }
        }

        public shellRun(args){
            // Get the process that was ran
            var processSelected = args[0];
            var selectedPCB;

            // Make sure the PCB with the pid is in the Resident Queue
            for(var i = 0; i < _ResidentQueue.getSize(); i++){
                if(_ResidentQueue.q[i].pid == processSelected){
                    // Get the specific PCB so we can use it's attributes
                    selectedPCB = _ResidentQueue.q[i];
                    // Remove the selectedPCB from it's location in the Resident Queue
                    _ResidentQueue.q.splice(i,1);
                }
            }

            
            if(selectedPCB != null){
                if(_CPU.isExecuting == true){
                    /*
                    If a process is already executing
                    Enqueue the process to Ready Queue
                    Indicate that multiple processes are running
                    */
                    _ReadyQueue.enqueue(selectedPCB);
                    _StdOut.putText("Executing process " + selectedPCB.pid);
                    _CPUScheduler.multipleProcessesRunning = true;
                } else {
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
            } else {
                // Otherwise it's an invalid Process ID
                _StdOut.putText("Invalid PID");    
            }    
        }

        public shellClearMemory(){
            
            // Clear the queues
            if(_ReadyQueue.isEmpty() != true || _ResidentQueue.isEmpty() != true){
                while(_ReadyQueue.getSize() != 0){
                    _ReadyQueue.dequeue();
                }
                while(_ResidentQueue.getSize() != 0){
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
        }

        public shellProcessDisplay(){
            if(_ReadyQueue.getSize() == 0){
                _StdOut.putText("No active processes");
            } else {
                _StdOut.putText("Active Processes: ");
                for(var i = 0; i < _ReadyQueue.getSize(); i++){
                    _StdOut.putText("PID: " + _ReadyQueue.q[i].pid.toString() + " ");
                }
            }
        }

        public shellQuantum(args){
            var newQuantum = args[0];
            if(newQuantum < 1){
                _StdOut.putText("Invalid quantum");
            } else {
                _CPUScheduler.setQuantum(newQuantum);
                _StdOut.putText("Quantum set to " + newQuantum);
            }
        }

        public shellRunAll(){
            // No processes currently executing or waiting to be executed
            if(_ResidentQueue.getSize() == 0 && _ReadyQueue.getSize() == 0){
                _StdOut.putText("No processes to be ran");
            } else if(_ResidentQueue.getSize() > 0){
                // Get the processes from the Resident List, move them to Ready Queue
                while(_ResidentQueue.getSize() != 0){
                    _CPUScheduler.scheduleProcess(_ResidentQueue.q[0]);
                    _ResidentQueue.dequeue();
                }

                // If the CPU is already executing, just indicate multiple processes are running
                if(_CPU.isExecuting == true){
                    _CPUScheduler.multipleProcessesRunning = true;
                } else if(_ReadyQueue.getSize() == 1){
                    // If the CPU wasn't already running and the Ready Queue only has 1 process, it's a regular run
                    var startingProcess = _ReadyQueue.q[0];
                    _CPU.PC = startingProcess.baseRegister;
                    _MemoryManager.updateBaseAndLimit(startingProcess.baseRegister, startingProcess.limitRegister);
                    _CPU.isExecuting = true;
                } else {
                    // In this case the CPU wasn't already executing and there are multiple processes
                    var startingProcess = _ReadyQueue.q[0];
                    _CPUScheduler.multipleProcessesRunning = true;
                    _CPU.PC = startingProcess.baseRegister;
                    _MemoryManager.updateBaseAndLimit(startingProcess.baseRegister, startingProcess.limitRegister);
                    _ReadyQueue.q[0].processState = "Running";
                    _CPU.isExecuting = true;
                }

                // Print the processes to be executed
                for(var i = 0; i < _ReadyQueue.getSize(); i++){
                    _StdOut.putText("Executing PID: " + _ReadyQueue.q[i].pid.toString());
                    if(i != _ReadyQueue.getSize() - 1){
                        _StdOut.advanceLine();
                    }
                }
            } else {
                _StdOut.putText("All processes already running");
            }
        }

        public shellKill(args){
            // There's no processes running
            if(_ReadyQueue.getSize() == 0){
                _StdOut.putText("No processes to kill");
            } else {
                var selectedProcess = args[0];
                var pidFound = false;

                // Preserve the state of the CPU
                _CPUScheduler.saveCPUState();
                // Stop executing so the Ready Queue doesn't move
                _CPU.isExecuting = false;
                for(var i=0;i<=_ReadyQueue.getSize()-1;i++){
                    if(_ReadyQueue.q[i].pid == selectedProcess){
                        // If the Argument matches a PID in the Ready Queue reset the partition and remove it from the queue
                        _MemoryManager.resetPartition(_ReadyQueue.q[i].baseRegister);
                        _ReadyQueue.q.splice(i,1);
                        pidFound = true;
                        _StdOut.putText("Killing process " + selectedProcess);
                    }
                }

                // If we never found the PID
                // Load the CPU state, go back to executing
                if(pidFound == false){
                    _StdOut.putText(selectedProcess + " is not an active process");
                    _CPUScheduler.loadCPUState();
                    _CPU.isExecuting = true;
                } else {
                    // If there's one or no process left, turn off multiple processing
                    if(_ReadyQueue.getSize() <= 1){
                        _CPUScheduler.multipleProcessesRunning = false;
                    }
                    // If we have any processes remaining, continue CPU execution
                    if(_ReadyQueue.getSize() > 0) {
                        _CPUScheduler.loadCPUState();
                        _CPU.isExecuting = true;
                    }
                }
            }
        }

        public shellFormat(){
            // Call the proper Device Driver's format function
            if(!_CPU.isExecuting){
                _krnFileDriver.format();
                _StdOut.putText("Hard Drive formatted");
            } else {
                _StdOut.putText("Cannot format while programs are running");
            }
        }

        public shellCreate(args){
            // Check if the Hard Drive has been formatted
           if(_krnFileDriver.formatted){
                var filename = args[0];
                var fileIndex = _krnFileDriver.nextAvailableFileNameIndex(); 
                if(fileIndex>0){
                    // If the index exists (greater than 0) then create a File
                    _krnFileDriver.createFileName(filename, fileIndex);
                    _StdOut.putText("File " + filename + " created!");
                } else {
                    _StdOut.putText("No space for new files available");
                }
            } else {
                _StdOut.putText("File System must be formatted beforehand");
            }
        }

        public shellList(){
            // List all the filenames available
            _krnFileDriver.ls();
        }

        public shellWrite(args){
            // Check if the Hard Drive has been formatted
            if(_krnFileDriver.formatted){
                // Get the filename and check if it exists
                var filename = args[0];
                if(_krnFileDriver.fileExists(filename) != "0"){
                    // If the file exists format it properly
                    var content = "";
                    for(var i = 1; i < args.length; i++){
                        content += args[i] + " ";
                    }
                    content = content.substring(0,content.length - 1);
                    // Make sure the beginning/ending of the content isn't missing double quotes
                    if(content.charAt(0) != "\"" || content.charAt(content.length - 1) != "\""){
                        _StdOut.putText("Input must have double quotes surrounding it");    
                    } else {
                        // Pass the content and the key to the filename
                        _krnFileDriver.writeFile(content, _krnFileDriver.fileExists(filename));
                        _StdOut.putText("Content written to file " + filename);
                    }
                } else {
                    _StdOut.putText("The filename you specified does not exist");    
                }
            } else {
                _StdOut.putText("File System must be formatted beforehand");    
            }
        }

        public shellRead(args){
            // Check if the Hard Drive has been formatted
            if(_krnFileDriver.formatted){
                // Get the filename and check if it exists
                var filename = args[0];
                if(_krnFileDriver.fileExists(filename) != "0"){
                    /* 
                    Take the verified valid file name key
                    Get the index where content begins
                    Pass the index to the File Driver Read Function
                    */
                    var key = _krnFileDriver.fileExists(filename);
                    var value = sessionStorage.getItem(key).toString();
                    var contentIndex = value.charAt(1) + value.charAt(2) + value.charAt(3);
                    _krnFileDriver.readFile(contentIndex);
                } else {
                    _StdOut.putText("The filename you specified does not exist");    
                }
            } else {
                _StdOut.putText("File System must be formatted beforehand");   
            }  
        }

        public shellDelete(args){
            // Check if the Hard Drive has been formatted
            if(_krnFileDriver.formatted){
                // Get the filename and check if it exists
                var filename = args[0];
                if(_krnFileDriver.fileExists(filename) != "0"){
                    // Pass the filename key to the File Driver Delete Function
                    var key = _krnFileDriver.fileExists(filename);
                    _krnFileDriver.deleteFileName(key);
                    _StdOut.putText("Deleted file " + filename);
                } else {
                 _StdOut.putText("The filename you specified does not exist");   
                }
            } else {
                _StdOut.putText("File System must be formatted beforehand");
            }
        }

    }
}