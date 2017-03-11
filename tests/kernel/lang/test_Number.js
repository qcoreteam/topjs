/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../../lib/Index");

let assert = require("chai").assert;

describe("TopJs.Number", function ()
{
    describe("TopJs.Number.constrain", function ()
    {
        describe("限制数字的范围", function ()
        {
            it("如果数字等于最大值和最小值，返回数字本身", function ()
            {
                assert.equal(TopJs.Number.constrain(1, 1, 1), 1);
            });
            it("如果数字等于最小值，返回数字本身", function ()
            {
                assert.equal(TopJs.Number.constrain(1, 1, 5), 1);
            });
            it("如果数字等于最大值, 返回数字本身", function ()
            {
                assert.equal(TopJs.Number.constrain(5, 1, 5), 5);
            });
            it("限制为负数也满足", function ()
            {
                assert.equal(TopJs.Number.constrain(-5, -5, -1), -5);
            })
        });
        describe("如果数字不在范围内", function ()
        {
            it("数字小于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(1, 3, 5), 3);
            });
            it("数字大于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(6, 3, 5), 5);
            });
            it("负数情况， 数字小于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(-10, -5, -3), -5);
            });
            it("负数情况， 数字大于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(-2, -5, -3), -3);
            });
        });
        describe("限制NaN", function ()
        {
            it("在指定范围限定NaN", function ()
            {
                assert.isNaN(TopJs.Number.constrain(NaN, 1, 3));
            });
            it("在指定范围限定NaN，最小值是undefined", function ()
            {
                assert.isNaN(TopJs.Number.constrain(NaN, undefined, 3));
            });
            it("在指定范围限定NaN，最大值是undefined", function ()
            {
                assert.isNaN(TopJs.Number.constrain(NaN, 1, undefined));
            });
            it("在指定范围限定NaN，最小值和最大值都是undefined", function ()
            {
                assert.isNaN(TopJs.Number.constrain(NaN, undefined, undefined));
            });
        });
        describe("最大值是NaN或者undefined", function ()
        {
            it("最大值NaN, 数字大于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(3, 2, NaN), 3);
            });
            it("最大值NaN, 数字小于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(2, 3, NaN), 3);
            });
            it("最大值undefined, 数字大于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(3, 2, undefined), 3);
            });
            it("最大值undefined, 数字小于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(2, 3, undefined), 3);
            });
        });
        describe("最小值是NaN或者undefined", function ()
        {
            it("最小值NaN, 数字大于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(4, NaN, 3), 3);
            });
            it("最小值NaN, 数字小于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(2, NaN, 4), 2);
            });
            it("最小值undefined, 数字大于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(4, undefined, 3), 3);
            });
            it("最小值undefined, 数字小于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(2, undefined, 4), 2);
            });
        });
        describe("限制浮点数", function ()
        {
            it("数字在范围里面", function ()
            {
                assert.equal(TopJs.Number.constrain(3.2, 3.1, 3.6), 3.2);
            });
            it("数字在范围里面，负数的情况", function ()
            {
                assert.equal(TopJs.Number.constrain(-3.4, -3.6, -3.1), -3.4);
            });
            it("小于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(-3.7, -3.6, -3.1), -3.6);
            });
            it("大于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(-2.5, -3.6, -3.1), -3.1);
            })
        });
        describe("null限制", function ()
        {
            it("null是最大值和数字小于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(5, 10, null), 10);
            });
            it("null是最大值和数字等于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(5, 5, null), 5);
            });
            it("null是最大值和数字大于最小值", function ()
            {
                assert.equal(TopJs.Number.constrain(6, 5, null), 6);
            });
            it("null是最小值, 数字大于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(6, null, 2), 2);
            });
            it("null是最小值, 数字等于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(6, null, 6), 6);
            });
            it("null是最小值, 数字小于最大值", function ()
            {
                assert.equal(TopJs.Number.constrain(3, null, 6), 3);
            });
            it("最大值最小值都是null", function ()
            {
                assert.equal(TopJs.Number.constrain(3, null, null), 3);
            })
        })
    });
    describe("TopJs.Number.sign", function ()
    {
        it("0返回0", function ()
        {
            assert.equal(TopJs.Number.sign(0), 0);
        });
        it("正数返回1", function ()
        {
            assert.equal(TopJs.Number.sign(12), 1);
        });
        it("字符串返回NaN", function ()
        {
            assert.isNaN(TopJs.Number.sign('a'));
        });
        it("负数范湖-1", function ()
        {
            assert.equal(TopJs.Number.sign(-11), -1);
        });
        it("undefined返回NaN", function ()
        {
            assert.isNaN(TopJs.Number.sign(undefined));
        });
        it("null返回`0`", function ()
        {
            assert.equal(TopJs.Number.sign(null), 0);
        });
        it("返回传入`-0`返回`-0`", function ()
        {
            assert.equal(1/TopJs.Number.sign(-0), -Infinity);
        });
        it("返回传入`+0`返回`+0`", function ()
        {
            assert.equal(1/TopJs.Number.sign(+0), +Infinity);
        });
    });
    
    describe("TopJs.Number.randomInt", function ()
    {
        it("在指定的范围里生成随机数", function ()
        {
            assert.isAtLeast(TopJs.Number.randomInt(0, 100), 0);
            assert.isAtMost(TopJs.Number.randomInt(0, 100), 100);
            assert.isAtLeast(TopJs.Number.randomInt(-100, 0), -100);
            assert.isAtMost(TopJs.Number.randomInt(-100, 0), 0);
        });
    });
    describe("TopJs.Number.correctFloat", function ()
    {
        it("解决小正数的溢出", function ()
        {
            assert.equal(TopJs.Number.correctFloat(0.1 + 0.2), 0.3);
        });
        it("解决小负数的溢出", function ()
        {
            assert.equal(TopJs.Number.correctFloat(-0.1 - 0.2), -0.3);
        });
        it("大整数的溢出处理", function(){
            assert.equal(TopJs.Number.correctFloat(10000000.12300000000001), 10000000.123);
        });
    });
    
    describe("TopJs.Number.roundToNearest", function ()
    {
        describe("边界的情况", function ()
        {
            it("处理value = `0`的情况", function ()
            {
                assert.equal(TopJs.Number.roundToNearest(0, 30), 0);
            });
            it("处理interval = `0`的情况", function ()
            {
                assert.equal(TopJs.Number.roundToNearest(30, 0), 30);
            });
        });
        describe("当value < interval的情况", function ()
        {
            describe("值是正数的时候", function ()
            {
                it("在小于interval一半的时候，向下round", function ()
                {
                    for(let i = 0; i < 15; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), 0);
                    }
                });
                it("当等于一半的时候向上round", function ()
                {
                    assert.equal(TopJs.Number.roundToNearest(15, 30), 30);
                });
                it("大于interval一半的时候，向上round", function ()
                {
                    for(let i = 16; i < 30; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), 30);
                    }
                });
            });
            describe("值是负数的时候", function ()
            {
                it("在小于interval一半的时候，向下round", function ()
                {
                    for(let i = -29; i < -15; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), -30);
                    }
                });
                it("当等于一半的时候向上round", function ()
                {
                    assert.equal(TopJs.Number.roundToNearest(-15, 30), 0);
                });
                it("大于interval一半的时候，向上round", function ()
                {
                    for(let i = -14; i < 0; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), 0);
                    }
                });
            });
        });
        
        describe("value > interval的情况", function ()
        {
            describe("值是正数的时候", function ()
            {
                it("在小于interval一半的时候，向下round", function ()
                {
                    for(let i = 91; i < 105; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), 90);
                    }
                });
                it("当等于一半的时候向上round", function ()
                {
                    assert.equal(TopJs.Number.roundToNearest(105, 30), 120);
                });
                it("大于interval一半的时候，向上round", function ()
                {
                    for(let i = 106; i < 120; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), 120);
                    }
                });
            });
            describe("值是负数的时候", function ()
            {
                it("在小于interval一半的时候，向下round", function ()
                {
                    for(let i = -119; i < -105; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), -120);
                    }
                });
                it("当等于一半的时候向上round", function ()
                {
                    assert.equal(TopJs.Number.roundToNearest(-105, 30), -90);
                });
                it("大于interval一半的时候，向上round", function ()
                {
                    for(let i = -104; i < -90; i++){
                        assert.equal(TopJs.Number.roundToNearest(i, 30), -90);
                    }
                });
            });
        });
        describe("当value = interval的时候", function ()
        {
            for(let i = 1; i < 100; i++){
                assert.equal(TopJs.Number.roundToNearest(i, i), i);
            }
        });
    });
    describe("TopJs.Number.from", function ()
    {
        it("函数应该正确的处理数字类型", function ()
        {
            assert.equal(TopJs.Number.from(2, 1), 2);
            assert.equal(TopJs.Number.from(-2, 1), -2);
            assert.equal(TopJs.Number.from(999999, 1), 999999);
            assert.equal(TopJs.Number.from(-999999, 1), -999999);
            assert.equal(TopJs.Number.from(-999999.9999, 1), -999999.9999);
            assert.equal(TopJs.Number.from(999999.9999, 1), 999999.9999);
        });
        it("函数应该正确的处理字符串数字类型", function ()
        {
            assert.equal(TopJs.Number.from("2", 1), 2);
            assert.equal(TopJs.Number.from("-2", 1), -2);
            assert.equal(TopJs.Number.from("999999", 1), 999999);
            assert.equal(TopJs.Number.from("-999999", 1), -999999);
            assert.equal(TopJs.Number.from("-999999.9999", 1), -999999.9999);
            assert.equal(TopJs.Number.from("999999.9999", 1), 999999.9999);
        });
        it("处理无穷大", function ()
        {
            assert.equal(TopJs.Number.from(1/0, 1), Number.POSITIVE_INFINITY);
            assert.equal(TopJs.Number.from(-1/0, 1), Number.NEGATIVE_INFINITY);
        });
        it("返回默认值如果value不能转换成数字类型", function ()
        {
            assert.equal(TopJs.Number.from("", 100), 100);
            assert.equal(TopJs.Number.from(true, 1), 1);
            assert.equal(TopJs.Number.from(false, 1), 1);
            assert.equal(TopJs.Number.from("some string", 7), 7);
            assert.equal(TopJs.Number.from("12345ImAlmostANumber", 10), 10);
        });
    });
    describe("TopJs.Number.clipIndices", function ()
    {
        assert.deepEqual(TopJs.Number.clipIndices(0, [0]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(0, [3]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(0, [-1]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(0, [-5]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(0, []),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(0, null),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, []),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, null),[0, 8]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [0]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3]),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [8]),[8, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [9]),[8, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1]),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-3]),[5, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7]),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-9]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-10]),[0, 8]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 0]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 3]),[0, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 8]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 9]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -1]),[0, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -3]),[0, 5]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -7]),[0, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -8]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -9]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -10]),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 0]),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 3]),[1, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 8]),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 9]),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -1]),[1, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -3]),[1, 5]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -7]),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -8]),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [2, -9]),[2, 2]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -10]),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 0]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 3]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 8]),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 9]),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -1]),[3, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -3]),[3, 5]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -7]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -8]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -10]),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 0]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 3]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 8]),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 9]),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -1]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -3]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -7]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -8]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -10]),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 0]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 3]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 8]),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 9]),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -1]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -3]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -7]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -8]),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -10]),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 0]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 3]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 8]),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 9]),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -1]),[3, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -3]),[3, 5]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -7]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -8]),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -10]),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 0]),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 3]),[1, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 8]),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 9]),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -1]),[1, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -3]),[1, 5]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -7]),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -8]),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -10]),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 0]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 3]),[0, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 8]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 9]),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -1]),[0, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -3]),[0, 5]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -7]),[0, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -8]),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -10]),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 0], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 3], TopJs.Number.Clip.COUNT),[0, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 8], TopJs.Number.Clip.COUNT),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 9], TopJs.Number.Clip.COUNT),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -1], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -3], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -7], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -8], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -10], TopJs.Number.Clip.COUNT),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 0], TopJs.Number.Clip.COUNT),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 3], TopJs.Number.Clip.COUNT),[1, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 8], TopJs.Number.Clip.COUNT),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 9], TopJs.Number.Clip.COUNT),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -1], TopJs.Number.Clip.COUNT),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -3], TopJs.Number.Clip.COUNT),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 0], TopJs.Number.Clip.COUNT),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 3], TopJs.Number.Clip.COUNT),[3, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 8], TopJs.Number.Clip.COUNT),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 9], TopJs.Number.Clip.COUNT),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -1], TopJs.Number.Clip.COUNT),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -3], TopJs.Number.Clip.COUNT),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 0], TopJs.Number.Clip.COUNT),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 3], TopJs.Number.Clip.COUNT),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 8], TopJs.Number.Clip.COUNT),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 9], TopJs.Number.Clip.COUNT),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -1], TopJs.Number.Clip.COUNT),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -3], TopJs.Number.Clip.COUNT),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 0], TopJs.Number.Clip.COUNT),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 3], TopJs.Number.Clip.COUNT),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 8], TopJs.Number.Clip.COUNT),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 9], TopJs.Number.Clip.COUNT),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -1], TopJs.Number.Clip.COUNT),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -3], TopJs.Number.Clip.COUNT),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 0], TopJs.Number.Clip.COUNT),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 3], TopJs.Number.Clip.COUNT),[3, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 8], TopJs.Number.Clip.COUNT),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 9], TopJs.Number.Clip.COUNT),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -1], TopJs.Number.Clip.COUNT),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -3], TopJs.Number.Clip.COUNT),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 0], TopJs.Number.Clip.COUNT),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 3], TopJs.Number.Clip.COUNT),[1, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 8], TopJs.Number.Clip.COUNT),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 9], TopJs.Number.Clip.COUNT),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -1], TopJs.Number.Clip.COUNT),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -3], TopJs.Number.Clip.COUNT),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 0], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 3], TopJs.Number.Clip.COUNT),[0, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 8], TopJs.Number.Clip.COUNT),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, 9], TopJs.Number.Clip.COUNT),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -1], TopJs.Number.Clip.COUNT),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-8, -3], TopJs.Number.Clip.COUNT),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 0], TopJs.Number.Clip.INCLUSIVE),[0, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 3], TopJs.Number.Clip.INCLUSIVE),[0, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 6], TopJs.Number.Clip.INCLUSIVE),[0, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 7], TopJs.Number.Clip.INCLUSIVE),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 8], TopJs.Number.Clip.INCLUSIVE),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -1], TopJs.Number.Clip.INCLUSIVE),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -3], TopJs.Number.Clip.INCLUSIVE),[0, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -7], TopJs.Number.Clip.INCLUSIVE),[0, 2]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -8], TopJs.Number.Clip.INCLUSIVE),[0, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -9], TopJs.Number.Clip.INCLUSIVE),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -10], TopJs.Number.Clip.INCLUSIVE),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 0], TopJs.Number.Clip.INCLUSIVE),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 3], TopJs.Number.Clip.INCLUSIVE),[1, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 6], TopJs.Number.Clip.INCLUSIVE),[1, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 7], TopJs.Number.Clip.INCLUSIVE),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 8], TopJs.Number.Clip.INCLUSIVE),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -1], TopJs.Number.Clip.INCLUSIVE),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -3], TopJs.Number.Clip.INCLUSIVE),[1, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -7], TopJs.Number.Clip.INCLUSIVE),[1, 2]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -8], TopJs.Number.Clip.INCLUSIVE),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -9], TopJs.Number.Clip.INCLUSIVE),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -10], TopJs.Number.Clip.INCLUSIVE),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 0], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 3], TopJs.Number.Clip.INCLUSIVE),[3, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 6], TopJs.Number.Clip.INCLUSIVE),[3, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 7], TopJs.Number.Clip.INCLUSIVE),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 8], TopJs.Number.Clip.INCLUSIVE),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -1], TopJs.Number.Clip.INCLUSIVE),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -3], TopJs.Number.Clip.INCLUSIVE),[3, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -7], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -8], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -9], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -10], TopJs.Number.Clip.INCLUSIVE),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 0], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 3], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 6], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 7], TopJs.Number.Clip.INCLUSIVE),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 8], TopJs.Number.Clip.INCLUSIVE),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -1], TopJs.Number.Clip.INCLUSIVE),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -3], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -7], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -8], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -9], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -10], TopJs.Number.Clip.INCLUSIVE),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 0], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 3], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 6], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 7], TopJs.Number.Clip.INCLUSIVE),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 8], TopJs.Number.Clip.INCLUSIVE),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -1], TopJs.Number.Clip.INCLUSIVE),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -3], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -7], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -8], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -9], TopJs.Number.Clip.INCLUSIVE),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -10], TopJs.Number.Clip.INCLUSIVE),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 0], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 3], TopJs.Number.Clip.INCLUSIVE),[3, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 6], TopJs.Number.Clip.INCLUSIVE),[3, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 7], TopJs.Number.Clip.INCLUSIVE),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, 8], TopJs.Number.Clip.INCLUSIVE),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -1], TopJs.Number.Clip.INCLUSIVE),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -3], TopJs.Number.Clip.INCLUSIVE),[3, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -7], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -8], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -9], TopJs.Number.Clip.INCLUSIVE),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-5, -10], TopJs.Number.Clip.INCLUSIVE),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 0], TopJs.Number.Clip.INCLUSIVE),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 3], TopJs.Number.Clip.INCLUSIVE),[1, 4]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 6], TopJs.Number.Clip.INCLUSIVE),[1, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 7], TopJs.Number.Clip.INCLUSIVE),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, 8], TopJs.Number.Clip.INCLUSIVE),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -1], TopJs.Number.Clip.INCLUSIVE),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -3], TopJs.Number.Clip.INCLUSIVE),[1, 6]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -7], TopJs.Number.Clip.INCLUSIVE),[1, 2]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -8], TopJs.Number.Clip.INCLUSIVE),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -9], TopJs.Number.Clip.INCLUSIVE),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-7, -10], TopJs.Number.Clip.INCLUSIVE),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [0], TopJs.Number.Clip.NOWRAP),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3], TopJs.Number.Clip.NOWRAP),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [8], TopJs.Number.Clip.NOWRAP),[8, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [9], TopJs.Number.Clip.NOWRAP),[8, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1], TopJs.Number.Clip.NOWRAP),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-9], TopJs.Number.Clip.NOWRAP),[0, 8]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 0], TopJs.Number.Clip.NOWRAP),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 3], TopJs.Number.Clip.NOWRAP),[0, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 8], TopJs.Number.Clip.NOWRAP),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, 9], TopJs.Number.Clip.NOWRAP),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -1], TopJs.Number.Clip.NOWRAP),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [0, -10], TopJs.Number.Clip.NOWRAP),[0, 0]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 0], TopJs.Number.Clip.NOWRAP),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 3], TopJs.Number.Clip.NOWRAP),[1, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 8], TopJs.Number.Clip.NOWRAP),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, 9], TopJs.Number.Clip.NOWRAP),[1, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -1], TopJs.Number.Clip.NOWRAP),[1, 1]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [1, -10], TopJs.Number.Clip.NOWRAP),[1, 1]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 0], TopJs.Number.Clip.NOWRAP),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 3], TopJs.Number.Clip.NOWRAP),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 8], TopJs.Number.Clip.NOWRAP),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, 9], TopJs.Number.Clip.NOWRAP),[3, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -1], TopJs.Number.Clip.NOWRAP),[3, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [3, -10], TopJs.Number.Clip.NOWRAP),[3, 3]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 0], TopJs.Number.Clip.NOWRAP),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 3], TopJs.Number.Clip.NOWRAP),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 8], TopJs.Number.Clip.NOWRAP),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, 9], TopJs.Number.Clip.NOWRAP),[7, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -1], TopJs.Number.Clip.NOWRAP),[7, 7]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [7, -10], TopJs.Number.Clip.NOWRAP),[7, 7]);

        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 0], TopJs.Number.Clip.NOWRAP),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 3], TopJs.Number.Clip.NOWRAP),[0, 3]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 8], TopJs.Number.Clip.NOWRAP),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, 9], TopJs.Number.Clip.NOWRAP),[0, 8]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -1], TopJs.Number.Clip.NOWRAP),[0, 0]);
        assert.deepEqual(TopJs.Number.clipIndices(8, [-1, -10], TopJs.Number.Clip.NOWRAP),[0, 0]);
    });
});