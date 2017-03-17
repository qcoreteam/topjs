"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.stdlib");

let ParametersInterface = TopJs.require("TopJs.stdlib.ParametersInterface");

class Parameters {
    /**
     * @private
     * @property {Map} data
     */
    data = new Map();
    
    /**
     * Constructor
     *
     * @param {Object} values
     */
    constructor(values = null)
    {
        if (null != values && TopJs.isSimpleObject(values)) {
            this.fromLiteralObject(values);
        }
    }

    /**
     * From
     *
     * Allow deserialization from standard
     *
     * @param {Object} values
     * @return {TopJs.stdlib.Parameters}
     */
    fromLiteralObject(values)
    {
        for (let [key, value] of Object.entries(values)) {
            this.data.set(key, value);
        }
        return this;
    }

    /**
     * From string
     *
     * Allow deserialization from raw body{} e.g., for PUT requests
     *
     * @param {String} string
     * @return mixed
     */
    fromString(string)
    {
        this.fromLiteralObject(TopJs.Object.fromQueryString(string));
        return this;
    }

    /**
     * To
     *
     * Allow serialization back to standard
     *
     * @return {Object}
     */
    toLiteralObject()
    {
        let obj = {};
        for (let [value, key] of this.data) {
            obj[key] = value;
        }
        return obj;
    }

    /**
     * To string
     *
     * Allow serialization to query format{} e.g., for PUT or POST requests
     *
     * @return mixed
     */
    toString()
    {
        return TopJs.Object.toQueryString(this.toLiteralObject());
    }

    /**
     * Get
     *
     * @param {String} name
     * @param {mixed} defaultValue
     * @return {mixed}
     */
    get(name, defaultValue = null)
    {
        if (this.data.has(name)) {
            return this.data.get(name);
        }
        return defaultValue;
    }

    /**
     * Set
     *
     * @param {String} name
     * @param {mixed} value
     * @return {TopJs.stdlib.ParametersInterface}
     */
    set(name, value)
    {
        this.data.set(name, value);
        return this;
    }

    /**
     * whether has parameter
     * 
     * @param {String} name
     * @return {Boolean}
     */
    has(name)
    {
        return this.data.has(name);
    }
}

TopJs.registerClass("TopJs.stdlib.Parameters", Parameters);
TopJs.implements(Parameters, ParametersInterface);
module.exports = Parameters;
