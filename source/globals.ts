/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "My OS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "0.10";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;


//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  						// Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory: TSOS.coreMemory;				// Ensures _Memory is an instance of the Memory class.
var _MemoryManager: TSOS.memoryManager;		// Ensures _MemoryManager is an instance of MemoryManager class.
var _GuiRoutines: TSOS.guiRoutines;			// Ensures _GuiRoutines is an instance of Gui Routines class.
var _CPUScheduler: TSOS.scheduler;			// Ensures _CPUScheduler is an instance of Scheduler

var _ResidentQueue: TSOS.Queue				// Ensures _ResidentQueue is an instance of Queue
var _ReadyQueue: TSOS.Queue;				// Ensures _ReadyQueue is an instance of Queue
var _TerminatedQueue: TSOS.Queue;			// Ensures _TerminatedQueue is an instance of Queue

var _PartitionThreePCB: TSOS.PCB;	

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _UniqueKeys: number[] = [186,187,188,189,190,191,192,219,221,222];	// keyCodes for Keyboard keys with unique handling
var _AllCommands: string[] = [];										// Global accessor for all of the string values of our commands
var _CommandHistory: string[] = [];										// All the commands
var _CommandCycle: number = 0;											// Used to shift through command history

var _PCBContainer = [];											// Holds all created PCB's
var _TotalProcesses = 0;										// Total Processes that have been created

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _CanvasDiv: HTMLDivElement;			// Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnFileDriver; // = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
