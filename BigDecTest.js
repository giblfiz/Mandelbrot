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


});