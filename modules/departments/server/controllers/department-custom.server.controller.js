'use strict';

/**
 * Module dependencies
 */
let path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Department = mongoose.model('Department'),
  Groups = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  Consumptions = require(path.resolve('./modules/service_consumptions/server/controllers/service_consumptions.server.controller')),
  CustomGroup = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  Keys = require(path.resolve('./modules/keys/server/controllers/keys.server.controller')),
  CustomTower = require(path.resolve('./modules/towers/server/controllers/towers-custom-queries.server.controller')),
  Bill = require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.generateBill = async function (req, res) {
  let current_month =  moment().format('M');
  let current_year =  moment().format('Y');

  let year = req.query.year;
  if(!year) year = current_year;
  current_month = 0;

  let departments = await listDepartments();
  let arrayDepartment;
  let dep;

  let x = 0;

  let iterateDepartments = function(departments) {
    arrayDepartment = [];
    dep = {};
    for(let i = 12; i > current_month; i--) {
      dep.status = 'Pendiente';
      dep.department = departments[x]._id;
      dep.month = i;
      dep.year = parseInt(year, 10);
      dep.due_date = new Date(year + '-' + i + '-' + '25');
      arrayDepartment.push(dep);
      dep = {};
    }
    console.log(arrayDepartment);
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

exports.createBillHeadersByDepartment = async(department) => {
  return new Promise((resolve, reject) => {
    let arrayDepartment = [];
    let current_month =  moment().format('M');
    let current_year =  moment().format('Y');
    current_month = 0;
    let dep = {};
    for(let i = 12; i > current_month; i--) {
      dep.status = 'Pendiente';
      dep.department = department._id;
      dep.month = i;
      dep.year = parseInt(current_year, 10);
      dep.due_date = new Date(current_year + '-' + i + '-' + '25');
      arrayDepartment.push(dep);
      dep = {};
    }
    Bill.dumpHeaders(arrayDepartment, function () {
      resolve();
    });
  });
};

exports.populateDepartment = async departmentId => {

  return new Promise(async (resolve, reject) => {
    //  Deep-Population, deep population, deeppoulation
    Department.findOne({ _id: departmentId }).populate({ path: 'tower', populate: { path: 'groupAssigned' }}).exec(async(err, department) => {
      if(err) console.log(err);
      else resolve(department);      
    })
  });
}

function listDepartments() {
  return new Promise((resolve, reject) => {
    Department.find().sort('-created').populate('user', 'displayName').exec(function (err, departments) {
      if (err) reject(err);
      else resolve(departments);
    });
  });
}

exports.getDepartmentsByCondominium = async(req, res) => {
  let departmentsResponse = [];
  let groupIds = [];
  let groups = await CustomGroup.listGroupsForCondominiumId(req.query.condominiumId, 'promise');
  groups.forEach((key) => {
    groupIds.push(key._id);
  });

  let towers = await CustomTower.getTowersByGroups(groupIds);

  Department.find({ tower: { $in: towers } }).sort('-created').populate('user', 'displayName').exec( async function (err, departments) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      //  Obtener el grupo de cada departamento y traer su avgWater
      for(let i = 0; i < departments.length; i++) {
        let lastConsume = 0;
        let keyData = await Keys.getGroupByDepartmentId(departments[i]._id);
        let avgWaterSupply = await Groups.getAvgWaterSupply(keyData.group);
        let lastConsumption = await Consumptions.verifyPreviousConsume(departments[i]._id, req.query.month);
        if(lastConsumption) lastConsume = lastConsumption.consumed;
        departmentsResponse.push({ _id: departments[i]._id, code: departments[i].code, description: departments[i].description, avgWaterSupply: avgWaterSupply, lastConsume: lastConsume })
        //  LastConsume
      }

      res.json(departmentsResponse);
    }
  });
};

exports.getDepartmentsByTower = async(req, res) => {
  let departmentsResponse = [];
  let data =  {};
  let registered;
  Department.find({ tower: req.query.towerId }).sort('-created').populate('user', 'displayName').exec( async function (err, departments) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      data.year = req.query.year;
      data.month = req.query.month;
      data.departments = departments;
      let alreadyRegistered = await Consumptions.getCurrentRegisteredSupplies(data);
      departments = deleteRegisteredConsumptions(alreadyRegistered, departments);
      //  Aqui
      //  Obtener el grupo de cada departamento y traer su avgWater
      for(let i = 0; i < departments.length; i++) {
        let lastConsume = 0;
        let keyData = await Keys.getGroupByDepartmentId(departments[i]._id);
        let avgWaterSupply = await Groups.getAvgWaterSupply(keyData.group);
        let lastConsumption = await Consumptions.verifyPreviousConsume(departments[i]._id, req.query.month);
        if(lastConsumption) lastConsume = lastConsumption.consumed;
        departmentsResponse.push({ _id: departments[i]._id, code: departments[i].code, description: departments[i].description, avgWaterSupply: avgWaterSupply, lastConsume: lastConsume })
        //  LastConsume
      }

      res.json(departmentsResponse);
    }
  });
};

exports.getDepartmentsByCodeRegex = (req, res) => {
  return new Promise(async(resolve, reject) => {
    let type = typeof req;
    let result;
    if(type === 'string') {
      result = await search(req);
      resolve(result);
    } else {
      result = await search(req.query.code);
      res.json(result);
    }
  });
};

exports.getActiveDepartmentsQty = async(req, res) => {
  let totals = await Keys.activeDepartments();
  res.json(totals);
};

let search = async (code) => {
  return new Promise((resolve, reject) => {
    Department.find({ code: new RegExp(code, 'i') }, function(err, department) {
      if(err) reject(err);
      else resolve(department);
    }).populate('tower', 'name');
  });
};

let deleteRegisteredConsumptions = (alreadyRegistered, departments) => {
  let registered;
  let response = [];
  for(let i = 0; i< departments.length; i++) {
    let registered = alreadyRegistered.includes(departments[i]._id.toString());
    if(!registered) response.push(departments[i]);
  }

  return response;
};
