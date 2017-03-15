"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

const TopJs = require("../../lib/Index");

let Heap = TopJs.require("TopJs.stdlib.Heap");

let assert = require("chai").assert;

describe("TopJs.stdlib.Heap", function()
{
    let heap;
    beforeEach(function(){
        heap = new Heap();
    });
    
    it ("test insert and toArray", function ()
    {
        assert.deepEqual(heap.toArray(), []);
        heap.insert(1);
        assert.deepEqual(heap.toArray(), [1]);
        heap.insert(2);
        assert.deepEqual(heap.toArray(), [2, 1]);
        heap.insert(3);
        assert.deepEqual(heap.toArray(), [3, 1, 2]);
        heap.insert(4);
        assert.deepEqual(heap.toArray(), [4, 3, 2, 1]);
        heap.insert(5);
        assert.deepEqual(heap.toArray(), [5, 4, 2, 1, 3]);
        heap.insert(0);
        assert.deepEqual(heap.toArray(), [5, 4, 2, 1, 3, 0]);
        heap.insert(null);
        assert.deepEqual(heap.toArray(), [5, 4, 2, 1, 3, 0, null]);
    });
    
    it("test extra and count", function ()
    {
        heap.insert(1);
        heap.insert(2);
        heap.insert(3);
        heap.insert(4);
        heap.insert(5);
        heap.insert(0);
        heap.insert(null);
        assert.equal(heap.count(), 7);
        assert.equal(heap.extract(), 5);
        assert.equal(heap.count(), 6);
        assert.equal(heap.extract(), 4);
        assert.equal(heap.extract(), 3);
        assert.equal(heap.extract(), 2);
        assert.equal(heap.count(), 3);
        assert.equal(heap.extract(), 1);
        assert.equal(heap.extract(), 0);
        assert.equal(heap.extract(), null);
        assert.equal(heap.count(), 0);
        assert.throws(function() {
            assert.equal(heap.extract(), null);
        }, Error);
    });
    
    it("compare function test", function ()
    {
        assert.equal(heap.compare(0,0), 0);
        assert.equal(heap.compare('A', 'A'), 0);
        assert.equal(heap.compare(-101, -101), 0);
        assert.equal(heap.compare(0.0001, 0.0001), 0);
        assert.equal(heap.compare(0.0001, 0.0002), -1);
        assert.equal(heap.compare(1, 2), -1);
        assert.equal(heap.compare('A', 'Z'), -1);
        assert.equal(heap.compare(-102, -101), -1);
        assert.equal(heap.compare(0.001, 0.0002), 1);
        assert.equal(heap.compare(2, 1), 1);
        assert.equal(heap.compare('Z', 'B'), 1);
        assert.equal(heap.compare(-102, -103), 1);
    });
    
    it("test top", function()
    {
        heap.insert(1);
        heap.insert(2);
        heap.insert(3);
        heap.insert(4);
        heap.insert(5);
        heap.insert(0);
        assert.equal(heap.top(), 5);
        heap.extract();
        assert.equal(heap.top(), 4);
    });
    
    it("test empty method", function ()
    {
        assert.equal(heap.empty(), true);
        heap.insert(1);
        assert.equal(heap.empty(), false);
    });
    
    it("test to string", function()
    {
        heap.insert(1);
        heap.insert(2);
        heap.insert(3);
        heap.insert(4);
        heap.insert(5);
        heap.insert(0);
        let treeStr = "\
  5\n\
  ├─4\n\
  │ ├─1\n\
  │ └─3\n\
  └─2\n\
    └─0";
        assert.equal(heap.toString(), treeStr);
    });
    
    it("test iterator", function() {
        heap.insert(1);
        heap.insert(2);
        heap.insert(3);
        heap.insert(4);
        heap.insert(5);
        heap.insert(0);
        let ret = [];
        for (let [index, value] of heap) {
            ret.push(value);
        }
        assert.deepEqual(ret, [ 5, 4, 2, 1, 3, 0 ]);
    });
});