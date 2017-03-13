"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../lib/Index");

let PriorityList = TopJs.require("TopJs.stdlib.PriorityList");

let assert = require("chai").assert;


describe("TopJs.stdlib.PriorityList", function()
{
    let list;
    beforeEach(function ()
    {
        list = new PriorityList();
    });
    
    describe("TopJs.stdlib.PriorityList.insert", function()
    {
        it("test normal insert", function ()
        {
            list.insert("foo", {}, 0);
            assert.equal(list.getCount(), 1);
            for (let [key, value] of list) {
                assert.equal(key, "foo");
            }
        });
        
        it("test duplicates insert", function()
        {
            list.insert("foo", {});
            list.insert("bar", {});
            assert.equal(list.getCount(), 2);
            list.insert("foo", {});
            list.insert("foo", {});
            list.insert("bar", {});
            list.remove("foo");
            assert.equal(list.getCount(), 1);
        });
    });
    
    describe("TopJs.stdlib.PriorityList.remove", function()
    {
        it("test normal remove", function ()
        {
            list.insert("foo", {}, 0);
            list.insert("bar", {}, 0);
            assert.equal(list.getCount(), 2);
            list.remove("foo");
            assert.equal(list.getCount(), 1);
        });
        
        it("removing non existent route route does not yield error", function ()
        {
            list.remove("not exist");
        });
    });
    
    it("TopJs.stdlib.PriorityList.clear", function()
    {
        list.insert("foo", {}, 0);
        list.insert("bar", {}, 0);
        assert.equal(list.getCount(), 2);
        list.clear();
        assert.equal(list.getCount(), 0);
    });
    
    it("TopJs.stdlib.PriorityList.get", function ()
    {
        let obj = {};
        list.insert("foo", obj, 0);
        assert.equal(list.get("foo"), obj);
        assert.isNull(list.get("bar"))
    });
    
    it("TopJs.stdlib.PriorityList.LIFOOnly", function ()
    {
        list.insert("foo", {});
        list.insert("bar", {});
        list.insert("baz", {});
        list.insert("foobar", {});
        list.insert("barbaz", {});
        let orders = [];
        for (let [key] of list) {
            orders.push(key);
        }
        assert.deepEqual(orders, [ 'barbaz', 'foobar', 'baz', 'bar', 'foo' ]);
    });
});