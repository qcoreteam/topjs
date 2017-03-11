"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let queryRe = /^\?/;
let keyRe = /(\[):?([^\]]*)\]/g;
let nameRe = /^([^\[]+)/;
let plusRe = /\+/g;

function object_check(object1, object2)
{
    for (let key of Object.keys(object1)) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
}

let TopJsObj = TopJs.Object = {};
/**
 * @class TopJs.Object
 * @requires TopJs.Date
 * @singleton
 */

TopJs.apply(TopJsObj, /** @lends TopJs.Object */{
    /**
     * 创建一个拥有指定原型和若干个指定属性的对象
     *
     * @method
     * @param {Object} proto 一个对象，作为新创建对象的原型。
     * @param {Object} propertiesObject 可选。该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与Object.defineProperties()的第二个参数一样）。注意：该参数对象不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，
     * 也就是说该对象的原型链上属性是无效的。
     * @return {object} 新创建的对象
     * @throws TypeError
     */
    chain: Object.create,
    /**
     * 删除传入的对象的所有的属性
     *
     * @param {Object} obj 等待删除的属性
     * @return {Object} 处理完成的属性
     */
    clear(obj)
    {
        for (let key in obj) {
            delete obj[key];
        }
        return obj;
    },

    /**
     * 冻结指定的对象属相，如果`deep`为`true`那么递归的去冻结该对象
     *
     * @param {Object} obj 等待冻结的对象
     * @param {Boolean} [deep=false] 是否递归冻结
     * @return {Object} 冻结之后的对象
     */
    freeze(obj, deep = false)
    {
        if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
            Object.freeze(obj);
            if (deep) {
                for (let key in obj) {
                    TopJsObj.freeze(obj, deep)
                }
            }
        }
        return obj;
    },

    /**
     * 将`name`和`value`参数对转换成浏览器支持的嵌套格式，构造一个`query strings`很有帮助
     *
     * ```javascript
     * let objects = TopJs.Object.toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
     *
     * // objects等价于:
     * [
     *    { name: 'hobbies', value: 'reading' },
     *    { name: 'hobbies', value: 'cooking' },
     *    { name: 'hobbies', value: 'swimming' },
     * ];
     *
     * let objects = TopJs.Object.toQueryObjects('dateOfBirth', {
       *    day: 3,
       *    month: 8,
       *    year: 1987,
       *    extra: {
       *       hour: 4
       *       minute: 30
       *    }
       * }, true); // 递归生成
     *
     * // objects等价于:
     * [
     *    { name: 'dateOfBirth[day]', value: 3 },
     *    { name: 'dateOfBirth[month]', value: 8 },
     *    { name: 'dateOfBirth[year]', value: 1987 },
     *    { name: 'dateOfBirth[extra][hour]', value: 4 },
     *    { name: 'dateOfBirth[extra][minute]', value: 30 },
     * ];
     * ```
     *
     * @param {String} name 生成键值对的名称
     * @param {Object/Array} value 对应`name`的值，支持数组生成和对象结构
     * @param {Boolean} [recursive=false] 是否递归生成
     * @return {Object[]} 生成的键值对象数组
     */
    toQueryObjects(name, value, recursive = false)
    {
        let self = TopJsObj.toQueryObjects;
        let objects = [];

        if (TopJs.isArray(value)) {
            let len = value.length;
            if (0 === len) {
                objects.push({
                    name: name,
                    value: ''
                });
            } else {
                for (let i = 0; i < len; i++) {
                    if (recursive) {
                        objects = objects.concat(self(`${name}[${i}]`, value[i], true));
                    } else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        } else if (TopJs.isObject(value)) {
            if (TopJsObj.isEmpty(value)) {
                objects.push({
                    name: name,
                    value: ''
                });
            } else {
                for (let [k, v] of Object.entries(value)) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + k + ']', v, true));
                    } else {
                        objects.push({
                            name: name,
                            value: v
                        });
                    }
                }
            }
        } else {
            objects.push({
                name: name,
                value: value
            });
        }
        return objects;
    },

    /**
     * 将一个对象转换成url查询字符串表示
     *
     * ```javascript
     * 不递归生成:
     *
     * TopJs.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
     * TopJs.Object.toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
     * TopJs.Object.toQueryString({'some price': '$300'}); // returns "some%20price=%24300"
     * TopJs.Object.toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
     * TopJs.Object.toQueryString({colors: ['red', 'green', 'blue']}); // returns "colors=red&colors=green&colors=blue"
     *
     * 递归生成:
     *
     * TopJs.Object.toQueryString({
       *    username: 'Jacky',
       *    dateOfBirth: {
       *       day: 1,
       *       month: 2,
       *       year: 1911
       *    },
       *    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
       * }, true); // returns the following string (broken down and url-decoded for ease of reading purpose):
     * // username=Jacky
     * //    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
     * //    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
     * ```
     *
     * @param {Object} object 用于转换的对象
     * @param {String} recursive [recursive=false] 是否递归生成
     * @return {String} 转换的到的字符串
     */
    toQueryString(object, recursive)
    {
        let paramObjects = [];
        let params = [];
        if (object === null || object === undefined) {
            return "";
        }
        for (let [k, v] of Object.entries(object)) {
            paramObjects = paramObjects.concat(TopJsObj.toQueryObjects(k, v, recursive));
        }
        let len = paramObjects.length;
        let param;
        let paramValue;
        for (let i = 0; i < len; i++) {
            param = paramObjects[i];
            paramValue = param.value;
            if (TopJs.isEmpty(paramValue)) {
                paramValue = '';
            } else if (TopJs.isDate(paramValue)) {
                paramValue = TopJs.Date.toString(paramValue);
            }
            params.push(encodeURIComponent(param.name) + '=' + encodeURIComponent(String(paramValue)));
        }
        return params.join('&');
    },

    /**
     * 将查询字符串转换成常量对象
     *
     * ```javascript
     * 非递归:
     *
     * TopJs.Object.fromQueryString("foo=1&bar=2"); // returns {foo: '1', bar: '2'}
     * TopJs.Object.fromQueryString("foo=&bar=2"); // returns {foo: '', bar: '2'}
     * TopJs.Object.fromQueryString("some%20price=%24300"); // returns {'some price': '$300'}
     * TopJs.Object.fromQueryString("colors=red&colors=green&colors=blue"); // returns {colors: ['red', 'green', 'blue']}
     *
     * 递归方式:
     *
     * TopJs.Object.fromQueryString(
     *    "username=Jacky&"+
     *    "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
     *    "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
     *    "hobbies[3][0]=nested&hobbies[3][1]=stuff", true
     * );
     *
     * // 返回值
     * {
       *    username: 'Jacky',
       *    dateOfBirth: {
       *       day: '1',
       *       month: '2',
       *       year: '1911'
       *    },
       *    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
       * }
     * ```
     *
     * @param {String} queryString 用来转换的字符串
     * @param {Boolean} [recursive=false] 递归解出数据
     */
    fromQueryString(queryString, recursive)
    {
        let parts = queryString.replace(queryRe, '').split('&');
        let object = {};
        let len = parts.length;
        let part;
        let components;
        let matchedKeys;
        let matchedName;
        let name;
        let value;
        let nextKey;
        for (let i = 0; i < len; i++) {
            part = parts[i];
            if (part.length > 0) {
                components = part.split('=');
                name = components[0];
                name = name.replace(plusRe, '%20');
                name = decodeURIComponent(name);
                value = components[1];
                if (undefined !== value) {
                    value = value.replace(plusRe, '%20');
                    value = decodeURIComponent(value);
                } else {
                    value = '';
                }
                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!TopJs.isArray(object[name])) {
                            object[name] = [object[name]];
                        }
                        object[name].push(value);
                    } else {
                        object[name] = value;
                    }
                } else {
                    matchedKeys = name.match(keyRe);
                    matchedName = name.match(nameRe);
                    //<debug>
                    if (!matchedName) {
                        throw new Error(`[TopJs.Object.fromQueryString] 查询字符串格式有错误，解析错误部分"${part}"`);
                    }
                    //</debug>
                    name = matchedName[0];
                    let keys = [];
                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }
                    for (let j = 0, subLen = matchedKeys.length; j < subLen; j++) {
                        let key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }
                    keys.unshift(name);
                    let temp = object;
                    for (let j = 0, subLen = keys.length; j < subLen; j++) {
                        let key = keys[j];
                        if (j === subLen - 1) {
                            if (TopJs.isArray(temp) && key === '') {
                                temp.push(value);
                            } else {
                                temp[key] = value;
                            }
                        } else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j + 1];
                                temp[key] = (TopJs.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }
                            temp = temp[key];
                        }
                    }
                }
            }
        }
        return object;
    },

    /**
     * 对传入的对象依次调用指定的回调函数，如果回调函数返回`false`，那么就停止迭代
     *
     * ```javascript
     * let person = {
       *    name: "Jacky"
       *    hairColor: "black"
       *    loves: ["food", "sleeping", "wife"]
       * };
     *
     * TopJs.Object.each(person, function(key, value, myself) {
       *    console.log(key + ":" + value);
       *    if (key === "hairColor") {
       *       return false; // 停止迭代
       *    }
       * });
     * ```
     *
     * @param {Object} object 需要遍历的对象
     * @param {Function} func 遍历调用的回调函数
     * @param {String} func.key 回调函数第一个参数，对象的`key`
     * @param {Object} func.value 回调函数第一个参数，对象的`value`
     * @param {Object} func.object 遍历的对象本身
     * @param {Object} [scope] 回调函数的作用域
     */
    each(object, func, scope)
    {
        if (object) {
            scope = scope || object;
            for (let [k, v] of Object.entries(object)) {
                if (false === func.call(scope, k, v, object)) {
                    return;
                }
            }
        }
    },

    /**
     * 迭代指定的对象，调用指定的回调函数，回调函数接受对象的值作为参数
     *
     * ```javascript
     * let items = {
       *    1: 'Hello',
       *    2: 'TopJs'
       * };
     *
     * TopJs.Object.eachValue(items, function (value) {
       *    console.log("Value: " + value);
       * });
     * //会输出 `Hello`和`TopJs`但是两个之间的输出顺序不定
     * ```
     *
     * @param {Object} object 需要遍历的对象
     * @param {Function} func 遍历调用的回调函数
     * @param {Object} func.value 回调函数的参数，对象的`value`
     * @param {Object} [scope] 回调函数的作用域
     */
    eachValue(object, func, scope)
    {
        if (object) {
            scope = scope || object;
            for (let [k, v] of Object.entries(object)) {
                if (false === func.call(scope, v)) {
                    return;
                }
            }
        }
    },

    /**
     * 递归合并指定的对象到目标对象中
     *
     * ```javascript
     * let topjs = {
       *    teamName: "qcoreteam",
       *    products: [ "topjs", "qingeditor", "qingswift" ],
       *    isSuperCool: true,
       *    office: {
       *       location: "earth",
       *       isFun: true
       *    }
       * };
     *
     * var newStuff = {
       *    companyName: "cntysoft",
       *    products: [ "topjs", "qingeditor", "qingswift"],
       *    office: {
       *       size: 12,
       *       location: 'Beijing'
       *    }
       * };
     *
     * var qcoreteam = TopJs.Object.merge(topjs, newStuff);
     * // topjs和qcoreteam都等于
     * {
       *    companyName: 'cntysoft',
       *    products: [ "topjs", "qingeditor", "qingswift"],
       *    isSuperCool: true,
       *    office: {
       *       size: 12,
       *       location: 'Beijing',
       *       isFun: true
       *    }
       * }
     * ```
     *
     * @param {Object} destination 合并的目标对象
     * @param {...Object} sources 数据合并来源对象
     * @return {Object} 合并之后的结果
     */
    merge(destination, ...sources)
    {
        let len = arguments.length;
        let mergeFunc = TopJsObj.merge;
        let cloneFunc = TopJs.clone;
        let object;
        for (let i = 0; i < len; i++) {
            object = sources[i];
            for (let key in object) {
                let value = object[key];
                if (value && value.constructor === Object) {
                    let destValue = destination[key];
                    if (destValue && destValue.constructor === Object) {
                        mergeFunc(destValue, value);
                    } else {
                        destination[key] = cloneFunc(value);
                    }
                } else {
                    destination[key] = value;
                }
            }
        }
        return destination;
    },

    /**
     * 有条件的合并来源对象到`destination`对象中
     *
     * @param {Object} destination 目标对象
     * @param {...Object} sources 来源对象列表
     * @return {Object} 合并之后的对象列表
     */
    mergeIf(destination, ...sources)
    {
        let len = sources.length;
        let cloneFunc = TopJsObj.clone;
        for (let i = 0; i < len; i++) {
            let object = arguments[i];
            for (let key in object) {
                if (!(key in destination)) {
                    let value = object[key];
                    if (value && value.constructor === Object) {
                        destination[key] = cloneFunc(value);
                    } else {
                        destination[key] = value;
                    }
                }
            }
        }
        return destination;
    },

    /**
     * 获取指定对象的所有属性名称
     *
     * @param {Object} object 目标对象引用
     * @return {Array} 对象所有属性数组
     */
    getAllKeys(object)
    {
        let keys = [];
        for (let property in object) {
            keys.push(property);
        }
        return keys;
    },

    /**
     * 获取常量对象中值等于`value`参数的键名称
     *
     * ```javascript
     *
     * let person = {
       *    name: "softboy",
       *    loves: "programming"
       * };
     * console.log(TopJs.Object.getKey(person, "programming")); // 输出`loves`
     * ```
     *
     * @param {Object} object 目标的操作数组
     * @param {Object} value 比较的值
     * @return {Object|null}
     */
    getKey(object, value)
    {
        for (let property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }
        return null;
    },

    /**
     * 获取传入对象的值得集合
     *
     * @param {Object} object 目标操作对象
     * @return {Array}
     */
    getValues(object)
    {
        let values = [];
        if (null === object || undefined === object) {
            return values;
        }
        for (let key of Object.keys(object)) {
            values.push(object[key]);
        }
        return values;
    },

    /**
     * 获取一个对象的大小
     *
     * ```javascript
     * let size = TopJs.Object.getSize({
       *    name: 'softboy',
       *    loves: 'programming'
       * }); // size等于2
     * ```
     * @param {Object} object 需要检查的对象
     * @return {Number} 对象的大小
     */
    getSize(object)
    {
        let size = 0;
        if (object) {
            size = Object.keys(object).length;
        }
        return size;
    },

    /**
     * 检查当前的对象是否为空
     *
     * @param {Object} object 需要检查的对象
     * @return {Boolean} `true`代表对象没有任何属性
     */
    isEmpty(object)
    {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },

    /**
     * 浅比较两个对象是否相等
     *
     * ```javascript
     * // 相等的返回`true`
     * TopJs.Object.equals({
       *    foo: 1,
       *    bar: 2
       *  }, {
       *    foo: 1,
       *    bar: 2
       * });
     * ```
     *
     * @param {Object} object1 参与比较的对象1
     * @param {Object} object2 参与比较的对象2
     * @return {Boolean} 如果两个对象相等就返回`true`
     */
    equals(object1, object2)
    {
        if (object1 === object2) {
            return true;
        }
        if (object1 && object2) {
            return object_check(object1, object2) && object_check(object2, object1);
        } else if (!object1 && !object2) {
            return object1 === object2;
        } else {
            return false;
        }
    },
    /**
     * 相等性判断，私有函数
     *
     * @private
     * @param {String} arg1
     * @param {String} arg2
     */
    equalCheck(arg1, arg2)
    {
        for (let key in arg1) {
            if (arg1.hasOwnProperty(key)) {
                if (arg1[key] !== arg2[key]) {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * @param {String} obj
     */
    fork(obj)
    {
        let ret;
        if (obj && obj.constructor === Object) {
            ret = TopJsObj.chain(obj);
            for (let key in obj) {
                let value = obj[key];
                if (value) {
                    if (value.constructor === Object) {
                        ret[key] = TopJsObj.fork(value);
                    } else if (value instanceof Array) {
                        ret[key] = TopJs.Array.clone(value);
                    }
                }
            }
        } else {
            ret = obj;
        }
        return ret;
    },

    /**
     * 将传入的对象成成Class对象
     *
     * @private
     * @param object
     */
    classify(object)
    {
        let prototype = object;
        let objectProperties = [];
        let propertyClassesMap = {};
        let objectClass = function ()
        {
            let len = objectProperties.length;
            let property;
            for (let i = 0; i < len; i++) {
                property = objectProperties[i];
                this[property] = new propertyClassesMap[property]();
            }
        };
        for (let [k, v] of Object.entries(object)) {
            if (v && v.constructor === Object) {
                objectProperties.push(key);
                propertyClassesMap[key] = TopJsObj.classify(v);
            }
        }
        objectClass.prototype = prototype;
        return objectClass;
    }
});