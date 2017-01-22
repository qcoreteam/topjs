/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
export function mount(TopJs)
{
    let Function = TopJs.Function = {};
    /**
     * @class TopJs.Function
     * @requires TopJs.Array
     * @singleton
     */
    TopJs.apply(Function, /** @lends TopJs.Function */{
        /**
         * 传入一个接受两个参数的函数，然后生成一个包装器函数，包装器函数可以
         * 调用方式可以接受两个参数，也可以接受一个对象，迭代的传入键值作为第一个参数和第二个
         * 参数传入原始的setter函数
         *
         * ```javascript
         *
         * let setValueProxy = TopJs.Function.proxySetter(function(name, value){
         *    this[name] = value;
         * });
         *
         * setValueProxy("name1", "value1");
         *
         * //或者使用常量对象进行批量设置
         * setValueProxy({
         *    name1: "value1",
         *    name2: "value2",
         *    name3: "value3",
         *    ...
         * });
         *
         * ```
         *
         * @param {Function} setter 传入的原始的设置函数
         * @return {Function} 生成之后的代理函数
         */
        proxySetter(setter)
        {
            return function (name, value)
            {
                if (null !== name) {
                    if ("string" !== typeof name) {
                        for (let [k, v] of name) {
                            if (name.hasOwnProperty(k)) {
                                setter.call(this, k, v);
                            }
                        }
                    } else {
                        setter.call(this, name, value);
                    }
                }
                return this;
            };
        },

        /**
         * 生成一个调用`TopJs.callback`的闭包，将生成的闭包函数的参数附加到`TopJs.callback`
         * 生成的闭包函数的参数中去, 参数解释请参考 {@link TopJs.callback}
         *
         * @param {Function|String} callback 一个函数引用或者一个作用域下的方法名称
         * @param {Object} scope 第一个参数指定的`callback`的执行作用域，如果第一个参数为字符串，那么必须在这个作用域下
         * 存在名字为`callback`所指字符串的方法,如果`scope`为`null`那么`callback`将在`defaultScope`指定的作用域下执行
         * @param {Array} args 传给`callback`的参数
         * @param {Number} delay `callback`延迟调用的毫秒数
         * @param {Object} caller 如果没有显示的提供`scope`，那么`callback`调用时将用`caller`参数进行解析方法
         * @return {Mixed|undefined} 返回`callback`的返回值，如果指定`defer`或者`callback`不是一个函数则返回`undefined`
         */
        bindCallback(callback, scope, args, delay, caller)
        {
            return function (...newArgs)
            {
                return TopJs.callback(callback, scope, args ? args.concat(newArgs) : newArgs, delay, caller);
            }
        },

        /**
         * @private
         * @param {Function} func 被代理的函数
         * @param {object} scope 代理函数的作用域
         * @param {Array} [args] 覆盖传递给被代理函数的参数，默认是代理函数接收的参数
         * @param {Boolean|Number} appendArgs 当为`true`将指定的`args`添加到代理函数接收的参数列表后天，当
         * 指定为`Number`值时候，插入到代理函数参数列表的指定位置
         * @return {Function} 新创建的代理函数
         */
        bind(func, scope, args, appendArgs)
        {
            if(arguments.length === 2){
                return function() {
                    return func.apply(scope, arguments);
                };
            }
            let method = func;
            return function(...callArgs)
            {
                let actualCallArgs = args || callArgs;
                if(appendArgs === true){
                    actualCallArgs = callArgs;
                    actualCallArgs = actualCallArgs.concat(args);
                }else if(typeof appendArgs === 'number'){
                    actualCallArgs = callArgs;
                    actualCallArgs.splice(appendArgs, 0, ...args)
                }
                return method.apply(scope || global, actualCallArgs);
            };
        },

        /**
         * 给传入的函数绑定相关的参数，生成之后的函数传递的参数在其后面
         *
         * ```javascript
         *
         * var originalFunction = function(...args){
         *    console.log(args.join(' '));
         * };
         *
         * var callback = TopJs.Function.pass(originalFunction, ["你好, ", "TopJs"]);
         * callback(); // 输出： "你好,  TopJs"
         * callback(", 你是最棒的"); // 输出："你好,  TopJs, 你是最棒的"
         *
         * ```
         *
         * @param {Function} fn 等待处理的函数
         * @param {Array} args 函数传递的参数
         * @param {Object} scope 函数执行的作用域，函数里面的`this`对象引用绑定
         * @return {Function} 新创建的回调函数
         */
        pass(fn, args, scope)
        {
            if (!TopJs.isArray(args)) {
                if (TopJs.isIterable(args)) {
                    args = TopJs.Array.clone(args);
                } else {
                    args = args !== undefined ? [args] : [];
                }
            }
            return function (...newArgs)
            {
                let fnArgs = args.slice();
                fnArgs.push(...newArgs);
                return fn.apply(scope || this, fnArgs);
            };
        },

        /**
         * 给指定对象的方法建立一个别名，这个别名函数执行的名称空间是指定的对象
         *
         * @param {Object} object 目标对象
         * @param {String} methodName 目标对象的函数名称
         * @return {Function} aliasFn 建立的别名函数
         */
        alias(object, methodName)
        {
            return function (...args)
            {
                return object[methodName](...args);
            };
        },

        /**
         * 克隆一个函数，返回的函数会调用传入的函数，并且传入其接收到的参数，然后传递给传入的函数
         * 并且会传递`this`指针给传入的函数，并且返回传入的函数返回值。
         *
         * @param {Function} method 等待克隆的函数
         * @return {Function} 克隆的结果函数
         */
        clone(method)
        {
            return function ()
            {
                return method.apply(this, arguments);
            };
        },

        /**
         * 创建一个拦截器函数，`newFunc`在`origFunc`之前进行调用，如果返回`false`，origFunc将不会
         * 调用，拦截器返回`origFunc`的返回值，`newFunc`接收到的参数跟`origFunc`函数一样
         *
         * @param {Function} origFn 原始传入的函数
         * @param {Function} newFn 执行判断的函数
         * @param {Object} scope `newFn`函数执行的作用域
         * @param {Object} returnValue 当`newFunc`返回`false`的时候拦截器函数返回给调用者的值
         * @return {Function} 生成的拦截器函数
         */
        createInterceptor(origFn, newFn, scope, returnValue)
        {
            if (!TopJs.isFunction(newFn)) {
                return origFn;
            } else {
                returnValue = TopJs.isDefined(returnValue) ? returnValue : null;
                return function (...args)
                {
                    let me = this;
                    return (newFn.apply(scope || me || global, args) !== false) ?
                        origFn.apply(scope || me || global, args) : returnValue;
                };
            }
        },

        /**
         * 创建一个迟延执行的代理函数，在指定的时间之后执行
         *
         * @param {Function} func 延迟执行的函数
         * @param {Number} delay 需要迟延执行的毫秒数
         * @param {Object} [scope] 延迟执行的函数的作用域
         * @param {Array} [args] 传递给延迟执行的函数的参数
         * @param {Boolean|Number} [appendArgs] 附加传递的参数
         * @return {Function} 生成的代理函数, 函数在指定的时间执行
         */
        createDelayed(func, delay, scope, args, appendArgs)
        {
            if (scope || args) {
                func = TopJs.Function.bind(func, scope, args, appendArgs);
            }
            return function (...calledArgs)
            {
                let me = this;
                setTimeout(function ()
                {
                    func.apply(me, calledArgs);
                }, delay);
            };
        },

        /**
         * 创建一个在指定时间后执行的函数，我们可以指定函数的作用域和调用时传递的参数
         *
         * ```javascript
         *
         * var sayHello = function(name){
         *    console.log("Hello, " + name);
         * }
         *
         * // 立即执行:
         * sayHello("TopJs");
         *
         * // 延迟一秒执行:
         * TopJs.Function.defer(sayHello, 1000, this, ["TopJs"]);
         *
         * 这个函数有时候对延迟执行一个匿名函数很有用：
         * TopJs.Function.defer(function(){
         *    console.log("Anonymous");
         * }, 200);
         *
         * ```
         *
         * @param {Function} func 延迟执行的函数
         * @param {Number} millis 需要迟延执行的毫秒数
         * @param {Object} [scope] 延迟执行的函数的作用域
         * @param {Array} [args] 传递给延迟执行的函数的参数
         * @param {Boolean|Number} [appendArgs] 附加传递的参数
         * @return {Number} 返回`timeout id`，到时候可以传入`clearTimeout`进行取消
         */
        defer(func, millis, scope, args, appendArgs)
        {
            func = TopJs.Function.bind(func, scope, args, appendArgs);
            if (millis > 0) {
                return setTimeout(function ()
                {
                    func();
                }, millis);
            }
            func();
            return 0;
        },

        /**
         * 按照指定的时间间歇性调用指定的函数，可以指定函数执行的作用域
         *
         * @param {Function} fn 延迟执行的函数
         * @param {Number} millis 需要间歇执行的毫秒数
         * @param {Object} [scope] 间歇执行的函数的作用域
         * @param {Array} [args] 传递给间歇执行的函数的参数
         * @param {Boolean|Number} [appendArgs] 附加传递的参数
         * @return {Number} 返回`interval id`，到时候可以传入`clearInterval`进行取消
         */
        interval(fn, millis, scope, args, appendArgs)
        {
            fn = fn.bind(scope, args, appendArgs);
            return setInterval(function ()
            {
                fn();
            }, millis);
        },

        /**
         * 创建一个新的函数，这个函数一次调用`origFunc`和`newFunc`
         *
         * ```javascript
         *
         * let sayHello = function(name)
         * {
         *    console.log("Hello, " + name);
         * };
         *
         * sayHello("TopJs"); // console: "Hello, TopJs"
         *
         * sayBye = TopJs.Function.createSequence(sayHello, function(name){
         *    console.log("Bye, " + name);
         * });
         *
         * sayBye("softboy");
         * // console : "Hello, softby" 和 "Bye, softboy"
         *
         * ```
         *
         * @param {Function} origFunc 原始传入的执行函数
         * @param {Function} [newFunc] 在`origFunc`之后执行的函数
         * @param {Object} [scope=null] `newFunc`函数执行的作用域
         * @return {Function} 新创建的函数
         */
        createSequence(origFunc, newFunc, scope = null)
        {
            if (!newFunc) {
                return origFunc;
            } else {
                return function (...args)
                {
                    let result = origFunc.apply(this, args);
                    newFunc.apply(scope || this, args);
                    return result;
                };
            }
        },

        /**
         * 创建一个代理函数，可以指定其执行的作用域和传入参数，`buffer`参数指定缓冲时长，
         * 如果时长还没过期我们又一次调用了代理函数，那么我们重新计算缓冲时长，我们会清除上一次
         * 的`timeout id`,然后重新按照`buffer`指定的时长进行重新设置。
         *
         * @param {Function} func 原始函数
         * @param {Number} buffer 缓冲时间的大小，单位毫秒
         * @param {Object} [scope=null] `func`函数执行的作用域
         * @param {Array} [args=null] 传给`func`函数的参数
         * @return {Function} 生成的代理函数
         */
        createBuffered(func, buffer, scope = null, args = null)
        {
            let timerId = null;
            return function (...newArgs)
            {
                let callArgs = args || newArgs;
                let me = scope || this;
                if (timerId) {
                    clearTimeout(timerId);
                }
                timerId = setTimeout(function ()
                {
                    func.apply(me, callArgs);
                }, buffer);
            };
        },

        /**
         * 给一个存在的方法添加一个行为，在其之前进行调用
         *
         * ```javascript
         * var someObj = {
         *    contents: [],
         *    add: function(item) {
         *       this.contents.push(item);
         *    }
         * };
         * TopJs.Function.interceptBefore(soup, "add", function(item){
         *    if (!this.contents.length && item !== "something") {
         *       this.contents.push("something");
         *     }
         * });
         * someObj.add("item1");
         * someObj.add("item2");
         * someObj.contents; //contents的内容现在是: something, item1, item2
         *
         * ```
         *
         * @param {Object} object 目标对象
         * @param {String} methodName 目标对象的方法名称
         * @param {Function} func 传入的函数
         * @param {Object} [scope] `func`函数
         * @return {Function} 创建的代理器函数
         */
        interceptBefore(object, methodName, func, scope)
        {
            let method = object[methodName] || TopJs.emptyFn;
            object[methodName] = function (...args)
            {
                let ret = func.apply(scope || this, args);
                let mret = method.apply(this, args);
                return [ret, mret];
            };
            return object[methodName];
        },

        /**
         * 给一个存在的方法添加一个行为，在其之后进行调用
         *
         * ```javascript
         * var someObj = {
         *    contents: [],
         *    add: function(item) {
         *       this.contents.push(item);
         *    }
         * };
         * TopJs.Function.interceptBefore(soup, "add", function(item){
         *    let pushItem = this.contents[this.contents.length - 1];
         *    this.contents[this.contents.length - 1] = pushItem.toUpperCase();
         * });
         * someObj.add("item1");
         * someObj.add("item2");
         * someObj.contents; //contents的内容现在是: SOMETHING, ITEM1, ITEM2
         *
         * ```
         *
         * @param {Object} object 目标对象
         * @param {String} methodName 目标对象的方法名称
         * @param {Function} func 传入的函数
         * @param {Object} [scope] `func`函数
         * @return {Function} 创建的代理器函数
         */
        interceptAfter(object, methodName, func, scope)
        {
            let method = object[methodName] || TopJs.emptyFn;
            object[methodName] = function (...args)
            {
                let mret = method.apply(this, args);
                let ret = func.apply(scope || this, args);
                return [mret, ret];
            };
            return object[methodName];
        },

        /**
         * 给一个存在的方法添加一个行为，在其之后进行调用，但是只执行一次，功能描述请参考
         * {@link TopJs.Function.interceptAfter}
         *
         * @param {Object} object 目标对象
         * @param {String} methodName 目标对象的方法名称
         * @param {Function} func 传入的函数
         * @param {Object} [scope] `func`函数
         * @return {Function} 创建的代理器函数
         */
        interceptAfterOnce(object, methodName, func, scope)
        {
            let origMethod = object[methodName];
            let newMethod = function (...args)
            {
                let ret;
                let mret;
                if (origMethod) {
                    mret = origMethod.apply(this, args);
                }
                ret = func.apply(scope || this, args);
                object[methodName] = origMethod;
                object = methodName = func = scope = origMethod = newMethod = null;
                return [mret, ret];
            };
            object[methodName] = newMethod;
            return newMethod;
        },

        /**
         * 给指定的对象的方法建立一个执行环境闭包
         *
         * @param {Object} object 回调函数的目标对象
         * @param {Function} methodName 回调函数的目标对象的方法名
         * @return {Function} 创建的闭包函数
         */
        makeCallback(object, methodName)
        {
            return function (...args)
            {
                return object[methodName].apply(scope, args)
            };
        },

        /**
         * 返回一个代理函数，这个代理函数会针对相应的参数对函数的执行结果进行缓存，当以同样的参数调用函数
         * 的时候函数直接返回缓存的结果
         *
         * ```javascript
         *
         * function factorial (value) {
         *    let ret = value;
         *    while (--value > 1) {
         *       ret *= value;
         *    }
         *    return ret;
         * }
         *
         * //创建缓存函数的包装器
         * factorial = TopJs.Function.memoize(factorial);
         * let val1 = factorial(30);
         * let val2 = factorial(30);
         * //val2直接使用缓存的结果
         *
         * //支持多个参数调用
         * function permutation(n, k)
         * {
         *    return factorial(n) / factorial(n - k);
         * }
         *
         * permutation = TopJs.Function.permutation(permutation, null, function(n, k){
         *    return `${n}-${k}`
         * });
         *
         * ```
         * ***<font color="red">特别注意</font>***</br>
         * 缓存是存在内存里面，千万不要使用不一样的参数进行长时间调用，否则内存最终会溢出
         *
         *
         * @param {Function} func 真正进行计算的函数
         * @param {Object} scope `func`执行的作用域
         * @param {Function} hashFunc 自定义的缓存`key`生成函数
         * @return {Function} 新创建的函数
         */
        memoize: function (func, scope, hashFunc)
        {
            let memo = new Map();
            let isFunc = hashFunc && TopJs.isFunction(hashFunc);
            return function (value)
            {
                let key = isFunc ? hashFunc.apply(scope, arguments) : value;
                if (!map.has(key)) {
                    map.set(key, func.apply(scope, arguments))
                }
                return memo.get(key);
            };
        }
    });
}