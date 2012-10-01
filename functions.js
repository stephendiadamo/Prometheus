//Globals 

var RECTANGLE = "rectangle";
var CIRCLE = "circle";
var LINE = "line";

var rectangleSelected = false;
var circleSelected = false;
var straightLineSelected = false;

function setSelected(shape){
	switch(shape)
	{
		case RECTANGLE:
			rectangleSelected = true;
			circleSelected = false;
			straightLineSelected = false;
			break;
		case CIRCLE:
			rectangleSelected = false;
			circleSelected = true;
			straightLineSelected = false;
			break;
		case LINE:
			rectangleSelected = false;
			circleSelected = false;
			straightLineSelected = true;
			break;
		default:
			break;	
	}
}


function clearCanvas()
{
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function circleClicked(){
	setSelected(CIRCLE);
}

function straightLineClicked()
{
	setSelected(LINE);
}

function rectangleClicked()
{
	//var canvas = document.getElementById("drawingCanvas");
	//var context = canvas.getContext('2d');
	setSelected(RECTANGLE);
	
	//USELESS BUILDING RECTANGLE CODE
	
	//context.beginPath();
	//context.moveTo(10,10);
	//context.lineTo(10, 100);
	//context.lineTo(100, 100);
	//context.lineTo(100, 10);

	//context.closePath();
	//context.stroke();	
}

function saveImage(){
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
	var dataURL = canvas.toDataURL();
	alert("THIS IS THE ENCODED PNG: \n" + dataURL);
}

// Get the mouse coordinates with respect to the canvas
function updateMouseCoordinates(event)  { 
	var coordinates = document.getElementById("coords");
	var canvas = document.getElementById("drawingCanvas");
	
	// With respect to the canvas
	
	var x = event.pageX - canvas.offsetLeft; 
	var y = event.pageY - canvas.offsetTop;
	
	// Display for now.
	coordinates.innerHTML = " (" + x + ", " + y + ")";
	
	return [x, y];
} 

function drawShape(event){
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
	
	var coordinates = updateMouseCoordinates(event);
	var x = coordinates[0];
	var y = coordinates[1];
	
	if (rectangleSelected){	
		// Need rectangle logic here
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x, y + 50);
		context.lineTo(x + 50, y + 50);
		context.lineTo(x + 50, y);
		context.closePath();
		
	} else if (circleSelected){
		context.beginPath();
		context.arc(x, y, 40, 0, 2*Math.PI);
		
	} else if (straightLineSelected){
		context.moveTo(x, y);
		context.lineTo(x+ 50, y + 50);
	} 
	
	context.stroke()
}


