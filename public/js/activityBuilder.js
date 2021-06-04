document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
	document.getElementById('addActivityButton').addEventListener('click',function(event){
	
		var req = new XMLHttpRequest();

		var userInputs = getUserRequest();  // Call to build string input used in GET function
		
		req.open('GET', userInputs, true);
		//req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.addEventListener('load',function(){
			if (req.status >=200 && req.status < 400){
				var response = JSON.parse(req.responseText);  // Parse returned JSON to JS object
				//var id = response.inserted;
				//document.getElementById('errorLine').textContent = response.id;
				addTableLine(response);
			} else {
				document.getElementById('errorLine').textContent = "Error in network request: " + req.statusText + ". Please check your input and try again.";
			}
		});
		req.send(null);
		event.preventDefault();
	});
}

function getUserRequest(){
	var addActivity = document.getElementById('addActivityForm');
	var userInputs = "insert?name="

	if(addActivity.elements.activityName.value != ""){
		userInputs += addActivity.elements.activityName.value;
	}else{
		alert('Please enter an activity name.');
		return;
	}
	if(addActivity.elements.activityReps.value != ""){
		userInputs += "&reps=" + addActivity.elements.activityReps.value;
	}else{
		alert('Please enter number of reps.');
		return;
	}
	if(addActivity.elements.activityWeight.value != ""){
		userInputs += "&weight=" + addActivity.elements.activityWeight.value;
	}else{
		alert('Please enter a weight.');
		return;
	}
	if(addActivity.elements.activityDate.value != ""){
		userInputs += "&date=" + addActivity.elements.activityDate.value;
	}else{
		alert('Please select a date for your activity.');
		return;
	}
	if(addActivity.elements.unitRadio.value != ""){
		userInputs += "&lbs=" + addActivity.elements.unitRadio.value;
	}else{
		alert('Please select units for your weight');
		return;
	}
	
 	return userInputs;
}

function addTableLine(reqResponse){
	var table = document.getElementById("activityTable");
	var	newRow = document.createElement("tr");

	var dateCell = document.createElement("td");
	dateCell.textContent= formatDate(reqResponse.date);
	newRow.appendChild(dateCell);

	var nameCell = document.createElement("td");
	nameCell.textContent=reqResponse.name;
	newRow.appendChild(nameCell);

	var repCell = document.createElement("td");
	repCell.textContent=reqResponse.reps;
	newRow.appendChild(repCell);

	var weightCell = document.createElement("td");
	weightCell.textContent=reqResponse.weight;
	newRow.appendChild(weightCell);

	if(reqResponse.lbs){
        var unitString = "lbs";
  	}else{
        var unitString = "kgs";
  	}
  	var unitCell = document.createElement("td");
	unitCell.textContent=unitString;
	newRow.appendChild(unitCell);

	var editCell = document.createElement("td");
	editCell.innerHTML = "<input type='submit' name='Edit Activity' value='Edit' id='editActivityButton'>"
	//setAtts(editCell,{"type":"submit", "name":"Edit Activity", "value":"Edit", "id":"editActivityButton"});
	newRow.appendChild(editCell);

	var delCell = document.createElement("td");
	var delBut = document.createElement("input");
	setAtts(delBut,{"type": "submit", "name": "DeleteActivity", "value": "Delete", "id": "deleteActivityButton", "onClick":"deleteData('activityTable','"+reqResponse.id+"')"});
	//delCell.innerHTML = "<input type='submit' name='Delete Activity' value='Delete' id='deleteActivityButton' onClick='deleteData('activityTable'," +reqResponse.id + ")'><input type='hidden' id='row" +reqResponse.id + "'>"
	var hiddenId = document.createElement("input");
	setAtts(hiddenId,{"type":"hidden","id":"'"+ reqResponse.id+ "'"});
	delCell.appendChild(delBut);
	delCell.appendChild(hiddenId);

	newRow.appendChild(delCell);

	table.appendChild(newRow);
	document.getElementById('errorLine').textContent = "Added new activity";
}

function setAtts(element,attributes){
	for (var key in attributes){
		element.setAttribute(key,attributes[key]);
	}
}

function formatDate(inputDate){
	var hardDate = new Date(inputDate);
	var day = hardDate.getDate();
	var month = hardDate.getMonth() +1;
	var year = hardDate.getFullYear();
	
	var easyDate = month + "/" + day + "/" + year;
	return	easyDate;
}

function deleteData(tableId, id){
    var targetId = "row" + id;
	var table = document.getElementById(tableId);
	var rowCount = table.rows.length;
	var req = new XMLHttpRequest();

	req.open("GET", "/delete?id=" + id, true);
	req.send(null);
	event.preventDefault();

	for(var i = 1; i < rowCount; i++){
		var row = table.rows[i];
		var findData = row.getElementsByTagName("td");
		var erase = findData[findData.length -1];
		if(erase.children[1].id === targetId){
			table.deleteRow(i);
			rowCount--;
			i--;
			document.getElementById('errorLine').textContent = "Activity deleted";
		}
	}
}

function editData(tableId, id){
	var targetId = "row" + id;
	var table = document.getElementById(tableId);
	var rowCount = table.rows.length;
	var req = new XMLHttpRequest();

	req.open("GET", "/edit?id=" + id, true);
	req.send(null);
	event.preventDefault();
}

