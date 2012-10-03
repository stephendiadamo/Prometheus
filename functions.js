//Constants
var RECTANGLE = "rectangle";
var CIRCLE = "circle";
var LINE = "line";

// Globals
var rectangleSelected = true;
var circleSelected = false;
var straightLineSelected = false;
var shapes = [];
var currentSelectedShape;
var currentOutlineColor = "#000";
var currentfillColor = "#000"

var currentSelectedShape = null;
var currentDraw = null;
var shapesTable = [];

// Do not OVERRIDE these variables!
var canvas;
var context;
// Objects

// Initialization 
$(document).ready(function() {
    // Set up variables neccessary for drawing
    canvas = document.getElementById("drawingCanvas");
    context = canvas.getContext('2d');
});

    /*
     * Points define the type of shape
     */
function DefaultProperty(){
    var x, y;
    
    this.points = []; // Can be clicked.
    this.arcs = [];
    
    this.fillColor = "#000"
    this.lineColor = "#000";
    this.lineThickness = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.Rotate = 0.0;
    
    this.translate(newX, newY){
        x = newX;
        y = newY;
    }
}

/*
 * Assume all shapes move Clockwise
 * Shapes are created by click and dragging.
 */
function Line(pointStart){
    DefaultProperty.call(this);
    this.x = pointStart[0];
    this.y = pointStart[1];
    
    var x_end = 0;
    var y_end = 0;
    
    this.setDraw = function(secondPoint){
        x_end = secondPoint[0]
        y_end = secondPoint[1]
    }
    this.draw = function(){
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.scale(this.scaleX,this.scaleY);
        
        context.strokeStyle = currentOutlineColor;
        context.fillStyle = outlineColor;
        
        context.lineTo(x_end, y_end);
        context.closePath();
    }
}

function Rectangle(pointStart) {
    DefaultProperty.call(this);
    DefaultProperty.x = pointStart[0];
    DefaultProperty.y = pointStart[1];

    DefaultPropery.fillColor = "#000"
    DefaultPropery.outlineColor = "#000";
    DefaultPropery.outlineThickness = 1;
    
    var length = 0;
    var height = 0;
    
    this.setDraw = function (secondPoint){
        length = x - secondPoint[0];
        height = y - secondPoint[1];
    }
    
    // Defines the unique Shape
    this.draw = function(){
        context.moveTo(this.x, this.y);
        context.scale(this.scaleX,this.scaleY);
        
        context.strokeStyle = currentOutlineColor;
        context.fillStyle = outlineColor;
        
        context.rect(0,0,length,height);
        
        //DefaultProperty.points[1] = [DefaultProperty.x + length, DefaultProperty.y];
        //DefaultProperty.points[2] = [DefaultProperty.x + length, DefaultProperty.y + height];
        //DefaultProperty.points[3] = [DefaultProperty.x, DefaultProperty.y + height];
    }
}

function Circle(pointStart){
    DefaultProperty.call(this);
    DefaultProperty.points = null;
    var radius = pointStart - pointEnd; // Radius
    
    this.setDraw = function(secondPoint){
        radius = pointStart - pointEnd;
    }
    this.draw = function(){
        context.moveTo(this.x, this.y);
        context.scale(this.scaleX,this.scaleY);
        
        context.strokeStyle = currentOutlineColor;
        context.fillStyle = outlineColor;
        
        context.arc(0, 0, radius, 0, 2 * Math.PI);
    }
}

function setSelected(event){
    document.getElementById("curShape").innerHTML = "Shape : " + shape;
    currentSelectedShape = shape;
}

/*
 * Note: this should be binded to elements with Jquery, for now just use html
 */
function commandCanvas(var command) {
    switch (command){
    case "clear":
        context.clearRect(0, 0, canvas.width, canvas.height);
        break;
    case "save":
        var dataURL = canvas.toDataURL();
        alert("THIS IS THE ENCODED PNG: \n" + dataURL);
        break;
    case "undo":
        break;
    }
}

// Get the mouse coordinates with respect to the canvas
function updateMouseCoordinates(event) {
    // Paranoid check
    if (event == null && canvas == null)
        return null;
    
    var coordinates = document.getElementById("coords");

    // With respect to the canvas
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    // Display for now
    coordinates.innerHTML = " (" + x + ", " + y + ")";

    return [ x, y ];
}

function finishShape(event){
    
}

// Fired off until click RELEASE event
function modifyShape(event){
    var coordinates = updateMouseCoordinates(event);
    
    renderShapes(drawShape);
}

// Fired off on first click HOLD event
function addShape(event){
    var coordinates = updateMouseCoordinates(event);
    
    // First we add the shape
    var drawShape = null;
    switch (currentSelectedShape){
        case RECTANGLE:
            drawShape = new Rectangle(coordinates);
            break;
        case CIRCLE:
            drawShape = new Circle(coordinates);
            break;
        case LINE:
            drawShape = new Line(coordinates);
            break;
    }
    if (drawShape!= null){
        shapesTable.push(drawShape);
        currentDraw = drawShape;
    }
    renderShapes(drawShape);
}

function renderShapes(shape){
    for (var i = 0; i < shapesTable.length; i ++){
        shapesTable[i].draw();
    }
}

function setColor(color) {
    currentOutlineColor = color;
    document.getElementById("curColor").innerHTML = "Color: " + color;
}
