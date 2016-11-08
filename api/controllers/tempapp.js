'use strict';

/* Module Dependencies
*/


//GET /getTemperature operationId
function get_temp(req, res, next) {
    var temp = 25;
    res.json(temp);
}

module.exports = {get_temp};