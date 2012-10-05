
var rectanglePalletShowing = false;
var straightLinePalletShowing = false;
var circlePalletShowing = false;

$(document).ready(function() {


	function hidePallets(rect, circle, line){
		if (rect){
        	$("#rectanglePallet").slideUp(600, function() {
        		$("#rectanglePallet").html("");
        		$("#rectanglePallet").css("display", "none");
        	});
        	rectanglePalletShowing = false;
		}

		if (circle){
			$("#circlePallet").slideUp(600, function() {
        		$("#circlePallet").html("");
        		$("#circlePallet").css("display", "none");
        	});
        	circlePalletShowing = false;
		}

		if (line){
			$("#straightLinePallet").slideUp(600, function() {
        		$("#straightLinePallet").html("");
        		$("#straightLinePallet").css("display", "none");
        	});
        	straightLinePalletShowing = false;
		}
	}

    $("#rectangle").click(function() {
    	if (!rectanglePalletShowing){
    		hidePallets(false, true, true);
        	$("#rectanglePallet").html($("#drawingOptions").html());
        	$("#rectanglePallet").slideDown(600);
        	rectanglePalletShowing = true;
        } else {
			hidePallets(true, false, false);
        }
    });

	$("#straightLine").click(function() {
    	if (!straightLinePalletShowing){
    		hidePallets(true, true, false);
        	$("#straightLinePallet").html($("#drawingOptions").html());
        	$("#straightLinePallet").slideDown(600);
        	straightLinePalletShowing = true;
        } else {
        	hidePallets(false, false, true);
        }
    });

    $("#circle").click(function() {
    	if (!circlePalletShowing){
    		hidePallets(true, false, true);
        	$("#circlePallet").html($("#drawingOptions").html());
        	$("#circlePallet").slideDown(600);
        	circlePalletShowing = true;
        } else {
			hidePallets(false, true, false);
        }
    });
});
