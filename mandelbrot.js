function newMb(canvas){
    //private Variables
    var maxIttr = 210;  // This controls the color depth of the renders
    var ctx = canvas.getContext('2d'); 
    var sizeX = $(canvas).width(); 
    var sizeY = $(canvas).height();
    var zoom = .8;                //This is part of the starting zoom (and used as the current zoom)
    var centerX = sizeX / 2;      // The Center of X & Y (starts off dead center
    var centerY = sizeY / 2;
    var timeOutDur = 150;         // Max time in milliseconds between check-in with the browser. FF times out at ~6000
                                  // Higher numbers render faster, lower numbers feel more interactive
    var drawToCanvas = true;      // Actually draw the results. This is turned off for some testing functions
    var useMbAlgo = true;         // Actually compute the pixel depth. This is turned off for some testing functions
    var useBigDec = false;        // use the Big Decimal library, allowing for infinate depth at the cost of _much_ slower performance
    var debug = false;            // output debug information


    if(useBigDec){
	var zoom = bigDec(.8);
	var centerX = bigDec(sizeX).over(2);
	var centerY = bigDec(sizeY).over(2);
    }

    //private functions

    var _v = {
	pixSize : null,
	startTime: null,
	x: 1,
	y: 1,
	xClean: null,
	yClean: null,
  }	

    var _drawInternals = function(){
	var d;

	if(debug){ 
	    $("body").append("<br> Draw Internals running with pixSize: " + _v.pixSize);
	    $("body").append("<br>  centerY = " + centerY);
	}

	if (_v.pixSize >= 1){
	    for(; _v.x< sizeX; _v.x+=_v.pixSize){
		for(; _v.y< sizeY ; _v.y+= _v.pixSize){
		    _v.xClean = ((_v.x-1)/(_v.pixSize*2));
		    _v.yClean = ((_v.y-1)/(_v.pixSize*2));
		    if(_v.xClean.floor !== _v.xClean && _v.yClean.floor !== _v.yClean){
			if(drawToCanvas && useMbAlgo){
			    _colorPicker(_getDepth(_v.x,_v.y)).fillRect(_v.x,_v.y,_v.pixSize , _v.pixSize);
			} else if (useMbAlgo) {
			    _getDepth(_v.x,_v.y);
			} else if (drawToCanvas) {
			    _colorPicker(ctx).fillRect(_v.x,_v.y,_v.pixSize, _v.pixSize);
			}
		    }

		    d = new Date;
		    if((_v.startTime + timeOutDur) < d.getTime()){
			_v.startTime = d.getTime();
			window.setTimeout(_drawInternals, 0);
			if(debug){ 
			    $("body").append("<br>Loop-booted due to time");
			}
			return;
		    }

		} //close the Y Loop
		_v.y = 1;
	    } //close the X loop
	    _v.x = 1;
	    _v.pixSize = _v.pixSize /2;
	    window.setTimeout(_drawInternals, 0);
	}// close the block size loop
	
    }

    var _offset = function(num, axis){
	if (axis !== "x" && axis !== "y"){
	    throw new Error("offset Axis not recognized, was " + axis);
	} else if (axis === "x"){
	    if(useBigDec){
		return (bigDec(num).minus(centerX).over(bigDec(sizeX).times(zoom)));
	    } else {
		return ((num - centerX)/(sizeX * zoom));
	    }
	} else {
	    if(useBigDec){
		return bigDec(num).minus(centerY).over(bigDec(sizeY).times(zoom));
	    } else {
		return ((num - centerY)/(sizeY * zoom));
	    }
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
	   if(useBigDec){
	       x = bigDec(0);
	       y = bigDec(0);
	       nextX = bigDec(0);
	       while ( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4)  &&  ittr < maxIttr ) {
		   nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
		   y = bigDec(2).times(x).times(y).plus(yStart);
		   x = nextX;
		   ittr +=1;
	       }
	   } else {
	       while ( x*x + y*y <= 4  &&  ittr < maxIttr ) {
		   nextX = x*x - y*y + xStart;
		   y = 2*x*y + yStart;
		   x = nextX;
		   ittr +=1;
	       }
	   }
	if(debug && !useBigDec){ 
//	    $("body").append("<br>(getDepth)  itter: " + ittr + " yStart = " + yStart + " y = " + rawY + " centerY = " + centerY);
	}
	if(debug && useBigDec){
	    $("body").prepend("<hr>" + ittr + " xStart = " + xStart.print() + " :: 4 >= " + bigDec(x).times(x).plus(bigDec(y).times(y)).print() );
	    $("body").prepend("<br>" + ittr + " yStart = " + yStart.print());
	}
	return ittr;
	}// close getDepth



    // The object below 
    return({
	drawFromKeyString: function(keyString){
	    var parts = keyString.split('&');
	    parts[0] = parseFloat(parts[0]);
	    parts[1] = parseFloat(parts[1]);
	    parts[2] = parseFloat(parts[2]);

	    if (typeof(parts[0]) == typeof(parts[1]) &&  
		typeof(parts[2]) == typeof(parts[1]) &&
		'number' == typeof(parts[1]) ){

		this.draw(parts[0], parts[1], parts[2])
	    } else {
		throw { message: "Invalid KeyString passed to drawFromKeyString, some of it's parts are not numbers ",
			name: "badInput"};	    
	    }
	},
	
	getKeyString : function(base){
	    base = isNaN(base) ? 10 : base;
	    if(useBigDec){
		//think of a way to implement this...
		return "";
	    } else {
		return(centerX.toString(base) + "&" + centerY.toString(base) + "&" + zoom.toString(base) );
	    }
	}, 

	"draw": function(newX,newY,newZoom){
	    var d = new Date();

	    centerX = newX == null ? centerX : newX;
	    centerY = newY == null ? centerY : newY;
	    zoom = newZoom == null ? zoom : newZoom;

	    _v.pixSize = 32;
	    _v.startTime = d.getTime();
	    _v.x = 1;
	    _v.y = 1;
	    window.setTimeout(_drawInternals, 0);
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
	    if(useBigDec){
		newZoom = zoomMultiplier == null ? zoom : (bigDec(zoom).times(zoomMultiplier));
	    } else {
		newZoom = zoomMultiplier == null ? zoom : zoom*zoomMultiplier;
	    }
    
	    startX = (startX == null) ? centerX : startX;
	    startY = (startY == null) ? centerY : startY;
	    
	    //OK So the formula(S) below should really be simplified algibreicly 
	    if(useBigDec){
		offsetX = bigDec(startX).minus(newX).plus(bigDec(sizeX).over(2));
		offsetY = bigDec(startY).minus(newY).plus(bigDec(sizeY).over(2));

		offsetX = bigDec(offsetX).times(newZoom).over(zoom).minus(
		    bigDec(sizeX).times(bigDec(newZoom).minus(zoom))
			.over(bigDec(zoom).times(2)));

		offsetY = bigDec(offsetY).times(newZoom).over(zoom).minus(
		    bigDec(sizeY).times(bigDec(newZoom).minus(zoom))
			.over(bigDec(zoom).times(2)));
	    } else {
		offsetX = (startX -newX + (sizeX/2));
		offsetY = (startY -newY + (sizeY/2));
		offsetX = (offsetX*newZoom/zoom) - (sizeX*(newZoom-zoom)/(2*zoom));
		offsetY = (offsetY*newZoom/zoom) - (sizeY*(newZoom -zoom)/(2*zoom));
	    }
	    this.draw(offsetX,offsetY, newZoom);
	}, //close move
	
	"setZoom": function(newZoom){
	    if(useBigDec){
		offsetX = bigDec(offsetX).times(newZoom).over(zoom).minus(
		    bigDec(sizeX).times(bigDec(newZoom).minus(zoom))
			.over(bigDec(zoom).times(2)));

		offsetY = bigDec(offsetY).times(newZoom).over(zoom).minus(
		    bigDec(sizeY).times(bigDec(newZoom).minus(zoom))
			.over(bigDec(zoom).times(2)));
	    } else {
		offsetX = (centerX*newZoom/zoom) - (sizeX*(newZoom-zoom)/(2*zoom));
		offsetY = centerY*newZoom/zoom - (sizeY*(newZoom -zoom)/(2*zoom));
	    }

	    this.draw(offsetX, offsetY, newZoom);
	},

	"zoom": function(zoomMultiplier){
	    if(useBigDec){
		this.setZoom(bigDec(zoom).times(zoomMultiplier));
	    } else {
		this.setZoom(zoom*zoomMultiplier);
	    }
	},

	"addZoom": function(zoomAdder){
	    if(useBigDec){
		this.setZoom(bigDec(zoom).plus(zoomAdder));
	    } else {
		this.setZoom(zoomAdder + zoom);
	    }
	},

    }); // end "return"
    
}

