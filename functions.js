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
var currentSelectedOutlineColor = "#000";
var currentSelectedFillColor = "#000";

var currentSelectedShape = null;
var currentsetDraw = null;
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
    $('#drawingCanvas').mousedown( function(e) {
        addShape(e);
        console.log("mousedown");
      });
    
    $('#drawingCanvas').mouseup( function(e) {
        finishShape(e);
        console.log("mouseup");
      });
    
    // Need to add mouse movement event
    $("#drawingCanvas").mousemove( function (e){
        modifyShape(e);
    });
});

    /*
     * Points define the type of shape
     */
function BaseShape(identifier){
    this.id = identifier; // Identifies current shape in array
    this.x = 0;
    this.y = 0;
    this.fillColor = "#001";
    this.lineColor = "#001";
    this.lineThickness = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.Rotate = 0.0;
}

BaseShape.prototype.setAttributes = function(){
    context.translate(this.x, this.y);
    context.scale(this.scaleX,this.scaleY);
    
    if (this.lineColor != null){
        context.strokeStyle = this.lineColor;
    }
    
    if (this.fillStyle != null){
        context.fillStyle = this.fillStyle;
    }
}

/*
 * Assume all shapes move Clockwise
 * Shapes are created by click and dragging.
 */
Line.prototype = new BaseShape();
//Line.prototype.constructor = Line;
function Line(pointStart, identifier){
    BaseShape.call(this);
    this.x = pointStart[0];
    this.y = pointStart[1];
    this.id = identifier;
    
    var x_end = 0;
    var y_end = 0;
    
    this.setDraw = function(secondPoint){
        x_end = secondPoint[0]
        y_end = secondPoint[1]
    }
    this.draw = function(){
        BaseShape.parent.prototype.setAttributes(this);
        
        context.beginPath();
        context.lineTo(x_end, y_end);
        context.closePath();
        
        context.stroke();
    }
}

Rectangle.prototype = new BaseShape();
//Rectangle.prototype.constructor = Rectangle;
function Rectangle(pointStart) {
    BaseShape.call(this);
    this.x = pointStart[0];
    this.y = pointStart[1];

    this.fillColor = "#000";
    this.outlineColor = "#000";
    this.outlineThickness = 1;
    
    this.length = 0;
    this.height = 0;
    
    this.setDraw = function (secondPoint){
        this.length = secondPoint[0] - this.x;
        this.height = secondPoint[1] - this.y;
    }

    // Defines the unique Shape
    this.draw = function(){
        BaseShape.prototype.setAttributes.call(this);
       
        context.rect(0,0, this.length, this.height); 
        context.stroke();
        
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

Circle.prototype = new BaseShape();

//Circle.prototype.constructor = Circle;
function Circle(pointStart){
    BaseShape.call(this);
   /* var radius = pointStart - pointEnd; 
    
    this.setDraw = function(secondPoint){
        radius = pointStart - pointEnd;
    }
    this.draw = function(){
        BaseShape.parent.prototype.setAttributes(this);

        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.stroke();
    }*/
}

function setSelected(shapeID){
    document.getElementById("curShape").innerHTML = "Shape : " + shapeID;
    currentSelectedShape = shapeID;
}

/*
 * Note: this should be binded to elements with Jquery, for now just use html
 */
function commandCanvas(command) {
    switch (command){
    case "clear":
        context.clearRect(0, 0, canvas.width, canvas.height);
        shapesTable = null;
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
    context.clearRect(0, 0, canvas.width, canvas.height);

    currentsetDraw = null;
}

// Fired off until click RELEASE event
function modifyShape(event){
    if (currentsetDraw != null){
        var coordinates = updateMouseCoordinates(event);
        shapesTable[currentsetDraw].setDraw(coordinates);
        renderShapes();
    }
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
        currentsetDraw = shapesTable.length-1;
    }
    renderShapes();
}

function renderShapes(){
    // First we need reset the page
    // Will always clear the right space
    context.translate(0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < shapesTable.length; i ++){
        context.clearRect(0, 0, canvas.width, canvas.height);

        shapesTable[0].draw();
        break;
    }

}

function setColor(color) {
    currentSelectedOutlineColor = color;
    document.getElementById("curColor").innerHTML = "Color: " + color;
}
