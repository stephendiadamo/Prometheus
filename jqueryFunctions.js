var rectanglePalletShowing = false;
var straightLinePalletShowing = false;
var circlePalletShowing = false;



function showPallets(rect, circle, line){
	if (rect) {
		hidePallets(false, true, true);
		$("#rectanglePallet").html($("#drawingOptions").html());
     	$("#rectanglePallet").slideDown(600);
     	rectanglePalletShowing = true;
	}
 
	if (circle) {
		hidePallets(true, false, true);
     	$("#circlePallet").html($("#drawingOptions").html());
     	$("#circlePallet").slideDown(600);
	  	circlePalletShowing = true;
	}

	if (line) {
		hidePallets(true, true, false);
     	$("#straightLinePallet").html($("#drawingOptions").html());
     	$("#straightLinePallet").slideDown(600);
     	straightLinePalletShowing = true;
	}		
}

function hidePallets(rect, circle, line){
		if (rect){
        	$("#rectanglePallet").slideUp(600, function() {
        		$("#rectanglePallet").html("");
        		$("#rectanglePallet").css("display", "none");
        	});
        	rectanglePalletShowing = false;
        	$("#rectangle").css("font-weight", "normal");
		}

		if (circle){
			$("#circlePallet").slideUp(600, function() {
        		$("#circlePallet").html("");
        		$("#circlePallet").css("display", "none");
        	});
        	circlePalletShowing = false;
        	$("#circle").css("font-weight", "normal");
		}

		if (line){
			$("#straightLinePallet").slideUp(600, function() {
        		$("#straightLinePallet").html("");
        		$("#straightLinePallet").css("display", "none");
        	});
        	straightLinePalletShowing = false;
        	$("#straightLine").css("font-weight", "normal");
	}
}

$(document).ready(function() {
	
   /* $("#rectangle").click(function() {
    	if (!rectanglePalletShowing){
    		hidePallets(false, true, true);
			showPallets(true, false, false);
        	$("#rectangle").css("font-weight", "900");	
        } else {
			hidePallets(true, false, false);
        }
    });

	$("#straightLine").click(function() {
    	if (!straightLinePalletShowing){
    		hidePallets(true, true, false);
			showPallets(false, false, true);
        	$("#straightLine").css("font-weight", "900");
        } else {
        	hidePallets(false, false, true);
        }
    });

    $("#circle").click(function() {
    	if (!circlePalletShowing){
    		hidePallets(true, false, true);
			showPallets(false, true, false);
        	$("#circle").css("font-weight", "900");
     } else {
			hidePallets(false, true, false);
     }
  });*/
});
