"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * @namespace TopJs.eventmanager
 */
TopJs.namespace('TopJs.eventmanager');

/**
 * @alias TopJs.eventmanager.ResponseCollection
 * @classdesc
 *
 * Collection of signal handler return values
 */
class ResponseCollection {
    constructor()
    {

        /**
         * @property {Boolean} _stopped
         * @private
         */
        this._stopped = false;
    }

    /**
     * Did the last response provided trigger a short circuit of the stack?
     *
     * @memberOf TopJs.eventmanager.ResponseCollection
     * @instance
     * @return {Boolean}
     */
    stopped()
    {
        return this._stopped;

    }

    /**
     * Mark the collection as stopped (or its opposite)
     *
     * @param {Boolean} flag
     * @return {TopJs.eventmanager.ResponseCollection}
     */
    setStopped(flag)
    {
        this._stopped = !!flag;
        return this;
    }

    /**
     * Convenient access to the first handler return value.
     *
     * @return {Object} The first handler return value
     */
    first()
    {
        return this.bottom();
    }

    /**
     * Convenient access to the last handler return value.
     *
     * If the collection is empty, returns null. Otherwise, returns value
     * returned by last handler.
     *
     * @return {Object} The last handler return value
     */
    last()
    {
        if (0 === this.count()) {
            return null;
        }
        return this.top();
    }

    /**
     * Check if any of the responses match the given value.
     *
     * @param {Object} value The value to look for among responses
     * @return {Boolean}
     */
    contains(value)
    {
        for (let [key, response] of this) {
            if (response === value) {
                return true;
            }
        }
        return false;
    }
}

TopJs.registerClass("TopJs.eventmanager.ResponseCollection", ResponseCollection);
module.exports = ResponseCollection;
