/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require("chai").assert;
let TopJs = require("../../../lib/Index");

describe("TopJs.Function", function ()
{

    let _setTimeout;
    let _clearTimeout;
    let timeouts;
    let clearedTimeoutIds;
    let mockTimeout = function()
    {
        timeouts = [];
        timeoutIds = [];
        clearedTimeoutIds = [];
        _setTimeout = setTimeout;
        setTimeout = function(fn, timeout) {
            timeouts.push(timeout);
            let timeoutId = _setTimeout.apply(this, arguments);
            timeoutIds.push(timeoutId);
            return timeoutId;
        };
        _clearTimeout = clearTimeout;
        clearTimeout = function(timeoutId) {
            clearedTimeoutIds.push(timeoutId);
            _clearTimeout.apply(this, arguments);
        };
    };
    let unmockTimeout = function ()
    {
        timeouts = undefined;
        timeoutIds = undefined;
        clearedTimeoutIds = undefined;
        setTimeout = _setTimeout;
        clearTimeout = _clearTimeout;
    };

    describe("TopJs.Function.pass", function ()
    {
        let calledArgs = [];
        let func = function ()
        {
            calledArgs = Array.from(arguments);
        };
        afterEach(function ()
        {
            calledArgs = [];
        });
        it("应该传递指定的参数给创建的代理函数", function ()
        {
            let passedFunc = TopJs.Function.pass(func, [0, 1, 2]);
            passedFunc(3, 4);
            assert.deepEqual(calledArgs, [0, 1, 2, 3, 4]);
        });
        it("参数只有一个元素的时候可以不传递数组", function ()
        {
            let passedFunc = TopJs.Function.pass(func, 0);
            passedFunc(1, 2);
            assert.deepEqual(calledArgs, [0, 1, 2]);
            calledArgs = [];
            passedFunc = TopJs.Function.pass(func, "a string");
            passedFunc(1, 2);
            assert.deepEqual(calledArgs, ["a string", 1, 2]);
        });
        it("能处理`arguments`参数的魔术变量", function ()
        {
            let testFunc = function ()
            {
                let passedFunc = TopJs.Function.pass(func, arguments);
                passedFunc('a', 'b');
                assert.deepEqual(calledArgs, [1, 2, 3, 'a', 'b']);
            };
            testFunc(1, 2, 3);
        });
        it("传入undefined参数，忽略", function()
        {
            let passedFunc = TopJs.Function.pass(func, undefined);
            passedFunc(1, 2);
            assert.deepEqual(calledArgs, [1, 2]);
        });
        it("默认使用`this`作用域", function ()
        {
            let foo = 'a';
            let scopedFunc = function ()
            {
                calledArgs = Array.from(arguments);
                foo = this.foo;
            };
            let passedFunc = TopJs.Function.pass(scopedFunc, 'arg');
            passedFunc(1);
            assert.deepEqual(calledArgs, ["arg", 1]);
            assert.isUndefined(foo);
        });
        it("指定作用域", function ()
        {
            let foo = 'a';
            let scope = {foo:'b'};
            let scopedFunc = function ()
            {
                calledArgs = Array.from(arguments);
                foo = this.foo;
            };
            let passedFunc = TopJs.Function.pass(scopedFunc, 'arg', scope);
            passedFunc(1);
            assert.deepEqual(calledArgs, ["arg", 1]);
            assert.deepEqual(foo, 'b');
        });
    });

    describe("TopJs.Function.clone", function()
    {
        it("克隆指定的函数", function()
        {
            let callArgs = [];
            let func = function ()
            {
                callArgs = Array.from(arguments);
                return "bar";
            };
            let passedFunc = TopJs.Function.pass(func, 'arg');
            let ret = passedFunc(1);
            assert.deepEqual(callArgs, ["arg", 1]);
            assert.equal(ret, "bar");
        });
    });
    describe("TopJs.Function.createInterceptor", function ()
    {
        let interceptorIsRunFirst;
        let interceptedIsRunAfter;
        let interceptor;
        let interceptorFnScope;
        let fakeScope = {};
        let interceptorFn = function ()
        {
            interceptorIsRunFirst = true;
            interceptorFnScope = this;
        };
        let interceptedFn = function ()
        {
            interceptedIsRunAfter = interceptorIsRunFirst;
        };
        beforeEach(function ()
        {
            interceptorIsRunFirst = false;
            interceptedIsRunAfter = false;
        });
        it("没有拦截器，返回原来的函数", function ()
        {
            assert.equal(TopJs.Function.createInterceptor(interceptedFn), interceptedFn);
        });
        describe("当传入一个拦截器函数", function ()
        {
            beforeEach(function ()
            {
                interceptor = TopJs.Function.createInterceptor(interceptedFn, interceptorFn, fakeScope);
                interceptor();
            });
            it("应该返回一个新函数", function ()
            {
                assert.equal(typeof interceptor === "function", true);
                assert.notEqual(interceptor, interceptedFn);
            });
            it("给拦截器设置正确的作用域", function ()
            {
                assert.equal(interceptorFnScope, fakeScope);
            });
            it("拦截器先于被拦截的函数执行", function ()
            {
                assert.equal(interceptedIsRunAfter, true);
            });
        });
        describe("如果拦截器返回false,被拦截函数不运行", function ()
        {
            it("被拦截函数不运行", function ()
            {
                let interceptedFnCalled = false;
                interceptor = TopJs.Function.createInterceptor(function ()
                {
                    interceptedFnCalled = true;
                }, function ()
                {
                    return false;
                });
                assert.equal(interceptedFnCalled, false);
            });
        });
        describe("代理函数返回值", function ()
        {
            beforeEach(function ()
            {
                interceptedFn = function () {
                    return 'Original';
                };
                interceptorFn = function () {
                    return false;
                };
            });

            describe("当拦截器返回false", function ()
            {
                it("默认返回null", function ()
                {
                    interceptor = TopJs.Function.createInterceptor(interceptedFn, interceptorFn);
                    assert.isNull(interceptor());
                });
                it("当返回false，可以指定默认返回值", function ()
                {
                    interceptor = TopJs.Function.createInterceptor(interceptedFn, interceptorFn, null, "Custom");
                    assert.equal(interceptor(), "Custom");
                });
                it("当返回false，可以指定默认返回值，返回值接受`false`参数", function ()
                {
                    interceptor = TopJs.Function.createInterceptor(interceptedFn, interceptorFn, null, false);
                    assert.equal(interceptor(), false);
                });
                it("拦截器不返回false，返回原始的函数的返回值", function ()
                {
                    interceptor = TopJs.Function.createInterceptor(interceptedFn, function ()
                    {
                    });
                    assert.equal(interceptor(), "Original");
                })
            });
        });
    });

    describe("TopJs.Function.createDelayed", function ()
    {
        it("创建一个代理函数，在指定的毫秒之后调用", function (done)
        {
            mockTimeout();
            let hasBeenCalled = false;
            let calledArgs = [];
            let func = function ()
            {
                hasBeenCalled = true;
                calledArgs = Array.from(arguments);
                assert.deepEqual(calledArgs, ["softboy"]);
                done();
            };
            let delayedFn = TopJs.Function.createDelayed(func, 2);
            delayedFn("softboy");
            assert.equal(timeouts.shift(), 2);
            assert.isFalse(hasBeenCalled);
            unmockTimeout();
        });
        it("在指定的作用域上运行", function (done)
        {
            mockTimeout();
            let scope = {name: 'softboy'};
            let name;
            let hasBeenCalled = false;
            let func = function()
            {
                name = this.name;
                hasBeenCalled = true;
            };
            let delayedFn = TopJs.Function.createDelayed(func, 2, scope);
            delayedFn();
            assert.isFalse(hasBeenCalled);
            let id = _setTimeout(function(){
                assert.equal(name, "softboy");
                _clearTimeout(id);
                done();
            }, 6);
            unmockTimeout();
        });

        it("使用指定的参数进行调用", function (done)
        {
            mockTimeout();
            let scope = {};
            let args = [0, 1, 2];
            let hasBeenCalled = false;
            let calledArgs = [];
            let func = function ()
            {
                hasBeenCalled = true;
                calledArgs = Array.from(arguments);
            };
            let delayedFn = TopJs.Function.createDelayed(func, 2, scope, args);
            delayedFn(3, 4, 5);
            assert.isFalse(hasBeenCalled);
            let id = _setTimeout(function(){
                assert.deepEqual(calledArgs, [0, 1, 2]);
                _clearTimeout(id);
                done();
            }, 6);
            unmockTimeout();
        });

        it("使用指定的参数进行调用, `appendArgs`为`true`", function (done)
        {
            mockTimeout();
            let scope = {};
            let args = [0, 1, 2];
            let hasBeenCalled = false;
            let calledArgs = [];
            let func = function ()
            {
                hasBeenCalled = true;
                calledArgs = Array.from(arguments);
            };
            let delayedFn = TopJs.Function.createDelayed(func, 2, scope, args, true);
            delayedFn(3, 4, 5);
            assert.isFalse(hasBeenCalled);
            let id = _setTimeout(function(){
                assert.deepEqual(calledArgs, [3, 4, 5, 0, 1, 2]);
                _clearTimeout(id);
                done();
            }, 6);
            unmockTimeout();
        });

        it("使用指定的参数进行调用, `appendArgs`为`Number`类型", function (done)
        {
            mockTimeout();
            let scope = {};
            let args = [0, 1, 2];
            let hasBeenCalled = false;
            let calledArgs = [];
            let func = function ()
            {
                hasBeenCalled = true;
                calledArgs = Array.from(arguments);
            };
            let delayedFn = TopJs.Function.createDelayed(func, 2, scope, args, 1);
            delayedFn(3, 4, 5);
            assert.isFalse(hasBeenCalled);
            let id = _setTimeout(function(){
                assert.deepEqual(calledArgs, [3, 0, 1, 2, 4, 5]);
                _clearTimeout(id);
                done();
            }, 6);
            unmockTimeout();
        });
    });
    describe("TopJs.Function.bind", function ()
    {
        let bind;
        it("第一个参数是function的时候返回一个function", function ()
        {
            let func = function(){};
            bind = TopJs.Function.bind(func, this);
            assert.isTrue(typeof bind === "function");
        });
        it("在指定的作用域中调用", function(){
            let actualScope;
            let func = function(){
                actualScope = this;
            };
            let scope = {};
            bind = TopJs.Function.bind(func, scope);
            bind();
            assert.equal(scope, actualScope);
        });
        it("当代理函数执行时候，被代理函数应该被调用", function ()
        {
            let funcCalled = false;
            let func = function(){
                funcCalled = true;
            };
            bind = TopJs.Function.bind(func);
            bind();
            assert.isTrue(funcCalled);
        });
        describe("参数传递", function ()
        {
            it("代理函数无参数使用默认参数", function ()
            {
                let calledArgs = [];
                let func = function() {
                    calledArgs = Array.from(arguments);
                };
                bind = TopJs.Function.bind(func, this, ['S', 'B']);
                bind();
                assert.deepEqual(calledArgs, ['S', 'B']);
            });
            it("没有指定默认的参数，使用代理函数接收到的参数", function ()
            {
                let calledArgs = [];
                let func = function() {
                    calledArgs = Array.from(arguments);
                };
                bind = TopJs.Function.bind(func);
                bind('S', 'B');
                assert.deepEqual(calledArgs, ['S', 'B']);
            });
            it("将默认参数添加到代理函数接受到的参数后面", function ()
            {
                let calledArgs = [];
                let func = function() {
                    calledArgs = Array.from(arguments);
                };
                bind = TopJs.Function.bind(func, this, ['A', 'B'], true);
                bind('S', 'B');
                assert.deepEqual(calledArgs, ['S', 'B', 'A', 'B']);
            });
            it("将默认参数添加到代理函数接受到的参数列表的指定位置", function ()
            {
                let calledArgs = [];
                let func = function() {
                    calledArgs = Array.from(arguments);
                };
                bind = TopJs.Function.bind(func, this, ['A', 'B'], 1);
                bind('S', 'B');
                assert.deepEqual(calledArgs, ['S', 'A', 'B', 'B']);
            });
        });
    });
    describe("TopJs.Function.defer", function ()
    {
        it("在指定的时间之后执行函数", function (done)
        {
            mockTimeout();
            let calledCount = 0;
            let func = function ()
            {
                calledCount++;
            };
            TopJs.Function.defer(func, 5);
            let id = _setTimeout(function(){
                assert.equal(calledCount, 1);
                _clearTimeout(id);
                done();
            }, 10);
            unmockTimeout();
        });
        it("指定的时间小于等于`0`直接执行函数", function ()
        {
            let calledCount = 0;
            let func = function ()
            {
                calledCount++;
            };
            TopJs.Function.defer(func, 0);
            assert.equal(calledCount, 1);
        });
        it("在指定的作用域下执行", function (done)
        {
            mockTimeout();
            let calledScope;
            let scope = {};
            let func = function ()
            {
                calledScope = this;
            };
            TopJs.Function.defer(func, 5, scope);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.equal(calledScope, scope);
                done();
            }, 10);
            unmockTimeout();
        });
        it("绑定默认参数", function (done)
        {
            let calledArgs;
            let scope = {};
            let func = function ()
            {
                calledArgs = Array.from(arguments);
            };
            TopJs.Function.defer(func, 5, scope, [1, 2, 3]);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.deepEqual(calledArgs, [1, 2, 3]);
                done();
            }, 10);
        });
        it("应该返回超时时间", function ()
        {
            let timeout = TopJs.Function.defer(function ()
            {

            }, 5, this, [1, 2, 3]);
            assert.equal(timeout._idleTimeout, 5);
        });
    });

    describe("TopJs.Function.defer", function ()
    {
        beforeEach(function ()
        {
            mockTimeout();
        });
        afterEach(function(){
            unmockTimeout();
        });
        it("在指定的时间后执行", function (done)
        {
            let calledCount = 0;
            let func = function(){
                calledCount++;
            };
            TopJs.Function.defer(func, 5);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.equal(calledCount, 1);
                done();
            }, 10);

        });
        it("如果指定的延迟时间是`0`就直接执行", function ()
        {
            let calledCount = 0;
            let func = function(){
                calledCount++;
            };
            TopJs.Function.defer(func, 0);
            assert.equal(calledCount, 1);
        });
        it("使用正确的作用域", function (done)
        {
            let scope = {};
            let actualScope = {};
            let func = function(){
                actualScope = this;
            };
            TopJs.Function.defer(func, 5, scope);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.equal(actualScope, scope);
                done();
            }, 10);
        });
        it("使用正确的参数调用", function (done)
        {
            let calledArgs = [];
            let scope = {};
            let func = function(){
                calledArgs = Array.from(arguments);
            };
            TopJs.Function.defer(func, 5, scope, [1, 2, 3]);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.deepEqual(calledArgs, [1, 2, 3]);
                done();
            }, 10);
        });
        it("返回指定的timeout数值", function ()
        {
            let timeout = TopJs.Function.defer(function(){}, 5, this, [1, 2, 3]);
            assert.equal(timeout._idleTimeout, 5);
        });
    });

    describe("TopJs.Function.createBuffered", function ()
    {
        beforeEach(function ()
        {
            mockTimeout();
        });
        afterEach(function(){
            unmockTimeout();
        });
        it("在过期时间内，防止多次调用同一个函数", function (done)
        {
            let funcCalled = false;
            let calledCount = 0;
            let func = function () {
                funcCalled = true;
                calledCount++;
            };
            let bufferedFunc = TopJs.Function.createBuffered(func, 2);
            bufferedFunc();
            assert.equal(timeouts.shift(), 2);
            bufferedFunc();
            assert.equal(clearedTimeoutIds.shift(), timeoutIds.shift());
            assert.equal(timeouts.shift(), 2);
            assert.isFalse(funcCalled);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.equal(calledCount, 1);
                done();
            }, 10);
        });
        it("在指定的作用域中执行函数", function (done)
        {
            let scope = {x: 1};
            let func = function ()
            {
                this.x++;
            };
            let bufferedFunc = TopJs.Function.createBuffered(func, 5, scope);
            bufferedFunc();
            assert.equal(scope.x, 1);
            bufferedFunc();
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.equal(scope.x, 2);
                done();
            }, 10);
        });
        it("当创建代理函数的时候指定了参数，就忽略运行时的参数", function ()
        {
            let scope = this;
            let args = ['a', 'b'];
            let calledArgs = [];
            let calledCount = 0;
            let func = function ()
            {
                calledArgs = Array.from(arguments);
                calledCount++;
            };
            let bufferedFunc = TopJs.Function.createBuffered(func, 5, scope, args);
            bufferedFunc(1, 2);
            assert.equal(calledCount, 0);
            let id = _setTimeout(function(){
                _clearTimeout(id);
                assert.deepEqual(calledArgs, ['a', 'b']);
                done();
            }, 10);
        });
    });
    describe("TopJs.Function.interceptAfter", function ()
    {
        it("每次调用函数，都需要调用拦截器", function ()
        {
            let monologue = {
                phrases: [],
                addPhrase: function(phrase) {
                    this.phrases.push(phrase)
                }
            };
            let addMeTooCalledArgs = [];
            let addMeToo = function (phrase)
            {
                this.phrases.push(phrase+" too");
                addMeTooCalledArgs.push(phrase);
            };
            TopJs.Function.interceptAfter(monologue, "addPhrase", addMeToo);
            monologue.addPhrase("i like you");
            monologue.addPhrase("i love you");
            assert.deepEqual(monologue.phrases, [
                "i like you", "i like you too",
                "i love you", "i love you too" ]
            );
            assert.deepEqual(addMeTooCalledArgs, [
                "i like you",
                "i love you" ]
            );
        });
        describe("在指定的作用域里面执行拦截器", function ()
        {
            let monologue = {
                phrases: [],
                addPhrase: function(phrase) {
                    this.phrases.push(phrase)
                }
            };
            let transcription = {
                phrases: []
            };
            let transcriptPhraseArgs = [];
            let transcriptPhrase = function (phrase)
            {
                this.phrases.push("He said: " + phrase);
                transcriptPhraseArgs.push(phrase);
            };
            TopJs.Function.interceptAfter(monologue, "addPhrase", transcriptPhrase, transcription);
            monologue.addPhrase("I like you");
            monologue.addPhrase("I love you");
            assert.deepEqual(monologue.phrases, [ "I like you", "I love you" ]);
            assert.deepEqual(transcription.phrases, [ "He said: I like you", "He said: I love you" ]);
            assert.deepEqual(transcriptPhraseArgs, [ "I like you", "I love you" ]);
        });
    });
    describe("TopJs.Function.interceptAfterOnce", function ()
    {
        it("每次调用函数，都需要调用拦截器", function ()
        {
            let monologue = {
                phrases: [],
                addPhrase: function(phrase) {
                    this.phrases.push(phrase)
                }
            };
            let addMeTooCalledArgs = [];
            let addMeToo = function (phrase)
            {
                this.phrases.push(phrase+" too");
                addMeTooCalledArgs.push(phrase);
            };
            TopJs.Function.interceptAfterOnce(monologue, "addPhrase", addMeToo);
            monologue.addPhrase("i like you");
            monologue.addPhrase("i love you");
            assert.deepEqual(monologue.phrases, [
                "i like you", "i like you too",
                "i love you" ]
            );
            assert.deepEqual(addMeTooCalledArgs, [
                "i like you"]
            );
        });
        describe("在指定的作用域里面执行拦截器", function ()
        {
            let monologue = {
                phrases: [],
                addPhrase: function(phrase) {
                    this.phrases.push(phrase)
                }
            };
            let transcription = {
                phrases: []
            };
            let transcriptPhraseArgs = [];
            let transcriptPhrase = function (phrase)
            {
                this.phrases.push("He said: " + phrase);
                transcriptPhraseArgs.push(phrase);
            };
            TopJs.Function.interceptAfterOnce(monologue, "addPhrase", transcriptPhrase, transcription);
            monologue.addPhrase("I like you");
            monologue.addPhrase("I love you");
            assert.deepEqual(monologue.phrases, [ "I like you", "I love you" ]);
            assert.deepEqual(transcription.phrases, [ "He said: I like you"]);
            assert.deepEqual(transcriptPhraseArgs, [ "I like you" ]);
        });
    });

    describe("TopJs.Function.interceptBefore", function ()
    {
        it("每次调用函数，都需要调用拦截器", function ()
        {
            let monologue = {
                phrases: [],
                addPhrase: function(phrase) {
                    this.phrases.push(phrase)
                }
            };
            let addMeTooCalledArgs = [];
            let addMeToo = function (phrase)
            {
                this.phrases.push(phrase+" too");
                addMeTooCalledArgs.push(phrase);
            };
            TopJs.Function.interceptBefore(monologue, "addPhrase", addMeToo);
            monologue.addPhrase("i like you");
            monologue.addPhrase("i love you");
            assert.deepEqual(monologue.phrases, [
                "i like you too", "i like you",
                "i love you too", "i love you"]
            );
            assert.deepEqual(addMeTooCalledArgs, [
                "i like you",
                "i love you" ]
            );
        });
        describe("在指定的作用域里面执行拦截器", function ()
        {
            let monologue = {
                phrases: [],
                addPhrase: function(phrase) {
                    this.phrases.push(phrase)
                }
            };
            let transcription = {
                phrases: []
            };
            let transcriptPhraseArgs = [];
            let transcriptPhrase = function (phrase)
            {
                this.phrases.push("He said: " + phrase);
                transcriptPhraseArgs.push(phrase);
            };
            TopJs.Function.interceptBefore(monologue, "addPhrase", transcriptPhrase, transcription);
            monologue.addPhrase("I like you");
            monologue.addPhrase("I love you");
            assert.deepEqual(monologue.phrases, [ "I like you", "I love you" ]);
            assert.deepEqual(transcription.phrases, [ "He said: I like you", "He said: I love you" ]);
            assert.deepEqual(transcriptPhraseArgs, [ "I like you", "I love you" ]);
        });
    });
});