"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../lib/Index");

let FastPriorityQueue = TopJs.require("TopJs.stdlib.FastPriorityQueue");

let assert = require("chai").assert;

describe("TopJs.stdlib.FastPriorityQueue", function ()
{
    let queue;
    beforeEach(function ()
    {
        queue = new FastPriorityQueue();
        queue.insert("test3", -1);
        queue.insert("test5", -10);
        queue.insert("test1", 5);
        queue.insert("test2", 2);
        queue.insert("test4", -1);
        queue.insert("test6", -10);
    });

    it("test extra", function ()
    {
        assert.deepEqual(queue.extract(), ["test1", 5]);
        assert.deepEqual(queue.extract(), ["test2", 2]);
        assert.deepEqual(queue.extract(), ["test3", -1]);
        assert.deepEqual(queue.extract(), ["test4", -1]);
        assert.deepEqual(queue.extract(), ["test5", -10]);
        assert.deepEqual(queue.extract(), ["test6", -10]);
    });

    it("test maintain insert order for data if equal priority", function ()
    {
        let queue = new FastPriorityQueue();
        queue.insert("foo", 1000);
        queue.insert("bar", 1000);
        queue.insert("baz", 1000);
        queue.insert("bat", 1000);
        let orders = [];
        for (let [index, data] of queue) {
            orders.push(data);
        }
        assert.deepEqual(orders, [
            ['foo', 1000],
            ['bar', 1000],
            ['baz', 1000],
            ['bat', 1000]]
        );
        orders = [];
        for (let [index, data] of queue) {
            orders.push(data);
        }
        assert.deepEqual(orders, [
            ['foo', 1000],
            ['bar', 1000],
            ['baz', 1000],
            ['bat', 1000]]
        );
    });

    it("test can retrieve queue as array", function ()
    {
        let arr = queue.toArray();
        assert.deepEqual(arr, [['test1', 5],
            ['test2', 2],
            ['test3', -1],
            ['test4', -1],
            ['test5', -10],
            ['test6', -10]]
        );
    });
    
    it("test empty", function ()
    {
        queue = new FastPriorityQueue();
        assert.isTrue(queue.empty());
        queue.insert("foo", 1);
        assert.isFalse(queue.empty());
    });
    
    it("test contains and hasPriority", function()
    {
        assert.isFalse(queue.contains("test111"));
        assert.isFalse(queue.hasPriority(111));
        queue.insert("test111", 111);
        assert.isTrue(queue.contains("test111"));
        assert.isTrue(queue.hasPriority(111));
    });
    
    it("test can remove item from queue", function ()
    {
        assert.isTrue(queue.contains("test3"));
        assert.isTrue(queue.remove("test3"));
        assert.isFalse(queue.contains("test3"));
        assert.equal(queue.count(), 5);
        // only first occurence of data
        queue.insert("test6", -10);
        queue.insert("test6", -10);
        
        assert.deepEqual(queue.toArray(), [ [ 'test1', 5 ],
            [ 'test2', 2 ],
            [ 'test4', -1 ],
            [ 'test5', -10 ],
            [ 'test6', -10 ],
            [ 'test6', -10 ],
            [ 'test6', -10 ] ]);
        queue.remove("test6");
        assert.deepEqual(queue.toArray(), [ [ 'test1', 5 ],
            [ 'test2', 2 ],
            [ 'test4', -1 ],
            [ 'test5', -10 ],
            [ 'test6', -10 ],
            [ 'test6', -10 ]]);
    });
    
    it("iterate removing all items equal the request", function ()
    {
        let obj = {};
        let inserted = [];
        queue = new FastPriorityQueue();
        for (let i = 0; i < 5; i++) {
            let tobeInsert = TopJs.clone(obj);
            inserted.push(tobeInsert);
            queue.insert(tobeInsert, 1);
        }
        assert.equal(queue.count(), 5);
        for (let i = 0; i < 5; i++) {
            queue.remove(inserted[i]);
        }
        assert.equal(queue.count(), 0);
    })
});