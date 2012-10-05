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

// Toolset option variables
var currentSelectedOutlineColor = "#f00";
//var currentSelectedFillColor = "#000";
var currentlySelectedLineThickness = 1;
var currentSelectedTool = null;
var currentSelectedShape = null;
var currentsetDraw = null;

// Do not OVERRIDE these variables!
var canvas;
var context;

// Initialization 
$(document).ready(function() {
    // Set up variables necessary for drawing
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
        modifyShapes(e);
    });
});

/*
 * Basic shape variables
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
Shape.prototype.getBaseCoordinates = function(){return [this.x, this.y];}
Shape.prototype.setBaseCoordinates = function(x,y){this.x = x; this.y = y;}
// TODO: Make getters and setters for the other properties + grab a milkshake later on from Mcdonalds

// Trying to keep objects minimal, keeping functions outside of the 
// constructors

function Line(pointStart, lineColor, lineThickness){
    Shape.call(this, pointStart[0], pointStart[1], null, lineColor, lineThickness);
    
    // Set these using getters and setters 
    this.x_end = 0;
    this.y_end = 0;
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
    context.setTransform(1, 0, 0, 1, 0, 0);
    //context.moveTo(this.x, this.y);
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x_end, this.y_end);
    context.strokeStyle = this.lineColor;

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
    context.fillStyle= this.fillColor;
    
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(this.x, this.y);
    context.rect(0, 0, this.length, this.height);

    context.strokeStyle = this.lineColor;
    


    if (this.isSelected()) {
        context.lineWidth = this.lineThickness * 3;
    }
    else {
        context.lineWidth = this.lineThickness;
    }
    context.fill();
    context.stroke();
    context.closePath();
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
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
Circle.prototype.draw = function() {
    context.beginPath();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(this.x, this.y);
    
    context.arc(0, 0, this.radius, 0, Math.PI*2);
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
    context.closePath();
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

/**
 * Set selected used to enable or disable current drawing shape
 * Note: This is needed to differentiate drawing mode and selecting mode (both use click events)
 * Thus, select toggles drawing mode on / off (null), where we can select objects then.
 * select a
 * @param shapeID
 */
function setSelected(shapeID){
    if (currentSelectedTool == shapeID)
        currentSelectedTool = null;
    else
        currentSelectedTool = shapeID;
    document.getElementById("curShape").innerHTML = "Shape : " + currentSelectedTool;
}

/*
 * Note: this should be binded to elements with Jquery, for now just use html
 */
function commandCanvas(command) {
    switch (command){
    case CLEAR:
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        // Will always clear the right space
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();        shapes = null;
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
    // Lets not do his test here as this function is mainly use to grab the
    // mouse coordinates (do hit test on mouse down events and when not drawing anything)
    //for (var i = shapes.length-1; i >= 0; i--) {
      //  var shape = shapes[i];

        //if (shape.hitTest(x ,y)) {
          //  if (currentSelectedShape != null) {
            //    currentSelectedShape.selected = false;
            //}
            //shape.setSelected(true);
            //currentSelectedShape = shape;
            //renderShapes();
            //return;
        //}

    //}
    // Display for now
    coordinates.innerHTML = " (" + x + ", " + y + ")";

    return [ x, y ];
}

function finishShape(event){
    //context.clearRect(0, 0, canvas.width, canvas.height);
    currentsetDraw = null;
}

/**
 * Modify shapes required to be separate from add shapes function
 * to handle the mouse events independently (moving after clicking)
 * This resizes the current drawing shape.
 * - Modify the attributes of the shape and then redraw them 
 * - More comments to be added
 */
function modifyShapes(event){
    // Need to have a selected shape 
    if (currentsetDraw != null){
        // Use the dragging functionality here to set the endpoints
        var coordinates = updateMouseCoordinates(event);
        var shapePosition = currentsetDraw.getBaseCoordinates();
        switch (currentSelectedTool){
        case RECTANGLE:
            currentsetDraw.setLengthAndHeight(coordinates[0] - shapePosition[0], coordinates[1] - shapePosition[1]);
            break;
        case CIRCLE:
            var radius = helperDistance(coordinates, shapePosition);
            currentsetDraw.setRadius(radius);
            break;
        case LINE:
            currentsetDraw.setEndPoints(coordinates[0], coordinates[1]);
            break;
        }
        renderShapes();
    }
}

/*
 * Fired function on click events
 * If there is no currently selected shape (not drawing), we 
 * are then trying to select shapes - do hit test.
 */
function addShape(event){
    var coordinates = updateMouseCoordinates(event);
    // First we add the shape
    var drawShape = null;
    
    if (currentSelectedTool == null){
        hitTest(coordinates);
    }
    else{
        switch (currentSelectedTool){
            case RECTANGLE:
                drawShape = new Rectangle(coordinates, currentSelectedOutlineColor, "#000", 1);
                break;
            case CIRCLE:
                drawShape = new Circle(coordinates[0], coordinates[1], currentSelectedOutlineColor, "#000", 1, 0);
                break;
            case LINE:
                drawShape = new Line(coordinates,currentSelectedOutlineColor, 1);
                break;
        }
        if (drawShape!= null){
            shapes.push(drawShape);
            currentsetDraw = drawShape;
        }
    }
    renderShapes();
}

function hitTest(coordinates) {
    // Reset the current selected shape
    currentSelectedShape = null;
    
    // Search for shapes
    for ( var i = shapes.length - 1; i >= 0; i--) {
        var shape = shapes[i];
        
        if (shape.hitTest(coordinates[0], coordinates[1])) {
            shape.setSelected(true);
            currentSelectedShape = shape;
            // return;  // Need to de selected unfocus shapes shapes
            } else{
                shape.setSelected(false);
            }
    }
    
    renderShapes();
}

function renderShapes(){
    // First we need reset the page
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    // Will always clear the right space
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    for (var i = 0; i < shapes.length; i ++){
        shapes[i].draw();
    }
}

function setColor(color) {
    currentSelectedOutlineColor = color;
    document.getElementById("curColor").innerHTML = "Color: " + color;
}

/**
 * Helper distance between two points
 * @param point1 - first point
 * @param point2 - 2nd point.. duh hahahah
 * @returns the distance between two points
 */
function helperDistance(point1, point2) {
    var x = 0;
    var y = 0;
    
    x = point2[0] - point1[0];
    x = x * x;
    
    y = point2[1] - point1[1];
    y = y * y;
    
    return Math.sqrt(x + y);
}
