/**
 * Created by skplanet on 2016-02-05.
 */
var dbconfig = require('./dbconfig');
var mysql = require('mysql');

module.exports = mysql.createPool(dbconfig);
