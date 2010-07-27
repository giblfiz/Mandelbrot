  function newMb(canvas){
    //private Variables
    var maxIttr = 210;  // This controls the color depth of the renders
    var ctx = canvas.getContext('2d'); 
    var sizeX = $(canvas).width(); 
    var sizeY = $(canvas).height();
    var zoom = 0.8;                //This is part of the starting zoom (and used as the current zoom)
    var centerX = sizeX / 2;      // The Center of X & Y (starts off dead center
    var centerY = sizeY / 2;
    var timeOutDur = 150;         // Max time in milliseconds between check-in with the browser. FF times out at ~6000
                                  // Higher numbers render faster, lower numbers feel more interactive
    var drawToCanvas = true;      // Actually draw the results. This is turned off for some testing functions
    var useMbAlgo = true;         // Actually compute the pixel depth. This is turned off for some testing functions
    var useBigDec = false;        // use the Big Decimal library, allowing for infinate depth at the cost of _much_ slower performance
    var debug = true;            // output debug information


    // These variables are used as part of the _drawInternals function, They would be local, 
    // But the function interupts itself frequently, and needs it's variables stored externally
    // So it knows where to pick up when restarted. 
    var _v = { 
	pixSize : null,    //current pixel size for this itteration
	startTime: null,   //The time this pass started running, used to track timeOut
	x: 1,              //current x pixel
	y: 1,              //current y pixel
	xClean: null,      //current x pixel with loaction adjusted for pixSize
	yClean: null      //current y pixel with loaction adjusted for pixSize
    };	


    //if we are using bigDec, this variables need to be bigDecs and not regular floats
    if(useBigDec){
	 zoom = bigDec(0.8);
	 centerX = bigDec(sizeX).over(2);
	 centerY = bigDec(sizeY).over(2);
    }

    //!!!!!!!!!!!!!!   Private Functions   !!!!!!!!!!!!!!!!!!


    //**********************************************************************
    //_drawInternals is the workhorse of this object. It itterates through 
    // each of the pixels in the canvas and generates the correct color for them
    // There are two particularly novel features of this function: large pass & Chunking
    //
    // Large Pass:
    // Rather than simply itterating through each pixel in the expected order
    // the function loops through the pixels in steps of "pixel Size" (currently starts at 32)
    // which it draws in as huge pixels, and then returns itterating through again with 
    // pixels that are half as big, and skipping pixels that have already been drawn.
    // this causes a rough version of the set to be displayed quite quickly and as further
    // itterations occur the unblurring effect occurs, finally resulting in a clean display
    //
    // Chunking:
    // Rather than being called directly from draw _drawInternals is called by window.setTimeout
    // further, after each pixel is drawn, it checks the elapsed time and if more than timeOutDur
    // has gone by drawInternals pushes a new copy of itself onto the setTimeout Que and
    // shuts itself down. This is useful because these breaks in the application execution
    // give the browser a chance to interrupt the string of events, and prevent the
    // script from being flagged as "Hanging"
    //**********************************************************************
    function _drawInternals(){
	var d; //this is used to store a non-reusable date object

	if(debug){ 
	    $("body").append("<br> Draw Internals running with pixSize: " + _v.pixSize);
	    $("body").append("<br>  centerY = " + centerY);
	}

	if (_v.pixSize >= 1){ //we don't need to loop over anything smaller than single pixels
	    while(_v.x< sizeX){
		_v.xClean = ((_v.x-1)/(_v.pixSize*2)); //compute the x offset accounting for pix size

		while( _v.y< sizeY){
		    _v.yClean = ((_v.y-1)/(_v.pixSize*2)); // compute the y offset accounting for pix size

		    if(_v.xClean.floor !== _v.xClean && _v.yClean.floor !== _v.yClean){ // check if this pix was drawn on previous pass

			if(drawToCanvas && useMbAlgo){
			    //This is the normal call to draw a pixel
			    //_colorPicker returns the canvas, primed to draw in a color
			    //_getDepth calculates itterations to determine if the pixel is in or out of set
			    // which traditionally determines what color should be used. 
			    _colorPicker(_getDepth(_v.x,_v.y)).fillRect(_v.x,_v.y,_v.pixSize , _v.pixSize);
			} else if (useMbAlgo) {
			    _getDepth(_v.x,_v.y); //used during "speed test", does not draw to canvas
			} else if (drawToCanvas) {
			    _colorPicker(ctx).fillRect(_v.x,_v.y,_v.pixSize, _v.pixSize); //used during speed test, no computation
			}
		    }

		    d = new Date();
		    if((_v.startTime + timeOutDur) < d.getTime()){ //detect if timeout has occured.
			_v.startTime = d.getTime(); //reset timeout counter
			window.setTimeout(_drawInternals, 0); //push new copy of algo onto the que
			if(debug){ 
			    $("body").append("<br>Loop-booted due to time");
			}
			return; //abort remaining loop executions. New Que item will pick up where we left off.
		    }

		    _v.y += _v.pixSize; //incriment the Y step
		} //close the Y Loop

		_v.y = 1; //reset Y to start (not using for loops to make interacting with chunking easier)
		_v.x += _v.pixSize; //incriment the X step
	    } //close the X loop
	    _v.x = 1; 
	    _v.pixSize = _v.pixSize /2; //move on to a smaller pixel size
	    window.setTimeout(_drawInternals, 0); // give the browser a chance to act.
	}// close the pix size loop
	
    }

    function _offset(num, axis){
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

    function _colorPicker(depth){
	if(depth < 0){
	    //this should never happen, but may fail quitely without causing problems
	    ctx.fillStyle= "rgb(0,0,0)";
	} else if (depth >= maxIttr) {
	    ctx.fillStyle= "rgb(0,100,0)";
	} else if (depth < 125) {
	    ctx.fillStyle= "rgb(0,0,"+ parseInt(depth*2, 10) + ")";
	} else if (depth < 250) {
	    ctx.fillStyle= "rgb("+ parseInt((depth*2) - 255, 10) + ",0,255)";
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
	};// close getDepth



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

		this.draw(parts[0], parts[1], parts[2]);
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

	if(debug){ 
	    $("body").append("<br>  pre-centerY = " + centerY);
	    $("body").append("<br>  new Y = " + newY);
	}

	    centerX = !newX ? centerX : newX;
	    centerY = !newY ? centerY : newY;
	    zoom = !newZoom ? zoom : newZoom;

	if(debug){ 
	    $("body").append("<br>  post-centerY = " + centerY);
	}

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
	    var newZoom, offsetX, offsetY;
	    if(useBigDec){
		newZoom = zoomMultiplier === null ? zoom : (bigDec(zoom).times(zoomMultiplier));
	    } else {
		newZoom = zoomMultiplier === null ? zoom : zoom*zoomMultiplier;
	    }
    
	    startX = (!startX) ? centerX : startX;
	    startY = (!startY) ? centerY : startY;
	    
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

	if(debug){ 
	    $("body").append("<br>  offsetY = " + offsetY);
	    $("body").append("<br>  startY = " + startY);
	    $("body").append("<br>  newY = " + newY);
	    $("body").append("<br>  sizeY = " + sizeY);
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
	}

    }); // end "return"
    
}

