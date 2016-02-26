var express = require('express');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
   var products = [];
   var sql = "select id, name, description, category, price "+
             "from greendb.products";
   pool.getConnection(function(err, connection) {
      if(err) {
         next(err);
      } else {
         connection.query(sql, [], function(err, rows, fields) {
            connection.release();
            if(err) {
               next(err);
            } else {
               async.each(rows, function(row, callback) {
                  var product = {
                     "id" : row['id'],
                     "name" : row['name'],
                     "description" : row['description'],
                     "category" : row['category'],
                     "price" : row['price']
                  };
                  products.push(product);
                  callback(null);
               }, function(err, result) {
                  if(err) {
                     next(err);
                  } else {
                     res.json(products);
                  }
               });
            }
         });
      }
   });
});

module.exports = router;
