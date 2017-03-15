"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.stdlib");

let PriorityQueue = TopJs.require("TopJs.stdlib.PriorityQueue");

/**
 * @class TopJs.stdlib.FastPriorityQueue
 * @classdesc
 *
 * This is an efficient implementation of an integer priority queue in PHP
 *
 * This class acts like a queue with insert() and extract(), removing the
 * elements from the queue and it also acts like an Iterator without removing
 * the elements. This behaviour can be used in mixed scenarios with high
 * performance boost.
 */
class FastPriorityQueue 
{
    static EXTR_DATA = PriorityQueue.EXTR_DATA;
    static EXTR_PRIORITY = PriorityQueue.EXTR_PRIORITY;
    static EXTR_BOTH = PriorityQueue.EXTR_BOTH;

    /**
     * @property {Symbol} extractFlag
     */
    extractFlag = FastPriorityQueue.EXTR_BOTH;

    /**
     * Elements of the queue, divided by priorities
     *
     * @property {Map} values
     */
    values = new Map();

    /**
     * Map of priorities
     *
     * @property {Map} priorities
     */
    priorities = new Map();

    /**
     * Map of priorities used for the iteration
     *
     * @property {Map} priorities
     */
    subPriorities = new Map();

    /**
     * Max priority
     *
     * @property {Number} maxPriority
     */
    maxPriority = 0;

    /**
     * Total number of elements in the queue
     *
     * @property {Number} length
     */
    length = 0;

    /**
     * Index of the current element in the queue
     *
     * @property {Number} index
     */
    index = 0;

    /**
     * Sub index of the current element in the same priority level
     *
     * @property {Number} subIndex
     */
    subIndex = 0;

    /**
     * Insert an element in the queue with a specified priority
     *
     * @param {Object} value
     * @param {Number} priority a positive integer
     */
    insert(value, priority)
    {
        if (!TopJs.isInteger(priority)) {
            TopJs.raise("The priority must be an Number");
        }
        if (!this.values.has(priority)) {
            this.values.set(priority, []);
        }
        let priorityArray = this.values.get(priority);
        priorityArray.push(value);
        if (!this.priorities.has(priority)) {
            this.priorities[priority] = priority;
            this.maxPriority = Number.max(priority, this.maxPriority);
        }
        this.length++;
    }

    /**
     * set the extract data flag
     * @param {Symbol} flag
     * @return {TopJs.stdlib.PriorityQueue}
     */
    setExtractFlag(flag)
    {
        if (FastPriorityQueue.EXTR_BOTH == flag ||
            FastPriorityQueue.EXTR_DATA == flag ||
            FastPriorityQueue.EXTR_PRIORITY == flag) {
            this.extractFlag = flag;
        } else {
            TopJs.raise("The extract flag specified is not valid");
        }
        return this;
    }

    /**
     * Extract an element in the queue according to the priority and the
     * order of insertion
     *
     * @return {Object}
     */
    extract()
    {
        if (!this.valid()) {
            return false;
        }
        let datum = this.values.get(this.maxPriority).shift();
        if (!datum) {
            this.priorities.delete(this.maxPriority);
            this.values.delete(this.maxPriority);
            this.maxPriority = (0 === this.priorities.size()) ? 0 : this.getMaxPriority(this.priorities);
            this.subIndex = -1;
        }
        ++this.index;
        ++this.subIndex;
        --this.length;
        switch (this.extractFlag) {
            case FastPriorityQueue.EXTRA_DATA:
                return datum;
            case FastPriorityQueue.EXTR_PRIORITY:
                return this.maxPriority;
            case FastPriorityQueue.EXTR_BOTH:
                return [datum, this.maxPriority];
        }
    }

    /**
     * Check if the queue is empty
     *
     * @return {Boolean}
     */
    empty()
    {
        return this.values.empty();
    }

    /**
     * Does the queue contain the given datum?
     *
     * @param {Object} datum
     * @return {Boolean}
     */
    contains(datum)
    {
        for (let [key, value] of this.values) {
            if (value.includes(datum)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Does the queue have an item with the given priority?
     *
     * @param {Number} priority
     * @return {Boolean}
     */
    hasPriority(priority)
    {
        return this.values.has(priority);
    }

    /**
     * Check if the current iterator is valid
     *
     * @return {Boolean}
     */
    valid()
    {
        return this.values.has(this.maxPriority);
    }

    /**
     *  Rewind the current iterator
     */
    rewind()
    {
        this.subPriorities = this.priorities;
        this.maxPriority = (0 === this.priorities.size()) ? 0 : this.getMaxPriority(this.priorities);
        this.index = 0;
    }

    /**
     * get max priority from priorities
     *
     * @private
     * @return {Number}
     */
    getMaxPriority(map)
    {

        let priorities = [];
        map.forEach(function (value)
        {
            priorities.push(value);
        });
        let length = priorities.length;
        if (1 === length) {
            return priorities[0];
        }
        let max = priorities[0];
        for (let i = 1; i < length; i++) {
            if (max < priorities[i]) {
                max = priorities[i];
            }
        }
        return max;
    }

    [Symbol.iterator]()
    {
        let me = this;
        this.rewind();
        return {
            maxPriorityValuesIndex: 0,
            maxPriority: me.maxPriority,
            index: me.index,
            subIndex: me.subIndex,
            next ()
            {
                let datum = me.values.get(this.maxPriority)[this.maxPriorityValuesIndex++];
                let retValue;
                switch (me.extractFlag) {
                    case FastPriorityQueue.EXTRA_DATA:
                        retValue = [this.index, datum];
                        break;
                    case FastPriorityQueue.EXTR_PRIORITY:
                        retValue = [this.index, this.maxPriority];
                        break;
                    case FastPriorityQueue.EXTR_BOTH:
                        retValue = [this.index, [datum, this.maxPriority]];
                        break;
                }
                if (this.maxPriorityValuesIndex === me.values.get(this.maxPriority).length) {
                    me.subPriorities.delete(this.maxPriority);
                    this.maxPriorityValuesIndex = 0;
                    this.maxPriority = (0 === me.subPriorities.size()) ? 0 : me.getMaxPriority(me.subPriorities);
                }
                ++this.index;
                if (me.values.has(this.maxPriority)) {
                    return {
                        value: retValue,
                        done: false
                    };
                }

                return {
                    value: undefined,
                    done: true
                };
            }
        };
    }
}

TopJs.registerClass("TopJs.stdlib.FastPriorityQueue", FastPriorityQueue);
module.exports = FastPriorityQueue;
