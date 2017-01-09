/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
'use strict'; // eslint-disable-line

let gulp = require("gulp");
let jsdoc = require('gulp-jsdoc3');

gulp.task("default", function() {
   // place code for your default task here
   
});

gulp.task("apidocs", function(){
   let config = require('./jsdoc.json');
   gulp.src(['./src/**/*.js'], {read: false})
   .pipe(jsdoc(config));
});