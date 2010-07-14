var Assert = YAHOO.util.Assert;
var BigDecTest = new YAHOO.tool.TestCase({

    name: "Big Decimal Test",

    testBasicBigInt: function(){
	Assert.isArray(int2bigInt(17,1,1));
    },
  
    testGetNumerator: function(){
	Assert.isArray(bigDec(4).getNumerator());
	Assert.isArray(bigDec("4").getNumerator());
    },

    testCreateBigDec: function(){
	var Four = bigDec(4);
	var TwoPointFive = bigDec(2.5);
	Assert.areEqual(1,equals(int2bigInt(4,1,1), Four.getNumerator()));
	Assert.areEqual(1,equals(int2bigInt(4,1,1), bigDec("4").getNumerator()));
	Assert.areEqual("bigDec",TwoPointFive.isA);
	Assert.areEqual("bigDec",bigDec(int2bigInt(97,1,1)).isA);
	Assert.areEqual(1,equals(int2bigInt(98,1,1), 
				 bigDec(int2bigInt(98,1,1)).getNumerator()));

	Assert.areEqual(1,equals(int2bigInt(98,1,1), 
				 bigDec(98).getNumerator()));

	Assert.areEqual(1,equals(int2bigInt(8,1,1), 
				 bigDec(".8").getNumerator()));
    },

    testBigDecEquality: function(){
	Assert.isTrue(bigDec("4").eq(bigDec("4")));
	Assert.isTrue(bigDec("4").eq(bigDec(4)));
	Assert.isFalse(bigDec("4").eq(bigDec(2)));
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
		      .eq(bigDec(6.1)));

	var FourPointThree = bigDec(4.3);
	Assert.isTrue(FourPointThree.plus(bigDec(1.8))
		     .eq(bigDec(6.1)));

	var FourPointThree = bigDec(4.3);
	Assert.isTrue(FourPointThree.plus(bigDec(1).plus(bigDec(".8")))
		     .eq(bigDec(6.1)));
    },

    testPlusAutoCast: function(){
	var FourPointThree = bigDec(4.3);
	Assert.isTrue(FourPointThree.plus(bigDec(1).plus(".8")).eq(bigDec(6.1)));
    },

    testTimes: function(){
	var Seven = bigDec(7);
	Assert.isTrue(Seven.times(3).eq(21));
    },

    testBigIntLib_withLargeishNumbers: function(){
	Assert.isTrue(bigInt2str(int2bigInt(Number.MAX_VALUE,1,1), 10) = Number.MAX_VALUE);
	var largeNormal = 999999999
	Assert.isTrue(bigInt2str(int2bigInt(largeNormal,1,1), 10) = Number.MAX_VALUE);
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
//	Assert.isFalse(bigDec(1).plus(bigestNormal).plus(bigestNormal).eq(bigestNormal.times(4).plus(1)));
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

    testBigIntNegAddition: function(){
	Assert.areEqual(1,negative(add(int2bigInt(-5,1,1),int2bigInt(4,1,1))));
	Assert.areEqual(0,negative(add(int2bigInt(-3,1,1),int2bigInt(4,1,1))));
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
	Assert.isTrue(bigDec(10).over(200).eq(-.05));

	Assert.isTrue(bigDec(-10).dividedBy(5).eq(-2));
	Assert.isTrue(bigDec(-10).dividedBy(2).eq(-5));
	Assert.isTrue(bigDec(10).dividedBy(200).eq(-.05));
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

    testSetNumirator: function(){
	Assert.isTrue(bigDec(1).setNumirator(4).eq(4));
	Assert.isTrue(bigDec(.1).setNumirator(4).eq(.4));
	Assert.isTrue(bigDec(-1).setNumirator(4).eq(-4));
	Assert.isTrue(bigDec(-1).setNumirator(-4).eq(4));
	var exThrown;


	exThrown = false;
	try{
	    bigDec(-1).setNumirator("five");
	} catch (ex){
	    if (ex.name == "wrongType"){
		exThrown = true;
	    }
	}
	Assert.isTrue(exThrown);


	exThrown = false;
	try{
	    bigDec(-1).setNumirator(73.2);
	} catch (ex){
	    if (ex.name == "wrongType"){
		exThrown = true;
	    }
	}
	Assert.isTrue(exThrown);


},


    testSetDenominator: function(){
	Assert.isTrue(bigDec(1).setDenominator(100).eq(.01));
	Assert.isTrue(bigDec(10).setDenominator(5).eq(2));
	Assert.isTrue(bigDec(10).setDenominator(-5).eq(-2));
	Assert.isTrue(bigDec(-1).setDenominator(-4).eq(.25));
	var exThrown;


	exThrown = false;
	try{
	    bigDec(-1).setDenominator("five");
	} catch (ex){
	    if (ex.name == "wrongType"){
		exThrown = true;
	    }
	}
	Assert.isTrue(exThrown);


	exThrown = false;
	try{
	    bigDec(-1).setDenominator(73.2);
	} catch (ex){
	    if (ex.name == "wrongType"){
		exThrown = true;
	    }
	}
	Assert.isTrue(exThrown);


},
    

    testManuallyConstructedNumbers: function(){
	Assert.isTrue(bigDec(1).setNumirator(500).setDenominator(200).eq(2.5));
    },

    testFailureFromMandelbrot: function(){
	Assert.isTrue(bigDec(1).setNumirator(1236456845654182337045331968000000000000000000).setDenominator(93542383581052893114463682560000000000000000).gte(4));
//	Assert.isTrue(bigDec(1).setNumirator(1236456845654182337045331968000000000000000000).setDenominator(93542383581052893114463682560000000000000000).lt(13.3));
    },


    testManuallyConstructedNumbers: function(){
	Assert.isTrue(bigDec(1).setNumirator(500).setDenominator(200).eq(2.5));
    },

    testSubtraction: function(){
	Assert.isTrue(bigDec(100).minus(50).eq(50));
	Assert.isTrue(bigDec(100).plus(-50).eq(50));
    },

    testCompression: function(){
	var saved = bigDec(9).setNumirator(5000).setDenominator(100);
	saved.compress();
	Assert.isTrue(saved.eq(50));


	Assert.isTrue(bigDec(900).times(.01).plus(1).compress().eq(10));
	Assert.isTrue(bigDec(9).compress().eq(9));
	Assert.isTrue(bigDec(900).times(.001).compress().eq(.9));
	Assert.isTrue(bigDec(90).times(.002).compress().eq(.18));
	Assert.isTrue(bigDec(9).setNumirator(5).setDenominator(10).compress().eq(.5));


	Assert.isTrue(bigDec(0).plus(.5).compress().eq(.5));

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
//	v.x.compress();
	$("#body").append( " to x: " + v.x.print());	

	var pt5 = bigDec(9).setNumirator(5).setDenominator(10);
	$("#body").append( "<br> compressing pt5: " + pt5.print());	
//	pt5.compress();
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

