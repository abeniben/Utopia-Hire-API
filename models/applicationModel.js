const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Job = require('./jobModel');
const JobSeeker = require('./jobSeekerModel');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  dateApplied: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  resume: { type: DataTypes.STRING, allowNull: false },

}, { timestamps: true });

Application.belongsTo(Job);       // Each application is for (one) job - fk jobId is added to the application table
Application.belongsTo(JobSeeker); // Each application is submitted by one job seeker - JobSeekerId is added to the Application table.



module.exports = Application;
