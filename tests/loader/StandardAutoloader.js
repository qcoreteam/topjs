/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require('chai').assert;
let StandardAutoloader = require('../../lib/loader/StandardAutoloader');

describe('loader/StandardAutoloader测试用例', function() {
   let loader;
   beforeEach(function(){
      loader = new StandardAutoloader();
   });
   
   it("测试normalizeDirectory", function(){
      assert.equal(loader.normalizeDirectory("/some/path"), '/some/path/');
   });
   
   it("测试transformClassNameToFilename", function(){
      let filename = loader.transformClassNameToFilename('TopJs.loader.AutoloaderFactory', 'root/');
      assert.equal(filename, "root/TopJs/loader/AutoloaderFactory.js");
   });
   
   it("测试normalizeDirectory", function(){
      let filename = loader.normalizeDirectory("root/subdir//");
      assert.equal(filename, "root/subdir//");
      filename = loader.normalizeDirectory("root/subdir/\\");
      assert.equal(filename, "root/subdir//");
      filename = loader.normalizeDirectory("root/subdir");
      assert.equal(filename, "root/subdir/");
   });

   // it("测试registerNamespace", function(){
   //    loader.registerNamespace('TopJs', 'root/subdir/');
   //    // assert.equal(filename, "root/TopJs/loader/AutoloaderFactory.js");
   // });
   
});
