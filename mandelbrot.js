
function newMb(canvas){
    //private Variables
    var maxIttr = 210;
    var ctx = canvas.getContext('2d');
    var zoom = .8;
    var sizeX = $(canvas).width();
    var sizeY = $(canvas).height();
    var centerX = sizeX / 2;
    var centerY = sizeY / 2;
    var drawToCanvas = true;
    var useMbAlgo = true;


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
	} else if (depth < 125) {
	    ctx.fillStyle= "rgb(0,0,"+ parseInt(depth*2) + ")";
	} else if (depth < 250) {
	    ctx.fillStyle= "rgb("+ parseInt((depth*2) - 255) + ",0,255)";
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
	    while ( x*x + y*y <= 4  &&  ittr < maxIttr ) 
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
		    if(drawToCanvas && useMbAlgo){
			_colorPicker(_getDepth(x,y)).fillRect(x,y,1,1);
		    } else if (useMbAlgo) {
			_getDepth(x,y);
		    } else if (drawToCanvas) {
			_colorPicker(ctx).fillRect(x,y,1,1);
		    }
		}
	    }
	},//close draw

	"redDot":function(x,y){
	    ctx.fillStyle= "rgb(255,0,0)";
	    ctx.fillRect(x,y,2,2);
	},

	"setDrawToCanvas":function(newVal){
	    drawToCanvas = newVal;
	},

	"setUseMbAlgo":function(newVal){
	    useMbAlgo = newVal;
	},
	
	"move": function(newX, newY, zoomMultiplier, startX, startY){
	    //if not passed a pair of start values, use the current center
	    var newZoom
	    newZoom = zoomMultiplier == null ? zoom : (zoomMultiplier*zoom);
	    startX = (startX == null) ? centerX : startX;
	    startY = (startY == null) ? centerY : startY;
	    
	    //OK So the formula(S) below should really be simplified algibreicly 
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

