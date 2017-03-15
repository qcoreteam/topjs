"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.stdlib");

let Heap = TopJs.require("TopJs.stdlib.Heap");

/**
 * @class TopJs.stdlib.PriorityQueue
 * @author https://github.com/vovazolotoy/TypeScript-STL
 * @classdesc 
 * The PriorityQueue class provides the main functionality of an prioritized queue,
 * implemented using a max heap.
 */
class PriorityQueue extends Heap 
{
    static EXTR_BOTH = Symbol("TopJs.stdlib.PriorityQueue.EXTR_BOTH");
    static EXTR_PRIORITY = Symbol("TopJs.stdlib.PriorityQueue.EXTR_PRIORITY");
    static EXTR_DATA = Symbol("TopJs.stdlib.PriorityQueue.EXTR_DATA");

    /**
     * extract data flag
     *
     * @type {Symbol}
     */
    extractFlag = PriorityQueue.EXTR_DATA;

    constructor()
    {
        super();
        this.type = Heap.MAX;
    }

    /**
     * Adds an element to the queue
     *
     * @param {Object} data The value to enqueue.
     * @param {Number} priority The priority of value.
     * @return {void}
     */
    enqueue(data, priority = 0)
    {
        return this.insert(new PriorityQueueNode(
            data,
            priority
        ));
    }

    /**
     * Dequeues a node from the queue
     *
     * @return any The value of the dequeued node.
     */
    dequeue()
    {
        let data = this.extract();
        if (this.extractFlag == PriorityQueue.EXTR_BOTH) {
            return data;
        } else if (this.extractFlag == PriorityQueue.EXTR_PRIORITY) {
            return data.priority;
        } else {
            return data.value;
        }
    }

    /**
     * Peeks at the node from the top of the heap
     *
     * @return any The value of the node on the top.
     */
    top()
    {
        let data = super.top();
        if (this.extractFlag == PriorityQueue.EXTR_BOTH) {
            return data;
        } else if (this.extractFlag == PriorityQueue.EXTR_PRIORITY) {
            return data.priority;
        } else {
            return data.value;
        }
    }

    /**
     * Compare elements in order to place them correctly in the heap while sifting up.
     *
     * @param {Object} left The value of the first node being compared.
     * @param {Object} right The value of the second node being compared.
     * @return {Number} Result of the comparison, positive integer if first is greater than second, 0 if they are equal,
     * negative integer otherwise.
     * Having multiple elements with the same value in a Heap is not recommended. They will end up in an arbitrary relative position.
     */
    compare(left, right)
    {
        if (left.priority > right.priority) {
            return 1;
        }
        else if (left.priority == right.priority) {
            return 0;
        }
        else {
            return -1;
        }
    }

    /**
     * set the extract data flag
     * @param {Symbol} flag
     * @return {TopJs.stdlib.PriorityQueue}
     */
    setExtractFlag(flag)
    {
        if (PriorityQueue.EXTR_BOTH == flag ||
            PriorityQueue.EXTR_DATA == flag ||
            PriorityQueue.EXTR_PRIORITY == flag) {
            this.extractFlag = flag;
        } else {
            TopJs.raise("The extract flag specified is not valid");
        }
        return this;
    }

    [Symbol.iterator]()
    {
        let length = this.tree.length;
        let tree = this.tree;
        return {
            current: 0,
            next ()
            {
                if (this.current < length) {
                    let data = tree[this.current];
                    if (this.extractFlag == PriorityQueue.EXTR_PRIORITY) {
                        data = data.priority;
                    } else {
                        data = data.value;
                    }
                    let item = [this.current, data];
                    this.current++;
                    return {
                        value: item,
                        done: false
                    };
                } else {
                    return {
                        value: undefined,
                        done: true
                    };
                }
            }
        };
    }
}

/**
 * @private
 */
class PriorityQueueNode {
    value = null;
    priority = null;

    /**
     * Constructor
     *
     * @param {Object} value
     * @param {Number} priority
     */
    constructor(value, priority)
    {
        this.value = value;
        this.priority = priority;
    }

    /**
     * Serializes the node to string
     *
     * @return {String}  The serialized string.
     */
    toString()
    {
        return this.value + " [" + this.priority + "]";
    }
}

TopJs.registerClass("TopJs.stdlib.PriorityQueue", PriorityQueue);
module.exports = PriorityQueue;
