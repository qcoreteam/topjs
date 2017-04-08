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
 * @alias TopJs.stdlib.MinHeap
 * @author https://github.com/vovazolotoy/TypeScript-STL
 * @classdesc
 * same interface as {@link TopJs.stdlib.Heap}
 */
class MinHeap extends Heap
{
    constructor()
    {
        super(Heap.MIN);
    }
}

TopJs.registerClass("TopJs.stdlib.MinHeap", MinHeap);
module.exports = MinHeap;