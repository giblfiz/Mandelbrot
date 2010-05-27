var oldCenterX, oldCenterY;
var oldZoom = 1;

$(document).ready(function(){
    var canvas = document.getElementById("canvas");
    if(!canvas.getContext){
	alert("Browser does not support Canvas");
    }

    plotMandelbrot(canvas, 200, 200, oldZoom);

    $("#zoom2x").click(function(event){
	plotMandelbrot(canvas, oldCenterX, oldCenterY, oldZoom *= 2 );
	$("#info").html( "zoom at "  + oldZoom );
	$("#info").append( "<BR> oldX "  + oldCenterX );
	$("#info").append( "<BR> oldY "  + oldCenterY );

    });

    $("#zoom1p").click(function(event){
	plotMandelbrot(canvas, oldCenterX, oldCenterY, oldZoom += 1 );
	$("#info").html( "zoom at "  + oldZoom );
	$("#info").append( "<BR> oldX "  + oldCenterX );
	$("#info").append( "<BR> oldY "  + oldCenterY );

    });

    $(canvas).click(function(event){
	var relX, relY
	relX =  event.pageX - $(event.target).offset().left;
	relY = event.pageY - $(event.target).offset().top;
	
	newX =  oldCenterX - relX + ($(event.target).width()/2); 
	newY =  oldCenterY - relY + ($(event.target).height()/2); 

//	if(event.metaKey){
	    plotMandelbrot(canvas, newX, newY, oldZoom);
//	}else {
//	    plotMandelbrot(canvas, newX, newY, oldZoom *= 1.5 );
//	}

	$("#info").html( "zoom at "  + oldZoom );
	$("#info").append( "<BR> NewX "  + newX );
	$("#info").append( "<BR> NewY "  + newY );

    })

})

function plotMandelbrot(canvas, centerX, centerY, zoom){
    var sizeX = $(canvas).width();
    var sizeY = $(canvas).height();
    var ctx = canvas.getContext('2d');
    var x, y;
    for(x= 1; x< sizeX; x+=1){
	for(y= 1; y< sizeY ; y+=1){
	    mbPixel(x,y,
		    mandelbrotColor((x-centerX)/(sizeX *zoom) ,
				    (y-centerY)/(sizeY *zoom ) , 255), ctx);
	}
    }
    oldCenterY = centerY;
    oldCenterX = centerX;
    crossHairs(ctx);
}

function crossHairs(ctx){
    ctx.fillStyle= "rgb(200,0,0)";
    var x, y;
    for(x= 1; x< 300; x+=1){
	ctx.fillRect(x, 150, 1, 1);
	ctx.fillRect( 150, x, 1, 1);
    }
}

//takes an X & a Y and a max Itteration Count
//Returns a number of itterations
function mandelbrotColor(xStart,yStart, maxIttr){
    var x = 0;
    var y = 0;
    var iteration = 0;
    var nextX = 0; 
    maxIttr = maxIttr == null ? 1000 : maxIttr;

  while ( x*x + y*y <= (2*2)  &&  iteration < maxIttr ) 
  {
      nextX = x*x - y*y + xStart;
      y = 2*x*y + yStart;
      x = nextX;
      iteration +=1;
  }
    return iteration;
}


//color val should be between 0 and 1000
function mbPixel(x, y, colorVal,  ctx){
    if(colorVal == 255){
	ctx.fillStyle= "rgb(0,100,0)";
    } else {
	ctx.fillStyle= "rgb(0,0,"+ parseInt(colorVal) + ")";
    }
    /*
    if (colorVal < 255){
	ctx.fillStyle = "rgb(0,0,"+colorVal+")";
    } else if (colorVal < 500){
	ctx.fillStyle = "rgb(0," + (colorVal-255) + " , " +(500-colorVal) +")";

    } else if (colorVal < 750){
	ctx.fillStyle = "rgb(" + (colorVal-510) + "," + (750-colorVal)+ ", 0)";

    } else if (colorVal > 999){
	ctx.fillStyle = "rgb(0,0,0, 50)";
    }
*/
    ctx.fillRect(x, y, 1, 1);
	
}