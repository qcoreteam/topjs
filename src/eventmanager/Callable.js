"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace('TopJs.eventmanager');

/**
 * @alias TopJs.eventmanager.Callable
 */
class Callable {
    
    constructor(callable, object)
    {
        /**
         * @property {Symbol} callableType
         */
        this.callableType = Callable.CALLABLE_TYPE_NORMAL;
        /**
         * @property {Array} callableData
         */
        this.callableData = [];
        if (TopJs.isFunction(callable)) {
            throw new TypeError(
                TopJs.sprintf("callable arg must callable, %s received", (typeof callable))
            );
        }
        this.callableData.push(callable);
        if (!TopJs.isEmpty(object)) {
            this.callableData.push(object);
        }
        if (this.callableData.length === 2) {
            this.callableType = Callable.CALLABLE_TYPE_METHOD;
        } else if (this.callableData.length === 1) {
            this.callableType = Callable.CALLABLE_TYPE_NORMAL;
        }
    }

    /**
     * call internal callable function or class method with args
     *
     * @param args
     * @return {mixed}
     */
    call(...args)
    {

    }
}

TopJs.apply(Callable,  /** @lends TopJs.eventmanager.Callable */{
    CALLABLE_TYPE_NORMAL: Symbol("TopJs.eventmanager.Callable.CALLABLE_TYPE_NORMAL"),
    CALLABLE_TYPE_METHOD: Symbol("TopJs.eventmanager.Callable.CALLABLE_TYPE_METHOD")
});

TopJs.registerClass("TopJs.eventmanager.Callable", Callable);

module.exports = Callable;