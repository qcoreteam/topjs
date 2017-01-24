/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
"use strict";
export function mount(TopJs)
{
    let Assert = TopJs.Assert = {};
    /**
     * @class TopJs.Assert
     * @singleton
     * @classdesc
     * 这个类提供一个有用的诊断信息，经常用在`debug hooks`区域
     * ```javascript
     * TopJs.define("Foo.bar.Class", {
     *    debugHooks: {
     *       method: function (a) {
     *          TopJs.Assert.truthy(a, "Expected "a" to be truthy");
     *       },
     *       foo: function (object) {
     *          TopJs.Assert.isFunctionProp(object, "doSomething");
     *       }
     *     }
     * });
     * ```
     * **注意:** 这个类里面的方法在打包的时候需要移除，所以请在`debug comment`区域使用或者在
     * `debughooks`里面使用
     * 
     * 如下从`TopJs`探测得到的方法被自动包装，加入`assert`相关的语句
     *
     *  * `isEmpty`
     *  * `isArray`
     *  * `isDate`
     *  * `isObject`
     *  * `isSimpleObject`
     *  * `isPrimitive`
     *  * `isFunction`
     *  * `isNumber`
     *  * `isNumeric`
     *  * `isString`
     *  * `isBoolean`
     *  * `isDefined`
     *  * `isIterable`
     *  
     * 以上方法都有一个加了`Prop`后缀的方法，方便检测对象上的属性
     * 例如：
     * ```javascript
     * TopJs.Assert.isFunction(object.foo);
     * TopJs.Assert.isFunctionProp(object, 'foo');
     * ```
     *  
     * 上面方法列表同样有否定断言方法
     * 
     *  * `isNotEmpty`
     *  * `isNotArray`
     *  * `isNotDate`
     *  * `isNotObject`
     *  * `isNotSimpleObject`
     *  * `isNotPrimitive`
     *  * `isNotFunction`
     *  * `isNotNumber`
     *  * `isNotNumeric`
     *  * `isNotString`
     *  * `isNotBoolean`
     *  * `isNotDefined`
     *  * `isNotIterable`
     *  
     */
    TopJs.apply(Assert, /** @lends TopJs.Assert */{
        /**
         * 检查第一个参数是否`falsey`，如果不是则抛出`Error`
         * 
         * @param {Object} b 需要检查的对象
         * @param {String} msg 抛出异常的值
         */
        falsey(b, msg)
        {
            if (b) {
                TopJs.raise(msg || (`期望得到一个"falsey"值，但是值${b}。`))
            }
        },

        /**
         * 检查第一个参数的属性是否`falsey`，如果不是则抛出`Error`
         * 
         * @param {Object} object 等待检查的对象
         * @param {String} property 需要检查的属性名称
         */
        falseyProp(object, property)
        {
            TopJs.Assert.truthy(object);
            let b = object[property];
            if (b) {
                if (object.$_class_name_$) {
                    property = object.$_class_name_$ + '#' + property;
                }
                TopJs.raise(`期望${property}是一个"falsey"值，但是值${b}。`);
            }
        },

        /**
         * 判断第一个参数是否为`truthy`值，如果不是抛出`Error`
         * 
         * @param {Object} b 需要检查的对象
         * @param {String} msg 抛出异常的值
         */
        truthy(b, msg)
        {
            if (b) {
                TopJs.raise(msg || (`期望得到一个"truthy"值，但是值${b}。`))
            }
        },

        /**
         * 检查第一个参数的属性是否`truthy`，如果不是则抛出`Error`
         *
         * @param {Object} object 等待检查的对象
         * @param {String} property 需要检查的属性名称
         */
        truthyProp(object, property)
        {
            TopJs.Assert.truthy(object);
            let b = object[property];
            if (b) {
                if (object.$_class_name_$) {
                    property = object.$_class_name_$ + '#' + property;
                }
                TopJs.raise(`期望${property}是一个"truthy"值，但是值${b}。`);
            }
        }
    });

    function make_assert (name, kind) {
        let testFn = TopJs[name],
            def;
        return function (value, msg) {
            if (!testFn(value)) {
                TopJs.raise(msg || def ||
                    (def = `期望值是${kind}`));
            }
        };
    }

    function make_assert_prop (name, kind) {
        let testFn = TopJs[name],
            def;
        return function (object, prop) {
            TopJs.Assert.truthy(object);
            if (!testFn(object[prop])) {
                TopJs.raise(def || (def = '期望属性 ' +
                        (object.$_class_name_$ ? object.$_class_name_$ + '#' : '') +
                        prop + ' 的值是 ' + kind));
            }
        };
    }

    function make_not_assert (name, kind) {
        let testFn = TopJs[name],
            def;
        return function (value, msg) {
            if (testFn(value)) {
                TopJs.raise(msg || def ||
                    (def = `期望值不是${kind}`));
            }
        };
    }

    function make_not_assert_prop (name, kind) {
        let testFn = TopJs[name],
            def;
        return function (object, prop) {
            TopJs.Assert.truthy(object);
            if (testFn(object[prop])) {
                TopJs.raise(def || (def = '期望属性 ' +
                        (object.$_class_name_$ ? object.$_class_name_$ + '#' : '') +
                        prop + ' 值不是 ' + kind));
            }
        };
    }

    for (let name in TopJs) {
        if (name.substring(0,2) == "is" && TopJs.isFunction(TopJs[name])) {
            let kind = name.substring(2);
            TopJs.Assert[name] = make_assert(name, kind);
            TopJs.Assert[name + 'Prop'] = make_assert_prop(name, kind);
            TopJs.Assert['isNot' + kind] = make_not_assert(name, kind);
            TopJs.Assert['isNot' + kind + 'Prop'] = make_not_assert_prop(name, kind);
        }
    }
}