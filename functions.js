//Constants
var RECTANGLE = "rectangle";
var CIRCLE = "circle";
var LINE = "line";

//Globals
var rectangleSelected = true;
var circleSelected = false;
var straightLineSelected = false;
var shapes = [];
var currentSelectedShape;
var currentOutlineColor = "#000";
var currentfillColor = "#000"

//Objects  

//Can use a Shape parent class possibly
// function Shape (x, y, outlineColor, outlineThickness, fillColor) {
// 	this.x = x;
// 	this.y = y;
// 	this.outlineColor = outlineColor;
// 	this.outlineThickness = outlineThickness;
// 	this.fillColor = fillColor;
// }

function Circle()
{
	this.x = 0;
	this.y = 0;
	this.radius = 1;
	this.fillColor = "#000"
	this.outlineColor = "#000";
	this.outlineThickness = 1;
}

function Line()
{
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 1;
	this.y2 = 1;
	this.lineColor = "#000"
	this.lineThickness = 1;
}

function Rectangle()
{
	this.x = 0;
	this.y = 0;
	this.l = 1;
	this.w = 1;
	this.fillColor = "#000"
	this.outlineColor = "#000";
	this.outlineThickness = 1;
}

//Can be built into constructor, but must be added to the shapes array.
function addCircle(x, y, radius, fillColor, outlineColor, outlineThickness)
{
	var circle = new Circle;
	circle.x = x;
	circle.y = y;
	circle.radius = radius;
	circle.fillColor = fillColor;
	circle.outlineColor = outlineColor;
	circle.outlineThickness = outlineThickness;
	shapes.push(circle);
}

function addLine(x1, y1, x2, y2, lineColor, lineThickness)
{
	var line = new Line;
	line.x1 = x1;
	line.y1 = y1;
	line.x2 = x2;
	line.y2 = y2;
	line.lineColor = lineColor; 
	line.lineThickness = lineThickeness;
	shapes.push(line);
}

function addRectangle(x, y, l, w, fillColor, outlineColor, outlineThickness) 
{
	var rectangle = new Rectangle;
	rectangle.x = x;
	rectangle.y = y;
	rectangle.l = l;
	rectangle.w = w;
	rectangle.fillColor = fillColor;
	rectangle.outlineColor = outlineColor;
	rectangle.outlineThickness = outlineThickness;
	shapes.push(rectangle);
}

function setSelected(shape){
	document.getElementById("curShape").innerHTML = "Shape : " + shape; 
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

function circleClicked()
{
	setSelected(CIRCLE);
}

function straightLineClicked()
{
	setSelected(LINE);
}

function rectangleClicked()
{
	setSelected(RECTANGLE);
}

function saveImage()
{
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
	var dataURL = canvas.toDataURL();
	alert("THIS IS THE ENCODED PNG: \n" + dataURL);
}

// Get the mouse coordinates with respect to the canvas
function updateMouseCoordinates(event) 
{ 
	var coordinates = document.getElementById("coords");
	var canvas = document.getElementById("drawingCanvas");
	
	// With respect to the canvas
	var x = event.pageX - canvas.offsetLeft; 
	var y = event.pageY - canvas.offsetTop;
	
	// Display for now
	coordinates.innerHTML = " (" + x + ", " + y + ")";
	
	return [x, y];
} 

function drawShape(event)
{
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
	
	var coordinates = updateMouseCoordinates(event);
	var x = coordinates[0];
	var y = coordinates[1];
	
	if (rectangleSelected){	
		// Rectangle logic here
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x, y + 50);
		context.lineTo(x + 50, y + 50);
		context.lineTo(x + 50, y);
		
	} else if (circleSelected){
		// Circle logic here
		context.beginPath();
		context.arc(x, y, 40, 0, 2*Math.PI);
		
	} else if (straightLineSelected){
		// Line logic here
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x+ 50, y + 50);
	} 
	context.closePath();
	context.strokeStyle = currentOutlineColor;
	context.stroke()
}

function undoLast(){
	return;
}

function setColor(color)
{
	currentOutlineColor = color;
	document.getElementById("curColor").innerHTML = "Color: " + color;
}
