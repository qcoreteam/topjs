"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace('TopJs.eventmanager.filter');

let FastPriorityQueue = TopJs.require("TopJs.stdlib.FastPriorityQueue");

class FilterIterator extends FastPriorityQueue
{
    /**
     * Does the queue contain a given value?
     *
     * @param {Object} datum
     * @return {Boolean}
     */
    contains(datum)
    {
        for (let [index, item] of this) {
            if (datum === item) {
                return true;
            }
        }
        return false;
    }


    /**
     * Insert a value into the queue.
     *
     * Requires a callable.
     *
     * @param {TopJs.eventmanager.Callable} value
     * @param {Number} priority
     * @return void
     */
    insert(value, priority)
    {
        
    }
}

TopJs.registerClass("TopJs.eventmanager.filter.FilterIterator");
module.exports = FilterIterator;