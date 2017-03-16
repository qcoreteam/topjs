"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace('TopJs.eventmanager');

let EventInterface = TopJs.require("TopJs.eventmanager.EventInterface");

class Event {
    /**
     * @property {String} Event name
     */
    name;

    /**
     * @property {String|Object} The event target
     */
    target;

    /**
     * @property {Map} The event parameters
     */
    params = new Map();

    /**
     * @property {Boolean} stopPropagationFlag
     */
    stopPropagationFlag = false;

    constructor(name = null, target = null, params = null)
    {
        if (null !== name) {
            this.setName(name);
        }

        if (null !== target) {
            this.setTarget(target);
        }

        if (null !== target) {
            this.setParams(params);
        }
    }

    /**
     * Get event name
     *
     * @return {String}
     */
    getName()
    {
        return this.name;
    }

    /**
     * Get the event target
     *
     * This may be either an object, or the name of a static method.
     *
     * @return {String|Object}
     */
    getTarget()
    {
        return this.target;
    }

    /**
     * Set parameters
     *
     * Overwrites parameters
     *
     * @param {Object|Map} params
     * @throws {TopJs.Error}
     */
    setParams(params)
    {
        if (!TopJs.isSimpleObject(params) && !(params instanceof Map)) {
            TopJs.raise(TopJs.raise(
                'Event parameters must be an array or object; received "%s"', (typeof params)
            ));
        }
        if (TopJs.isSimpleObject(params)) {
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    this.params.set(key, params[key]);
                }
            }
        } else if (params instanceof Map) {
            let me = this;
            params.forEach(function (value, key){
                me.params.set(key, value);
            });
        }
        this.params = params;
    }

    /**
     * Get all parameters
     * 
     * @return {Map}
     */
    getParams()
    {
        return this.params;
    }

    /**
     * Get an individual parameter
     *
     * If the parameter does not exist, the $default value will be returned.
     *
     * @param {String} name
     * @param {Object} defaultValue
     * @return {Object}
     */
    getParam(name, defaultValue = null)
    {
        if (!this.params.has(name)) {
            return defaultValue;
        }
        return this.params.get(name);
    }

    /**
     * Set the event name
     *
     * @param {String} name
     * @return {TopJs.eventmanager.Event}
     */
    setName(name)
    {
        this.name = name;
        return this;
    }

    /**
     * Set the event target/context
     *
     * @param {Object} target
     * @return {TopJs.eventmanager.Event}
     */
    setTarget(target) 
    {
        this.target = target;
        return this;
    }

    /**
     * Set an individual parameter to a value
     *
     * @param {String} name
     * @param {Object} value
     * @return {TopJs.eventmanager.Event}
     */
    setParam(name, value) 
    {
        this.params.set(name, value);
        return this;
    }

    /**
     * Stop further event propagation
     *
     * @param {Boolean} flag
     * @return {TopJs.eventmanager.Event}
     */
    stopPropagation(flag = true)
    {
        this.stopPropagationFlag = flag;
        return this;
    }

    /**
     * Is propagation stopped?
     *
     * @return {Boolean}
     */
    propagationIsStopped()
    {
        return this.stopPropagationFlag;
    }
}

TopJs.registerClass("TopJs.eventmanager.Event", Event);
TopJs.implements(Event, EventInterface);

module.exports = Event;
