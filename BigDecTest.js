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

    testLargeNumbers: function(){
	var bigestNormal = bigDec(Number.MAX_VALUE);
	Assert.isTrue(bigDec(1).plus(bigestNormal).plus(bigestNormal).eq(bigestNormal.times(2).plus(1)));

	var bigestNormal = bigDec(Number.MAX_VALUE);
	Assert.isTrue(bigDec(1).plus(bigestNormal).plus(bigestNormal).eq(bigestNormal.times(2).plus(1)));
    },

    testNegitiveNumbers: function(){
	var negOne = bigDec(-1);
    },


});