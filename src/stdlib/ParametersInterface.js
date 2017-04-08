"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.namespace("TopJs.stdlib");

/**
 * @alias TopJs.stdlib.ParametersInterface
 */
class ParametersInterface {
    /**
     * Constructor
     *
     * @param {Object} values
     */
    constructor(values = null)
    {
    }

    /**
     * From
     *
     * Allow deserialization from standard
     *
     * @param values
     * @return mixed
     */
    fromArray(values)
    {
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
    }

    /**
     * To
     *
     * Allow serialization back to standard
     *
     * @return mixed
     */
    toArray()
    {
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
    }
}

TopJs.registerClass("TopJs.stdlib.ParametersInterface", ParametersInterface);
module.exports = ParametersInterface;
