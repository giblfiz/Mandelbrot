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


    function _ltNoSign(input){
	input = _isABigDec(input) ? input : bigDec(input);
	var A = mult(_numerator, input.getDenominator());
	var B = mult(_denominator, input.getNumerator());
	return greater(B,A) ? true: false;
    }
    
    function _plus(input, subtraction){
	input = _isABigDec(input) ? input : bigDec(input);
	var inputIsNegitive = input.isNegitive();
	if (subtraction){
	    inputIsNegitive = !inputIsNegitive;
	}

	if(_isNegitive == inputIsNegitive){
	    _numerator = add(mult(_numerator,input.getDenominator()),
			     mult(_denominator, input.getNumerator()));
	} else {
	    if (_ltNoSign(input)){
		_numerator =  sub(mult(_denominator, input.getNumerator()),
				  mult(_numerator,input.getDenominator()));
		_isNegitive = inputIsNegitive;
	    } else {
		_numerator = sub(mult(_numerator,input.getDenominator()),
				 mult(_denominator, input.getNumerator()));
	    }
	}
	_denominator = mult(_denominator, input.getDenominator());
	return this;
	
    }


    if(_isABigDec(rawVal)){
	_isNegitive = rawVal.isNegitive();
	_numerator = rawVal.getNumerator();
	_denominator = rawVal.getDenominator();
//	return(rawVal);
    } else if(typeof(rawVal) == "string"){
	if(parseFloat(rawVal) < 0 ){
	    _isNegitive = true;
	    _numerator = sub(int2bigInt(0,1,1), str2bigInt(rawVal.replace(".",""),10,1,1));
	} else {
	    _numerator = str2bigInt(rawVal.replace(".",""),10,1,1);
	}
	_denominator = int2bigInt(Math.pow(10,_getNumberOfDecimalPoints(rawVal)),1,1);
    } else if (typeof(rawVal) == "number"){
	if(rawVal < 0){
	    _isNegitive = true;
	    rawVal *= -1;
	}
	_numerator = int2bigInt((rawVal * Math.pow(10, _getNumberOfDecimalPoints(rawVal))) ,1,1);
	_denominator = int2bigInt(Math.pow(10,_getNumberOfDecimalPoints(rawVal)),1,1);
    } else if (typeof(rawVal) == "object"){
	//for the moment we are going to assume that any array we are passed 
	// is actually a bigInt. This will obviously go away once the bigInt lib is refactored
	if (negative(rawVal)){ throw RangeError ;}
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

	    setNumirator: function(rawVal){
		if (typeof(rawVal) == "number" && Math.floor(rawVal) == rawVal){
		    if(rawVal < 0){
			_isNegitive = !_isNegitive;
			rawVal *= -1;
		    }
		    _numerator = int2bigInt(rawVal,1,1);
		} else {
		    throw { message: "only a numeric integer may be used to set the numirator, you used " + rawVal,
			    name: "wrongType"};
		}

		return(this);
	    },

	    setDenominator: function(rawVal){
		if (typeof(rawVal) == "number" && Math.floor(rawVal) == rawVal){
		    if(rawVal < 0){
			_isNegitive = !_isNegitive;
			rawVal *= -1;
		    }
		    _denominator = int2bigInt(rawVal,1,1);
		} else {
		    throw { message: "only a numeric integer may be used to set the denominator, you used " + rawVal,
			    name: "wrongType"};
		}

		return(this);
	    },
	    
	    print: function(){
		var negSign = _isNegitive ? "-" : "";
		return(negSign + bigInt2str(_numerator, 10) + "/"+ bigInt2str(_denominator,10));
	    },

	    eq:function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		if ( isZero(input.getDenominator()) || isZero(_denominator)){ 		
		    throw { message: "Denominator is zero, Comparisons will go poorly " + rawVal,
			    name: "DivideByZero"};
		};
		var A = mult(_numerator, input.getDenominator());
		var B = mult(_denominator, input.getNumerator());
		return equals(A,B) ?  true : false;
	    },

	    gt:function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		if ( isZero(input.getDenominator()) || isZero(_denominator)){ 		
		    throw { message: "Denominator is zero, Comparisons will go poorly " + rawVal,
			    name: "DivideByZero"};
		};

		var A = mult(_numerator, input.getDenominator());
		var B = mult(_denominator, input.getNumerator());
		return greater(A,B) ? true: false;
	    },

	    lt:function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		if ( isZero(input.getDenominator()) || isZero(_denominator)){ 		
		    throw { message: "Denominator is zero, Comparisons will go poorly " + rawVal,
			    name: "DivideByZero"};
		};
		var A = mult(_numerator, input.getDenominator());
		var B = mult(_denominator, input.getNumerator());
		return greater(B,A) ? true: false;
	    },

	    gte:function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		if ( isZero(input.getDenominator()) || isZero(_denominator)){ 		
		    throw { message: "Denominator is zero, Comparisons will go poorly " + rawVal,
			    name: "DivideByZero"};
		};
		var A = mult(_numerator, input.getDenominator());
		var B = mult(_denominator, input.getNumerator());
		if(greater(A,B) || equals(A,B)){
		    return true;
		} else{
		    return false;
		}
	    },

	    lte:function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		if ( isZero(input.getDenominator()) || isZero(_denominator)){ 		
		    throw { message: "Denominator is zero, Comparisons will go poorly " + rawVal,
			    name: "DivideByZero"};
		};
		var A = mult(_numerator, input.getDenominator());
		var B = mult(_denominator, input.getNumerator());
		if(greater(B,A) || equals(B,A)){
		    return true;
		} else{
		    return false;
		}
	    },

	    plus: function(input){
		_plus(input, false);
		return this;
	    },

	    minus: function(input){
		_plus(input, true);
		return this;
	    },

	    times: function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		_numerator = mult(_numerator, input.getNumerator());
		_denominator = mult(_denominator, input.getDenominator());
		if(_isNegitive == input.isNegitive()){
		    _isNegitive = false;
		} else {
		    _isNegitive = true;
		}
		return this;
	    },

	    over: function(input){
		input = _isABigDec(input) ? input : bigDec(input);
		_numerator = mult(_numerator, input.getDenominator());
		_denominator = mult(_denominator, input.getNumerator());
		if(_isNegitive == input.isNegitive()){
		    _isNegitive = false;
		} else {
		    _isNegitive = true;
		}
		return this;
	    },

	    dividedBy: function(input){
		return(this.over(input));
	    },

	    isNegitive: function(){
		return  _isNegitive;
	    },

	    compress: function(){
		if(_numerator.length > _denominator.length){
		    $("#body").append( " grow-D ");	
		    _denominator = expand(_denominator, _numerator.length)
		} else if (_numerator.length < _denominator.length){
		    $("#body").append( " grow-N ");	
		    _numerator = expand(_numerator, _denominator.length)
		}

		if(isZero(_numerator)){
		    _denominator = int2bigInt(1,0,1);
		}

		var myGCD, newDenominator, newNumerator, numRemander, denomRemander;
		newNumerator = int2bigInt(0,0,_numerator.length);
		newDenominator = int2bigInt(0,0,_numerator.length);
		numRemander = int2bigInt(0,0,_numerator.length);
		denomRemander = int2bigInt(0,0,_numerator.length);
		myGCD = GCD(_numerator, _denominator);
//		$("#body").append( " GCD:" + bigInt2str(myGCD,10));	

		myGCD = expand(myGCD, _numerator.length);

		divide_(_numerator, myGCD, newNumerator, numRemander);
/*		$("#body").append( "<BR/> _num:" + bigInt2str(_numerator,10) + 
				   " GCD:" + bigInt2str(myGCD,10) + 
				   " newNum:" + bigInt2str(newNumerator,10) + 
				   " newRem:" + bigInt2str(numRemander,10)  );	*/
		divide_(_denominator, myGCD, newDenominator, denomRemander);

		if(!isZero(numRemander) || !isZero(denomRemander) ){
		    throw { message: "Something has gone HORRIBLY wrong with compression ",
			    name: "compressionFailure"};	    
		}

		_numerator = newNumerator;
		_denominator = newDenominator;

		return(this);
	    },


	    
	});//close the bigDec clojure-"object"

};