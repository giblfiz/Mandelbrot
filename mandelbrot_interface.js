$(document).ready(function(){
    var canvas = document.getElementById("canvas");
    if(!canvas.getContext){
	alert("Browser does not support Canvas");
    }
    mb = newMb(canvas); 
    mb.draw();

    $("#zoom2x").click(function(event){
	mb.zoom(2);
    });

    $("#zoom1p").click(function(event){
	mb.addZoom(1);
    });

    $("#speedTest").click(function(event){
	var startTimeForTrial;
	var runTimes = [];
	var d = new Date();
	var x;

	mb.setDrawToCanvas(false);
	for(x=0; x< 5; x+=1){
	    d = new Date();
	    startTimeForTrial = d.getTime();
	    $("#info").append("algoOnly " + startTimeForTrial + " - ")
	    mb.zoom(1.6);

	    d = new Date();
	    $("#info").append(d.getTime() + " : ")
	    runTimes[x] = d.getTime() - startTimeForTrial;
	    $("#info").append(runTimes[x] + " ms <BR/>")
	}

	$("#info").append(" <BR/><BR/>")

	mb.setDrawToCanvas(true);
	mb.setUseMbAlgo(false);
	for(x=0; x< 5; x+=1){
	    d = new Date();
	    startTimeForTrial = d.getTime();
	    $("#info").append("drawOnly" + startTimeForTrial + " - ")
	    mb.zoom(1.6);

	    d = new Date();
	    $("#info").append(d.getTime() + " : ")
	    runTimes[x] = d.getTime() - startTimeForTrial;
	    $("#info").append(runTimes[x] + " ms <BR/>")
	}

	mb.setUseMbAlgo(true);
	mb.draw();

    });

    $(canvas).click(function(event){
	var relX, relY
	relX =  event.pageX - $(event.target).offset().left;
	relY = event.pageY - $(event.target).offset().top;
	mb.move(relX, relY, 1.3);
    })

})
