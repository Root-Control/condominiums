'use strict';

/**
 * Module dependencies
 */
let path = require('path'),
  mongoose = require('mongoose'),
  Service_consumption = mongoose.model('Service_consumption'),
  Keys = require(path.resolve('./modules/keys/server/controllers/keys.server.controller')),
  billDetail = require(path.resolve('./modules/bill_sale_details/server/controllers/bill_sale_details.server.controller')),
  Groups = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  BillHeader = require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an service_consumption
 */

exports.create = async (req, res) => {
  let service_consumption = new Service_consumption(req.body);
  service_consumption.user = req.user;

  await service_consumption.save(async (err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      await Service_consumption.populate(service_consumption, { path: 'service' }, async (err, service_consumption) => {
        await createTransaction(service_consumption, req.user);
        res.json(service_consumption);
      });      
    }
  });
};

/**
 * Show the current service_consumption
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  let service_consumption = req.service_consumption ? req.service_consumption.toJSON() : {};

  // Add a custom field to the Service_consumption, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Service_consumption model.
  service_consumption.isCurrentUserOwner = !!(req.user && service_consumption.user && service_consumption.user._id.toString() === req.user._id.toString());

  res.json(service_consumption);
};

/**
 * Update an service_consumption
 */
exports.update = function (req, res) {
  let service_consumption = req.service_consumption;

  service_consumption.globalIdentifier = req.body.globalIdentifier;
  service_consumption.qty_consumed = req.body.qty_consumed;
  service_consumption.measure = req.body.measure;
  service_consumption.total = req.body.total;
  service_consumption.month = req.body.month;

  service_consumption.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service_consumption);
    }
  });
};

/**
 * Delete an service_consumption
 */
exports.delete = function (req, res) {
  let service_consumption = req.service_consumption;

  service_consumption.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service_consumption);
    }
  });
};

/**
 * List of Service_consumptions
 */
exports.list = function (req, res) {
  Service_consumption.find().sort('-created').populate('user', 'displayName').populate('service', 'name').exec(function (err, service_consumptions) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service_consumptions);
    }
  });
};

/**
 * Service_consumption middleware
 */
exports.service_consumptionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Service_consumption is invalid'
    });
  }

  Service_consumption.findById(id).populate('user', 'displayName').exec(function (err, service_consumption) {
    if (err) {
      return next(err);
    } else if (!service_consumption) {
      return res.status(404).send({
        message: 'No service_consumption with that identifier has been found'
      });
    }
    req.service_consumption = service_consumption;
    next();
  });
};

let createTransaction = async (consumed, user) => {
  return new Promise(async (resolve, reject) =>{
    let globalIdentifier = consumed.globalIdentifier;
    let type = consumed.service.type;
    let month = consumed.month;
    let data;
    let departmentsToapply;
    let avgWaterSupply;

    switch(type) {
      //  Global
      case 1:
        data = await Keys.getDataDepartmentsByCondominium(globalIdentifier);
        departmentsToapply = data.departments;
        console.log('Condominio -> Depas: ' + departmentsToapply.length);
        break;
      case 2:
      //  Group
        data = await Keys.getDataDepartmentsByGroup(globalIdentifier);
        avgWaterSupply = await Groups.getAvgWaterSupply(globalIdentifier)
        departmentsToapply = data.departments;
        console.log('Grupo -> Depas: ' + departmentsToapply.length);
        break;
      case 3:
      //  Tower
        data = await Keys.getDataDepartmentsByTower(globalIdentifier);
        departmentsToapply = data.departments;
        console.log('Torre -> Depas: ' + departmentsToapply.length);        
        break;
    }
    let amount = consumed.total;
    let serviceName = consumed.service.name;
    let qtyDivision = data.qty;
    let totalAmount = twoDecimals(amount / data.qty);

    console.log('departmentsToapply');
    console.log(departmentsToapply);
    let billHeaders = await BillHeader.getHeadersByDepartments(departmentsToapply, month);

    let x = 0;
    let detail = {};
    let iterateHeaders = function(headers) {
      console.log('headers');
      console.log(headers);
      detail = {
        user: user,
        amount: amount,
        serviceName: serviceName,
        qtyDivision: qtyDivision,
        totalAmount: totalAmount || 0,
        billHeader: headers[x]
      };

      billDetail.create(detail, function() {
          x++;
          if(x < headers.length) {
              iterateHeaders(headers);   
          } else {
            resolve();
          }
      }); 
    }

    iterateHeaders(billHeaders);
  });
}


function twoDecimals(num, decimals = 2) {
    let sign = (num >= 0 ? 1 : -1);
    num = num * sign;
    if (decimals === 0) //con 0 decimals
        return sign * Math.round(num);
    // round(x * 10 ^ decimals)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimals) : decimals)));
    // x * 10 ^ (-decimals)
    num = num.toString().split('e');
    return sign * (num[0] + 'e' + (num[1] ? (+num[1] - decimals) : -decimals));
}