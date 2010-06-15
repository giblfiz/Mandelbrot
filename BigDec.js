/**********************************************************
*     Big Decimal Library v 0.1
*
* This lib depends on the BigInt Library v5.4 and creates a
* new type called BigDec which is essentially a BigInt Numirator
* and a BigInt Divisor. This takes care of most of what I need
*
* Later I'm hoping to roll the Big Int library into this directly
* and take care of all the globals & non-lint ness in it so that 
* it is just a better library
*
* Functions I very much need....
* plus, divBy, minus, times, gt, gte, (constructor)bigDec, eq, isA
* getNumerator, getDivisor, shrink, print
*
*
* Sample of use...
* ((num - centerX)/(sizeX * zoom)); turns into :
* bigDec(num).minus(bigDec(centerX)).divBy(bigDec(sizeX).times(bigDec(zoom)))
* ...or if your vars are already all bigDec(s)
* num.minus(centerX).divBy(sizeX.times(zoom))
*
**********************************************************/

function bigDec(rawVal){
    var _numerator;
    var _denominator;
    var _isNegitive = false;
    that = this;

    function _isABigDec(value){
	if (value.hasOwnProperty("isA")){
	    if(value.isA === "bigDec"){
		return(true);
	    }
	}
	return(false);
    }

    function _getNumberOfDecimalPoints(value){
	
	var valueAsString = value.toString();
	if(valueAsString.indexOf(".") == -1){
	    return(0);
	} else {
	    return (valueAsString.length - (valueAsString.indexOf(".") +1));
	}
    }

    if(_isABigDec(rawVal)){
	return(rawVal);
    } else {
	if(typeof(rawVal) == "string"){
	    var newVal = parseFloat(rawVal);
	    _numerator = str2bigInt(rawVal.replace(".",""),10,1,1);
	    _denominator = int2bigInt(Math.pow(10,_getNumberOfDecimalPoints(rawVal)),1,1);
	} else if (typeof(rawVal) == "number"){
	    _numerator = int2bigInt((rawVal * Math.pow(10, _getNumberOfDecimalPoints(rawVal))) ,1,1);
	    _denominator = int2bigInt(Math.pow(10,_getNumberOfDecimalPoints(rawVal)),1,1);
	} else if (typeof(rawVal) == "object"){
	    //for the moment we are going to assume that any array we are passed 
	    // is actually a bigInt. This will obviously go away once the bigInt lib is refactored
	    _numerator = rawVal;
	    _denominator = int2bigInt(1,1,1);
	} 

	return({
	    isA:"bigDec",

	    getNumerator: function(){
		return(_numerator);
	    },

	    getDenominator: function(){
		return(_denominator);
	    },
	    
	    eq:function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		var A = mult(_numerator, input.getDenominator());
		var B = mult(_denominator, input.getNumerator());
		if(equals(A,B)){
		    return true;
		} else{
		    return false;
		}
	    },
	    
	    plus: function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		_numerator = add(mult(_numerator,input.getDenominator()),
				 mult(_denominator, input.getNumerator()));
		_denominator = mult(_denominator, input.getDenominator());
		return this;
	    },

	    times: function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		_numerator = mult(_numerator, input.getNumerator());
		_denominator = mult(_denominator, input.getDenominator());
		return this;
	    },

	    isNegitive: function(){
		return(_isNegitive);
	    },

	    isNegitive: function(){
		return(_isNegitive);
	    },

	    
	});//close the bigDec clojure-"object"
    }//close else for NOT is a big Dec

};