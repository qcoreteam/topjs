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

describe("TopJs.Error", function ()
{
    let consoleError = console.error;
    let consoleLog = console.log;
    let consoleDir = console.dir;
    let consoleWarn = console.warn;
    beforeEach(function ()
    {
        console.error = console.log = console.dir = console.warn = TopJs.emptyFn;
    });
    afterEach(function ()
    {
        console.error = consoleError;
        console.log = consoleLog;
        console.dir = consoleDir;
        console.warn = consoleWarn;
    });
    describe("使用`TopJs.Error.raise`抛出一个错误", function ()
    {
        describe("传递一个字符串", function ()
        {
            it("抛出一个带有`msg`属性的异常", function ()
            {
                let error;
                try {
                    TopJs.raise("something wrong");
                } catch(err) {
                    error = err;
                }
                assert.equal(error.msg, "something wrong")
            });
            it("将错误在控制台显示", function ()
            {
                let calledWithMsg = false;
                console.error = function (s)
                {
                    if(s === "[E] foo"){
                        calledWithMsg = true;
                    }
                };
                try {
                    TopJs.raise("foo");
                }
                catch (err) {
                }
                assert.isTrue(calledWithMsg);
                
            });
            it("在控制台输出对象", function ()
            {
                let calledWithMsg = false;
                let calledMsg = '';
                console.dir = function (error)
                {
                    calledMsg = error.msg;
                };
                try {
                    TopJs.raise("foo");
                }
                catch (err) {
                }
                assert.equal(calledMsg, "foo");
            });
            it("`TopJs.Error.ignore` = true 什么都不做", function ()
            {
                TopJs.Error.ignore = true;
                let hasBeenCalled = false;
                console.error = function(){
                    hasBeenCalled = true;
                };
                try {
                    TopJs.raise("foo");
                }
                catch (err) {
                }
                assert.isFalse(hasBeenCalled);
                TopJs.Error.ignore = false;
            });
            it("如果`TopJs.Error.handle`返回`True`", function ()
            {
                let origHandle = TopJs.Error.handle;
                let hasBeenCalled = false;
                console.error = function(){
                    hasBeenCalled = true;
                };
                TopJs.Error.handle = function (error)
                {
                    assert.equal(error.msg, "foo");
                    return true;
                };
                try {
                    TopJs.raise({msg: 'foo'});
                }
                catch (err) {
                    assert.equal("这个异常不应该抛出", true);
                }
                assert.isFalse(hasBeenCalled);
                TopJs.Error.handle = origHandle;
            });
        });
        describe("传递自定义属性", function ()
        {
            it("使用自定义数据抛出异常", function ()
            {
                let error;
                try{
                    TopJs.raise({
                        msg: "Custom error",
                        data: {
                            foo: "bar"
                        }
                    });
                }catch(exp){
                    error = exp;
                }
                assert.equal(error.msg, "Custom error");
                assert.isNotNull(error.data);
                assert.equal(error.data.foo, "bar");
            });
        });
    });
    describe("直接抛出异常", function ()
    {
        describe("通过构造函数传递错误信息", function ()
        {
            it("should contain a msg property with the given string as value", function() {
                try {
                    throw new TopJs.Error("expected message");
                }
                catch (e) {
                    assert.instanceOf(e, Error);
                    assert.equal(e.message, "expected message")
                }
            });
        });
    });
});