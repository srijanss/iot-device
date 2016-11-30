'use strict';


var Simulator = require('./simulator');


// var options = {
// 	host: 'localhost',
// 	port: '10010'
// };

var api = 'getTemperature';

var simulate = new Simulator();


var time = process.hrtime();
simulate.get(api);
simulate.on('get_success', function(){
    console.log(simulate.RESPONSE);
	var diff = process.hrtime(time);
	console.log('Time taken : '+ diff[0] + diff[1]/1e9 + ' seconds');
});


