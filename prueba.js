function gritar(param, cb) {
	console.log(param);
	cb(param);
};



gritar(1, callbacked);


function callbacked(a, b, c) {
	console.log(a);
	console.log(b);
	console.log(c);
}