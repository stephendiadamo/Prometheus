var rectanglePalletShowing = false;
var straightLinePalletShowing = false;
var circlePalletShowing = false;
var didFinish = [true, true, true];


function showPallets(rect, circle, line, fillSelected){
  if (rect) {
    if (didFinish[0]) {
      hidePallets(false, true, true);
      $("#rectanglePallet").html($("#drawingOptions").html());
      $("#rectanglePallet").slideDown(300);
      rectanglePalletShowing = true;
      didFinish[0] = false;
    }
  }

  if (circle) {
    if (didFinish[1]) {
      hidePallets(true, false, true);
      $("#circlePallet").html($("#drawingOptions").html());
      $("#circlePallet").slideDown(300);
      circlePalletShowing = true;
      didFinish[1] = false;
    }
  }

  if (line) {
    if (didFinish[2]){
      hidePallets(true, true, false);
      $("#straightLinePallet").slideDown(300);
      $("#straightLinePallet").html($("#drawingOptions").html());
      straightLinePalletShowing = true;
      didFinish[2] = false;		
    }
  }
   
	if (fillSelected){
      	$(".fillColorSelector").css("font-weight", "900");
      	$(".lineColorSelector").css("font-weight", "normal");
    } else {
        $(".lineColorSelector").css("font-weight", "900");
        $(".fillColorSelector").css("font-weight", "normal");
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
  }

  if (circle){
    $("#circlePallet").slideUp(300, function() {
      $("#circlePallet").css("display", "none");
      $("#circlePallet").html("");
      didFinish[1] = true;
    });
    circlePalletShowing = false;
  }

  if (line){
    $("#straightLinePallet").slideUp(300, function() {
      $("#straightLinePallet").css("display", "none");
      $("#straightLinePallet").html("");
      didFinish[2] = true;
    });
    straightLinePalletShowing = false;
  }
}


