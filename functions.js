//Constants
var RECTANGLE = "rectangle";
var CIRCLE = "circle";
var LINE = "straightLine";
var CLEAR = "clear";
var SAVE = "save";
var FILLCOLOR = "fillColor";
var LINECOLOR = "lineColor";
var DELETE = "delete";
var COPY_PASTE = "copy_paste";

// Globals
var rectangleSelected = true;
var circleSelected = false;
var straightLineSelected = false;
var fillColorSelected = true;
var lineColorSelected = false;

var shapes = [];

// Toolset option variables
var currentSelectedOutlineColor = "#000";
var currentSelectedFillColor = "#000";
var currentlySelectedLineThickness = 1;
var currentSelectedTool = null;
var currentSelectedShape = null;
var currentsetDraw = null;
var currentSelectedHandle = false;
var currentCopiedShape = null;

// Selection variables 
var mainSelectionHandles = [];
var mainSelectedHandle = -1;
var mySelBoxSize = 10;
var mouseDowncoord; // For calculating offsets
var mouseDown = false; // Used for mouseMove events

// Do not OVERRIDE these variables!
var canvas;
var context;

// Initialization 
$(document).ready(function () {
	// Set up variables necessary for drawing
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext('2d');	

	$('#drawingCanvas').mousedown(function (e) {
		mouseDown = true;
		addShape(e);
	});

	$('#drawingCanvas').mouseup(function (e) {
		mouseDown = false;
		finishShape(e);
	});

	// Need to add mouse movement event
	$("#drawingCanvas").mousemove(function (e) {
		if (mouseDown) {
			modifyShapes(e);
		}
	});

	// Set up selection variables
	for (var i = 0; i < 8; i++) {
		var rect = new Rectangle([0, 0], "#000", "#000", 0);
		mainSelectionHandles.push(rect);
	}
});


/*
 * Basic shape variables
 */
function Shape(x, y, fillColor, lineColor, lineThickness) {
	// Won't need ID since the hittest returns the selected object
	//  this.id = 0; // Identifies current shape in array
	this.baseX = x;
	this.baseY = y;
	this.fillColor = fillColor;
	this.lineColor = lineColor;
	this.lineThickness = lineThickness;

	// Need this to determine size of selection Handles per object
	// Also can be used for scaling the object (different from resizing)
	// This is set to the same value as baseX and baseY as mouse has
	// not moved to give object size
	this.endX = x;
	this.endY = y;

	// Rotate isn't a required feature, maybe leave that until later
	// this.rotate = 0.0;

}
Shape.prototype.setFillColor = function (newColor){
    this.fillColor = newColor;
}

Shape.prototype.setLineColor = function (newLineColor){
    this.lineColor = newLineColor;
}

Shape.prototype.setLineThickness = function (newLineThickness){
    this.lineThickness = newLineThickness;
}

Shape.prototype.setDimension = function (dimX, dimY) {
	this.endX = dimX;
	this.endY = dimY;
}
Shape.prototype.getDimension = function () {
	return [this.endX, this.endY];
}

Shape.prototype.selected = false;
Shape.prototype.setSelected = function (value) {
	this.selected = value;
}
Shape.prototype.isSelected = function () {
	return this.selected;
}
Shape.prototype.getBaseCoordinates = function () {
	return [this.baseX, this.baseY];
}
Shape.prototype.setBaseCoordinates = function (x, y) {
	this.baseX = x;
	this.baseY = y;
}
// TODO: Make getters and setters for the other properties + grab a milkshake later on from Mcdonalds

// Trying to keep objects minimal, keeping functions outside of the 
// constructors

function Line(pointStart, lineColor, lineThickness) {
	// Initialize a line with no length first
    if (pointStart != null){
	    Shape.call(this, pointStart[0], pointStart[1], null, lineColor, lineThickness);
    } else {
        Shape.call(this, null, null, null, lineColor, lineThickness);
    }
	// Set these using getters and setters 
	//this.x_end = 0;
	//this.y_end = 0;
}

Line.prototype = new Shape();
Line.prototype.constructor = Line;

/*Line.prototype.setEndPoints = function (x_end, y_end){
    this.x_end = x_end;
    this.y_end = y_end;
}
Line.prototype.getEndPoints = function() {
    return [this.x_end, this.y_end];
}*/
Line.prototype.draw = function () {
	context.setTransform(1, 0, 0, 1, 0, 0);
	//context.moveTo(this.x, this.y);
	context.beginPath();
	context.moveTo(this.baseX, this.baseY);
	context.lineTo(this.endX, this.endY);
	context.strokeStyle = this.lineColor;
	context.lineWidth = this.lineThickness;
	context.stroke();
	context.closePath();
}

Line.prototype.hitTest = function (testX, testY) {
	// Need to think of logic to implement this
    
    console.log("TEST finding" + testX + " | " +  testY);
    var lineThickness = this.lineThickness + 10;

    // Utillize Y = mx + b
    // Say Y1 and X1 is the base
    // Say Y2 and X2 is the end point
    x1 = this.baseX;
    y1 = this.baseY;
    x2 = this.endX;
    y2 = this.endY;
    
    // If completely vertical
    if ((x2 - x1) == 0){
        if (testY > y1 + lineThickness && testY < y2 + lineThickness && testX > x1 - lineThickness && testX < x1 + lineThickness){
            return true;
        }
        return false;
    }
       
    
    
    // If completely horizontal
    if (y2 - y1 == 0){
        if (testX > x1 + lineThickness && testX < x2 + lineThickness && testY > y1 - lineThickness && testY < y1 + lineThickness){
            return true;
        }
        return false;
    }
    
    // If completely vertical y2 - y1 will be 0 
    
    var m = (y2 - y1) / (x2 - x1);

    
    var b = y2 - (x2*m);
    
    var height = Math.abs(y2 - y1);
    var wideth = Math.abs(x2 - x1);
    var errorRate = 4;

    /*
     * Algorithm for finding lines.
     * Knowing the current x and Y mouse click value, we use the mouseY and substitute
     * it into the line equation for the current focus line we are checking on.
     * We check for a range of Numbers around our MouseY
     * [ mouseY - range << currentY << mouseY + range ]
     * 
     * We then iterate this range over the current line function to get line_X
     * As such: mouseY = line_X*m + b;
     * Therefore isolating line_X gives: line_X = (mouseY -b )/m
     * 
     * Then if the point line_X is outside the start_X and end_X of the given line
     * - No hit.
     * 
     * If the point is on the given line, check if that line_X on the line is close
     * to our testX, within a accuracy of lineThickness, and if so
     * - Hit.
     * 
     */
    var hitTest = false;
    for (currentY = testY - errorRate ; currentY < testY + errorRate ; currentY ++){
        currentX = (currentY-b)/m;
        
        if (testX > (currentX - lineThickness) && testX < (currentX + lineThickness) &&
                ((testX > (x1  - lineThickness) && testX < (x2 + lineThickness) ) || 
                 (testX > (x2 - lineThickness) && testX < ( x1 + lineThickness) ) )
                 ){
            return true;
        }
    }
    
    

        
	return false;
};

function Rectangle(pointStart, fillColor, lineColor, lineThickness) {
    if (pointStart != null){
    	Shape.call(this, pointStart[0], pointStart[1], fillColor, lineColor, lineThickness);
    } else {
        Shape.call(this, null, null, fillColor, lineColor, lineThickness);
    }
	//this.length = 0;
	//this.height = 0;
}
Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;
/*
Rectangle.prototype.setLengthAndHeight = function (length, height){
    this.length = length;
    this.height = height;
}
Rectangle.prototype.getLengthAndHeight = function() {
    return [this.length, this.height];
}*/

Rectangle.prototype.draw = function () {
	context.beginPath();
	context.fillStyle = this.fillColor;

	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(this.baseX, this.baseY);
	context.rect(0, 0, this.endX - this.baseX, this.endY - this.baseY);

	context.strokeStyle = this.lineColor;
	context.lineWidth = this.lineThickness;

	context.fill();
	if (this.lineThickness > 0) {
		context.stroke();
	}
	context.closePath();
}

Rectangle.prototype.hitTest = function (currentX, currentY) {
	var baseX = this.baseX;
	var baseY = this.baseY;
	var endX = this.endX;
	var endY = this.endY;

	// Check shapes that are created in UP Left motion
	if (currentX <= baseX && currentX >= endX && currentY <= baseY && currentY >= endY) {
		return true;
	}
	// Check shapes that are created in Down right motion
	else if (currentX >= baseX && currentX <= endX && currentY >= baseY && currentY <= endY) {
		return true;
	}

	// Check shapes created in TOP right motion
	else if (currentX >= baseX && currentX <= endX && currentY <= baseY && currentY >= endY) {
		return true;
	}
	// Check shapres created in DOWN left motion
	else if (currentX <= baseX && currentX >= endX && currentY >= baseY && currentY <= endY) {
		return true;
	}

	return false;
};


function Circle(x, y, fillColor, lineColor, lineThickness, myRadius) {
	Shape.call(this, x, y, fillColor, lineColor, lineThickness);
	var radius = myRadius;
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
Circle.prototype.draw = function () {
	context.beginPath();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(this.baseX, this.baseY);

	this.radius = Math.sqrt(Math.pow(this.endX - this.baseX, 2) + Math.pow(this.endY - this.baseY, 2));

	context.arc(0, 0, this.radius, 0, Math.PI * 2);
	context.fillStyle = this.fillColor;
	context.strokeStyle = this.lineColor;
	context.lineWidth = this.lineThickness;
	context.fill();
	context.stroke();
	context.closePath();
}
Circle.prototype.setRadius = function (radius) {
	this.radius = radius;
}
Circle.prototype.getRadius = function () {
	return this.radius;
}
Circle.prototype.hitTest = function (testX, testY) {
	var distanceFromCenter = Math.sqrt(Math.pow(this.baseX - testX, 2) + Math.pow(this.baseY - testY, 2));
	if (distanceFromCenter <= this.radius) {
		return true;
	}
	return false;
};

// Override resizing functino with selection handles as the
// base_x and base_y are differe
Circle.prototype.selectionHandlerResize = function (mouseCoord) {
    // If there is no current selection handles
    if (mainSelectionHandles == null){
        return;
    }
    /* Selection Rectangle is as follows:
        *  0 1 2 
        *  3   4
        *  5 6 7 
    */
    var currentDim = currentSelectedShape.getDimension();
    var currentRad = currentSelectedShape.getRadius();
    switch (mainSelectedHandle) {
    case 0:
        currentSelectedShape.setDimension(mouseCoord[0] + currentRad, mouseCoord[1]);
        break;
    case 1:
        currentSelectedShape.setDimension(mouseCoord[0], mouseCoord[1]);
        break;
    case 2:
        currentSelectedShape.setDimension(mouseCoord[0] - currentRad, mouseCoord[1]);

        break;
    case 3:
        currentSelectedShape.setDimension(mouseCoord[0], mouseCoord[1]);
        break;
    case 4:
        currentSelectedShape.setDimension(mouseCoord[0], mouseCoord[1]);
        break;
    case 5:
        currentSelectedShape.setDimension(mouseCoord[0] + currentRad, mouseCoord[1]);

        break;
    case 6:
        currentSelectedShape.setDimension(mouseCoord[0], mouseCoord[1]);
        break;
    case 7:
        currentSelectedShape.setDimension(mouseCoord[0] - currentRad, mouseCoord[1]);

        break;
    }

}
/**
 * Set selected used to enable or disable current drawing shape
 * Note: This is needed to differentiate drawing mode and selecting mode (both use click events)
 * Thus, select toggles drawing mode on / off (null), where we can select objects then.
 * select a
 * @param shapeID
 */
function setSelectedTool(shapeID) {
	if (currentSelectedTool == shapeID) {
	    currentSelectedTool = null;
        hidePallets(true, true, true);
    }
	else {
	    // Immediately deselect currently selected shape
	    // Go into drawing mode
	    if (currentSelectedShape != null){
	        currentSelectedShape.setSelected(false);
	    }
	    currentSelectedShape = null;
	    currentSelectedHandle = false;
	    currentSelectedTool = shapeID;
        // Expand pallets used to modify current selected shape
        var toShow = [ (shapeID == RECTANGLE),
                (shapeID == CIRCLE), (shapeID == LINE) ];
        
        showPallets(toShow[0], toShow[1], toShow[2]);
        $("#fillColorSelector").css("font-weight", "900");
	}
	renderShapes();
	document.getElementById("curShape").innerHTML = "Shape : " + currentSelectedTool;
}

/*
 * Note: this should be binded to elements with Jquery, for now just use html
 */
function commandCanvas(command) {
	switch (command) {
	case CLEAR:
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		// Will always clear the right space
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.restore();

		setSelectedTool(null);
		currentSelectedShape = null;

		shapes = []; // er...
		renderShapes();
		break;
	case SAVE:
		var dataURL = canvas.toDataURL();
		alert("THIS IS THE ENCODED PNG: \n" + dataURL);
		break;
	case COPY_PASTE:
		var copyPasteButton = document.getElementById(COPY_PASTE);
        if (currentSelectedShape != null || currentCopiedShape != null) {
			if (copyPasteButton.innerHTML == "Copy") {
				copyPasteButton.innerHTML = "Paste";
				currentCopiedShape = copyShape(currentSelectedShape);
			} else if (copyPasteButton.innerHTML == "Paste") {
				copyPasteButton.innerHTML = "Copy";
				currentCopiedShape = null;
			}
		}
		break;
	case DELETE:
		removeShapeFromArray(currentSelectedShape);
		renderShapes();
		break;
	}
}

function copyShape(shape){
    var newShape;
    if (shape instanceof Circle) {
        newShape = new Circle;
        newShape.radius = shape.radius;
    } else if (shape instanceof Rectangle) {
        newShape = new Rectangle;
    } else if (shape instanceof Line) {
        newShape = new Line;
    }         

    newShape.fillColor = shape.fillColor;
    newShape.lineColor = shape.lineColor;
    newShape.lineThickness = shape.lineThickness;
    newShape.endX = shape.endX;
    newShape.endY = shape.endY;
    newShape.baseX = shape.baseX;
    newShape.baseY = shape.baseY;
    return newShape;
}

// Get the mouse coordinates with respect to the canvas
function updateMouseCoordinates(event) {
	// Paranoid check
	if (event == null && canvas == null) return null;

	var coordinates = document.getElementById("coords");

	// With respect to the canvas
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;

	// Display for now
	coordinates.innerHTML = " (" + x + ", " + y + ")";

	return [x, y];
}

function finishShape(event) {
	//context.clearRect(0, 0, canvas.width, canvas.height);
	currentsetDraw = null;
	currentSelectedHandle = false;
}

/**
 * Modify shapes required to be separate from add shapes function
 * to handle the mouse events independently (moving after clicking)
 * This resizes the current drawing shape.
 * - Modify the attributes of the shape and then redraw them 
 * - More comments to be added
 */
function modifyShapes(event) {

	// If we are currently moving the mouse to draw the shape:
	if (currentsetDraw != null) {
		var coordinates = updateMouseCoordinates(event);
		// Use the dragging functionality here to set the endpoints
		var shapePosition = currentsetDraw.getBaseCoordinates();
		currentsetDraw.endX = coordinates[0];
		currentsetDraw.endY = coordinates[1];
		renderShapes();
	}
	// If we are trying to move a select Handle
	else if (currentSelectedHandle) {
		var coordinates = updateMouseCoordinates(event);
		// Use the dragging functionality here to set the endpoints
		currentSelectedShape.selectionHandlerResize(coordinates);
		renderShapes();

	}
	// If we are trying to move the object without the select handle
	// Usually for translation
	// Or if we modifying an exsiting shape
	else if (currentSelectedShape != null) {
		var coordinates = updateMouseCoordinates(event);
		var baseCoordinates = currentSelectedShape.getBaseCoordinates();
		var dimentions = currentSelectedShape.getDimension();
		var savedDimensions = [dimentions[0] - baseCoordinates[0], dimentions[1] - baseCoordinates[1]]
		currentSelectedShape.setBaseCoordinates(coordinates[0] - mouseOffset[0], coordinates[1] - mouseOffset[1]);
		currentSelectedShape.setDimension(coordinates[0] - mouseOffset[0] + savedDimensions[0], coordinates[1] - mouseOffset[1] + savedDimensions[1]);

		renderShapes();
	}
}

/*
 * Fired function on click events
 * If there is no currently selected shape (not drawing), we 
 * are then trying to select shapes - do hit test.
 */
function addShape(event) {
	var coordinates = updateMouseCoordinates(event);
	// First we add the shape
	var drawShape = null;

	// Pasting
    if (currentSelectedTool == null && currentCopiedShape != null) {
        var toPaste = copyShape(currentCopiedShape); 
        var relativeLength_x = currentCopiedShape.endX - currentCopiedShape.baseX;
        var relativeLength_y = currentCopiedShape.endY - currentCopiedShape.baseY;
        toPaste.baseX = coordinates[0];
        toPaste.baseY = coordinates[1];
        toPaste.endX = coordinates[0] + relativeLength_x;
        toPaste.endY = coordinates[1] + relativeLength_y;

       shapes.push(toPaste);
       renderShapes();

    // HitTestwill Render itself 
    } else if (currentSelectedTool == null) {
		hitTest(coordinates);
	} else {
		switch (currentSelectedTool) {
		case RECTANGLE:
			drawShape = new Rectangle(coordinates, currentSelectedFillColor, currentSelectedOutlineColor, currentlySelectedLineThickness);
			break;
		case CIRCLE:
			drawShape = new Circle(coordinates[0], coordinates[1], currentSelectedFillColor, currentSelectedOutlineColor, currentlySelectedLineThickness, 0);
			break;
		case LINE:
			drawShape = new Line(coordinates, currentSelectedOutlineColor, currentlySelectedLineThickness);
			break;
		}
		if (drawShape != null) {
			shapes.push(drawShape);
			currentsetDraw = drawShape;
		}
	}
	renderShapes();
}

function hitTest(coordinates) {
    // Reset the current selected shape
    var selectedHighest = false;
    // var selectedHandles = false;
    
    // We have selected an object, increase outline of shape to
    // simulate focus, and turn selectionHandle on for the current shape.
    if (currentSelectedShape != null) {
        for ( var i = 0; i < mainSelectionHandles.length; i++) {
            if (mainSelectionHandles[i].hitTest(coordinates[0], coordinates[1])) {
                mainSelectedHandle = i;
                currentSelectedHandle = true;
                // selectedHandles = true;
                return;
            }
        }
        
        // If we failed to select the selected Handles
    }
    
    // Have not yet selected shape, perform hit test on all shapes
    for ( var i = shapes.length - 1; i >= 0; i--) {
        var shape = shapes[i];
        
        if (shape.hitTest(coordinates[0], coordinates[1]) && !selectedHighest) {
            // Flag to be highlighted
            shape.setSelected(true);
            
            // Set the current shape global var
            currentSelectedShape = shape;
            bringToFront(currentSelectedShape);
            
            // Expand pallets used to modify current selected shape
            var toShow = [ (shape instanceof Rectangle),
                    (shape instanceof Circle), (shape instanceof Line) ];
            
            showPallets(toShow[0], toShow[1], toShow[2]);
            
            // We have already selected the highest shape therefore
            // do not hit test on shapes beneath this
            selectedHighest = true;
            var shapeCoord = currentSelectedShape.getBaseCoordinates();
            
            // Mouse Offset for drag and drop
            mouseOffset = [ coordinates[0] - shapeCoord[0], coordinates[1] - shapeCoord[1] ];
            
        } else {
            shapes[i].setSelected(false);
        }
    }
    
    // If hit detection has not selected anything
    // close all pallets, set currentselectedshape to null
    if (!selectedHighest) {
        hidePallets(true, true, true);
        currentSelectedShape = null;
    }
}

function renderShapes() {
	// First we need reset the page
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	// Will always clear the right space
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();

	for (var i = 0; i < shapes.length; i++) {
		shapes[i].draw();
		shapes[i].selectionHandlerRender(shapes[i]);
	}
}

/**
 * Surround current shape with selectionHandler Square Nodes
 * 
 * @param shape
 */
Shape.prototype.selectionHandlerRender = function(shape) {
    // If currently there isn't any instantiate selection handles
    if (mainSelectionHandles == null)
        return;
    
    if (shape.isSelected()) {
        // After main shapes are rendered
        // We now draw the selection box on top of the shape
        var rad = 0; // HTML5 Circle's 0,0 system is different from rect.
        var radHacks = 1;
        
        var x_length = shape.endX - shape.baseX;
        var y_length = shape.endY - shape.baseY;
        if (shape.radius) {
            rad = shape.radius;
            radHacks = 0.5;
            x_length = rad;
            y_length = rad;
        }
        var iHandle = 0;
        for ( var h = 0; h < 3; h++) {
            for ( var w = 0; w < 3; w++) {
                // Not drawing middle selection handle
                if (!(w == 1 && h == 1)) {
                    var block_x = shape.baseX + (w * x_length / (2 * radHacks))- rad;
                    var block_y = shape.baseY + (h * y_length / (2 * radHacks))- rad;
                    
                    /*
                     * mainSelectionHandles[iHandle].setBaseCoordinates(shape.x
                     * + (w * x_length / (2* radHacks)) - rad, shape.y 
                     * + (h * y_length / (2* radHacks)) - rad);
                     */
                    mainSelectionHandles[iHandle].setBaseCoordinates(block_x,
                            block_y);
                    mainSelectionHandles[iHandle].setDimension(block_x
                            + mySelBoxSize, block_y + mySelBoxSize);
                    
                    mainSelectionHandles[iHandle].draw();
                    iHandle++;
                }
            }
        }
    }
}

/*
 * Selection Rectangle is as follows:
 *  0 1 2 
 *  3   4
 *  5 6 7 
 *  
 *  Each number is represented by a Rectangle Object.
 *  When the user selects that object, the current
 *  selected shape of which the Selection Rectangle targets
 *  will be resized accordingly.
 *  
 *  0 - Modify BaseX and baseY
 *  1 - Modify BaseY
 *  2 - Modify dimensionX and BaseY
 *  3 - Modify BaseX
 *  4 - Modify dimensionX
 *  5 - Modify BaseX and dimensionY
 *  6 - Modify dimensionY
 *  7 - Modify dimensionX and dimensionY
 */
Shape.prototype.selectionHandlerResize = function (mouseCoord) {
    // If there is no current selection handles
    if (mainSelectionHandles == null){
        return;
    }
	var currentDimensions = currentSelectedShape.getDimension();
	var shapeBaseCoord = currentSelectedShape.getBaseCoordinates();
	
	// If we are a circle then we just need to resize the Radius
	// The base coordinate does not move. 
	
	switch (mainSelectedHandle) {
	case 0:
		currentSelectedShape.setBaseCoordinates(mouseCoord[0], mouseCoord[1]);
		break;
	case 1:
		currentSelectedShape.setBaseCoordinates(shapeBaseCoord[0], mouseCoord[1]);
		break;
	case 2:
		currentSelectedShape.setBaseCoordinates(shapeBaseCoord[0], mouseCoord[1]);
		currentSelectedShape.setDimension(mouseCoord[0], currentDimensions[1]);
		break;
	case 3:
		currentSelectedShape.setBaseCoordinates(mouseCoord[0], shapeBaseCoord[1]);
		break;
	case 4:
		currentSelectedShape.setDimension(mouseCoord[0], currentDimensions[1]);
		break;
	case 5:
		currentSelectedShape.setBaseCoordinates(mouseCoord[0], shapeBaseCoord[1]);
		currentSelectedShape.setDimension(currentDimensions[0], mouseCoord[1]);
		break;
	case 6:
		currentSelectedShape.setDimension(currentDimensions[0], mouseCoord[1]);
		break;
	case 7:
		currentSelectedShape.setDimension(mouseCoord[0], mouseCoord[1]);

		break;
	}
}

function bringToFront(shape){
	removeShapeFromArray(shape);
	shapes.push(shape);
}


function removeShapeFromArray(shape) {
	if (shape != null) {
		// Done in reverse because it is more likely that the shape will be stacked on another.
		// (i.e. more effiecient) 
		for (var i = shapes.length - 1; i >= 0; i--) {
			if (shape === shapes[i]) {
				shapes.splice(i, 1);
				break;
			}
		}
	}
}

function setColor(color) {
    if (fillColorSelected) {
        currentSelectedFillColor = color;
        document.getElementById("curColor").innerHTML = "Color: " + color;
    } else if (lineColorSelected) {
        currentSelectedOutlineColor = color;
    }
    
    // If user selects the shape and then would
    // like to change the color of a current shape
    // Then force a render with upated color
    if (currentSelectedShape != null){
        if (fillColorSelected){
            currentSelectedShape.setFillColor(color);
        }
        else if (lineColorSelected){
            currentSelectedShape.setLineColor(color);
        }
        renderShapes();
    }
}

function setLineThickeness(thickness) {
	currentlySelectedLineThickness = thickness;
	document.getElementById("thickDisp").innerHTML = "Thickness: " + thickness;
    // If user selects the shape and then would
    // like to change the color of a current shape
    if (currentSelectedShape != null){
        currentSelectedShape.setLineThickness(thickness);
        renderShapes();
    }
}

function setColorSelector(type) {
	if (type == FILLCOLOR) {
		fillColorSelected = true;
		lineColorSelected = false;
		$("#lineColorSelector").css("font-weight", "normal");

	} else if (type == LINECOLOR) {
		fillColorSelected = false;
		lineColorSelected = true;
		$("#fillColorSelector").css("font-weight", "normal");
		$("#lineColorSelector").css("font-weight", "900");
	}
}
