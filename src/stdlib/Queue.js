"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.namespace("TopJs.stdlib");

let DoubleLinkedList = TopJs.require("TopJs.stdlib.Queue");

class Queue extends DoubleLinkedList
{
    /**
     * Adds an element to the queue
     * 
     * @param {Object} value The value to enqueue.
     * @return {void}
     */
    enqueue (value)
    {
        return this.push(value);
    }

    /**
     * Dequeues a node from the queue
     * 
     * @return any The value of the dequeued node.
     */
    dequeue ()
    {
        return this.shift();
    }
}

TopJs.registerClass("TopJs.stdlib.Queue", Queue);
module.exports = Queue;
