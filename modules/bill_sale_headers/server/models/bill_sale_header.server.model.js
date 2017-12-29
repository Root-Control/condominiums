'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Bill_sale_header Schema
 */
var Bill_sale_headerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  month: {
    type: Number,
    trim: true
  },
  year: {
    type: Number,
    default: 2017
  },
  due_date: {
    type: Date,
    default: ''
  },
  status: {
    type: String,
    default: 'Pendiente'
  },
  department: {
    type: Schema.ObjectId,
    ref: 'Department'
  }
});

Bill_sale_headerSchema.index({ department: 1, month: 1 }, { unique: true });

mongoose.model('Bill_sale_header', Bill_sale_headerSchema);
