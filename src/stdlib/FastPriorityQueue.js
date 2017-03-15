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
class FastPriorityQueue {
    static EXTRA_BOTH = Symbol("TopJs.stdlib.FastPriorityQueue.EXTR_BOTH");
    static EXTRA_PRIORITY = Symbol("TopJs.stdlib.FastPriorityQueue.EXTR_PRIORITY");
    static EXTRA_DATA = Symbol("TopJs.stdlib.FastPriorityQueue.EXTR_DATA");

    /**
     * @property {Symbol} extractFlag
     */
    extractFlag = FastPriorityQueue.EXTRA_BOTH;

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

    constructor(type = FastPriorityQueue.EXTRA_BOTH)
    {
        if (FastPriorityQueue.EXTRA_BOTH == type ||
            FastPriorityQueue.EXTRA_DATA == type ||
            FastPriorityQueue.EXTRA_PRIORITY == type) {
            this.extractFlag = type;
        }
    }

    /**
     * Insert an element in the queue with a specified priority
     *
     * @param {Object} value
     * @param {Number} priority a positive integer
     */
    insert(value, priority)
    {
        if (!TopJs.isNumber(priority)) {
            TopJs.raise("The priority must be an Number");
        }
        if (!this.values.has(priority)) {
            this.values.set(priority, []);
        }
        let priorityArray = this.values.get(priority);
        priorityArray.push(value);
        if (!this.priorities.has(priority)) {
            this.priorities.set(priority, priority);
            this.maxPriority = Math.max(priority, this.maxPriority);
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
        if (FastPriorityQueue.EXTRA_BOTH == flag ||
            FastPriorityQueue.EXTRA_DATA == flag ||
            FastPriorityQueue.EXTRA_PRIORITY == flag) {
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
            this.maxPriority = (0 === this.priorities.size) ? 0 : this.getMaxPriority(this.priorities);
            this.subIndex = -1;
            return this.extract();
        }
        ++this.index;
        --this.length;
        switch (this.extractFlag) {
            case FastPriorityQueue.EXTRA_DATA:
                return datum;
            case FastPriorityQueue.EXTRA_PRIORITY:
                return this.maxPriority;
            case FastPriorityQueue.EXTRA_BOTH:
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
        return this.values.size === 0;
    }

    /**
     * Get the total number of elements in the queue
     * 
     * @return {Number}
     */
    count ()
    {
        return this.length;
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
     * Remove an item from the queue
     *
     * This is different than {@link FastPriorityQueue.extract()}; its purpose is to dequeue an
     * item.
     *
     * Note: this removes the first item matching the provided item found. If
     * the same item has been added multiple times, it will not remove other
     * instances.
     *
     * @param {Object} datum
     * @return {Boolean} False if the item was not found, true otherwise.
     */
    remove(datum)
    {
        this.rewind();
        while (this.valid()) {
            let cycleValues = this.values.get(this.maxPriority);
            let cycleLength = cycleValues.length;
            for (let index = 0; index < cycleLength; index++) {
                if (datum == cycleValues[index]) {
                    TopJs.Array.removeAt(cycleValues, index);
                    --this.length;
                    return true;
                }
            }
            this.subPriorities.delete(this.maxPriority);
            this.maxPriority = (0 === this.subPriorities) ? 0 : this.getMaxPriority(this.subPriorities);
            ++this.index;
        }
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
        let me = this;
        if (this.subPriorities) {
            this.subPriorities.clear();
        } else {
            this.subPriorities = new Map();
        }
        this.priorities.forEach(function (value, key)
        {
            me.subPriorities.set(key, value);
        });
        this.maxPriority = (0 === this.priorities.size) ? 0 : this.getMaxPriority(this.priorities);
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

    /**
     * create an order array
     *
     * @return {Array}
     */
    toArray()
    {
        let arr = [];
        for (let [index, data] of this) {
            arr.push(data);
        }
        return arr;
    }

    [Symbol.iterator]()
    {
        let me = this;
        this.rewind();
        return {
            maxPriorityValuesIndex: 0,
            maxPriority: me.maxPriority,
            subPriorities: me.subPriorities,
            index: me.index,
            next ()
            {
                if (!me.values.has(this.maxPriority)) {
                    return {
                        value: undefined,
                        done: true
                    };
                }
                let datum = me.values.get(this.maxPriority)[this.maxPriorityValuesIndex++];
                let retValue;
                switch (me.extractFlag) {
                    case FastPriorityQueue.EXTRA_DATA:
                        retValue = [this.index++, datum];
                        break;
                    case FastPriorityQueue.EXTRA_PRIORITY:
                        retValue = [this.index++, this.maxPriority];
                        break;
                    case FastPriorityQueue.EXTRA_BOTH:
                        retValue = [this.index++, [datum, this.maxPriority]];
                        break;
                }
                if (this.maxPriorityValuesIndex === me.values.get(this.maxPriority).length) {
                    this.subPriorities.delete(this.maxPriority);
                    this.maxPriorityValuesIndex = 0;
                    this.maxPriority = (0 === me.subPriorities.size) ? 0 : me.getMaxPriority(me.subPriorities);
                }
                return {
                    value: retValue,
                    done: false
                };
            }
        };
    }
}

TopJs.registerClass("TopJs.stdlib.FastPriorityQueue", FastPriorityQueue);
module.exports = FastPriorityQueue;
