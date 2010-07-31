/**********************************************************
*     Big Decimal Library v 0.2
*
* This lib NO LONGER depends on the BigInt Library v5.4 and creates a
* new type called BigDec. BigInt proved to be slow, and written as if
* it was in C with lots of bitwise shifts (which are VERY slow in JS)
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
    var _valueLib;
    var _chunkSize = 1000000; //it's important that chunkSize ^ 2 does not overflow, must be positive...
    var _maxDecimalDepth = 2; //this is how deep a decimal may go OFF OF A SINGLE CHUNK 
    var that = this;


    function _isABigDec(value){
	if (value.hasOwnProperty("isA")){
	    if(value.isA === "bigDec2"){
		return(true);
	    }
	}
	return(false);
    }


    function _maxColumn(lib){
	if (!lib) {
	    lib = _valueLib;
	}
	var column = 0;
	while(lib.hasOwnProperty(column)){
	    column += 1;
	}
	return(column -1);
    }

    function _minColumn(lib){
	if (!lib) {
	    lib = _valueLib;
	}
	var column = 0;
	while(_valueLib.hasOwnProperty(column)){
	    column -= 1;
	}
	return(column +1);
    }


    function _isNeg(){
	return _valueLib[_maxColumn()]  < 0 ;
    }


    //*********************************************************************************
    // This is a new implementation, that simply fixes each of the columns... if any
    // of the columns contains a value that is to big for it (positive or negitive)
    // or has decimal points, it is resolved into the neighboring two colums.
    // This starts with the smallest column, works its way up, and then works it's way 
    // back down again. (allowing it to capture both values that are too big and  
    // fractional)
    //*********************************************************************************

    //*********************************************************************************
    // Need to go over sign management and carrying again!
    // This may have bugs in it!!!!
    //*********************************************************************************


    function _carryPlaces(){
	//	$("#body").append( "<BR/> Carry called ");  
	var remainder, val, decimalDepth, column, isNegitive;

	//it's important to note the numbers overall sign, this is determined by the sign of the most valuable column (aka MAX)
	if (_valueLib[_maxColumn()] >= 0){
	    isNegitive = false;
	} else {
	    isNegitive = true;
	}

	column = _minColumn();
	while(_valueLib.hasOwnProperty(column)){
	    val = _valueLib[column];
	    // see we exceed chunk size
	    if( val > _chunkSize || val < _chunkSize * (-1)){
		remainder = val % _chunkSize;
		if(remainder > 0){
		    if (_valueLib.hasOwnProperty(column+1)){
			_valueLib[column+1] += ((val - remainder)/_chunkSize);
		    } else {
			_valueLib[column+1] = ((val - remainder)/_chunkSize);
		    }
		} else {
		    if (_valueLib.hasOwnProperty(column+1)){
			_valueLib[column+1] += ((val + remainder)/_chunkSize);
		    } else {
			_valueLib[column+1] = ((val + remainder)/_chunkSize);
		    }
		}
		_valueLib[column] = remainder;
	    }
	    column += 1;
	}

	//we have now distributed our values all the way up the chain... 
	// it's time to carry the decimals all the way down...
	column -= 1; // the column was set to the first unassigned space, now its at the begining...

	while(_valueLib.hasOwnProperty(column) && decimalDepth < _maxDecimalDepth){
	    val = _valueLib[column];
	    //we check if there is a decimal compontent and deal with it...
	    if(Math.floor(val) !== val){	    
		remainder = val- Math.floor(val);
		remainderSignMatches = (remainder < 0) === isNegitive;
		if(remainderSignMatches){
		    if (_valueLib.hasOwnProperty(column-1)){
			_valueLib[column-1] += (remainder*_chunkSize);
		    } else {
			decimalDepth += 1;
			_valueLib[column-1] = (remainder*_chunkSize);
		    }
		} else {
		    if (_valueLib.hasOwnProperty(column-1)){
			_valueLib[column-1] += (remainder*_chunkSize);
		    } else {
			decimalDepth += 1;
			_valueLib[column-1] = (remainder*_chunkSize);
		    }
		}
		_valueLib[column] = Math.floor(val);
	    }

	}
    }

/*
    function _getNumberOfDecimalPoints(value){
	var valueAsString = value.toString();
	if(valueAsString.indexOf(".") == -1){
	    return(0);
	} else {
	    return (valueAsString.length - (valueAsString.indexOf(".") +1));
	}
    }
*/


    //**************************************
    //I'm pretty sure this code is not right!!
    // write exhaustive tests, and put them in place
    //**************************************


    function _lt(input, orEqual){
	//return true if value lib is larger
	// return false if input lib is larger
	input = _isABigDec(input) ? input : bigDec(input);
	var inputLib = input.getValueLib();
	var ilc = _maxColumn(inputLib);
	var vlc = _maxColumn(_valueLib);
	
	if( ilc == vlc){
	    //they have the same number of columns
	    while (_valueLib[vlc] === inputLib[ilc] && _valueLib.hasOwnProperty(vlc)){
		vlc -= 1;
		ilc -= 1;
	    }

	    $("#body").append( "<BR/> inputCol:" + ilc + " input:" + inputLib[ilc] + " valCol:" + vlc + " value:" + _valueLib[vlc]  );  
	    
	    if(!_valueLib.hasOwnProperty(vlc)){
		if(!inputLib.hasOwnProperty(ilc)){
		    //they are equal!!!
		    if(orEqual){
			return true;
		    } else{
			return false;
		    }
		} else {
		    //input lib has more decimals
		    return false;
		}
	    } else if (!inputLib.hasOwnProperty(ilc)){
		//valueLib has more decimals!!
		return true;
	    }
	    $("#body").append("!!!");
	    return (_valueLib[vlc] < inputLib[ilc]);
	    
	} else {
	    //one of them has more columns
	    
	    if (inputLib[_maxColumn(inputLib)] >= 0){
		//input is positive
		if(_valueLib[_maxColumn()] >= 0){
		    //base is positive
		    return _maxColumn(_valueLib) > _maxColumn(inputLib); //whichever one ahs more columns is bigger
		} else {
		    //base is negitive
		    return false;
			}
	    } else {
		//input is negitive
		if(_valueLib[_maxColumn()] >= 0){
		    //base is positive
		    return true;
		} else {
		    //base is negitive
		    return _maxColumn(_valueLib) < _maxColumn(inputLib); //whichever one ahs more columns is bigger
		}
		
	    }
	}
    }


    function _plus(input, subtraction){
	input = _isABigDec(input) ? input : bigDec(input);
	var column, colVal, key;
	var inputLib;
	var results = {};

	if (subtraction){
	    column = _maxColumn(inputLib);
	    inputLib = {}; //make sure we don't change the original
	    $("#body").append( "<BR/>(pre)Inside Plus (subtraction) col:" + column + " val:" + inputLib[column]);
	    while(input.getValueLib().hasOwnProperty(column)){
		inputLib[column] = input.getValueLib()[column] * -1;
		$("#body").append( "<BR/>Inside Plus (subtraction) col:" + column + " val:" + inputLib[column]);
		column -= 1;
	    }
	} else {
	    inputLib = input.getValueLib();
	}

	column = 0;
	//find the lowest column
	while(inputLib.hasOwnProperty(column) || _valueLib.hasOwnProperty(column)){
	    column -= 1;
	}
	column += 1;
	
	while(inputLib.hasOwnProperty(column) || _valueLib.hasOwnProperty(column)){
	    colVal = 0;
	    if (inputLib.hasOwnProperty(column)){
		colVal += inputLib[column];
	    }
	    if (_valueLib.hasOwnProperty(column)){
		colVal += _valueLib[column];
	    }
	    results[column] = colVal;
//	$("#body").append( "<BR/> Plus column: " + column + "  colVal:" + colVal);  
	    column += 1;
	}
	_valueLib = results;
	_carryPlaces();
	return this;
	
    }


    //
    // The code below is for initalizing a new BigDec based on whatever gets passed into it
    //
    
    if(_isABigDec(rawVal)){
	_valueLib = rawVal.getValueLib();
    } else if(typeof(rawVal) == "string"){
	rawVal = parseFloat(rawVal, 10);
	_valueLib = {
	    0: rawVal
	};
	_carryPlaces();
	/*
	    throw { message: "String Conversion needs to be written so it chunks and then imports ",
		    name: "NotYetSupported"};
	*/
    } else if (typeof(rawVal) == "number"){
	if(rawVal < 0){
	    _isNegitive = true;
	}
	_valueLib = {
	    0: rawVal
	};
	_carryPlaces();
    } 

    return({
	isA:"bigDec2",

	getValueLib: function(){
	    return _valueLib;
	},
	
	print: function(){
	    var output = " ";
	    var column = _maxColumn();
	    while(_valueLib.hasOwnProperty(column)){
		if(column == -1){
		    output = output + "."
		}
		if (column != _maxColumn() && _valueLib[column] < 0){
		    output = output + (_valueLib[column] * -1);
		} else {
			output = output + _valueLib[column];
		}
		column -= 1;
	    }
	    return output;
	},
	
	eq:function(input){
	    input = _isABigDec(input) ? input : bigDec(input);
	    var targetLib = input.getValueLib();
	    var key;
	    
	    for( key in _valueLib){
		if(_valueLib.hasOwnProperty(key) && _valueLib[key] != 0){
		    if (!targetLib.hasOwnProperty(key)){
			return false;
		    }
		    if (targetLib[key] !== _valueLib[key]){
			return false;
		    }
		}
	    } 
	    
	    for( key in targetLib){
		if(targetLib.hasOwnProperty(key) && targetLib[key] != 0){
		    if (!_valueLib.hasOwnProperty(key)){
			return false;
		    }
		    if (targetLib[key] !== _valueLib[key]){
			return false;
		    }
		}
	    } 
	    
	    return true;
	},

	gt:function(input){
	    return !_lt(input, true);
	},
	
	lt:function(input){
	    return _lt(input, false);
	},
	
	gte:function(input){
	    return !_lt(input, false);
	},
	
	lte:function(input){
	    return _lt(input, true);
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
	    var inputLib = input.getValueLib();
	    var result = {};
	    var inputLibCol = _minColumn(inputLib);
	    var valueLibCol = _minColumn();
	    
	    while(inputLib.hasOwnProperty(inputLibCol)){
		while(_valueLib.hasOwnProperty(valueLibCol)){
		    result[valueLibCol + inputLibCol] = inputLib[inputLibCol] * _valueLib[valueLibCol];
		    valueLibCol += 1;
		}
		inputLibCol +=1;
	    }
	    _valueLib = result;
	    _carryPlaces();
	    return this;
	},

	over: function(input){
	    input = _isABigDec(input) ? input : bigDec(input);
	    var inputLib = input.getValueLib();
	    var result = {};
	    var inputLibCol = _minColumn(inputLib);
	    var valueLibCol = _minColumn();
	    
	    while(inputLib.hasOwnProperty(inputLibCol)){
		while(_valueLib.hasOwnProperty(valueLibCol)){
		    result[valueLibCol + inputLibCol] =  _valueLib[valueLibCol] / inputLib[inputLibCol];
		    valueLibCol += 1;
		}
		inputLibCol +=1;
	    }
	    _valueLib = result;
	    _carryPlaces();
	    return this;
	},
	
	dividedBy: function(input){
	    return(this.over(input));
	},

	isNegitive: function(){
	    return  _isNeg();
	},

	maxColumn : function(){
	    return _maxColumn();
	},

	minColumn : function(){
	    return _minColumn();
	},

	    
	});//close the bigDec clojure-"object"

};