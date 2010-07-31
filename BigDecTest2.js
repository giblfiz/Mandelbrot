var Assert = YAHOO.util.Assert;
var BigDecTest2 = new YAHOO.tool.TestCase({

    name: "Big Decimal 2 Test(s) ",

    testCreateBigDec: function(){
	var Four = bigDec(4);
	var TwoPointFive = bigDec(2.5);
	Assert.areEqual("bigDec2",TwoPointFive.isA);
//	Assert.areEqual(1, bigDec2("98") bigDec(98)));
    },

    testBigDecEquality: function(){
	Assert.isTrue(bigDec(4).eq(bigDec(4)));
	Assert.isTrue(bigDec("4").eq(bigDec(4)));
	Assert.isFalse(bigDec(4).eq(bigDec(2)));
    },

    testBigDecEqualityDecimals: function(){
	Assert.isTrue(bigDec("4.3").eq(bigDec("4.3")));
	Assert.isTrue(bigDec("4.37").eq(bigDec(4.370)));
	Assert.isFalse(bigDec("4.3").eq(bigDec(2.3)));
    },

    testBigDecEqualityAutoTypecast: function(){
	Assert.isTrue(bigDec("4.3").eq("4.3"));
	Assert.isTrue(bigDec("4.3").eq(4.3));
	Assert.isFalse(bigDec("4.3").eq(2.3));
    },

    testPlus: function(){
	var FourPointThree = bigDec(4.3);
	var OnePointEight = bigDec(1.8);
	Assert.isTrue(FourPointThree.plus(OnePointEight)
		      .eq("6.1"));

	var FourPointThree = bigDec(4.3);
	Assert.isTrue(FourPointThree.plus(bigDec(1.8))
		     .eq(6.1));

	var FourPointThree = bigDec(4.3);
	Assert.isTrue(FourPointThree.plus(bigDec(1).plus(bigDec(".8")))
		     .eq(6.1));
    },

    testPlusAutoCast: function(){
	var FourPointThree = bigDec(4.3);
	Assert.isTrue(FourPointThree.plus(bigDec(1).plus(".8")).eq(bigDec(6.1)));
    },

    testTimes: function(){
	var Seven = bigDec(7);
	Assert.isTrue(Seven.times(3).eq(21));
    },

    testLargeNumbers: function(){
	var bigestNormal = bigDec(Number.MAX_VALUE);
	Assert.isTrue(bigDec(1).plus(bigestNormal).plus(bigestNormal).eq(bigestNormal.times(2).plus(1)));

	var bigestNormal = bigDec(Number.MAX_VALUE);
	Assert.isTrue(bigDec(1).plus(bigestNormal).plus(bigestNormal).eq(bigestNormal.times(2).plus(1)));

	var bigestNormal = bigDec(Number.MAX_VALUE);
	var largeNormal = 999999999
	var bnT4P1 = bigDec(largeNormal).times(4).plus(1);
	Assert.isFalse(bigDec(1).plus(largeNormal).plus(largeNormal).eq(bnT4P1));

	var bigestNormal = bigDec(largeNormal);
    },

    testGT_LT: function(){
	Assert.isTrue(bigDec(10).gt(5));

	Assert.isTrue(bigDec(10).gte(5));
	Assert.isTrue(bigDec(10).gte(5.01));
	Assert.isTrue(bigDec(10).gte(10));


	Assert.isTrue(bigDec(8).lt(10));

	Assert.isTrue(bigDec(8.999).lt(10));

	Assert.isTrue(bigDec(8.999).lte(10));
	Assert.isTrue(bigDec(10).lte(10));

	Assert.isFalse(bigDec(10).lt(10));
	Assert.isFalse(bigDec(10).gt(10));
	Assert.isFalse(bigDec(9).gt(10));
	Assert.isFalse(bigDec(90).lt(10));

    },

    testNegitiveNumbers: function(){
	var negOne = bigDec(-1);
	Assert.isTrue(negOne.isNegitive());
	Assert.isTrue(bigDec(negOne).isNegitive());
	Assert.isTrue(bigDec("-1").isNegitive());
    },


    testNegitiveNumbersAddition: function(){
//	$("#body").append(bigDec(-10).print());
//	$("#body").append("<BR>");
//	$("#body").append(bigDec(10).print());
//	$("#body").append("<BR>");
//	$("#body").append(bigDec(-10).times(-1).print());
	Assert.isTrue(bigDec(-10).plus(8).isNegitive());
	Assert.isFalse(bigDec(-6).plus(8).isNegitive());
    },

    testNegitiveNumbersTimes: function(){
	Assert.isTrue(bigDec(-10).times(8).isNegitive());
	Assert.isFalse(bigDec(-6).times(-8).isNegitive());
	Assert.isFalse(bigDec(6).times(8).isNegitive());
    },

    testDivison: function(){
	Assert.isTrue(bigDec(-10).over(5).eq(-2));
	Assert.isTrue(bigDec(-10).over(2).eq(-5));
	Assert.isTrue(bigDec(-10).over(200).eq(-.05));
	Assert.isTrue(bigDec(-10).dividedBy(5).eq(-2));
	Assert.isTrue(bigDec(-10).dividedBy(2).eq(-5));
	Assert.isTrue(bigDec(10).dividedBy(200).eq(.05));
    },

    testDifficultDivison: function(){
	Assert.isTrue(bigDec(-1).over(3).eq(bigDec(-2).over(6)) );
    },

    testCloning: function(){
	var thirty;
	thirty = bigDec(30);
	Assert.isTrue(bigDec(thirty).plus(3).eq(33));
	Assert.isTrue(thirty.eq(30));
    },

    testLTEforLargeNumbers: function(){
	Assert.isTrue(bigDec(100).plus(3).over(50).plus(26).over(24).times(1000).over(1000).lte(4));
    },


    testSubtraction: function(){

	$("#body").append("<HR/>");
	$("#body").append(bigDec(100).minus(50).print());
	$("#body").append(" vs ");
	$("#body").append(bigDec(.05).print());



	Assert.isTrue(bigDec(100).minus(50).eq(50));
	Assert.isTrue(bigDec(100).plus(-50).eq(50));
    },

    mbFormulaLarge: function(v){

	v.lt4check = bigDec(v.x).times(v.x).plus(bigDec(v.y).times(v.y));
	if (v.print) { 
	    $("#body").append("<HR>"); 
	    $("#body").append( "Large LT4 check:" + v.lt4check.print());
	}

	v.nextX = bigDec(v.x).times(v.x).minus(bigDec(v.y).times(v.y)).plus(v.xStart);

	if (v.print) { 
	    $("#body").append("<BR>");
	    $("#body").append("Large nextX:" + v.nextX.print());
	}

	v.y = bigDec(2).times(v.x).times(v.y).plus(v.yStart);
	if (v.print) { 
	    $("#body").append("<BR>");
	    $("#body").append("Large Y" + v.y.print());
	}

	v.x = v.nextX;
	

	return(v);
    },



    testMandelbrotFormulas: function(){
	var sx, sy, snextX, sxStart, syStart;
	sxStart = .5;
	syStart = .5;
	sy = sx = snextX = 0;

	var v = {
	    xStart : bigDec(sxStart),
	    yStart : bigDec(syStart),
	    x : bigDec(0),
	    y : bigDec(0),
	    nextX : bigDec(0),
	    lt4check : bigDec(0),
	    print : 1,
	};

	this.mbFormulaLarge(v);
	$("#body").append( "<br> compressing x: " + v.x.print());	
	$("#body").append( " to x: " + v.x.print());	

	var pt5 = bigDec(.5);
	$("#body").append( "<br> compressing pt5: " + pt5.print());	
	$("#body").append( " to pt5: " + pt5.print());	
	if(pt5.eq(.5)){ 
	    $("#body").append( " eq .5"); 
	} else {
	    $("#body").append( " neq .5"); 
	}

	$("#body").append( " to pt5: " + pt5.print());	
	if(pt5.eq(.6)){ 
	    $("#body").append( " eq .6"); 
	} else {
	    $("#body").append( " neq .6"); 
	}

//	v.y.compress();


	this.mbFormulaLarge(v);
	this.mbFormulaLarge(v);
	this.mbFormulaLarge(v);
	this.mbFormulaLarge(v);
	this.mbFormulaLarge(v);	
	this.mbFormulaLarge(v);	
	this.mbFormulaLarge(v);
	this.mbFormulaLarge(v);	
	this.mbFormulaLarge(v);
	this.mbFormulaLarge(v);	
	this.mbFormulaLarge(v);


/*
	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));

	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	snextX = sx*sx - sy*sy + sxStart;
	$("#body").append("<BR>");
	$("#body").append("nextX   :: " + nextX.print() + " vs " + snextX);

	y = bigDec(2).times(x).times(y).plus(yStart);
	sy = 2*sx*sy + syStart;
	$("#body").append("<BR>");
	$("#body").append("Y   :: " + y.print() + " vs " + sy);

	x = nextX;
	sx = snextX;

	/////////------------------------------------

	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));


	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	snextX = sx*sx - sy*sy + sxStart;
	$("#body").append("<BR>");
	$("#body").append("squared X:"+bigDec(x).times(x).print()+" Y:"+bigDec(y).times(y).print());
	$("#body").append("<BR>");
	$("#body").append("small X:"+sx+" Y:"+sy+" xStart:"+sxStart);
	$("#body").append("<BR>");
	$("#body").append("large X:"+x.print()+" Y:"+y.print()+" xStart:"+xStart.print());
	$("#body").append("<BR>");
	$("#body").append("nextX   :: " + nextX.print() + " vs " + snextX);

	y = bigDec(2).times(x).times(y).plus(yStart);
	sy = 2*sx*sy + syStart;
	$("#body").append("<BR>");
	$("#body").append("Y   :: " + y.print() + " vs " + sy);

	x = nextX;
	sx = snextX;

	/////////------------------------------------

	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));

	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	y = bigDec(2).times(x).times(y).plus(yStart);
	x = nextX;

	snextX = sx*sx - sy*sy + sxStart;
	sy = 2*sx*sy + syStart;
	sx = snextX;

	/////////------------------------------------

	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));

	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	y = bigDec(2).times(x).times(y).plus(yStart);
	x = nextX;

	snextX = sx*sx - sy*sy + sxStart;
	sy = 2*sx*sy + syStart;
	sx = snextX;

	/////////------------------------------------

	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));

	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	y = bigDec(2).times(x).times(y).plus(yStart);
	x = nextX;

	snextX = sx*sx - sy*sy + sxStart;
	sy = 2*sx*sy + syStart;
	sx = snextX;

	/////////------------------------------------

	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));

	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	y = bigDec(2).times(x).times(y).plus(yStart);
	x = nextX;

	snextX = sx*sx - sy*sy + sxStart;
	sy = 2*sx*sy + syStart;
	sx = snextX;

	/////////------------------------------------

	$("#body").append("<BR>");
	$("#body").append(((sx*sx)+(sy*sy)) + " vs " + bigDec(x).times(x).plus(bigDec(y).times(y)).print());
	Assert.isTrue( bigDec(x).times(x).plus(bigDec(y).times(y)).lte(4));

	nextX = bigDec(x).times(x).minus(bigDec(y).times(y)).plus(xStart);
	y = bigDec(2).times(x).times(y).plus(yStart);
	x = nextX;

	snextX = sx*sx - sy*sy + sxStart;
	sy = 2*sx*sy + syStart;
	sx = snextX;

	/////////------------------------------------

	/////////------------------------------------

*/
    },


});

