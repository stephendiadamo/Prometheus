//Constants
var RECTANGLE = "rectangle";
var CIRCLE = "circle";
var LINE = "straightLine";
var CLEAR = "clear";
var SAVE = "save";

// Globals
var rectangleSelected = true;
var circleSelected = false;
var straightLineSelected = false;

var shapes = [];

var currentSelectedShape;
var currentSelectedOutlineColor = "#f00";
//var currentSelectedFillColor = "#000";
var currentlySelectedLineThickness = 1;
var currentSelectedShape = RECTANGLE;
var currentsetDraw = null;

// Do not OVERRIDE these variables!
var canvas;
var context;

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
function Shape(x, y, fillColor, lineColor, lineThickness){    
    // Won't need ID since the hittest returns the selected object
    //  this.id = 0; // Identifies current shape in array
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
    this.lineColor = lineColor;
    this.lineThickness = lineThickness;

    // These probably don't need to be stored
    // this.scaleX = 1;
    // this.scaleY = 1;
    
    // Rotate isn't a required feature, maybe leave that until later
    // this.rotate = 0.0;
    
}

Shape.prototype.selected = false;
Shape.prototype.setSelected = function(value) {this.selected = value;}
Shape.prototype.isSelected = function(){return this.selected;}
// TODO: Make getters and setters for the other properties

// Likely will not need this because of new constructors

// Shape.prototype.setAttributes = function(){
//     context.translate(this.x, this.y);
    
//     if (this.lineColor != null){
//         context.strokeStyle = this.lineColor;
//     }
    
//     if (this.fillStyle != null){
//         context.fillStyle = this.fillStyle;
//     }
// }

/*
 * Assume all shapes move Clockwise
 * Shapes are created by click and dragging.
 */


// Trying to keep objects minimal, keeping functions outside of the 
// constructors

function Line(pointStart, lineColor, lineThickness){
    Shape.call(this, pointStart[0], pointStart[1], null, lineColor, lineThickness);
    
    // Set these using getters and setters 
    this.x_end = 0;
    this.y_end = 0;
    
    // this.setDraw = function(secondPoint){
    //     x_end = secondPoint[0]
    //     y_end = secondPoint[1]
    // }
    // this.draw = function(){
    //     Shape.parent.prototype.setAttributes(this);
        
    //     context.beginPath();
    //     context.lineTo(x_end, y_end);
    //     context.closePath();
        
    //     context.stroke();
    // }
}

Line.prototype = new Shape();
Line.prototype.constructor = Line;
Line.prototype.setEndPoints = function (x_end, y_end){
    this.x_end = x_end;
    this.y_end = y_end;
}
Line.prototype.getEndPoints = function() {
    return [this.x_end, this.y_end];
}
Line.prototype.draw = function() {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.x_end, this.y + this.y_end);
    context.strokeStyle = this.lineColor;
    context.setTransform(1, 0, 0, 1, 0, 0);


    if (this.isSelected()) {
        context.lineWidth = this.lineThickness * 3;
    }
    else {
        context.lineWidth = this.lineThickness;
    }
    context.stroke();
    context.closePath();
}

Line.prototype.hitTest = function(testX,testY) {
    // Need to think of logic to implement this

    return false;
};


//Rectangle.prototype.constructor = Rectangle;
function Rectangle(pointStart, fillColor, lineColor, lineThickness) {
    Shape.call(this, pointStart[0], pointStart[1], fillColor, lineColor, lineThickness);
    this.length = 0;
    this.height = 0;
    
    // this.setDraw = function (secondPoint){
    //      this.length = secondPoint[0] - this.x;
    //      this.height = secondPoint[1] - this.y;
    // }

    // // Defines the unique Shape
    // this.draw = function(){
    //     Shape.prototype.setAttributes.call(this);
       
    //     context.rect(0,0, this.length, this.height); 
    //     context.stroke();
        
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    // }
}
Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.setLengthAndHeight = function (length, height){
    this.length = length;
    this.height = height;
}
Rectangle.prototype.getLengthAndHeight = function() {
    return [this.length, this.height];
}
Rectangle.prototype.draw = function() {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.fillStyle= this.fillColor;

    context.rect(this.x, this.y, this.length, this.height);

    context.strokeStyle = this.lineColor;
    context.setTransform(1, 0, 0, 1, 0, 0);


    if (this.isSelected()) {
        context.lineWidth = this.lineThickness * 3;
    }
    else {
        context.lineWidth = this.lineThickness;
    }
    context.fill();
    context.stroke();
}

Rectangle.prototype.hitTest = function(testX, testY) {
    if (this.x < testX && (this.x + this.length) > testX && this.y < testY && (this.y + this.height) > testY){
        return true;
    }
    return false;
};


function Circle(x, y, fillColor, lineColor, lineThickness, radius){
    Shape.call(this, x, y, fillColor, lineColor, lineThickness);
    this.radius = radius;
   
   /* var radius = pointStart - pointEnd; 
    
    this.setDraw = function(secondPoint){
        radius = pointStart - pointEnd;
    }
    this.draw = function(){
        Shape.parent.prototype.setAttributes(this);

        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.stroke();
    }*/
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
Circle.prototype.draw = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    context.fillStyle= this.fillColor;
    context.strokeStyle = this.lineColor;

    if (this.isSelected()) {
        context.lineWidth = this.lineThickness * 3;
    }
    else {
        context.lineWidth = this.lineThickness;
    }

    context.fill();
    context.stroke();
}
Circle.prototype.setRadius =  function(radius) {this.radius = radius;}
Circle.prototype.getRadius =  function() {return this.radius;}
Circle.prototype.hitTest = function(testX,testY) {
    var distanceFromCenter = Math.sqrt(Math.pow(this.x - testX, 2) + Math.pow(this.y - testY, 2));
    if (distanceFromCenter <= this.radius) {
        return true;
    }
    return false;
};

//Likely won't need this with hit test
function setSelected(shapeID){
    document.getElementById("curShape").innerHTML = "Shape : " + shapeID;
    currentSelectedShape = shapeID;
}

/*
 * Note: this should be binded to elements with Jquery, for now just use html
 */
function commandCanvas(command) {
    switch (command){
    case CLEAR:
        context.clearRect(0, 0, canvas.width, canvas.height);
        shapes = null;
        break;
    case SAVE:
        var dataURL = canvas.toDataURL();
        alert("THIS IS THE ENCODED PNG: \n" + dataURL);
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

    // Done backwards to selected the highest object (i.e. two objects overlapping)

    for (var i = shapes.length-1; i >= 0; i--) {
        var shape = shapes[i];

        if (shape.hitTest(x ,y)) {
            if (currentSelectedShape != null) {
                currentSelectedShape.selected = false;
            }
            shape.setSelected(true);
            currentSelectedShape = shape;
            renderShapes();
            return;
        }

    }
    // Display for now
    coordinates.innerHTML = " (" + x + ", " + y + ")";

    return [ x, y ];
}

function finishShape(event){
    //context.clearRect(0, 0, canvas.width, canvas.height);
    currentsetDraw = null;
}

// Fired off until click RELEASE event
function modifyShape(event){
    if (currentsetDraw != null){
        var coordinates = updateMouseCoordinates(event);
        shapes[currentsetDraw].setDraw(coordinates);
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
            drawShape = new Rectangle(coordinates, currentSelectedOutlineColor, "#000", 1);
            
            // Use the dragging functionality here to set the endpoints
            drawShape.setLengthAndHeight(45, 45);
            break;
        case CIRCLE:
            drawShape = new Circle(coordinates[0], coordinates[1], currentSelectedOutlineColor, "#000", 1, 40);
            break;
        case LINE:
            drawShape = new Line(coordinates,currentSelectedOutlineColor, 1);
            
            // Use the dragging functionality here to set the endpoints
            drawShape.setEndPoints(45, 45);
            break;
    }
    if (drawShape!= null){
        shapes.push(drawShape);
        //currentsetDraw = shapes.length-1;
    }
    renderShapes();
}

function renderShapes(){
    // First we need reset the page
    // Will always clear the right space
    context.translate(0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < shapes.length; i ++){
        shapes[i].draw();
    }
}

function setColor(color) {
    currentSelectedOutlineColor = color;
    document.getElementById("curColor").innerHTML = "Color: " + color;
}
