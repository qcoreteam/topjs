/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const StandardLoader = require("../../../lib/Entry").StandardLoader;
let assert = require("chai").assert;
let loader = new StandardLoader({
    [StandardLoader.AUTO_REGISTER_TOPJS]: true
});
loader.register();

describe("TopJs.Array", function ()
{
    describe("TopJs.Array.remove", function()
    {
        let myArray;
        describe("空数组相关的删除", function ()
        {
            beforeEach(function(){
                myArray = [];
            });
            it("在空数组上删除不抛出异常", function ()
            {
                assert.doesNotThrow(function(){
                    TopJs.Array.remove(myArray, 1, 21);
                });
                assert.deepEqual(TopJs.Array.remove(myArray, 1, 21), []);
            });
            
            it("删除空数组返回数组本身", function ()
            {
                assert.equal(TopJs.Array.remove(myArray), myArray);
            });
        });
        
        describe("操作一个非空的数组", function ()
        {
            beforeEach(function() {
                myArray = [1, 2, 3, 4, 5];
            });
            
            it("删除指定的元素", function ()
            {
                TopJs.Array.remove(myArray, 1);
                assert.deepEqual(myArray, [2, 3, 4, 5]);
            });
            
            it("删除之后返回原数组", function ()
            {
                assert.equal(TopJs.Array.remove(myArray, 1), myArray);
            });
            it("删除元素之后后面的元素索引跟着改变", function()
            {
                TopJs.Array.remove(myArray, 1);
                assert.equal(myArray[0], 2);
                assert.equal(myArray[1], 3);
                assert.equal(myArray[2], 4);
                assert.equal(myArray[3], 5);
            });
            it("多元素删除", function()
            {
                TopJs.Array.remove(myArray, 1, 5);
                assert.deepEqual(myArray, [2, 3, 4]);
            });
            it("删除不存在的元素", function ()
            {
                TopJs.Array.remove(myArray, 10);
                assert.deepEqual(myArray, [1, 2, 3, 4, 5]);
            });
            it("删除之后长度变化", function ()
            {
                TopJs.Array.remove(myArray, 1);
                assert.equal(myArray.length, 4);
            });
            it("删除元素使用`===`严格相等", function ()
            {
                TopJs.Array.remove(myArray, '1');
                assert.deepEqual(myArray, [1, 2, 3, 4, 5]);
            });
            it("只删除第一次出现的元素", function ()
            {
                let a = {};
                let b = {};
                myArray = [a, b, b, a, a, a];
                TopJs.Array.remove(myArray, b);
                assert.deepEqual(myArray, [a, b, a, a, a]);
            });
        });
    });
    
    describe("TopJs.Array.removeAt", function ()
    {
        beforeEach(function() {
            myArray = [1, 2, 3, 4, 5];
        });
        describe("索引不合法", function ()
        {
            describe("索引小于0", function ()
            {
                it("不抛出异常", function ()
                {
                    assert.doesNotThrow(function(){
                        TopJs.Array.removeAt(myArray, -1);
                    });
                })
            });
        });
    });
});
