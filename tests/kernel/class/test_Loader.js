/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../../lib/Index");
let assert = require("chai").assert;
let Namespace = require("../../../lib/kernel/class/Namespace");
describe('TopJs.Loader', function() {

    beforeEach(function(){
        TopJs.Loader.unmountRegisteredNamespaces();
    });
    it("测试normalizeDirectory", function () {
        assert.equal(TopJs.Loader.normalizeDirectory("/some/path"), '/some/path/');
    });

    it("测试normalizeDirectory", function(){
        let filename = TopJs.Loader.normalizeDirectory("root/subdir//");
        assert.equal(filename, "root/subdir//");
        filename = TopJs.Loader.normalizeDirectory("root/subdir/\\");
        assert.equal(filename, "root/subdir//");
        filename = TopJs.Loader.normalizeDirectory("root/subdir");
        assert.equal(filename, "root/subdir/");
    });

    it("测试registerNamespace", function(){
        TopJs.Loader.registerNamespace("TopJs", "root/subdir/");
        assert.equal(TopJs.Loader.namespaces.size, 1);
        assert.instanceOf(TopJs.Loader.namespaces.get('TopJs'), Namespace);
        assert.equal(TopJs.Loader.namespaces.get('TopJs').directory, "root/subdir/");
        TopJs.Loader.registerNamespace("TopJs.kernel", "root/subdir/kernel");
        TopJs.Loader.registerNamespace("TopJs.kernel.Loader", "root/vender/TopJs.Loader");
        let ns = TopJs.Loader.getNamespace('TopJs.kernel');
        assert.instanceOf(ns, Namespace);
        assert.equal(ns.directory, "root/subdir/kernel/");
        ns = TopJs.Loader.getNamespace('TopJs.kernel.Loader');
        assert.instanceOf(ns, Namespace);
        assert.equal(ns.directory, "root/vender/TopJs.Loader/");
    });

    it("测试registerNamespaces", function(){
       TopJs.Loader.registerNamespaces({
          TopJs1: "root/subdir/",
          Vender: "root/venderdir/"
       });
       assert.equal(TopJs.Loader.namespaces.size, 3);
       assert.equal(TopJs.Loader.namespaces.get('TopJs1').directory, "root/subdir/");
       assert.equal(TopJs.Loader.namespaces.get('Vender').directory, "root/venderdir/");
    });

    it("测试transformClassNameToFilenameByNamespace", function(){
       TopJs.Loader.registerNamespaces({
          TopJs: "root/subdir/",
          "TopJs.kernel" : "root/subdir/",
          Vender: "root/venderdir/"
       });
       let filename = TopJs.Loader.transformClassNameToFilenameByNamespace('TopJs.kernel.SomeClass');
       assert.equal(filename, "root/subdir/SomeClass.js");
       filename = TopJs.Loader.transformClassNameToFilenameByNamespace('TopJs.kernelx.sdafasd.SomeClass');
       assert.equal(filename, "root/subdir/sdafasd/kernelx/SomeClass.js");
    });


    it("测试register", function(){
       let base = process.cwd() + "/lib";
       TopJs.Loader.registerNamespaces({
          TopJs: base,
          "TopJs.kernel": base+"/kernel"
       });
       let ns = TopJs.Loader.getNamespace("TopJs.TopJs.Loader");
       assert.isNull(ns);
    });
});
