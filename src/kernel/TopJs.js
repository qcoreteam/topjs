"use strict";
/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

/**
 * 我们在这个里面定义一些很重要函数，这个函数直接挂载在名称空间TopJs下面
 * 项目的其他地方调用这些函数，这个属于框架初始化部分
 */
import * as InternalFuncs from "./internal/Funcs"
/**
 * @namespace TopJs
 */
export let TopJs = global.TopJs = {};
let emptyFn = function () {};
let privateFn = function () {};
const objProto = Object.prototype;
const toString = objProto.toString;
const iterableRe = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List)\]/;

/**
 * 返回当前时间戳
 *
 * @method now
 * @memberof TopJs
 */
TopJs.now = Date.now || function ()
    {
        return +new Date();
    };

/**
 * 返回当前的时间戳，纳秒分辨率
 *
 * @type {Number}
 * @method ticks
 * @memberof TopJs
 */
TopJs.ticks = function ()
{
    let tinfo = process.hrtime();
    return tinfo[0] * 1e9 + tinfo[1]
};

TopJs.$startTime = TopJs.ticks();
/**
 * 有条件的将config的字段复制到object中
 *
 * @memberOf TopJs
 * @param {Object} object 目标的对象
 * @param {Object} config 指定的复制的对象
 * @param {Object} defaults 默认复制对象
 */
TopJs.apply = function (object, config, defaults)
{
    if (defaults) {
        TopJs.apply(object, defaults);
    }
    if (object && config && typeof config === "object") {
        for (let key in config) {
            object[key] = config[key];
        }
    }
    return object;
};

/**
 * @namespace TopJs
 */
TopJs.apply(TopJs, /** @lends TopJs */{
    /**
     * ```javascript
     *
     * TopJs.define("MyClass", {
     *    nothing: TopJs.emptyFnm
     *    
     *    privates: {
     *       privateNothing: TopJs.privateFn
     *    }
     * })
     *
     * ```
     *
     * @property {Function} privateFn privateFn
     */
    privateFn: privateFn,

    /**
     * @property {Function} emptyFn 可复用的空函数模板
     */
    emptyFn: emptyFn,

    /**
     * 有条件的将config的字段复制到object中
     *
     * @param {Object} object 目标对象
     * @param {Object} config 指定的复制的对象
     */
    applyIf(object, config)
    {
        if (object) {
            for (let property in config) {
                if (object[property] === undefined) {
                    object[property] = config[property];
                }
            }
        }
        return object;
    },

    /**
     * @method
     * @param {Object} value 等待检查的函数
     * @return {Boolean}
     */
    isArray: ("isArray" in Array) ? Array.isArray :
        function (value)
        {
            return toString.call(value) === "[object Array]";
        },

    /**
     * 判断传入的是否为对象
     *
     * @method
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isObject: InternalFuncs.is_object,

    /**
     * 快速判断传入的对象是否在Object字面类型
     *
     * @private
     * @memberOf TopJs
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isSimpleObject(value)
    {
        return value instanceof Object && value.constructor === Object;
    },

    /**
     * 判断传入的是否为字符串
     *
     * @method
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isString: InternalFuncs.is_string,

    /**
     * 判断传入的是否为函数
     *
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isFunction(value)
    {
        return !!value && typeof value === "function";
    },

    /**
     * 如果传入的对象为number返回`true`，不是number或者无穷数返回`false`
     *
     * @param {Object} value 等待测试的值
     * @returns {Boolean}
     */
    isNumber(value)
    {
        return typeof value === "number" && isFinite(value);
    },

    /**
     * 返回`true`如果传入的对象是`numeric`类型
     *
     * @param {Object} value 例如：1, `1`, `2.34`
     * @return {Boolean}
     */
    isNumeric(value)
    {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * 返回`true`如果传入的对象是布尔型
     *
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isBoolean(value)
    {
        return typeof value === "boolean";
    },

    /**
     * 判断传入的对象是否为JavaScript `primitive`，字符串, 数字和布尔类型
     *
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isPrimitive(value)
    {
        let type = typeof value;
        return "string" === type || "number" === type || "boolean" === type;
    },

    /**
     * 判断传入的对象是否为日期类型
     *
     * @param {Object} value 等待检查的对象
     * @return {Boolean}
     */
    isDate(value)
    {
        return toString.call(value) === "[object Date]";
    },

    /**
     * 判断传入的对象是否为空，判断为空的标准是
     * SB
     * - `null`
     * - `undefined`
     * - 空数组
     * - 长度为零的字符串(除非参数`allowEmptyString`为`true`)
     *
     * @param {Object} value 等待测试的值
     * @param {Boolean} allowEmptyString 空字符是否不为空
     * @return {Boolean}
     */
    isEmpty(value, allowEmptyString = false)
    {
        return (value == null) || (!allowEmptyString ? value === "" : false) || TopJs.isArray(value) && value.length === 0;
    },

    /**
     * 判断传入的对象是否已经定义
     *
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isDefined(value)
    {
        return typeof value !== "undefined";
    },

    /**
     * 探测传入的值是否可遍历
     *
     * @param {Object} value 等待测试的值
     * @return {Boolean}
     */
    isIterable(value)
    {
        if (!value || typeof value.length !== "number" || typeof value === "string" ||
            TopJs.isFunction(value)) {
            return false;
        }
        if (!value.propertyIsEnumerable) {
            return !!value.item;
        }
        if (value.hasOwnProperty("length") && !value.propertyIsEnumerable("length")) {
            return true;
        }
        return iterableRe.test(toString.call(value));
    },

    /**
     * 确保返回值，如果value不为空返回自己，否则返回defaultValue
     *
     * @param {Object} value
     * @param {Object} defaultValue
     * @param {Object} allowBlank 默认为false，当为true的时候，空字符串不为空
     */
    ensureValue(value, defaultValue, allowBlank = false)
    {
        return TopJs.isEmpty(value, allowBlank) ? defaultValue : value;
    },

    /**
     * 销毁传入的对象，如果传入的是数组，那么递归删除
     *
     * 删除的意思是根据传入的参数决定
     *  * `Array` 所有的元素递归的删除
     *  * `Object` 所有的具有`destroy`方法的都会被调用
     *
     * @param {...Mixed} args 任意数量的对象和数组
     */
    destroy()
    {
        let ln = arguments.length;
        for (let i = 0; i < ln; i++) {
            let arg = arguments[i];
            if (arg) {
                if (TopJs.isArray(arg)) {
                    this.destroy(...arg);
                } else if (Ext.isFunction(arg.destroy)) {
                    arg.destroy();
                }
            }
        }
    },

    /**
     * 删除参数object中指定的字段，在这些字段上调用TopJs.destroy()函数，这些目标删除的字段最终被设置
     * 为`null`。
     *
     * @param {Object} object 将要删除的目标对象
     * @param {...String} args 目标被删除的字段的名称
     * @return {Object}
     */
    destroyMembers(object)
    {
        let len = arguments.length;
        let ref;
        let name;
        for (let i = 1, a = arguments[i]; i < len; i++) {
            name = a[i];
            ref = object[name];
            if (null != ref) {
                TopJs.destroy(ref);
                object[name] = null;
            }
        }
    },

    /**
     * 用给定的值覆盖目标对象的指定的字段
     *
     * 如果目标的`target`的是通过{@link TopJs#define TopJs.define}定义的类，那么
     * 对象的`override`方法将会调用 (参考 {@link TopJs.Base#override}) 把`overrides`
     * 当做参数传入
     *
     * 如果传入的`target`是函数，那么我们默认其为构造函数，`overrides`将使用{@link TopJs.apply}
     * 添加到其的原型对象上
     *
     * 如果目标的`target`的是通过{@link TopJs#define TopJs.define}定义的类的实例化的对象，那么
     * `overrides`将复制到实例对象上，这种情况下，方法拷贝会被特使处理，让其能使用{@link TopJs.Base#callParent}。
     *
     * ```javascript
     * let controller = new TopJs.Controller({ ... });
     *
     * TopJs.override(controller, {
     *    forwardRequest: function()
     *    {
     *       //一些语句
     *       this.callParent();
     *    }
     * });
     *
     * ```
     *
     * 如果`target`不是以上几种，那么`overrides`将使用{@link TopJs#apply}复制到`target`上
     *
     * 详情请参考 {@link TopJs#define}和{@link TopJs.Base#override}
     *
     * @param {Object} target 目标替换对象
     * @param {Object} overrides 替换时使用的值对象
     * @return {Object} 替换之后的对象
     */
    override(target, overrides)
    {
        if (typeof target === "function") {
            TopJs.apply(target.prototype, overrides);
        } else {
            TopJs.apply(target, overrides);
        }
        return target;
    },

    /**
     * 克隆一个指定的对象
     *
     * @param {Object} item 等待克隆的值
     * @return {Object}
     */
    clone(item)
    {
        if (null === item || undefined === item) {
            return item;
        }
        let type = toString.call(item);
        let clone;
        // Date
        if ("[object Date]" === type) {
            return new Date(item.getTime());
        }

        // Array
        if ("[object Array]" === type) {
            let i = item.length;
            clone = [];
            while (i--) {
                clone[i] = TopJs.clone(item[i]);
            }
        }
        // Object
        else if ("[object Object]" === type && item.constructor === Object) {
            clone = {};
            for (let key in item) {
                clone[key] = TopJs.clone(item[key]);
            }
        }
        return clone || item;
    },

    /**
     * @private
     */
    Logger: {
        //<feature logger>
        log: function (message, priority)
        {
            if (message && console) {
                if (!priority || !(priority in console)) {
                    priority = 'log';
                }
                message = '[' + priority.toUpperCase() + '] ' + message;
                console[priority](message);
            }
        },
        verbose: function (message)
        {
            this.log(message, 'verbose');
        },
        info: function (message)
        {
            this.log(message, 'info');
        },
        warn: function (message)
        {
            this.log(message, 'warn');
        },
        error: function (message)
        {
            throw new Error(message);
        },
        deprecate: function (message)
        {
            this.log(message, 'warn');
        }
    } ||
    //</feature>
    {
        verbose: emptyFn,
        log: emptyFn,
        info: emptyFn,
        warn: emptyFn,
        error: function (message)
        {
            throw new Error(message);
        },
        deprecate: emptyFn
    }
});
/**
 * 这个名称空间是一些`TopJs`框架的底层实现，里面的函数和类定义不遵循`TopJs`的类规范
 * 应用程序不需要直接继承里面的类和函数，直接通过`TopJs`名称空间使用就可以
 *
 * @namespace TopJs.kernel
 */