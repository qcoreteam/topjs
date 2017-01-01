/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require("chai").assert;
let StandardAutoloader = require("../../../lib/kernel/loader/StandardAutoloader");
let Namespace = require("../../../lib/kernel/loader/Namespace").default;

describe('loader/StandardAutoloader测试用例', function() {
   let loader;
   beforeEach(function(){
      loader = new StandardAutoloader();
   });

   it("测试normalizeDirectory", function(){
      assert.equal(loader.normalizeDirectory("/some/path"), '/some/path/');
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
      assert.instanceOf(loader.namespaces.get('TopJs'), Namespace);
      assert.equal(loader.namespaces.get('TopJs').directory, "root/subdir/");
      loader.registerNamespace("TopJs.kernel", "root/subdir/kerel");
      loader.registerNamespace("TopJs.kernel.loader", "root/vender/loader");
      let ns = loader.getNamespace('TopJs.kernel');
      assert.instanceOf(ns, Namespace);
      assert.equal(ns.directory, "root/subdir/kerel/");
      ns = loader.getNamespace('TopJs.kernel.loader');
      assert.instanceOf(ns, Namespace);
      assert.equal(ns.directory, "root/vender/loader/");
   });

   it("测试registerNamespaces", function(){
      loader.registerNamespaces({
         TopJs: "root/subdir/",
         Vender: "root/venderdir/"
      });
      assert.equal(loader.namespaces.size, 2);
      assert.equal(loader.namespaces.get('TopJs').directory, "root/subdir/");
      assert.equal(loader.namespaces.get('Vender').directory, "root/venderdir/");
   });

   it("测试transformClassNameToFilenameByNamespace", function(){
      loader.registerNamespaces({
         TopJs: "root/subdir/",
         "TopJs.kernel" : "root/subdir/loader",
         Vender: "root/venderdir/"
      });
      let filename = loader.transformClassNameToFilenameByNamespace('TopJs.kernel.SomeClass');
      assert.equal(filename, "root/subdir/loader/SomeClass.js");
      filename = loader.transformClassNameToFilenameByNamespace('TopJs.kernelx.sdafasd.SomeClass');
      assert.equal(filename, "root/subdir/sdafasd/kernelx/SomeClass.js");
   });
   
   it("测试setOptions", function(){
      loader.setOptions({
         [StandardAutoloader.AUTO_REGISTER_TOPJS] : true
      });
      assert.equal(loader.namespaces.size, 1);
      assert.equal(loader.namespaces.get('TopJs').directory, process.cwd()+"/lib/");
   });
   
   it("测试register", function(){
      let base = process.cwd() + "/lib";
      loader.registerNamespaces({
         TopJs: base,
         "TopJs.kernel": base+"/kernel"
      });
      loader.register();
      let ns = loader.getNamespace("TopJs.loader");
      assert.isNull(ns);
      let obj = new TopJs.kernel.loader.StandardAutoloader();
      assert.instanceOf(obj, StandardAutoloader);
   });
});
