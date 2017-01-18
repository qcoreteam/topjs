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
                });
                it("返回原数组", function ()
                {
                    assert.equal(TopJs.Array.removeAt(myArray, -1), myArray);
                });
                it("不修改数组的长度", function ()
                {
                    TopJs.Array.removeAt(myArray, -1);
                    assert.equal(myArray.length, 5);
                });
            });
            describe("索引大于数组长度", function ()
            {
                it("不抛出异常", function ()
                {
                    assert.doesNotThrow(function(){
                        TopJs.Array.removeAt(myArray, 100);
                    });
                });
                it("返回原数组", function ()
                {
                    assert.equal(TopJs.Array.removeAt(myArray, 100), myArray);
                });
                it("不修改数组的长度", function ()
                {
                    TopJs.Array.removeAt(myArray, 100);
                    assert.equal(myArray.length, 5);
                });
            });
        });
        describe("合法的数组索引", function ()
        {
            it("返回原数组", function ()
            {
                assert.equal(TopJs.Array.removeAt(myArray, 1), myArray);
            });
            it("删除第一个元素", function ()
            {
                TopJs.Array.removeAt(myArray, 0);
                assert.deepEqual(myArray, [2, 3, 4, 5]);
            });
            it("删除最后一个元素", function ()
            {
                TopJs.Array.removeAt(myArray, 4);
                assert.deepEqual(myArray, [1, 2, 3, 4]);
            });
            it("删除中间一个元素", function ()
            {
                TopJs.Array.removeAt(myArray, 2);
                assert.deepEqual(myArray, [1, 2, 4, 5]);
            });
            describe("删除多个元素", function ()
            {
                it("默认删除一个元素", function ()
                {
                    TopJs.Array.removeAt(myArray, 0);
                    assert.deepEqual(myArray, [2, 3, 4, 5]);
                });
                it("删除两个元素", function ()
                {
                    TopJs.Array.removeAt(myArray, 0, 2);
                    assert.deepEqual(myArray, [3, 4, 5]);
                });
                it("删除所有的元素", function ()
                {
                    TopJs.Array.removeAt(myArray, 0, 5);
                    assert.deepEqual(myArray, []);
                });
                it("删除指定元素到最最后一个元素", function ()
                {
                    TopJs.Array.removeAt(myArray, 1, 4);
                    assert.deepEqual(myArray, [1]);
                });
                it("数量超过数组的长度", function ()
                {
                    TopJs.Array.removeAt(myArray, 2, 100);
                    assert.deepEqual(myArray, [1, 2]);
                });
            });
        });
    });
    
    describe("TopJs.Array.clone", function ()
    {
        it("克隆空数组得到空数组", function ()
        {
            assert.deepEqual(TopJs.Array.clone([]), []);
        });
        it("克隆不空的数组", function ()
        {
            assert.deepEqual(TopJs.Array.clone([1, 2, 3]), [1, 2, 3]);
        });
        it("克隆得到的数组不是原数组", function ()
        {
            let arr = [1, 2, 3];
            let cloneArr = TopJs.Array.clone(arr);
            assert.notEqual(arr, cloneArr);
        });
        it("克隆是浅克隆", function ()
        {
            let obj = {};
            let arr = [obj];
            let cloned = TopJs.Array.clone(arr);
            assert.equal(obj, cloned[0]);
        });
    });
    describe("TopJs.Array.clean", function ()
    {
        it("清除空数组返回空数组", function()
        {
            assert.deepEqual(TopJs.Array.clean([]), []);
        });
        it("删除undefined值", function()
        {
            assert.deepEqual(TopJs.Array.clean([undefined]), []);
        });
        it("删除null值", function ()
        {
            assert.deepEqual(TopJs.Array.clean([null]), []);
        });
        it("移除空字符串", function ()
        {
            assert.deepEqual(TopJs.Array.clean([""]), []);
        });
        it("移除空数组", function()
        {
            assert.deepEqual(TopJs.Array.clean([[]]), []);
        });
        it("移除混合的空值", function ()
        {
            assert.deepEqual(TopJs.Array.clean([undefined, null, "", []]), []);
        });
        it("移除多此出现的空值", function ()
        {
            assert.deepEqual(TopJs.Array.clean([undefined,undefined, undefined, null, "", undefined, null, "", []]), []);
        });
        it("只移除空值", function ()
        {
            assert.deepEqual(TopJs.Array.clean([undefined,undefined, 1, null, "", undefined, null, "12", []]), [1, "12"]);
        });
        it("移除的时候保留顺序", function ()
        {
            assert.deepEqual(TopJs.Array.clean([1, undefined, 2, null, "3"]), [1, 2, "3"]);
        });
    })
});
