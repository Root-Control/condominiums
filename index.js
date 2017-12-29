'use strict';


//	Tinka
/*let play = [];
play[0] = [17, 13, 38, 31, 3, 22];
play[1] = [16, 1, 21, 11, 15, 25];
play[2] = [34, 13, 19, 22, 44, 5];
play[3] = [36, 38, 5, 45, 35, 29];
play[4] = [28, 23, 5, 21, 4, 1];
play[5] = [21, 45, 44, 38, 34, 36];
play[6] = [42, 3, 20, 11, 36, 15];
play[7] = [41, 25, 6, 3, 8, 24];
play[8] = [14, 1, 27, 11, 23, 37];
play[9] = [43, 8, 7, 37, 3, 27];
play[10] = [45, 14, 35, 42, 8, 9];
play[11] = [2, 43, 21, 5, 30, 27];
play[12] = [43, 11, 12, 33, 1, 35];
play[13] = [27, 41, 14, 26, 12, 6];
play[14] = [42, 9, 30, 24, 1, 37];
play[15] = [15, 31, 30, 10, 32, 25];
play[16] = [45, 43, 27, 11, 41, 25];*/

//	Gana Diario
let play = [];
play[0] =  [5, 12, 24, 7, 25];
play[1] =  [20, 22, 1, 11, 18];
play[2] =  [27, 22, 32, 11, 35];
play[3] =  [1, 5, 7, 2, 32];
play[4] =  [12, 3, 7, 8, 1];
play[5] =  [18, 10, 23, 16, 19];
play[6] =  [29, 21, 23, 4, 18];
play[7] =  [11, 12, 13, 22, 29];
play[8] =  [20, 6, 24, 9, 10];
play[9] =  [20, 12, 13, 10, 11];
play[10] = [23, 14, 16, 13, 8];
play[11] = [18, 31, 29, 6, 7];
play[12] = [23, 32, 21, 26, 6];
play[13] = [2, 18, 17, 19, 6];
play[14] = [16, 8, 27, 23, 13];
play[15] = [22, 30, 25, 34, 19];
play[16] = [32, 26, 14, 22, 23];
play[17] = [1, 12, 11, 33, 34];
play[18] = [20, 13, 25, 24, 22];
play[19] = [22, 35, 14, 2, 25];
play[20] = [25, 16, 18, 1, 23];
play[21] = [14, 6, 15, 31, 5];
play[22] = [28, 10, 16, 8, 35];
play[23] = [11, 25, 21, 30, 8];
play[24] = [9, 27, 16, 17, 1];
play[25] = [30, 1, 6, 35, 27];
play[26] = [1, 13, 15, 35, 20];





function sortNumber(a,b) {
    return a - b;
}

let getAwait = async() => {
	for(var i = 0; i < 17; i++) {
		let combination = await doCombination(i); 
		console.log('play[' + i + '] = [' + combination + '];');
	}
};


function doCombination(number) {
	return new Promise((resolve, reject) => {
		play[number].sort(sortNumber);
		resolve(play[number].join(', '));
	});M
}

function countItems() {
	let repeatedNumbers = [];
	let numeric = [];
	for(var i = 0; i < play.length; i++)  {
		for(var x = 0; x < play[i].length; x++) {
			if(!numeric[play[i][x]]) numeric[play[i][x]] = 1;
			else numeric[play[i][x]] = numeric[play[i][x]] + 1;
		}
	}
	for(var i = 1; i < 35; i++) {
		if(numeric[i] > 2) {
			repeatedNumbers.push(i);
			//	console.log('El numero ' + i + ' se repite ' + (numeric[i] || 0) + ' veces, || Porcentaje de apariciones: ' +  ((numeric[i] || 0)/27 * 100).toFixed(2) +'%');
		}
	}
	randomItems(repeatedNumbers);	
}

countItems();

function randomItems (numbers) {
	let tinka = [];
	for(let i = 0; i<5; i++) {
		var item = numbers[Math.floor(Math.random() * numbers.length)];
		tinka.push(item);
		remove(numbers, item);
	}
	console.log(tinka);
}

function remove(array, search_term) {
	for (var i=array.length-1; i>=0; i--) {
	    if (array[i] === search_term) {
	        array.splice(i, 1);
	    }
	}
}

//randomItems();