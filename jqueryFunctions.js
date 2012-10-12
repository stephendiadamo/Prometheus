var rectanglePalletShowing = false;
var straightLinePalletShowing = false;
var circlePalletShowing = false;
var didFinish = [true, true, true];

function showPallets(rect, circle, line){
	if (rect) {
		if (didFinish[0]) {
			hidePallets(false, true, true);
			$("#rectanglePallet").html($("#drawingOptions").html());
			$("#rectanglePallet").slideDown(300);
			$("#fillColorSelector").css("font-weight", "900");
			rectanglePalletShowing = true;
			didFinish[0] = false;
		}
	}
 
	if (circle) {
		if (didFinish[1]) {
			hidePallets(true, false, true);
     		$("#circlePallet").html($("#drawingOptions").html());
     		$("#circlePallet").slideDown(300);
        	$("#fillColorSelector").css("font-weight", "900");
	  		circlePalletShowing = true;
	  		didFinish[1] = false;
		}
	}

	if (line) {
		if (didFinish[2]){
			hidePallets(true, true, false);
     		$("#straightLinePallet").html($("#drawingOptions").html());
     		$("#straightLinePallet").slideDown(300);
        	$("#fillColorSelector").css("font-weight", "900");
     		straightLinePalletShowing = true;
			didFinish[2] = false;
		}
	}		
}

function hidePallets(rect, circle, line){
		if (rect){
        	$("#rectanglePallet").slideUp(300, function() {
        		$("#rectanglePallet").css("display", "none");
        		$("#rectanglePallet").html("");
        		didFinish[0] = true;
        	});
        	rectanglePalletShowing = false;
        	$("#rectangle").css("font-weight", "normal");
		}

		if (circle){
			$("#circlePallet").slideUp(300, function() {
        		$("#circlePallet").css("display", "none");
				$("#circlePallet").html("");
				didFinish[1] = true;
        	});
        	circlePalletShowing = false;
        	$("#circle").css("font-weight", "normal");
		}

		if (line){
			$("#straightLinePallet").slideUp(300, function() {
        		$("#straightLinePallet").css("display", "none");
	       		$("#straightLinePallet").html("");
				didFinish[2] = true;
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
