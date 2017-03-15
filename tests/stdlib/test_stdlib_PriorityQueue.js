"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../lib/Index");

let PriorityQueue = TopJs.require("TopJs.stdlib.PriorityQueue");

let assert = require("chai").assert;

describe("TopJs.stdlib.PriorityQueue", function()
{
    let queue;
    beforeEach(function(){
        queue = new PriorityQueue();
    });
    it("test priority queue", function ()
    {
        assert.isTrue(queue.empty());
        queue.enqueue('C', 0.000001);
        assert.equal(queue.top(), 'C');
        queue.enqueue('C2', 2);
        assert.equal(queue.top(), 'C2');
        queue.enqueue('C3', 3);
        queue.enqueue('C1', 1);
        queue.enqueue('Cmin', 0.01);
        queue.enqueue('C4', 0.1);
        assert.equal(queue.top(), 'C3');
        assert.equal(queue.dequeue(), 'C3');
        assert.equal(queue.top(), 'C2');
        assert.equal(queue.dequeue(), 'C2');
        assert.equal(queue.dequeue(), 'C1');
        assert.equal(queue.dequeue(), 'C4');
        assert.equal(queue.dequeue(), 'Cmin');

        assert.equal(queue.toString(), "  C [0.000001]");
        queue.enqueue('C1', 1);
        queue.enqueue('Cmin', 0.01);
        let toString = "\
  C1 [1]\n\
  ├─Cmin [0.01]\n\
  └─C [0.000001]";
        assert.equal(queue.toString(), queue);
        assert.equal(queue.dequeue(), 'C1');

        toString = "\
  Cmin [0.01]\n\
  └─C [0.000001]";
        assert.equal(queue.toString(), toString);
        assert.equal(queue.dequeue(), 'Cmin');
        toString = "\
  C [0.000001]";
        assert.equal(queue.toString(), toString);
        assert.equal(queue.dequeue(), 'C');
    });
});