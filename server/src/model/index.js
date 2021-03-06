"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require('../../config/config');
var dbconfig  = config.databaseConfiguration;
var sequelize = new Sequelize("mysql://" + dbconfig.user + ":" + dbconfig.pass + "@" + dbconfig.host + "/" + dbconfig.name);
var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
sequelize
    .sync({ force: false })
    .then(function(err) {
        console.log('It worked!');
    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });

module.exports = db;