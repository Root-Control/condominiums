'use strict';

function dynamic(param1) {
	console.log(arguments[0]);
	console.log(arguments[1]);
	console.log(arguments[2]);
	console.log(arguments[3]);
}


dynamic('jsonparseable', 'stringparseable', 'numberparse', 'booleanparse');