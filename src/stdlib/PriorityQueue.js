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
 * @classdesc The PriorityQueue class provides the main functionality of an prioritized queue, 
 * implemented using a max heap.
 */
class PriorityQueue extends Heap
{
    constructor ()
    {
        super();
        this.type = Heap.MAX;
    }
    
}

TopJs.registerClass("TopJs.stdlib.PriorityQueue", PriorityQueue);
module.exports = PriorityQueue;
