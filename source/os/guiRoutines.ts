///<reference path="../globals.ts" />

module TSOS {
	export class guiRoutines {
		constructor(){
		}

		public updateMemoryDisplay(){
			// TS lacks a way to access individual table cells
            // So once again, the long way to update memory
            var table = (<HTMLTableElement> document.getElementById("memoryDisplay"));

            // Delete every single row of data
            for(var i = 0; i < 96; i++){
                    table.deleteRow(0);
            }

            for(var i = 0; i < 96; i++){

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

                var leadingValue = i*8;

                // Load up the cells with the proper memory address location
                eightIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 7]));
                sevenIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 6]));
                sixIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 5]));
                fiveIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 4]));
                fourIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 3]));
                threeIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 2]));
                twoIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8) + 1]));
                oneIndex.appendChild(document.createTextNode(_Memory.addressSpace[(i*8)]));

                // The display for the starting location in memory
                if(leadingValue == 8 || leadingValue == 0){
                    zeroIndex.appendChild(document.createTextNode("0x000" + leadingValue.toString(16)));
                } else {
                    zeroIndex.appendChild(document.createTextNode("0x00" + leadingValue.toString(16)));
                }
            }
		}

		public updateCpuDisplay(){
			// Documentation for TS lacks a way to access individual table cells
            // So we're gonna have to update the display like this (sadnessssss)
            
            // Object for the table we're going to access
            var table = (<HTMLTableElement> document.getElementById("cpuDisplay"));
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


            var fixedPC = _CPU.PC;
            while(fixedPC > 255){
                fixedPC = fixedPC - 256;
            }

            // Update the new cells with the appropriate values
            zValue.appendChild(document.createTextNode(_CPU.Zflag.toString()));
            yValue.appendChild(document.createTextNode(_CPU.Yreg.toString()));
            xValue.appendChild(document.createTextNode(_CPU.Xreg.toString()));
            accValue.appendChild(document.createTextNode(_CPU.Acc.toString()));
            irValue.appendChild(document.createTextNode(currentInstruction));
            pcValue.appendChild(document.createTextNode(fixedPC.toString()));	
		}

        
        public updatePCBDisplay(){
            // Same situation with the first two methods
            var table = (<HTMLTableElement> document.getElementById("PCBdisplay"));

            var myRows = table.rows.length;
            if(myRows > 1){
                var i = 1;
                while(i != myRows){
                    table.deleteRow(i);
                    myRows--;
                }   
            }
           
            var incrementor = 1;
             
            for(var i = 0; i <= _ReadyQueue.getSize()-1;i++){
                var updatedRow = table.insertRow(incrementor);

                var zValue = updatedRow.insertCell(0);
                var yValue = updatedRow.insertCell(0);
                var xValue = updatedRow.insertCell(0);
                var accValue = updatedRow.insertCell(0);
                var irValue = updatedRow.insertCell(0);
                var pcValue = updatedRow.insertCell(0);
                var state = updatedRow.insertCell(0);
                var pidValue = updatedRow.insertCell(0);

                var fixedPC = _ReadyQueue.q[i].PCstate;
                while(fixedPC > 255){
                    fixedPC = fixedPC - 256;
                }

                zValue.appendChild(document.createTextNode(_ReadyQueue.q[i].ZflagState.toString()));
                yValue.appendChild(document.createTextNode(_ReadyQueue.q[i].YregState.toString()));
                xValue.appendChild(document.createTextNode(_ReadyQueue.q[i].XregState.toString()));
                accValue.appendChild(document.createTextNode(_ReadyQueue.q[i].AccState.toString()));
                irValue.appendChild(document.createTextNode(_Memory.addressSpace[_ReadyQueue.q[i].PCstate]));
                pcValue.appendChild(document.createTextNode(fixedPC.toString()));
                state.appendChild(document.createTextNode(_ReadyQueue.q[i].processState));
                pidValue.appendChild(document.createTextNode(_ReadyQueue.q[i].pid.toString()));

                incrementor++;
            }
        }

        public updateHardDriveDisplay(){
            // Only update the file system display if the fsDD is formatted
            if(_krnFileDriver.formatted){
                var table = (<HTMLTableElement> document.getElementById("fileDisplay"));

                // Delete every single row of data
                var myRows = table.rows.length;
                while(myRows != 0){
                    table.deleteRow(0);
                    myRows -= 1;
                }

                // Iterate to create the table
                for(var i = 0; i < 256; i++){
                    var updateRow = table.insertRow(i);   
                    // Get the Octal Key and it's value
                    var key = i.toString(8);
                    var value = sessionStorage.getItem(key).toString();
                    
                    while(value.length != 124){
                        value = value + "0";
                    }
                    
                    var content: any = updateRow.insertCell(0);
                    var tsb: any = updateRow.insertCell(0);

                    if(parseInt(key, 10) < 10){
                        key = "00" + key;
                    } else if(parseInt(key, 10) < 100){
                        key = "0" + key;
                    } 
                    tsb.appendChild(document.createTextNode(key));
                    content.appendChild(document.createTextNode(value));
                 }   
            }
        }


	}
}


