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

   it("测试registerNamespace", function(){
      loader.registerNamespace("TopJs", "root/subdir/");
      assert.equal(loader.namespaces.size, 1);
      assert.equal(loader.namespaces.get('TopJs'), "root/subdir/");
   });

   it("测试registerNamespaces", function(){
      loader.registerNamespaces({
         TopJs: "root/subdir/",
         Vender: "root/venderdir/"
      });
      assert.equal(loader.namespaces.size, 2);
      assert.equal(loader.namespaces.get('TopJs'), "root/subdir/");
      assert.equal(loader.namespaces.get('Vender'), "root/venderdir/");
   });

   it("测试registerPrefix", function(){
      loader.registerPrefix("TopJs", "root/subdir/");
      assert.equal(loader.prefixes.size, 1);
      assert.equal(loader.prefixes.get('TopJs_'), "root/subdir/");
   });

   it("测试registerPrefixs", function(){
      loader.registerPrefixes({
         TopJs: "root/subdir/",
         Vender: "root/venderdir/"
      });
      assert.equal(loader.prefixes.size, 2);
      assert.equal(loader.prefixes.get('TopJs_'), "root/subdir/");
      assert.equal(loader.prefixes.get('Vender_'), "root/venderdir/");
   });

   it("测试loadClass", function(){
      let base = process.cwd() + "/lib";
      loader.registerNamespaces({
         TopJs: base,
         Vender: "root/venderdir/"
      });
      let Cls = loader.loadClass("TopJs.loader.StandardAutoloader", StandardAutoloader.LOAD_NS);
      assert.equal(StandardAutoloader.ACT_AS_FALLBACK, "fallback_autoloader");
   });

   it("测试setOptions", function(){
      loader.setOptions({
         [StandardAutoloader.AUTO_REGISTER_TOPJS] : true
      });
      assert.equal(loader.namespaces.size, 1);
      assert.equal(loader.namespaces.get('TopJs'), process.cwd()+"/lib/");
   });
   
});
