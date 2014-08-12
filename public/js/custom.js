function startDraw (evt)
{
  $(".blueRct").remove();
  var x1Position = evt.pageX;
  var y1Position = evt.pageY;
  //alert ("Click position is " + x1Position + "," +  y1Position);

  // Reset from previous draw
  var price = 1; //to update - growing price
  var priceTag = $("<h2>1$</h2>");
  $("#priceCount").find("h2").remove();
  $("#cnt-button").prop('disabled', true);

  function updateDraw (evt2)
  {
    var x2Position = evt2.pageX;
    var y2Position = evt2.pageY;

    var widthRct = Math.abs(x2Position - x1Position);
    var heightRct = Math.abs(y2Position - y1Position);

    var currentRct = $("<canvas/>", {'class' : 'blueRct'}).prop({width: widthRct,
								 height: heightRct});

    if (x2Position >= x1Position && y2Position >= y1Position)
     currentRct.css({'top' : y1Position,
		     'left': x1Position,
		     'right': 'auto',
		     'bottom': 'auto'});
    else if (x2Position < x1Position && y2Position >= y1Position)
      currentRct.css({'top' : y1Position,
		      'left': 'auto',
		      'right': $(window).width() - x1Position,
		      'bottom': 'auto'});
    else if (x2Position >= x1Position && y2Position < y1Position)
      currentRct.css({'top' : 'auto',
		      'left': x1Position,
		      'right': 'auto',
		      'bottom': $(window).height() - y1Position});
    else
       currentRct.css({'top' : 'auto',
		       'left': 'auto',
		       'right': $(window).width() - x1Position,
		       'bottom': $(window).height() - y1Position});

    $(".blueRct").remove();
    $("#select").append(currentRct);

    priceTag.text((widthRct * heightRct * price) +"$");
    $("#priceCount").find("h2").remove();
    $("#priceCount").append(priceTag);

    //Enable button
    $("#cnt-button").prop('disabled', false);

    // to add blocking stuff
  }

  $("#select").on("mousemove", updateDraw);

  function finishDraw(evt3)
  {
    $("#select").off("mousemove", updateDraw);
    // $(".blueRct").animatedBorder({size : 1, color : '#3b6cc'});
    // do stuff
  }

  // finish draw on mouseup
  $("#select").on("mouseup", finishDraw);
}

function dialogWindow()
{
  $("#dialog").dialog("open");
  $("#upload-button").on("click", function(){$("#dialog").find("input").click();});

  // To add - change uploaded file
  // To add - close dialog function

  // Check for file
  var timerId;
  timerId = setInterval( function(){
    console.log($("#userPhotoInput").val());
    if ($("#userPhotoInput").val() !== '')
    {
      clearInterval(timerId);
      console.log("SUBMITTED");
      $("#uploadForm").submit();
    }}, 500);

  // submit event listener
  $("#uploadForm").submit(function(){
   
   $(this).ajaxSubmit({
     error: function(xhr)
     {
       console.log('Error'+ xhr.status);
     },
     success: function(response)
     {
       console.log(response.path);
       var img = $("<img src=" + response.path + "></img>");
       $("#dialog").find("#upload-button").after(img);
       $("#dialog").find("#confirm-button").removeClass("hidden");
       $("#confirm-button").on("click", function(){
         // canvas filled with img
         var canvas = $(".blueRct").get(0);
         var ctx = canvas.getContext("2d");
         var pat = ctx.createPattern(img.get(0), 'no-repeat');
         ctx.rect(0,0,$(".blueRct").width(),$(".blueRct").height());
         ctx.fillStyle = pat;
         ctx.fill();
         // close dialog
         $("#dialog").dialog("close");
         // img sent to server and edit html
         // return to initial state
         initialMode();
       });
     }
   });

   // Stop the form for submitting so we avoid refresh
   return false;
 });


}

function selectMode()
{
  // Show instructions
  $("#cnt").removeClass("hidden");
  $("#select").addClass("select-screen");

  // Change button
  $(this).removeClass("btn-primary");
  $(this).addClass("btn-success");
  $(this).text("Confirm");
  $(this).prop('disabled', true);

  // Change event handler on button
  $(this).off("click", selectMode);
  $(this).on("click", dialogWindow);

  // Enter select tool mode
  $("#select").on("mousedown", startDraw);

  // to add - go back to previous mode
}

function initialMode()
{
}

$(document).ready(function (){

  // Maybe on load instead of ready?
  $("#cnt-button").prop('disabled', false);
  $( "#dialog" ).dialog({ autoOpen: false,
			  modal: true,
			  draggable: true});

  $("#cnt-button").on("click", selectMode);
  $("#userPhotoInput").val('');

});
