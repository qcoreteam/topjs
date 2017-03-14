"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

const TopJs = require("../../lib/Index");

let DoubleLinkedList = TopJs.require("TopJs.stdlib.DoubleLinkedList");

let assert = require("chai").assert;

describe("TopJs.stdlib.DoubleLinkedList", function()
{
    let list;
    beforeEach(function(){
        list = new DoubleLinkedList();
    });
    it("TopJs.stdlib.DoubleLinkedList.push", function ()
    {
        list.push(1);
        assert.equal(list.count(), 1);
        list.push(2);
        assert.equal(list.count(), 2);
        // push undefined
        list.push();
        assert.equal(list.count(), 3);
        list.push(null);
        assert.equal(list.count(), 4);
        list.push(true);
        assert.equal(list.count(), 5);
        list.push("a string");
        assert.equal(list.count(), 6);
        list.push({});
        assert.equal(list.count(), 7);
    });
    
    it("TopJs.stdlib.DoubleLinkedList.toArray", function ()
    {
        list.push(1);
        // push undefined
        list.push();
        assert.deepEqual(list.toArray(), [1, undefined]);
        list.push(null);
        list.push(true);
        list.push("a string");
        assert.deepEqual(list.toArray(), [ 1, undefined, null, true, 'a string' ]);
        list.push({});
        assert.deepEqual(list.toArray(), [ 1, undefined, null, true, 'a string', {} ]);
    });
    
    it("TopJs.stdlib.DoubleLinkedList.isEmpty", function() {
        assert.isTrue(list.isEmpty());
        list.push(12);
        assert.isFalse(list.isEmpty());
    });
    
    it("TopJs.stdlib.DoubleLinkedList.top", function ()
    {
        assert.equal(list.top(), null);
        list.push(1);
        assert.equal(list.top(), 1);
        list.push(null);
        list.push(true);
        list.push("a string");
        assert.equal(list.top(), "a string");
    });

    it("TopJs.stdlib.DoubleLinkedList.bottom", function ()
    {
        assert.equal(list.bottom(), null);
        list.push(1);
        assert.equal(list.bottom(), 1);
        list.push(null);
        list.push(true);
        assert.equal(list.bottom(), 1);
        list.push("a string");
        assert.equal(list.bottom(), 1);
    });

    it("TopJs.stdlib.DoubleLinkedList.pop", function () {

        assert.throws(function(){
            list.pop();
        }, Error);
        list.push(1);
        list.push(2);
        list.push(null);
        assert.equal(list.pop(), null);
        assert.equal(list.pop(), 2);
        assert.equal(list.pop(), 1);
        assert.equal(list.count(), 0);
    });

    it("TopJs.stdlib.DoubleLinkedList.push", function () {
        assert.equal(list.top(), null);
        list.push(1);
        assert.equal(list.top(), 1);
        list.push(2);
        list.push(null);
        assert.equal(list.top(), null);
        assert.equal(list.count(), 3);
    });
    
    it("TopJs.stdlib.DoubleLinkedList.add", function()
    {
        assert.throws(function(){
            list.insert(-1, 1);
        }, Error);
        assert.throws(function(){
            list.insert(111, 1);
        }, Error);
        list.push(1);
        list.push(2);
        list.push(3);
        assert.deepEqual(list.toArray(), [1, 2, 3]);
        list.insert(0, 4);
        assert.deepEqual(list.toArray(), [4, 1, 2, 3]);
        list.insert(1, 5);
        assert.deepEqual(list.toArray(), [4, 5, 1, 2, 3]);
    });

    it("TopJs.stdlib.DoubleLinkedList.shift", function(){
        assert.throws(function(){
            list.shift();
        }, Error);
        
        list.push(1);
        assert.deepEqual(list.count(), 1);
        assert.deepEqual(list.shift(), 1);
        assert.deepEqual(list.count(), 0);
        list.push(1);
        list.push(2);
        list.push(3);
        assert.deepEqual(list.bottom(), 1);
        list.shift();
        assert.deepEqual(list.bottom(), 2);
        list.shift();
        assert.deepEqual(list.bottom(), 3);
        list.shift();
        assert.deepEqual(list.bottom(), null);
        assert.deepEqual(list.count(), 0);
    });

    it("TopJs.stdlib.DoubleLinkedList.unshift", function(){
        list.push(1);
        list.push(2);
        assert.deepEqual(list.bottom(), 1);
        list.unshift(12);
        assert.deepEqual(list.bottom(), 12);
    });
    
    it("TopJs.stdlib.DoubleLinkedList.current", function ()
    {
        list.push(1);
        list.push(2);
        list.push(3);
        list.push(4);
        list.push(5);
        assert.equal(list.current(), null);
        list.rewind();
        assert.equal(list.current(), 1);
        list.next();
        assert.equal(list.current(), 2);
        list.next();
        assert.equal(list.current(), 3);
        list.next();
        assert.equal(list.current(), 4);
        list.next();
        assert.equal(list.current(), 5);
        list.next();
        assert.equal(list.current(), null);
        assert.isFalse(list.valid());
        list.rewind();
        list.next();
        list.next();
        list.prev();
        assert.equal(list.current(), 2);
    });
});