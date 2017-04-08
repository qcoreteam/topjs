"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.stdlib");

// the proxy handler
let abstractOptionsHandler = {

    /**
     * Get a configuration property
     *
     * @param {TopJs.stdlib.AbstractOptions} target
     * @param {String} name
     * @throws {TopJs.Error}
     * @return mixed
     */
    get(target, name)
    {
        if (name == "inspect" || (typeof name == 'symbol') || (target[name] && TopJs.isFunction(target[name]))) {
            return target[name];
        }
        let getter = 'get' + TopJs.String.capitalize(name);
        if (target[getter] && TopJs.isFunction(target[getter])) {
            return target[getter]();
        }
        if (target.$_strict_mode_$) {
            TopJs.raise(TopJs.sprintf(
                'The option "%s" does not have a callable property getter (%s)',
                name,
                getter
            ));
        }
    },

    /**
     * Set a configuration property
     *
     * @private
     * @param {TopJs.stdlib.AbstractOptions} target
     * @param {String} name
     * @param {mixed} value
     * @return {void}
     * @throws {TopJs.Error}
     */
    set(target, name, value)
    {
        let setter = 'set' + TopJs.String.capitalize(name);
        if (target[setter] && TopJs.isFunction(target[setter])) {
            target[setter](value);
            return true;
        }
        if (target.$_strict_mode_$) {
            TopJs.raise(TopJs.sprintf(
                'The option "%s" does not have a callable property setter (%s).',
                name,
                setter
            ));
        }
    },
    
    has(target, name)
    {
        return !!target[name];
    }
};

/**
 * @alias TopJs.stdlib.AbstractOptions
 */
class AbstractOptions
{
    /**
     * Constructor
     *
     * @param {Object} options
     */
    constructor(options)
    {
        /**
         * We use the prefix to avoid collisions with properties in
         * user-implementations.
         *
         * @private
         * @property {Boolean} $_strict_mode_$
         */
        this.$_strict_mode_$ = true;
        if (null != options) {
            this.setFromLiteralObject(options);
        }
        return new Proxy(this, abstractOptionsHandler);
    }

    /**
     * Set one or more configuration properties
     *
     * @param {Object} options
     * @return {TopJs.stdlib.AbstractOptions} Provides fluent interface
     */
    setFromLiteralObject(options)
    {
        if (options instanceof AbstractOptions) {
            options = options.toLiteralObject();
        }
        if (!TopJs.isSimpleObject(options)) {
            TopJs.raise(TopJs.sprintf(
                "Parameter provided to %s must be an %s",
                "TopJs.stdlib.AbstractOptions.setFromLiteralObject",
                "Literal Object"
            ));
        }
        for (let [key, value] of options) {
            abstractOptionsHandler.set(this, key, value);
        }
        return this;
    }

    /**
     * Get the literal object of this object
     * 
     * @return {Object}
     */
    toLiteralObject()
    {
        let obj = {};
        for (let prop in this) {
            if ('$_strict_mode_$' !== prop && !TopJs.isFunction(this[prop])) {
                obj[prop] = this[prop];
            }
        }
        return obj;
    }
}

TopJs.registerClass("TopJs.stdlib.AbstractOptions", AbstractOptions);
module.exports = AbstractOptions;
