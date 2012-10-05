
var rectanglePalletShowing = false;
var straightLinePalletShowing = false;
var circlePalletShowing = false;

$(document).ready(function() {
    $("#rectangle").click(function() {
    	if (!rectanglePalletShowing){
        	$("#rectanglePallet").html($("#colorPallet").html());
        	$("#rectanglePallet").slideDown(600);
        	rectanglePalletShowing = true;
        } else {
        	$("#rectanglePallet").slideUp(600, function() {
        		$("#rectanglePallet").html("");
        		$("#rectanglePallet").css("display", "none");
        	});
        	rectanglePalletShowing = false;
        }
    });

	$("#straightLine").click(function() {
    	if (!straightLinePalletShowing){
        	$("#straightLinePallet").html($("#colorPallet").html());
        	$("#straightLinePallet").slideDown(600);
        	straightLinePalletShowing = true;
        } else {
        	$("#straightLinePallet").slideUp(600, function() {
        		$("#straightLinePallet").html("");
        		$("#straightLinePallet").css("display", "none");
        	});
        	straightLinePalletShowing = false;
        }
    });

    $("#circle").click(function() {
    	if (!circlePalletShowing){
        	$("#circlePallet").html($("#colorPallet").html());
        	$("#circlePallet").slideDown(600);
        	circlePalletShowing = true;
        } else {
        	$("#circlePallet").slideUp(600, function() {
        		$("#circlePallet").html("");
        		$("#circlePallet").css("display", "none");
        	});
        	circlePalletShowing = false;
        }
    });
});
