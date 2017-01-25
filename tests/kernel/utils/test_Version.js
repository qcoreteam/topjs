/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

const StandardLoader = require("../../../lib/Entry").StandardLoader;
let assert = require("chai").assert;
let loader = new StandardLoader({
    [StandardLoader.AUTO_REGISTER_TOPJS]: true
});
loader.register();
describe("TopJs.Version", function ()
{
    let version = new TopJs.Version("1.2.1alpha");
    describe("toString", function ()
    {
        it("转换成字符串", function ()
        {
            assert.equal(version.toString(), "1.2.1alpha");
        });
    });

    describe("getMajor", function ()
    {
        it("获取版本信息`major`部分", function ()
        {
            assert.equal(version.getMajor(), 1);
        });
        it("获取版本信息`minor`部分", function ()
        {
            assert.equal(version.getMinor(), 2);
        });
        it("获取版本信息`patch`部分", function ()
        {
            assert.equal(version.getPatch(), 1);
        });
        it("获取版本信息`build`部分", function ()
        {
            assert.equal(version.getBuild(), 0);
        });
        it("获取版本信息的`release`部分", function ()
        {
            assert.equal(version.getRelease(), "alpha");
        });
        it("获取短版本信息", function ()
        {
            assert.equal(version.getShortVersion(), "121");
        });
        it("获取版本信息", function ()
        {
            assert.deepEqual(version.toArray(), [1, 2, 1, 0, "alpha"]);
        });
    });
    describe("TopJs.Version.isGreaterThan", function ()
    {
        it("应该大于1.2.0beta", function ()
        {
            assert.isTrue(version.isGreaterThan("1.2.0beta"));
        });
        it("应该大于1.2.0RC", function ()
        {
            assert.isTrue(version.isGreaterThan("1.2.0RC"));
        });
    });
    describe("TopJs.Version.isLessThan", function ()
    {
        it("应该小于1.2.2beta", function ()
        {
            assert.isTrue(version.isLessThan("1.2.2beta"));
        });
        it("应该小于1.2.2RC", function ()
        {
            assert.isTrue(version.isLessThan("1.2.2alpha"));
        });
    });
    describe("TopJs.Version.equals", function ()
    {
        it("应该等于1.2.1alpha", function ()
        {
            assert.isTrue(version.equals("1.2.1alpha"));
        });
    });

    describe("TopJs.Version.compareTo", function ()
    {
        function compare_to(v1, v2, expected)
        {
            let v = new TopJs.Version(v1);
            let c = v.compareTo(v2);
            if (c !== expected) {
                assert.equal('new Version(' + v1 + ').compare_to(' + v2 + ') == ' + c, expected);
            } else {
                assert.equal(c, expected);
            }
        }
        describe("测试^pad", function ()
        {
            describe("Zero padding", function ()
            {
                it("左边小于右边", function ()
                {
                    compare_to("^2.3", "2.4", -1);
                    compare_to("^2.3", "3", -1);
                });
                it("需要大于右边", function ()
                {
                    compare_to("^2.3", "1", 1);
                    compare_to("^2.3", "2", 1);
                    compare_to("^2.3", "2.3", 1);
                    compare_to("^2.3", "2.2", 1);
                    compare_to("^2.3", "2.3.100", 1);
                });
            });
            describe("Prefix match", function ()
            {
                it("应该小于", function ()
                {
                    compare_to("2.3", "~2.3.1", -1);
                    compare_to("2.3", "~2.4.1", -1);
                    compare_to("2.3", "~3", -1);
                });
                it("应该相等", function ()
                {
                    compare_to("2.3", "~2", 0);
                    compare_to("2.3", "~2.3", 0);
                    compare_to("2.3", "~2.3.0", 0);
                });
                it("应该大于", function ()
                {
                    compare_to("2.3", "~2.2", 1);
                    compare_to("2.3", "~1", 1);
                })
            });
            describe("Upper bound vs", function () {
                describe("Zero padding", function () {
                    it('should be less than', function () {
                        compare_to('^2.3', '2.4', -1);
                        compare_to('^2.3', '3', -1);
                    });
                    it('should be greater than', function () {
                        compare_to('^2.3', '1', 1);
                        compare_to('^2.3', '2', 1);
                        compare_to('^2.3', '2.3', 1);
                        compare_to('^2.3', '2.2', 1);
                        compare_to('^2.3', '2.3.9', 1);
                    });
                });

                describe("Upper bound", function () {
                    it('should be less than', function () {
                        compare_to('^2.3', '^2.4', -1);
                        compare_to('^2.3', '^3', -1);
                    });
                    it('should be equal', function () {
                        compare_to('^2.3', '^2.3', 0);
                    });
                    it('should be greater than', function () {
                        compare_to('^2.3', '^2.2', 1);
                        compare_to('^2.3', '^1', 1);
                    });
                });

                describe("Prefix match", function () {
                    it('should be less than', function () {
                        compare_to('^2.3', '~2.4', -1);
                        compare_to('^2.3', '~3', -1);
                    });
                    it('should be equal', function () {
                        compare_to('^2.3', '~2.3', 0);
                        compare_to('^2.3', '~2', 0);
                    });
                    it('should be greater than', function () {
                        compare_to('^2.3', '~2.2', 1);
                        compare_to('^2.3', '~1', 1);
                    });
                });
            }); // Upper bound
            describe("Prefix match vs", function () {
                describe("Zero padding", function () {
                    it('should be less than', function () {
                        compare_to('~2.3', '2.4', -1);
                        compare_to('~2.3', '3', -1);
                    });
                    it('should be equal', function () {
                        compare_to('~2.3', '2.3.4.5', 0);
                        compare_to('~2.3', '2.3.4', 0);
                        compare_to('~2.3', '2.3', 0);
                    });
                    it('should be greater than', function () {
                        compare_to('~2.3', '2.2', 1);
                        compare_to('~2.3', '2', 1);
                        compare_to('~2.3', '1', 1);
                    });
                });

                describe("Upper bound", function () {
                    it('should be less than', function () {
                        compare_to('~2.3', '^2.4', -1);
                        compare_to('~2.3', '^2', -1);
                    });
                    it('should be equal', function () {
                        compare_to('~2.3', '^2.3.4', 0);
                        compare_to('~2.3', '^2.3', 0);
                    });
                    it('should be greater than', function () {
                        compare_to('~2.3', '^2.2', 1);
                        compare_to('~2.3', '^2.1', 1);
                        compare_to('~2.3', '^1', 1);
                    });
                });

                describe("Prefix match", function () {
                    it('should be less than', function () {
                        compare_to('~2.3', '~2.4', -1);
                        compare_to('~2.3', '~3', -1);
                    });
                    it('should be equal', function () {
                        compare_to('~2.3', '~2.3.4', 0);
                        compare_to('~2.3', '~2.3', 0);
                        compare_to('~2.3', '~2', 0);
                    });
                    it('should be greater than', function () {
                        compare_to('~2.3', '~2.2', 1);
                        compare_to('~2.3', '~1', 1);
                    });
                });
            });
        });
    });

    describe("TopJs.Version.getCompValue", function() {
        it("should return 0", function() {
            assert.equal(TopJs.Version.getCompValue(undefined), 0);
        });

        it("should return -2", function() {
            assert.equal(TopJs.Version.getCompValue(-2), -2);
        });

        it("should return 2", function() {
            assert.equal(TopJs.Version.getCompValue("2"), 2);
        });

        it("should return -5", function() {
            assert.equal(TopJs.Version.getCompValue("alpha"), -5);
        });

        it("should return unknown", function() {
            assert.equal(TopJs.Version.getCompValue("unknown"), "unknown");
        });
    });
    
    describe("TopJs.Version.compare", function() {
        it("should return 1", function() {
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.2"), 1);
            assert.equal(TopJs.Version.compare("1.2.3beta", 1), 1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3dev"), 1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3alpha"), 1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3a"), 1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3alpha"), 1);
        });

        it("should return -1", function() {
            assert.equal(TopJs.Version.compare("1.2.3beta", 2), -1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.4"), -1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3RC"), -1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3rc"), -1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3#"), -1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3pl"), -1);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3p"), -1);
        });

        it("should return 0", function() {
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3b"), 0);
            assert.equal(TopJs.Version.compare("1.2.3beta", "1.2.3beta"), 0);
        });
    });
});
