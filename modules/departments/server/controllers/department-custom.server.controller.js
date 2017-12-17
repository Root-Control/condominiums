'use strict';

/**
 * Module dependencies
 */
let path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Department = mongoose.model('Department'),
  Bill = require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.generateBill = async function (req, res) {
  let current_month =  moment().format('M');
  let current_year =  moment().format('Y');
  current_month = 0;

  let departments = await listDepartments();
  let arrayDepartment;
  let dep;

  let x = 0;

  let iterateDepartments = function(departments) {
    arrayDepartment = [];
    dep = {};
    for(let i = 12; i > current_month; i--) {
      dep.department = departments[x]._id;
      dep.month = i;
      dep.year = current_year;
      dep.due_date = new Date(current_year + '-' + i + '-' + '25');
      arrayDepartment.push(dep);
      dep = {};
    }
    Bill.dumpHeaders(arrayDepartment, function (){
      x++;
      if(x < departments.length) {
          iterateDepartments(departments);   
      } else {
        res.json({ status: 'success'})
      }
    }); 
  }

  iterateDepartments(departments);
};

function listDepartments() {
  return new Promise((resolve, reject) => {
    Department.find().sort('-created').populate('user', 'displayName').exec(function (err, departments) {
      if (err) reject(err);
      else resolve(departments);
    });
  });
}
