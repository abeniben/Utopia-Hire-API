const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Employer = require('./employerModel');

const Job = sequelize.define('Job', {
  id: { type: DataTypes.INTEGER, allowNull:false, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.FLOAT, allowNull: false },
  datePosted: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { timestamps: true });


Job.belongsTo(Employer); // Each Job is posted by one Employer(A foreign key of employerid is added to job table)

module.exports = Job;
 