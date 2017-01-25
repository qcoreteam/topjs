/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
"use strict";

function to_string()
{
    let me = this;
    let cls = me.sourceClass;
    let method = me.sourceMethod;
    let msg = me.msg;
    if (method) {
        if (msg) {
            method += "(): ";
            method += msg;
        } else {
            method += "()";
        }
        if (cls) {
            method = method ? (cls + '.' + method) : cls;
        }
    }
    return method || msg || '';
}
/**
 * @classdesc
 * 定义一个原生的javascript`Error`对象的帮助类，添加一些在实现应用程序是经常使用的帮助方法
 * 当您在类系统中使用{@link TopJs.raise}方法抛出`TopJs.Error`异常的时候，错误类将自动的添加
 * 抛出异常时候的类名字和方法名字。我们包含一些逻辑，如果`TopJs.Error`携带额外的信息，可以自动的将`TopJs.Error`
 * 相关信息向`console`进行输出。在所有的情况下，在处理完相关逻辑后，系统将抛出`error`结束程序的运行。
 *
 * `TopJs.Error`同时提供一个全局的`error`, 您可以重写{@link TopJs.Error.handle}在应用程序范围中单点处理
 * 异常。在真实的程序中，一般会添加一些额外的逻辑，让错误记录更有实际意义。
 *
 * 简单使用
 * ```javascript
 * TopJs.raise("something bad happend!");
 * ```
 * 如果我们在普通的`javascript`代码中`raise error`, 错误将在控制台进行输出，将`error message`显示出来
 * 更多的情况我们是在`TopJs Class`中进行`raise`，系统将自动添加很多有用的信息，同时我们也可以手动添加一些错误的
 * 元信息。
 * 例如
 * ```javascript
 * TopJs.define("TopJs.SomeCls", {
     *      doSomething: function(option){
     *          if (someCondition === false) {
     *             TopJs.raise({
     *                msg: "错误的操作!",
     *                option: option, // 任意的常量对象
     *                "error code": 100
     *             });
     *          }
     *      }
     * });
 * ```
 * 控制台将输出如下信息：
 *
 *             option: Object { foo: "bar"}
 *                 oo: "bar"
 *         error code: 100
 *                msg: "错误的操作!"
 *        sourceClass: "TopJs.SomeCls"
 *       sourceMethod: "doSomething"
 *       uncaught exception: "错误的操作!"
 *
 * 正如您看到的`，TopJs.Error`会在控制台输出很多有用的信息
 *
 * 我们还可以处理全局所有的`error`，如下是一个例子：
 *
 * ```javascript
 * TopJs.Error.handle = function(err) {
     *     if (err.someProperty == "NotReallyAnError") {
     *         // maybe log something to the application here if applicable
     *         return true;
     *     }
     * }
 * ```
 *
 * @class TopJs.Error
 * @constructor
 */
let TopJsError = TopJs.Error = function (config)
{
    if (TopJs.isString(config)) {
        config = {
            msg: config
        };
    }
    let error = new Error();
    TopJs.apply(error, config);
    error.message = error.message || error.msg; // "message" is standard ("msg" is non-standard)
    error.toString = to_string;
    return error;
};

TopJs.apply(TopJsError, /** @lends TopJs.Error */{
    /**
     * 全局标志变量，当设置为`true`禁止全局错误报告。使用的时候要特别小心，当我们禁止`TopJs.Error`处理
     * 可能我们的程序会被原生的异常终止，更好的选择是重写{@link TopJs.Erorr.handle}方法进行全局的错误
     * 处理。
     *
     * 简单的例子：
     * ```javascript
     * TopJs.Error.ignore = true;
     * ```
     *
     * @property {Boolean} [ignore=false]
     */
    ignore: false,
    /**
     * @private
     * @param {String/Object} error 错误字符串，或者包含自定义信息的错误对象，自定义对象必须含有一个`msg`字段
     * 自定义信息将在控制台输出
     * @param {Function} processer 额外的处理器，对传入的对象对相关的处理
     */
    raise(error, processer = TopJs.emptyFn)
    {
        let msg;
        error = error || {};
        if (TopJs.isString(error)) {
            error = {
                msg: error
            }
        }
        processer(error);
        if (this.handle(error) !== true) {
            msg = to_string.call(error);
            //<debug>
            TopJs.log({
                msg: msg,
                level: "error",
                dump: error,
                stack: true
            });
            //</debug>
            throw new TopJs.Error(error);
        }
    },

    /**
     * 全局处理`TopJs errors`模板函数，您可以重写这个函数，加上一些自定义的错误处理逻辑
     * 这跟函数返回`true`,将不会抛出异常。
     *
     * @param {Object} error 错误字符串，或者包含自定义信息的错误对象，自定义对象必须含有一个`msg`字段
     * 自定义信息将在控制台输出
     * @return {boolean}
     */
    handle()
    {
        return this.ignore;
    }
});

/**
 * 创建一个函数，调用的时候抛出一个异常,并且输出一个弃用的信息
 *
 * @private
 * @param {String} suggestion 需要输出的信息
 * @return {Function} 生成的函数
 */
TopJs.deprecated = function (suggestion)
{
    //<debug>
    if (!suggestion) {
        suggestion = '';
    }
    function fail()
    {
        TopJs.raise("方法 \"" + fail.$_owner_$.$_class_name_$ +
            '.' + fail.$_name_$ + "\"已经被弃用了。" + suggestion);
    }

    return fail;
    //</debug>
    return TopJs.emptyFn;
};

/**
 * 抛出一个错误，同时将错误信息在控制台进行输出，如果`error`对象包含额外信息也会被一并进行输出
 * 您可以传入一个字符串或者一个带有`msg`属性的常量对象，如果传入的是常理对象，您可以添加的额外的
 * 键值对，用于输出更有用的错误信息。
 *
 * 当系统完成错误信息之后，将抛出一个`javascript error`来终止程序的执行。
 *
 * 简单用法:
 * ```javascript
 * //简单的例子
 * TopJs.raise("A simple string error message");
 * // 复杂一点的例子
 * TopJs.define("TopJs.SomeCls", {
     *      doSomething: function(option){
     *          if (someCondition === false) {
     *             TopJs.raise({
     *                msg: "错误的操作!",
     *                option: option, // 任意的常量对象
     *                "error code": 100
     *             });
     *          }
     *      }
     * });
 *
 * ```
 *
 * @param {String/Object} error 错误字符串，或者包含自定义信息的错误对象，自定义对象必须含有一个`msg`字段
 * 自定义信息将在控制台输出
 */
TopJs.raise = function (error)
{
    let method = TopJs.raise;
    TopJs.Error.raise.call(TopJs.Error, error, function (error)
    {
        let name;
        if (!error.sourceMethod && (name = method.$_name_$)) {
            error.sourceMethod = name;
        }
        if (!error.sourceClass && (name = method.$_owner_$) && (name = name.$_class_name_$)) {
            error.sourceClass = name;
        }
    });
};
