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

    $(canvas).click(function(event){
	var relX, relY
	relX =  event.pageX - $(event.target).offset().left;
	relY = event.pageY - $(event.target).offset().top;
	mb.move(relX, relY, 1.3);
    })

})

function newMb(canvas){
    //private Variables
    var maxIttr = 400;
    var ctx = canvas.getContext('2d');
    var zoom = .8;
    var sizeX = $(canvas).width();
    var sizeY = $(canvas).height();
    var centerX = sizeX / 2;
    var centerY = sizeY / 2;


    //private functions
    var _offset = function(num, axis){
	if (axis !== "x" && axis !== "y"){
	    throw new Error("offset Axis not recognized, was " + axis);
	} else if (axis === "x"){
	    return ((num - centerX)/(sizeX * zoom));
	} else {
	    return ((num - centerY)/(sizeY * zoom));
	}
    }

    var _colorPicker =  function(depth){
	    if(depth < 0){
		//this should never happen, but may fail quitely without causing problems
		ctx.fillStyle= "rgb(0,0,0)";
	    } else if (depth >= maxIttr) {
		ctx.fillStyle= "rgb(0,100,0)";
	    } else if (depth < 255) {
		ctx.fillStyle= "rgb(0,0,"+ parseInt(depth) + ")";
	    } else if (depth < 450) {
		ctx.fillStyle= "rgb("+ parseInt(depth - 255) + ",0,255)";
	    }
	    return(ctx);
	} //close colorPicker

    var _getDepth =  function(rawX,rawY){
	    var xStart = _offset(rawX,"x");
	    var yStart = _offset(rawY,"y");
	    //the interesting things happen where X&y are between 1&2 
	    //there is some scaling math that should probably be rolled into this
	    var ittr, x, y, nextX;
	    ittr = x = y = nextX = 0;
	    while ( x*x + y*y <= (2*2)  &&  ittr < maxIttr ) 
	    {
		nextX = x*x - y*y + xStart;
		y = 2*x*y + yStart;
		x = nextX;
		ittr +=1;
	    }
	    return ittr;
	}// close getDepth



    // The object below 
    return({
	"draw": function(newX,newY,newZoom){
	    centerX = newX == null ? centerX : newX;
	    centerY = newY == null ? centerY : newY;
	    zoom = newZoom == null ? zoom : newZoom;

	    var x, y;
	    for(x= 1; x< sizeX; x+=1){
		for(y= 1; y< sizeY ; y+=1){
		    _colorPicker(_getDepth(x,y)).fillRect(x,y,1,1);
		}
	    }
	},//close draw

	"redDot":function(x,y){
	    ctx.fillStyle= "rgb(255,0,0)";
	    ctx.fillRect(x,y,2,2);
	},
	
	"move": function(newX, newY, zoomMultiplier, startX, startY){
	    //if not passed a pair of start values, use the current center
	    var newZoom
	    newZoom = zoomMultiplier == null ? zoom : (zoomMultiplier*zoom);
	    startX = (startX == null) ? centerX : startX;
	    startY = (startY == null) ? centerY : startY;
	    
	    offsetX = (startX -newX + (sizeX/2));
	    offsetY = (startY -newY + (sizeY/2));
	    offsetX = (offsetX*newZoom/zoom) - (sizeX*(newZoom-zoom)/(2*zoom));
	    offsetY = (offsetY*newZoom/zoom) - (sizeY*(newZoom -zoom)/(2*zoom));


	    this.draw(offsetX,offsetY, newZoom);
	}, //close move
	
	"setZoom": function(newZoom){
	    offsetX = (centerX*newZoom/zoom) - (sizeX*(newZoom-zoom)/(2*zoom));
	    offsetY = centerY*newZoom/zoom - (sizeY*(newZoom -zoom)/(2*zoom));
	    this.draw(offsetX, offsetY, newZoom);
	},

	"zoom": function(zoomMultiplier){
	    this.setZoom(zoom*zoomMultiplier);
	},

	"addZoom": function(zoomAdder){
	    this.setZoom(zoom+zoomAdder);
	},

    }); // end "return"
    
}



/*
//********************************************************
//I ask myself... What do I want this code to look like?
mb = newMB(canvas, maxItter); //ok I like it,  be sure to set a default maxItter
mb.draw(x,y,zoom); //like it as well, set a default for x, y and zoom? (default zoom should be oldZoom, fallthrough to 1
mb.setZoom(zoom); //sets zoom absolutely
mb.zoom(multiplier); // calls setZoom(oldZoom * multiplier);
mb.move(x,y); //From is assumed to be the center
mb.moveFromTo(fromX,fromY,toX,toY);  //not so sure about this one
//********************************************************

*/