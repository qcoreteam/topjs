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
    });
    describe("TopJs.Array.toArray", function ()
    {
        it("将数组转换成数组", function ()
        {
            assert.deepEqual(TopJs.Array.toArray([1, 2, 3]), [1, 2, 3]);
        });
        it("将字符串转化成数组", function()
        {
            assert.deepEqual(TopJs.Array.toArray("abcd"), ['a', 'b', 'c', 'd']);
        });
        it("创建一个新的对象", function ()
        {
            let arr = [1, 2, 3];
            assert.notEqual(TopJs.Array.toArray(arr), arr);
            assert.deepEqual(TopJs.Array.toArray(arr), [1, 2, 3]);
        });
        it("可以用来转换arguments", function()
        {
            let args;
            let fn = function ()
            {
                args = TopJs.Array.toArray(arguments);
            };
            fn(1, 2, 3);
            assert.deepEqual(args, [1, 2, 3]);
            assert.instanceOf(args, Array);
        });
        
        describe("指定开始结束范围", function ()
        {
            it("默认复制全数组", function ()
            {
                assert.deepEqual(TopJs.Array.toArray([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
            });
            
            it("指定开始位置", function ()
            {
                assert.deepEqual(TopJs.Array.toArray([1, 2, 3, 4, 5, 6], 2), [3, 4, 5, 6])
            });
            it("指定结束位置", function ()
            {
                assert.deepEqual(TopJs.Array.toArray([1, 2, 3, 4, 5, 6, 7], null, 5), [1, 2, 3, 4, 5]);
            });
            it("指定开始和结束位置", function ()
            {
                assert.deepEqual(TopJs.Array.toArray([1, 2, 3, 4, 5, 6, 7], 2, 5), [3, 4, 5]);
            });
            it("可以指定负的索引值", function ()
            {
                assert.deepEqual(TopJs.Array.toArray([1, 2, 3, 4, 5, 6, 7], 2, -1), [3, 4, 5, 6]);
            })
        });
    });
    
    describe("TopJs.Array.pluck", function ()
    {
        it("操作空数组返回空数组", function ()
        {
            assert.deepEqual(TopJs.Array.pluck([], "prop"), []);
        });
        it("获取数组中对象的属性值", function ()
        {
            let arr = [{prop: 1}, {prop: 2}, {prop: 3}];
            assert.deepEqual(TopJs.Array.pluck(arr, "prop"), [1, 2, 3]);
        });
        it("返回一个新数组", function ()
        {
            let arr = [{prop: 1}, {prop: 2}, {prop: 3}];
            let propArr = TopJs.Array.pluck(arr, "prop");
            assert.notEqual(arr, propArr);
        });
    });
    
    describe("TopJs.Array.each", function ()
    {
        describe("返回值相关", function ()
        {
            it("空数组返回true", function ()
            {
                assert.equal(TopJs.Array.each([]), true);
            });
            it("返回停止的索引", function()
            {
                assert.equal(TopJs.Array.each([1, 2, 3], function (item)
                {
                    return item != 2;
                }), 1)
            });
            it("回调函数返回true不停止迭代", function ()
            {
                assert.isTrue(TopJs.Array.each([12, 3, 4], function (item)
                {
                    return true;
                }));
            });
        });
        
        describe("扩用域和参数相关", function ()
        {
            it("在指定的作用域执行", function ()
            {
                let scope = {};
                let actual;
                TopJs.Array.each([1], function()
                {
                    actual = this;
                }, scope);
                assert.equal(actual, scope);
            });
            it("应该传递参数`item`,`index`和`array`", function ()
            {
                let arrs = [];
                let values = [];
                let indexs = [];
                let data = [1, 2, 3];
                TopJs.Array.each(data, function (item, index, array)
                {
                    arrs.push(array);
                    values.push(item);
                    indexs.push(index);
                });
                assert.deepEqual(arrs, [data, data, data]);
                assert.deepEqual(indexs, [0, 1, 2]);
                assert.deepEqual(values, [1, 2, 3]);
            });
        });
        describe("停止迭代", function ()
        {
            it("正常情况不应该停止迭代", function ()
            {
                let count = 0;
                TopJs.Array.each([1, 2, 3, 4, 5], function ()
                {
                    count++;
                });
                assert.equal(count, 5);
            });
            it("只能返回false才能结束迭代", function ()
            {
                let count = 0;
                TopJs.Array.each([1, 2, 3, 4, 5], function ()
                {
                    count++;
                    return null;
                });
                assert.equal(count, 5);
            });
            it("返回false立即停止", function ()
            {
                let count = 0;
                TopJs.Array.each([1, 2, 3, 4, 5], function (item)
                {
                    count++;
                    return item != 3;
                });
                assert.equal(count, 3);
            });
        });
        describe("迭代其他迭代对象", function ()
        {
            it("迭代arguments", function ()
            {
                let values = [];
                let func = function ()
                {
                    TopJs.Array.each(arguments, function(item){
                        values.push(item);
                    });
                };
                func(1, 2, 3);
                assert.deepEqual(values, [1, 2, 3]);
            });
        });
        it("对具有iterable接口的对象先转换成数组，在迭代", function ()
        {
            let count = 0;
            TopJs.Array.each("string", function (){
                count++;
            });
            assert.equal(count, 6);
        });
        describe("反向迭代", function ()
        {
            it("反向迭代全部元素", function ()
            {
                let values = [];
                TopJs.Array.each([1, 2, 3, 4], function (item)
                {
                    values.push(item);
                }, undefined, true);
                assert.deepEqual(values, [4, 3, 2, 1]);
            });
            it("反向迭代中途退出", function ()
            {
                let values = [];
                TopJs.Array.each([1, 2, 3, 4], function (item)
                {
                    if(item === 1){
                        return false;
                    }
                    values.push(item);
                }, undefined, true);
                assert.deepEqual(values, [4, 3, 2]);
            });
        });
    });
    
    describe("TopJs.Array.merge", function ()
    {
        it("应该返回空数组", function ()
        {
            //assert.deepEqual(TopJs.Array.merge([]), []);
        });
        it("应该清空重复的元素", function ()
        {
            assert.deepEqual(TopJs.Array.merge([1, 2, 2, 3]), [1, 2, 3]);
        });
        it("新创建对象", function ()
        {
            let arr = [1, 2, 3];
            assert.notEqual(TopJs.Array.merge(arr), arr);
        });
        it("去重的比较是严格相等", function ()
        {
            assert.deepEqual(TopJs.Array.merge([1, '1']), [1, '1']);
        });
        it("合并对个数组然后去重并且保持一定的顺序", function ()
        {
            assert.deepEqual(TopJs.Array.merge([1, 2, 3], ['1', '2', '3'], [4, 1, 5, 2], [6, 3, 7, '1'], [8, '2', 9, '3']), 
                [1, 2, 3, '1', '2', '3', 4, 5, 6, 7, 8, 9])
        });
    });
    describe("TopJs.Array.intersect", function ()
    {
        it("不传参数返回空数组", function ()
        {
            assert.deepEqual(TopJs.Array.intersect(), []);
        });
        it("传空数组返回空数组", function ()
        {
            assert.deepEqual(TopJs.Array.intersect([]), []);
        });
        it("返回一个新的引用", function ()
        {
            let arr = [1, 2, 3];
            assert.notEqual(TopJs.Array.intersect(arr), arr);
        });
        it("复制一个数组如果只传一个参数", function ()
        {
            assert.deepEqual(TopJs.Array.intersect([1, 2, 3]), [1, 2, 3]);
        });
        it("按照出现的顺序合并数组", function ()
        {
            assert.deepEqual(TopJs.Array.intersect([1, 2, 3], [4, 3, 2, 5], [2, 6, 3]), [2, 3])
        });
        it("没有交集返回空数组", function ()
        {
            assert.deepEqual(TopJs.Array.intersect([1, 2, 3], [32]), [])
        });
        it("求交集的时候回去除重复的元素", function ()
        {
            assert.deepEqual(TopJs.Array.intersect([1, 1, 2, 3, 3],[1, 1, 2, 3, 3]), [1, 2, 3])
        });
        it("通过严格比较元素是否相等", function ()
        {
            assert.deepEqual(TopJs.Array.intersect([1], ['1']), []);
        });
        it("正确的处理falsy值", function ()
        {
            assert.deepEqual(TopJs.Array.intersect(
                [undefined, null, false, 0, ''], [undefined, null, false, 0, '']),
                [undefined, null, false, 0, '']);
        });
    });
    describe("TopJs.Array.difference", function ()
    {
        it("返回两个数组的差", function(){
            assert.deepEqual(TopJs.Array.difference([1, 2, 3, 4], [3, 2]), [1, 4]);
        });
        it("返回第一个数组如果没交集", function ()
        {
            assert.deepEqual(TopJs.Array.difference([1, 2, 3], [4, 5, 6]), [1, 2, 3]);
        });
        it("创建一个全新的引用", function ()
        {
            let arr = [1, 2];
            assert.notEqual(TopJs.Array.difference(arr, [3]), arr);
        });
        it("删除重复的数据", function ()
        {
            assert.deepEqual(TopJs.Array.difference([1, 1, 2, 2, 3, 3, 4, 4], [3]), [1, 2, 4]);
        });
        it("元素比较实用严格相等", function ()
        {
            assert.deepEqual(TopJs.Array.difference([1], ['1']), [1]);
        });
    });
    describe("TopJs.Array.sort", function ()
    {
        let sarray;
        let narray;
        beforeEach(function() {
            sarray = ["bbb", "addda", "erere", "fff", "de3"];
            narray = [1,3,2,4,6,7];
        });
        describe("操作字符串", function ()
        {
            it("对字符串进行排序", function ()
            {
                let sorted = TopJs.Array.sort(sarray);
                assert.deepEqual(sorted, ["addda", "bbb", "de3", "erere", "fff"]);
            });
            it("指定比较函数", function ()
            {
                assert.deepEqual(TopJs.Array.sort(sarray, function (a, b)
                {
                    if(a == b){
                        return 0;
                    }else if(a < b){
                        return -1;
                    }else if(a > b){
                        return 1;
                    }
                }), ["addda", "bbb", "de3", "erere", "fff"]);
            });
        });
        describe("操作数字", function ()
        {
            it("对数字进行排序", function ()
            {
                let sorted = TopJs.Array.sort(narray);
                assert.deepEqual(sorted, [1, 2, 3, 4, 6, 7]);
            });
            it("指定比较函数", function ()
            {
                assert.deepEqual(TopJs.Array.sort(narray, function (a, b)
                {
                    if(a == b){
                        return 0;
                    }else if(a < b){
                        return -1;
                    }else if(a > b){
                        return 1;
                    }
                }), [1, 2, 3, 4, 6, 7]);
            });
        });
    });
});
