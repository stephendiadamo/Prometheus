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
      $("#straightLinePallet").html($("#drawingOptions").html());
      $("#straightLinePallet").slideDown(300);
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