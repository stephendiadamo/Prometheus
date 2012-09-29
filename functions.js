function clearCanvas()
{
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function circleSelected()
{
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');

	context.beginPath();
	context.arc(95, 50, 40, 0, 2*Math.PI);
	context.stroke();
}

function rectangleSelected()
{
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');

	context.beginPath();
	context.moveTo(10,10);
	context.lineTo(10, 100);
	context.lineTo(100, 100);
	context.lineTo(100, 10);

	context.closePath();
	context.stroke();
}

function straightLineSelected()
{
	alert("Straight line selected");
}

function saveImage(){
	var canvas = document.getElementById("drawingCanvas");
	var context = canvas.getContext('2d');
	var dataURL = canvas.toDataURL();
	alert("THIS IS THE ENCODED PNG: \n" + dataURL);
}