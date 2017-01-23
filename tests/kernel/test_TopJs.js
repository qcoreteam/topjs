/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let assert = require("chai").assert;

const StandardLoader = require("../../lib/Entry").StandardLoader;
before(function ()
{
    let loader = new StandardLoader({
        [StandardLoader.AUTO_REGISTER_TOPJS]: true
    });
    loader.register();
});
describe("TopJs名称空间函数测试", function ()
{
    describe("TopJs.global", function ()
    {
        it("返回全局对象", function ()
        {
            assert.equal(TopJs.global, (function ()
            {
                return this
            }).call());
        });
    });

    describe("TopJs.apply", function ()
    {
        let origin;
        let obj;
        beforeEach(function ()
        {
            origin = {
                name: "value",
                something: "cool",
                items: [1, 2, 3],
                method: function ()
                {
                    this.myMethodCalled = true;
                },
                toString: function ()
                {
                    this.myToStringCalled = true;
                }
            };
        });

        it("复制普通的对象字段", function ()
        {
            TopJs.apply(origin, {
                name: "newValue",
                items: [5, 6, 7],
                otherThing: "not ok",
                isGood: true
            });
            assert.equal(origin.name, "newValue");
            assert.deepEqual(origin.items, [5, 6, 7]);
            assert.equal(origin.something, "cool");
            assert.equal(origin.otherThing, "not ok");
            assert.equal(origin.isGood, true);
        });

        it("复制函数", function ()
        {
            TopJs.apply(origin, {
                method: function ()
                {
                    this.newMethodCalled = true;
                }
            });
            origin.method();
            assert.isUndefined(origin.myMethodCalled);
            assert.equal(origin.newMethodCalled, true);
        });

        it("复制不可枚举的字段", function ()
        {
            TopJs.apply(origin, {
                toString()
                {
                    this.newToStringCalled = true;
                }
            });
            origin.toString();
            assert.isUndefined(origin.myToStringCalled);
            assert.equal(origin.newToStringCalled, true);
        });

        it("复制并且返回结果对象", function ()
        {
            obj = TopJs.apply({}, {
                prop1: 1,
                prop2: 2
            });
            assert.equal(obj.prop1, 1);
            assert.equal(obj.prop2, 2);
        });

        it("复制改变原有对象的引用", function ()
        {
            obj = {};
            TopJs.apply(obj, {
                prop1: "x",
                prop2: "y"
            });

            assert.deepEqual(obj, {
                prop1: "x",
                prop2: "y"
            });
        });

        it("重写目标对象的字段", function ()
        {
            obj = TopJs.apply({
                a: 1,
                b: 2
            }, {
                b: 3,
                c: 4
            });
            assert.deepEqual(obj, {
                a: 1,
                b: 3,
                c: 4
            });
        });

        it("使用默认对象", function ()
        {
            obj = {};
            TopJs.apply(obj, {
                a: 1,
                b: 2
            }, {
                d: 5,
                a: 3
            });
            assert.deepEqual(obj, {
                a: 1,
                b: 2,
                d: 5
            });
        });

        it("覆盖所有的默认属性", function ()
        {
            obj = TopJs.apply({}, {
                name: "TopJs",
                age: 3
            }, {
                name: "defaultName",
                age: 1
            });
            assert.deepEqual(obj, {
                name: "TopJs",
                age: 3
            });
        });

        it("第一个参数为null则返回null", function ()
        {
            assert.isNull(TopJs.apply(null, {}));
        });

        it("第二参数为null则，则返回第一对象", function ()
        {
            obj = {
                prop1: 1
            };
            assert.deepEqual(TopJs.apply(obj), obj);
        });

        it("覆盖valueOf函数", function ()
        {
            obj = TopJs.apply({}, {
                valueOf: 1
            });
            assert.equal(obj.valueOf, 1);
        });

        it("覆盖toString函数", function ()
        {
            obj = TopJs.apply({}, {
                toString: "topjs"
            });
            assert.equal(obj.toString, "topjs");
        });
    });

    describe("TopJs.emptyFn", function ()
    {
        it("返回undefined", function ()
        {
            assert.isUndefined(TopJs.emptyFn());
        });
        it("就算传参数返回也是undefined", function ()
        {
            assert.isUndefined(TopJs.emptyFn("arg1", "arg2"));
        });
    });


    describe("TopJs.applyIf", function ()
    {
        let obj;
        it("目标对象为空，返回所有被复制的属性", function ()
        {
            obj = TopJs.applyIf({}, {
                prop1: "prop1",
                prop2: "prop2"
            });
            assert.deepEqual(obj, {
                prop1: "prop1",
                prop2: "prop2"
            });
        });

        it("不能覆盖目标对象已有的属性", function ()
        {
            obj = TopJs.applyIf({
                prop1: "prop1"
            }, {
                prop1: "prop2"
            });
            assert.equal(obj.prop1, "prop1");
        });

        it("混合复制的时候，不能覆盖目标对象的属性", function ()
        {
            obj = TopJs.applyIf({
                prop1: "prop1",
                prop2: "prop2",
                prop3: "prop3"
            }, {
                prop2: "prop4",
                prop3: "xxx",
                prop4: "haha"
            });
            assert.deepEqual(obj, {
                prop1: "prop1",
                prop2: "prop2",
                prop3: "prop3",
                prop4: "haha"
            });
        });

        it("应该改变对象的引用", function ()
        {
            obj = {};
            TopJs.applyIf(obj, {
                prop1: "prop1"
            }, {
                prop1: "xxxx"
            });
            assert.equal(obj.prop1, "prop1");
        });

        it("如果第一个参数为null，返回null", function ()
        {
            assert.isNull(TopJs.applyIf(null, {
                prop1: "prop1"
            }));
        });

        it("返回第一个参数，如果第二个参数没有提供", function ()
        {
            obj = {
                prop1: "prop1"
            };
            assert.deepEqual(TopJs.applyIf(obj), obj);
        });
    });

    describe("TopJs.ensureValue", function ()
    {
        let value;
        let defaultValue;
        describe("空字符串不为空", function ()
        {
            it("返回空字符串", function ()
            {
                assert.equal(TopJs.ensureValue("", "arg2", true), "")
            });

            it("返回第一个参数值", function ()
            {
                assert.equal(TopJs.ensureValue("arg1", "arg2", true), "arg1");
            });

            it("第一个参数undefined就返回默认值", function ()
            {
                assert.equal(TopJs.ensureValue(undefined, "arg2", true), "arg2")
            });

            it("0不为空，返回它", function ()
            {
                assert.equal(TopJs.ensureValue(0, "arg2", true), 0)
            });
        });

        describe("空字符串不为空", function ()
        {
            it("返回空字符串", function ()
            {
                assert.equal(TopJs.ensureValue("", "arg2"), "arg2")
            });

            it("返回第一个参数值", function ()
            {
                assert.equal(TopJs.ensureValue("arg1", "arg2"), "arg1");
            });

            it("第一个参数undefined就返回默认值", function ()
            {
                assert.equal(TopJs.ensureValue(undefined, "arg2"), "arg2")
            });

            it("0不为空，返回它", function ()
            {
                assert.equal(TopJs.ensureValue(0, "arg2"), 0)
            });
        });
    });

    describe("TopJs.isIterable", function ()
    {
        let LengthyClass = function ()
        {
        };
        let ClassWithItem = function ()
        {
        };
        let LengthyItemClass = function ()
        {
        };
        LengthyClass.prototype.length = 1;
        ClassWithItem.prototype.item = function ()
        {
        };
        LengthyItemClass.prototype.length = 1;
        LengthyItemClass.prototype.item = function ()
        {
        };

        it("函数的argumets对象可遍历", function ()
        {
            assert.equal(TopJs.isIterable(arguments), true);
        });

        it("数组是可遍历", function ()
        {
            assert.equal(TopJs.isIterable([]), true);
        });

        it("有数据的数据也是可遍历", function ()
        {
            assert.equal(TopJs.isIterable([1, 2, 3, 4]), true);
        });

        it("布尔值false不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(false), false);
        });

        it("布尔值true不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(true), false);
        });

        it("字符串不可遍历", function ()
        {
            assert.equal(TopJs.isIterable("a string value"), false);
        });

        it("空字符串不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(""), false);
        });

        it("null不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(null), false);
        });

        it("undefined不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(undefined), false);
        });

        it("date不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(new Date()), false);
        });

        it("空对象不可遍历", function ()
        {
            assert.equal(TopJs.isIterable({}), false);
        });

        it("函数不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(function ()
            {
            }), false);
        });

        it("具有length属相的对象不可遍历", function ()
        {
            assert.equal(TopJs.isIterable({length: 1}), false);
        });

        it("具有item属性的对象不可遍历", function ()
        {
            assert.equal(TopJs.isIterable({
                item: function ()
                {
                }
            }), false);
        });

        it("原型具有length属性的对象不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(new LengthyClass()), false);
        });

        it("原型具有item属性的对象不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(new ClassWithItem()), false);
        });

        it("原型具有item和length属性的对象不可遍历", function ()
        {
            assert.equal(TopJs.isIterable(new LengthyItemClass()), false);
        })
    });

    describe("TopJs.isArray", function ()
    {
        it("空数组返回true", function ()
        {
            assert.equal(TopJs.isArray([]), true);
        });

        it("有内容的数组返回true", function ()
        {
            assert.equal(TopJs.isArray([1, 2, 3, 4]), true);
        });

        it("布尔值true不是数组", function ()
        {
            assert.equal(TopJs.isArray(true), false);
        });

        it("布尔值false不是数组", function ()
        {
            assert.equal(TopJs.isArray(false), false);
        });

        it("数值类型不是数组", function ()
        {
            assert.equal(TopJs.isArray(1), false);
        });

        it("字符串类型不是数组", function ()
        {
            assert.equal(TopJs.isArray("asdasda"), false);
        });

        it("null不是数组", function ()
        {
            assert.equal(TopJs.isArray(null), false);
        });

        it("undefined不是数组", function ()
        {
            assert.equal(TopJs.isArray(undefined), false);
        });

        it("date类型不是数组", function ()
        {
            assert.equal(TopJs.isArray(new Date()), false);
        });

        it("空对象不是数组", function ()
        {
            assert.equal(TopJs.isArray({}), false);
        });
    });

    describe("TopJs.isBoolean", function ()
    {
        it("空数组不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean([]), false);
        });

        it("有值得数组不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean([1, 2, 3]), false);
        });

        it("true是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(true), true);
        });

        it("false是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(false), true);
        });

        it("字符串不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean("asdasdq3eqweq"), false)
        });

        it("空字符串不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(""), false)
        });

        it("1不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(0), false);
        });

        it("0不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(1), false);
        });

        it("null不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(null), false);
        });

        it("undefined不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(undefined), false);
        });

        it("date类型不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean(new Date()), false);
        });

        it("空对象不是布尔类型", function ()
        {
            assert.equal(TopJs.isBoolean({}), false);
        });
    });

    describe("TopJs.isDate", function ()
    {
        it("空数组不是date类型", function ()
        {
            assert.equal(TopJs.isDate([]), false);
        });

        it("有值得数组不是date类型", function ()
        {
            assert.equal(TopJs.isDate([1, 2, 3]), false);
        });

        it("true不是date类型", function ()
        {
            assert.equal(TopJs.isDate(true), false);
        });

        it("false不是date类型", function ()
        {
            assert.equal(TopJs.isDate(false), false);
        });

        it("字符串不是date类型", function ()
        {
            assert.equal(TopJs.isDate("a string value"), false);
        });

        it("空字符串不是date类型", function ()
        {
            assert.equal(TopJs.isDate(""), false);
        });

        it("数值类型不是date类型", function ()
        {
            assert.equal(TopJs.isDate(1), false);
        });

        it("null不是date类型", function ()
        {
            assert.equal(TopJs.isDate(null), false);
        });

        it("undefined不是date类型", function ()
        {
            assert.equal(TopJs.isDate(undefined), false);
        });

        it("new Date()是date类型", function ()
        {
            assert.equal(TopJs.isDate(new Date()), true);
        });

        it("常量对象不是date类型", function ()
        {
            assert.equal(TopJs.isDate({}), false);
        });
    });

    describe("TopJs.isDefined", function ()
    {
        it("空数组已经定义", function ()
        {
            assert.equal(TopJs.isDefined([]), true);
        });

        it("有值得数组已经定义", function ()
        {
            assert.equal(TopJs.isDefined([1, 2, 3, 4]), true)
        });

        it("true已经定义", function ()
        {
            assert.equal(TopJs.isDefined(true), true);
        });

        it("false已经定义", function ()
        {
            assert.equal(TopJs.isDefined(false), true);
        });

        it("字符串已经定义", function ()
        {
            assert.equal(TopJs.isDefined("a string value"), true);
        });

        it("空字符串已经定义", function ()
        {
            assert.equal(TopJs.isDefined("a string value"), true);
        });

        it("数字常量已经定义", function ()
        {
            assert.equal(TopJs.isDefined(1), true);
        });

        it("null已经定义", function ()
        {
            assert.equal(TopJs.isDefined(null), true);
        });

        it("undefined已经定义", function ()
        {
            assert.equal(TopJs.isDefined(null), true);
        });

        it("date对象已经定义", function ()
        {
            assert.equal(TopJs.isDefined(new Date()), true);
        });

        it("空对象已经定义", function ()
        {
            assert.equal(TopJs.isDefined({}), true);
        });
    });

    describe("TopJs.isEmpty", function ()
    {
        it("空数组为空", function ()
        {
            assert.equal(TopJs.isEmpty([]), true);
        });

        it("有值得数组不为空", function ()
        {
            assert.equal(TopJs.isEmpty([1, 2, 3]), false);
        });

        it("true不为空", function ()
        {
            assert.equal(TopJs.isEmpty(true), false);
        });

        it("false不为空", function ()
        {
            assert.equal(TopJs.isEmpty(false), false);
        });

        it("字符串不为空", function ()
        {
            assert.equal(TopJs.isEmpty("a string value"), false);
        });

        it("空字符串为空", function ()
        {
            assert.equal(TopJs.isEmpty(""), true);
        });

        it("指定allowBlank参数空字符串不为空", function ()
        {
            assert.equal(TopJs.isEmpty("", true), false);
        });

        it("数字常量不为空", function ()
        {
            assert.equal(TopJs.isEmpty(1), false);
        });

        it("null为空", function ()
        {
            assert.equal(TopJs.isEmpty(null), true);
        });

        it("undefined为空", function ()
        {
            assert.equal(TopJs.isEmpty(null), true);
        });

        it("date类型不为空", function ()
        {
            assert.equal(TopJs.isEmpty(new Date()), false);
        })
    });

    describe("TopJs.isFunction", function ()
    {
        it("匿名函数是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(function ()
            {
            }), true);
        });

        it("箭头函数是函数类型", function ()
        {
            assert.equal(TopJs.isFunction((x) => x), true);
        });

        it("静态方法是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(TopJs.emptyFn), true);
        });

        it("实例对象的方法是函数类型", function ()
        {
            let Cls = function ()
            {
            };
            Cls.prototype.getName = function ()
            {
            };
            let obj = new Cls();
            assert.equal(TopJs.isFunction(obj.getName), true);
        });

        it("常量对象的函数字段是函数类型", function ()
        {
            let obj = {
                fn: function ()
                {
                }
            };
            assert.equal(TopJs.isFunction(obj.fn), true);
        });

        it("空数组不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction([]), false);
        });

        it("有值得数组不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction([1, 2, 4]), false);
        });

        it("false不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(false), false);
        });

        it("true不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(true), false);
        });

        it("字符串不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction("a string value"), false);
        });

        it("空字符串不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(""), false);
        });

        it("数字常量不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(666), false);
        });

        it("null不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(null), false);
        });

        it("undefined不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(undefined), false);
        });

        it("空对象不是函数类型", function ()
        {
            assert.equal(TopJs.isFunction(undefined), false);
        });
    });

    describe("TopJs.isNumber", function ()
    {
        it("0是number类型", function ()
        {
            assert.equal(TopJs.isNumber(0), true);
        });

        it("正数是number类型", function ()
        {
            assert.equal(TopJs.isNumber(666), true);
        });

        it("负数是number类型", function ()
        {
            assert.equal(TopJs.isNumber(-666), true);
        });

        it("浮点数是number类型", function ()
        {
            assert.equal(TopJs.isNumber(2.14), true);
        });

        it("负的浮点数是number类型", function ()
        {
            assert.equal(TopJs.isNumber(-5.12), true);
        });

        it("最大数是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Number.MAX_VALUE), true);
        });

        it("最小数是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Number.MIN_VALUE), true);
        });

        it("Math.PI是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Math.PI), true);
        });

        it("Number构造函数的对象是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Number(1.23)), true);
        });

        it("NaN不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Number.NaN), false);
        });

        it("Number.POSITIVE_INFINITY不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Number.POSITIVE_INFINITY), false);
        });

        it("Number.NEGATIVE_INFINITY不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(Number.NEGATIVE_INFINITY), false);
        });

        it("空数组不是number类型", function ()
        {
            assert.equal(TopJs.isNumber([]), false);
        });

        it("有值得数组不是number类型", function ()
        {
            assert.equal(TopJs.isNumber([666, 666, 666]), false);
        });

        it("true不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(true), false);
        });

        it("false不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(false), false);
        });

        it("字符串不是nubmer类型", function ()
        {
            assert.equal(TopJs.isNumber("a string value"), false);
        });

        it("空字符串不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(""), false);
        });

        it("数字字符串不是number类型", function ()
        {
            assert.equal(TopJs.isNumber("666"), false);
        });

        it("null不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(null), false);
        });

        it("undefined不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(undefined), false);
        });

        it("date类型不是number类型", function ()
        {
            assert.equal(TopJs.isNumber(new Date()), false);
        });

        it("空对象不是number类型", function ()
        {
            assert.equal(TopJs.isNumber({}), false);
        });
    });

    describe("TopJs.isNumeric", function ()
    {
        it("0是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(0), true);
        });

        it("正数是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(666), true);
        });

        it("负数是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(-666), true);
        });

        it("负浮点数是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(-3.25), true);
        });

        it("正浮点数是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(3.234), true);
        });

        it("Number.MAX_VALUE是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Number.MAX_VALUE), true);
        });

        it("Number.MIN_VALUE是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Number.MIN_VALUE), true);
        });

        it("Math.PI是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Math.PI), true);
        });

        it("Number()构造函数返回的对象是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Number('6.66')), true);
        });

        it("Number.NaN不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Number.NaN), false);
        });

        it("Number.POSITIVE_INFINITY不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Number.POSITIVE_INFINITY), false);
        });

        it("Number.NEGATIVE_INFINITY不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(Number.NEGATIVE_INFINITY), false);
        });

        it("空数组不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric([]), false);
        });

        it("有值得数组不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric([666, 666, 666]), false);
        });

        it("true不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(true), false);
        });

        it("false不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(false), false);
        });

        it("字符串不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric("a string value"), false);
        });

        it("空字符串不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(""), false);
        });

        it("字符串数字不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric("12.12"), true);
        });

        it("null不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(null), false);
        });

        it("null不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(null), false);
        });

        it("undefiend不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric(undefined), false);
        });

        it("空对象不是Numeric类型", function ()
        {
            assert.equal(TopJs.isNumeric({}), false);
        });
    });

    describe("TopJs.isObject", function ()
    {
        it("空数组不是对象类型", function ()
        {
            assert.equal(TopJs.isObject([]), false);
        });

        it("有值的数组不是对象类型", function ()
        {
            assert.equal(TopJs.isObject([666, 666, 666]), false);
        });

        it("true不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(true), false);
        });

        it("false不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(false), false);
        });

        it("字符串不是对象类型", function ()
        {
            assert.equal(TopJs.isObject("a string value"), false);
        });

        it("空字符串不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(""), false);
        });

        it("number常量不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(1), false);
        });

        it("null不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(null), false);
        });

        it("undefined不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(undefined), false);
        });

        it("date不是对象类型", function ()
        {
            assert.equal(TopJs.isObject(new Date()), false);
        });

        it("常量对象是对象类型", function ()
        {
            assert.equal(TopJs.isObject({}), true);
        });

        it("带有属性的常量对象是对象类型", function ()
        {
            assert.equal(TopJs.isObject({
                prop1: "prop1",
                prop2: "prop2"
            }), true);
        });

        it("普通的实例化的对象是对象类型", function ()
        {
            let Cls = function ()
            {
            };
            assert.equal(TopJs.isObject(new Cls()), true);
        });

        it("new Object()是对象类型", function ()
        {
            assert.equal(TopJs.isObject(new Object()), true);
        });
    });

    describe("TopJs.isPrimitive", function ()
    {
        it("整数是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(666), true);
        });

        it("负整数是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(-666), true);
        });

        it("浮点是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(3.666), true);
        });

        it("负浮点是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(-3.666), true);
        });

        it("Number.MAX_VALUE是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(Number.MAX_VALUE), true);
        });

        it("Math.PI是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(Math.PI), true);
        });

        it("空字符串是原始类型", function ()
        {
            assert.equal(TopJs.isPrimitive(""), true);
        });

        it("字符串是原始类型", function ()
        {
            assert.equal(TopJs.isPrimitive("a string value"), true);
        });

        it("true是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(true), true);
        });

        it("false是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(false), true);
        });

        it("null是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(null), false);
        });

        it("undefined是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive(undefined), false);
        });

        it("常量对象不是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive({}), false);
        });

        it("是实例话的类实例不是原生类型", function ()
        {
            let Cls = function ()
            {
            };
            assert.equal(TopJs.isPrimitive(new Cls()), false);
        });

        it("数组不是原生类型", function ()
        {
            assert.equal(TopJs.isPrimitive([]), false);
        });
    });

    describe("TopJs.isString", function ()
    {

        it("空字符串是字符串类型", function ()
        {
            assert.equal(TopJs.isString(""), true);
        });

        it("字符串是字符串类型", function ()
        {
            assert.equal(TopJs.isString("a string value"), true);
        });

        it("通过传入字符串到String()构造函数返回值是字符串类型", function ()
        {
            assert.equal(TopJs.isString(String("a string value")), true);
        });

        it("通过传入空字符串String()构造函数返回值是字符串类型", function ()
        {
            assert.equal(TopJs.isString(String("")), true);
        });

        it("number不是字符串类型", function ()
        {
            assert.equal(TopJs.isString(666), false);
        });

        it("true不是字符串类型", function ()
        {
            assert.equal(TopJs.isString(true), false);
        });

        it("null不是字符串类型", function ()
        {
            assert.equal(TopJs.isString(null), false);
        });

        it("undefined不是字符串类型", function ()
        {
            assert.equal(TopJs.isString(undefined), false);
        });

        it("数组不是字符串类型", function ()
        {
            assert.equal(TopJs.isString([]), false);
        });

        it("常量对象不是字符串类型", function ()
        {
            assert.equal(TopJs.isString({}), false);
        });

    });

    describe("TopJs.clone", function ()
    {
        let clone = null;
        beforeEach(function ()
        {
            clone = null;
        });
        it("克隆一个数组", function ()
        {
            let array = [234, 32, '22', [666, 6, "3"]];
            clone = TopJs.clone(array);
            assert.deepEqual(clone, array);
            assert.equal(array === clone, false);
        });

        it("克隆一个对象", function ()
        {
            let obj = {
                prop1: 1,
                fn: function ()
                {
                    return 666;
                }
            };
            clone = TopJs.clone(obj);
            assert.deepEqual(clone, obj);
            assert.equal(obj === clone, false);
        });

        it("克隆一个date类型", function ()
        {
            let date = new Date();
            clone = TopJs.clone(date);
            assert.deepEqual(clone, date);
            assert.equal(date === clone, false);
        });

        it("克隆null直接返回null", function ()
        {
            assert.isNull(TopJs.clone(null));
        });

        it("克隆undefined直接返回undefined", function ()
        {
            assert.isUndefined(TopJs.clone(undefined));
        });

        it("不克隆可遍历的字段", function ()
        {
            assert.equal(TopJs.clone({}).hasOwnProperty('toString'), false);
        });

        it("克隆显示指定的字段，哪怕是可遍历的", function ()
        {
            assert.equal(TopJs.clone({toString: true}).hasOwnProperty('toString'), true);
            assert.equal(TopJs.clone({toString: true}).hasOwnProperty('valueOf'), false);
        });
    });

    describe("TopJs.override", function ()
    {
        describe("操作原生的类型", function ()
        {
            it("覆盖原来的方法，并且将方法加到原型上", function ()
            {
                let Cls = function ()
                {
                };
                let fn1 = function ()
                {
                };
                let fn2 = function ()
                {
                };
                let fn3 = function ()
                {
                };
                let fn4 = function ()
                {
                };
                Cls.prototype.method1 = fn1;
                Cls.prototype.method2 = fn2;
                TopJs.override(Cls, {
                    method2: fn3,
                    method3: fn4
                });
                assert.equal(Cls.prototype.method1, fn1);
                assert.equal(Cls.prototype.method2, fn3);
                assert.equal(Cls.prototype.method3, fn4);
            });
        });
    });

    describe("TopJs.typeof", function ()
    {
        it("应该返回null", function ()
        {
            assert.equal(TopJs.typeOf(null), "null");
        });
        it("返回`undefined`", function ()
        {
            assert.equal(TopJs.typeOf(undefined), "undefined");
        });
        it("应该返回字符串", function ()
        {
            assert.equal(TopJs.typeOf(""), "string");
            assert.equal(TopJs.typeOf("something"), "string");
            assert.equal(TopJs.typeOf("1.2"), "string");
        });
        it("应该返回number", function ()
        {
            assert.equal(TopJs.typeOf(1), "number");
            assert.equal(TopJs.typeOf(1.2), "number");
            assert.equal(TopJs.typeOf(new Number(1.2)), "number");
        });
        it("返回boolean类型", function ()
        {
            assert.equal(TopJs.typeOf(true), "boolean");
            assert.equal(TopJs.typeOf(false), "boolean");
            assert.equal(TopJs.typeOf(new Boolean(1.2)), "boolean");
        });
        it("返回array", function ()
        {
            assert.equal(TopJs.typeOf([1, 2, 3]), "array");
            assert.equal(TopJs.typeOf(new Array(1, 2, 3)), "array");
        });

        it("应该返回函数", function ()
        {
            assert.equal(TopJs.typeOf(function ()
            {
            }), "function");
            assert.equal(TopJs.typeOf(new Function()), "function");
            assert.equal(TopJs.typeOf(Object), "function");
            assert.equal(TopJs.typeOf(Array), "function");
            assert.equal(TopJs.typeOf(Number), "function");
            assert.equal(TopJs.typeOf(Function), "function");
            assert.equal(TopJs.typeOf(Boolean), "function");
            assert.equal(TopJs.typeOf(String), "function");
            assert.equal(TopJs.typeOf(Date), "function");
            assert.equal(TopJs.typeOf(TopJs.typeOf), "function");
        });
        it("应该返回正则表达式", function ()
        {
            assert.equal(TopJs.typeOf(/test/), "regexp");
            assert.equal(TopJs.typeOf(new RegExp('test')), "regexp");
        });
        it("应该返回date类型", function ()
        {
            assert.equal(TopJs.typeOf(new Date()), "date");
        });
        it("应该返回对象类型", function ()
        {
            assert.equal(TopJs.typeOf({some: 'stuff'}), "object");
            assert.equal(TopJs.typeOf(new Object()), "object");
            assert.equal(TopJs.typeOf(global), "object");
        });
    });

    describe("TopJs.iterate", function ()
    {
        describe("迭代对象", function ()
        {
            let obj;
            beforeEach(function ()
            {
                obj = {
                    n1: 11,
                    n2: 13,
                    n3: 18
                };
            });
            describe("迭代器不返回`false`", function ()
            {
                let args = [];
                let calledCount = 0;
                let func = function (key, value)
                {
                    args.push([key, value]);
                    calledCount++;
                };
                beforeEach(function ()
                {
                    TopJs.iterate(obj, func);
                });
                afterEach(function ()
                {
                    args = [];
                    calledCount = 0;
                });
                it("应该被调用3次", function ()
                {
                    assert.equal(calledCount, 3);
                });
                it("使用正确的参数进行调用", function ()
                {
                    assert.deepEqual(args, [
                        ["n1", 11],
                        ["n2", 13],
                        ["n3", 18]
                    ]);
                })
            });
            describe("迭代器返回false", function ()
            {
                let calledCount = 0;
                let func = function (key, value)
                {
                    calledCount++;
                    return false;
                };
                it("应该停止迭代，如果迭代器返回false", function ()
                {
                    TopJs.iterate(obj, func);
                    assert.equal(calledCount, 1);
                });
            });

            describe("如果被迭代对象是空对象，那么迭代器不运行", function ()
            {
                let calledCount = 0;
                let func = function (key, value)
                {
                    calledCount++;
                    return false;
                };
                let obj = {};
                it("不运行迭代器", function ()
                {
                    TopJs.iterate(obj, func);
                    assert.equal(calledCount, 0);
                })
            });
        });
        describe("迭代数组", function ()
        {
            let arr;
            beforeEach(function ()
            {
                arr = [1, 2, 3]
            });
            describe("迭代器不返回`false`", function ()
            {
                let args = [];
                let calledCount = 0;
                let func = function (value, index)
                {
                    args.push([value, index]);
                    calledCount++;
                };
                beforeEach(function ()
                {
                    TopJs.iterate(arr, func);
                });
                afterEach(function ()
                {
                    args = [];
                    calledCount = 0;
                });
                it("应该被调用3次", function ()
                {
                    assert.equal(calledCount, 3);
                });
                it("使用正确的参数进行调用", function ()
                {
                    assert.deepEqual(args, [
                        [1, 0],
                        [2, 1],
                        [3, 2]
                    ]);
                })
            });
            describe("迭代器返回false", function ()
            {
                let calledCount = 0;
                let func = function (key, value)
                {
                    calledCount++;
                    return false;
                };
                it("应该停止迭代，如果迭代器返回false", function ()
                {
                    TopJs.iterate(arr, func);
                    assert.equal(calledCount, 1);
                });
            });
            describe("如果被迭代对象是空对象，那么迭代器不运行", function ()
            {
                let calledCount = 0;
                let func = function (key, value)
                {
                    calledCount++;
                    return false;
                };
                let arr = [];
                it("不运行迭代器", function ()
                {
                    TopJs.iterate(arr, func);
                    assert.equal(calledCount, 0);
                })
            });
        });
    });
    
    describe("TopJs.copy", function ()
    {
        let dest;
        let source = { a: 1, b: 'x', c: 42, obj: {} };
        beforeEach(function () {
            dest = { a: 427 };
        });
        it("覆盖原有属性", function ()
        {
            TopJs.copy(dest, source, ['a']);
            assert.equal(dest.a, 1);
        });
        it("添加新的属性", function ()
        {
            TopJs.copy(dest, source, ['a', 'b']);
            assert.deepEqual(dest, {
                a: 1,
                b: 'x'
            });
        });
        it("引用复制", function ()
        {
            TopJs.copy(dest, source, ['obj']);
            assert.equal(dest.obj, source.obj);
        });
    });

    describe("TopJs.copy", function ()
    {
        let dest;
        let source = { a: 1, b: 'x', c: 42, obj: {} };
        beforeEach(function () {
            dest = { a: 427 };
        });
        it("不覆盖原有属性", function ()
        {
            TopJs.copyIf(dest, source, ['a']);
            assert.equal(dest.a, 427);
        });
        it("添加新的属性", function ()
        {
            TopJs.copyIf(dest, source, ['a', 'b']);
            assert.deepEqual(dest, {
                a: 427,
                b: 'x'
            });
        });
        it("引用复制", function ()
        {
            TopJs.copyIf(dest, source, ['obj']);
            assert.equal(dest.obj, source.obj);
        });
    });
});