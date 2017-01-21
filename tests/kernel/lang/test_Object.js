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
describe("TopJs.Object", function ()
{
    describe("TopJs.Object.getSize", function ()
    {
        it("没有属性的时候返回0", function ()
        {
            let obj = {};
            assert.equal(TopJs.Object.getSize(obj), 0);
        });
        it("属性不为空的时候返回属性的数量", function ()
        {
            let obj = {
                prop1: "prop1",
                prop2: "prop2",
                prop3: "prop3"
            };
            assert.equal(TopJs.Object.getSize(obj), 3);
        });
    });
    describe("TopJs.Object.clear", function ()
    {
        it("删除只有一个属性的对象", function ()
        {
            let obj = {
                prop1: "prop1"
            };
            TopJs.Object.clear(obj);
            assert.isFalse(obj.hasOwnProperty('prop1'));
        });
        it("同时删除多个属性", function ()
        {
            let obj = {
                prop1: "prop1",
                prop2: "prop2",
                prop3: "prop3"
            };
            TopJs.Object.clear(obj);
            assert.isFalse(obj.hasOwnProperty('prop1'));
            assert.isFalse(obj.hasOwnProperty('prop2'));
            assert.isFalse(obj.hasOwnProperty('prop3'));
        });
        it("不删除原形链上的属性", function ()
        {
            let obj = TopJs.Object.chain({
                a: 1,
                b: 2
            });
            obj.prop1 = "prop1";
            TopJs.Object.clear(obj);
            assert.isTrue('a' in obj);
            assert.isTrue('b' in obj);
            assert.isFalse(obj.hasOwnProperty('prop1'));
        });
        it("应该返回同一个对象", function ()
        {
            let obj = TopJs.Object.chain({
                a: 1,
                b: 2
            });
            assert.equal(TopJs.Object.clear(obj), obj);
        });
    });
    describe("TopJs.Object.isEmpty", function ()
    {
        it("当对象有属性的时候返回false", function ()
        {
            assert.isFalse(TopJs.Object.isEmpty({prop1: "prop1"}));
        });
        it("当对象没有属性的时候返回true", function ()
        {
            assert.isTrue(TopJs.Object.isEmpty({}));
        });
    });
    describe("TopJs.Object.getValues", function ()
    {
        it("null或者undefined对象返回空数组", function ()
        {
            assert.deepEqual(TopJs.Object.getValues(null), []);
            assert.deepEqual(TopJs.Object.getValues(undefined), []);
        });
        it("空对象返回空数组", function ()
        {
            assert.deepEqual(TopJs.Object.getValues({}), []);
        });
        it("返回对象的所有的值", function ()
        {
            assert.deepEqual(TopJs.Object.getValues({
                prop1: "prop1",
                prop2: "prop2",
                prop3: "prop3"
            }), ["prop1", "prop2", "prop3"]);
        });
    });
    describe("TopJs.Object.getKey", function ()
    {
        it("当操作对象是null对象的时候返回null", function ()
        {
            assert.isNull(TopJs.Object.getKey(null, "prop1"));
        });
        it("当操作对象是空对象的时候返回null", function ()
        {
            assert.isNull(TopJs.Object.getKey({}, "prop1"));
        });
        it("值不存在的时候返回null", function ()
        {
            assert.isNull(TopJs.Object.getKey({
                prop1: 1,
                prop2: 2,
                prop3: 3
            }, 4));
        });
        it("值用严格相等进行比较", function ()
        {
            assert.isNull(TopJs.Object.getKey({
                prop1: 1,
                prop2: 2,
                prop3: 3
            }, '3'));
        });
        it("值存在，返回响应的key", function ()
        {
            assert.equal(TopJs.Object.getKey({
                prop1: 1,
                prop2: 2,
                prop3: 3
            }, 3), "prop3");
        });
        it("只返回第一个相等的key", function ()
        {
            assert.equal(TopJs.Object.getKey({
                prop1: 1,
                prop2: 2,
                prop3: 3
            }, 3), "prop3");
        });
    });

    describe("TopJs.Object.equals", function ()
    {
        it("null与null相等", function ()
        {
            assert.isTrue(TopJs.Object.equals(null, null));
        });
        it("undefined与undefined相等", function ()
        {
            assert.isTrue(TopJs.Object.equals(undefined, undefined));
        });
        it("空对象跟null对象不相等", function ()
        {
            assert.isFalse(TopJs.Object.equals({}, null));
        });
        it("不同属性的对象不相等", function ()
        {
            assert.isFalse(TopJs.Object.equals({prop1: 1}, {prop2: 2}));
        });
        it("属性相同值不同对象不相等", function ()
        {
            assert.isFalse(TopJs.Object.equals({prop1: 1}, {prop1: 2}));
        });
        it("值必须严格相等", function ()
        {
            assert.isFalse(TopJs.Object.equals({prop1: 1}, {prop1: '1'}));
        });
        it("键值都相等，顺序无所谓,返回true", function ()
        {
            assert.isTrue(TopJs.Object.equals({prop1: 1, name: "softboy"},
                {name: "softboy", prop1: 1}));
        })
    });
    describe("TopJs.Object.each", function ()
    {
        describe("测试作用域和参数", function ()
        {
            it("在指定的作用域执行", function ()
            {
                let scope = {};
                let actualScope;
                TopJs.Object.each({prop1:1}, function (k, v)
                {
                    actualScope = this;
                }, scope);
                assert.equal(scope, actualScope);
            });
            it("默认作用域是对象本身", function ()
            {
                let actualScope;
                let obj = {prop1:1};
                TopJs.Object.each(obj, function (k, v)
                {
                    actualScope = this;
                });
                assert.equal(actualScope, obj);
            });
            it("应该给回调函数传入key和value", function ()
            {
                let keys = [];
                let values = [];
                let actualObj;
                let obj = {
                    prop1: "prop1",
                    prop2: "prop2",
                    prop3: "prop3"
                };
                TopJs.Object.each(obj, function (k, v, o)
                {
                    keys.push(k);
                    values.push(v);
                    actualObj = o;
                });
                assert.deepEqual(keys, ["prop1", "prop2", "prop3"]);
                assert.deepEqual(values, ["prop1", "prop2", "prop3"]);
                assert.equal(actualObj, obj);
            })
        });
        describe("何时停止", function ()
        {
            it("默认是迭代全部", function ()
            {
                let count = 0;
                TopJs.Object.each({
                    prop1: "prop1",
                    prop2: "prop2",
                    prop3: "prop3"
                }, function ()
                {
                    count++;
                });
                assert.equal(count, 3);
            });
            it("只有在返回false的情况下才能停止迭代", function ()
            {
                let count = 0;
                TopJs.Object.each({
                    prop1: "prop1",
                    prop2: "prop2",
                    prop3: "prop3"
                }, function ()
                {
                    count++;
                    return null;
                });
                assert.equal(count, 3);
            });
            it("返回false立即停止迭代", function ()
            {
                let count = 0;
                TopJs.Object.each({
                    prop1: "prop1",
                    prop2: "prop2",
                    prop3: "prop3"
                }, function (key)
                {
                    count++;
                    return key != "prop2";
                });
                assert.equal(count, 2);
            });
        });
        describe("处理undefined和null对象", function ()
        {
            it("不能抛出异常", function ()
            {
                assert.doesNotThrow(function ()
                {
                    TopJs.Object.each(undefined, function ()
                    {
                    });
                });
                assert.doesNotThrow(function ()
                {
                    TopJs.Object.each(null, function ()
                    {
                    });
                });
            });
        });
    });
    describe("TopJs.Object.toQueryString", function ()
    {
        describe("默认情况", function ()
        {
            it("当对象是null时候发挥空字符串", function ()
            {
                assert.equal(TopJs.Object.toQueryString(null), "")
            });
            it("当对象是空对象的时候返回空字符串", function ()
            {
                assert.equal(TopJs.Object.toQueryString({}), "")
            });
        });
        describe("处理空格", function ()
        {
            it("将空格转化成%20", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    name: "foo bar"
                }), "name=foo%20bar")
            });
            it("将`+`转换成%2B", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    name: "foo+bar"
                }), "name=foo%2Bbar")
            });
        });
        describe("简单的值处理", function ()
        {
            describe("空值处理", function ()
            {
                it("undefined", function ()
                {
                    assert.equal(TopJs.Object.toQueryString({
                        name: undefined
                    }), "name=")
                });
                it("null", function ()
                {
                    assert.equal(TopJs.Object.toQueryString({
                        name: null
                    }), "name=")
                });
                it("空字符串", function ()
                {
                    assert.equal(TopJs.Object.toQueryString({
                        name: ""
                    }), "name=")
                });
                it("空数组", function ()
                {
                    assert.equal(TopJs.Object.toQueryString({
                        name: []
                    }), "name=")
                });
                it("空对象", function ()
                {
                    assert.equal(TopJs.Object.toQueryString({
                        name: {}
                    }), "name=");
                });
                it("混合空值", function ()
                {
                    assert.equal(TopJs.Object.toQueryString({
                        name: '',
                        age: 1
                    }), "name=&age=1");
                });
            });
            it("使用&连接多个值", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    name: 'softboy',
                    age: 1
                }), "name=softboy&age=1");
            });
            it("处理日期", function ()
            {
                let d = new Date(2017, 0, 22);
                assert.equal(TopJs.Object.toQueryString({
                    name: d,
                    age: 1
                }), "name=2017-01-22T00%3A00%3A00&age=1");
            });
            it("encode对象的key", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    "dog and cat": 1,
                    age: 1
                }), "dog%20and%20cat=1&age=1");
            });
            it("encode对象的值", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    name: "dog and cat",
                    age: 1
                }), "name=dog%20and%20cat&age=1");
            });
            it("encode键跟值", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    "dog and cat": "$300",
                    age: 1
                }), "dog%20and%20cat=%24300&age=1");
            });
        });
        describe("处理数组", function ()
        {
            it("encode数组", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    foo: [1, 2, 3]
                }), "foo=1&foo=2&foo=3");
            });
            it("encode多个数组", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    foo: [1, 2, 3],
                    bar: [1, 2]
                }), "foo=1&foo=2&foo=3&bar=1&bar=2");
            });
            it("普通的值跟数组混合", function ()
            {
                assert.equal(TopJs.Object.toQueryString({
                    foo: [1, 2, 3],
                    bar: "asd",
                    age: 20
                }), "foo=1&foo=2&foo=3&bar=asd&age=20");
            });
        });
        describe("处理递归encode", function ()
        {
            it("支持递归支持的对象和数组", function ()
            {
                assert.equal(decodeURIComponent(TopJs.Object.toQueryString({
                    username: 'Jacky',
                    dateOfBirth: {
                        day: 1,
                        month: 2,
                        year: 1911
                    },
                    hobbies: ['coding', 'eating', 'sleeping', [1,2]]
                }, true)), "username=Jacky&dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=1&hobbies[3][1]=2");
            })
        })
    });

    describe("TopJs.Object.merge", function ()
    {
        describe("空值", function ()
        {
            it("应该允许undefined", function ()
            {
                assert.deepEqual(TopJs.Object.merge({}, undefined), {});
            });
            it("应该允许null", function ()
            {
                assert.deepEqual(TopJs.Object.merge({}, null), {});
            });
        });
        describe("复杂的值", function ()
        {
            it("复制简单的对象", function ()
            {
                let obj = {
                    prop1: "prop1",
                    person: {
                        name: "softboy",
                        age: 12
                    }
                };
                let result = TopJs.Object.merge({}, obj);
                assert.notEqual(result, obj);
            });
            it("不应该合并不是常量对象的对象", function ()
            {
                function Cls()
                {
                }
                let instance = new Cls();
                let obj = {
                    prop1: instance
                };
                let result = TopJs.Object.merge({}, obj);
                assert.equal(result.prop1, instance);
            });
        });
        describe("属性相同递归合并而不是覆盖", function ()
        {
            it("递归复制属性相同的对象", function ()
            {
                assert.deepEqual(TopJs.Object.merge({
                    prop: {
                        sub1: "sub1"
                    }
                }, {
                    prop: {
                        sub2: "sub2"
                    }
                }), {
                    prop: {
                        sub1: "sub1",
                        sub2: "sub2"
                    }
                });
            });
            it("目标属性值不是对象则替换", function ()
            {
                function Cls()
                {
                }
                let instance = new Cls();
                let result = TopJs.Object.merge({
                    prop: 1
                }, {
                    prop: instance
                });
                assert.equal(result.prop, instance);
                assert.deepEqual(result.prop, instance);
            });
            it("简单的值直接覆盖", function ()
            {
                assert.deepEqual(TopJs.Object.merge({
                    prop: 1
                }, {
                    prop: 2
                }), {
                    prop: 2
                });
            });
        });
        describe("正常合并对象", function ()
        {
            it("合并对象到空对象", function ()
            {
                assert.deepEqual(TopJs.Object.merge({},
                    {
                        prop: "prop"
                    }), {
                    prop: "prop"
                });
            });
            it("从右往左进行合并", function ()
            {
                assert.deepEqual(TopJs.Object.merge({},
                    {
                        prop: "prop1"
                    },{
                        prop: "prop2"
                    },{
                        prop: "prop3"
                    }), {
                    prop: "prop3"
                });
            });
            it("合并会修改目标对象，并且返回结果", function ()
            {
                let object = {};
                let result = TopJs.Object.merge(object, {
                    prop: "prop1"
                });
                assert.equal(object, result);
                assert.equal(result.prop, "prop1");
            });
        })
    });

    describe("TopJs.Object.toQueryObjects", function ()
    {
        it("简单的键值对象", function()
        {
            assert.deepEqual(TopJs.Object.toQueryObjects("name", "softboy"),
                [{ name: 'name', value: 'softboy' }]);
        });
        it("非递归数组转换", function ()
        {
            assert.deepEqual(TopJs.Object.toQueryObjects('hobbies', ['eating', 'sleeping', 'coding']),
                [ { name: 'hobbies', value: 'eating' },
                    { name: 'hobbies', value: 'sleeping' },
                    { name: 'hobbies', value: 'coding' } ]);
        });
        it("递归对象合并", function ()
        {
            assert.deepEqual(TopJs.Object.toQueryObjects("dateOfBirth", {
                day: 1,
                month: 2,
                year: 1911,
                somethingElse: {
                    nested: {
                        very: 'very',
                        deep: {
                            inHere: true
                        }
                    }
                }
            }, true), [
                {
                    name: 'dateOfBirth[day]',
                    value: 1
                },
                {
                    name: 'dateOfBirth[month]',
                    value: 2
                },
                {
                    name: 'dateOfBirth[year]',
                    value: 1911
                },
                {
                    name: 'dateOfBirth[somethingElse][nested][very]',
                    value: 'very'
                },
                {
                    name: 'dateOfBirth[somethingElse][nested][deep][inHere]',
                    value: true
                }
            ]);
        });
        it("递归合并数组", function ()
        {
            assert.deepEqual(TopJs.Object.toQueryObjects("hobbies", [
                'eating', 'sleeping', 'coding', ['even', ['more']]
            ], true), [
                {
                    "name": "hobbies[0]",
                    "value": "eating"
                },
                {
                    "name": "hobbies[1]",
                    "value": "sleeping"
                },
                {
                    "name": "hobbies[2]",
                    "value": "coding"
                },
                {
                    "name": "hobbies[3][0]",
                    "value": "even"
                },
                {
                    "name": "hobbies[3][1][0]",
                    "value": "more"
                }
            ]);
        });
    });
    describe("TopJs.Object.fromQueryString", function ()
    {
        describe("处理空格", function ()
        {
            it("decode%20成空格", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=foo%20bar"), {
                    name: "foo bar"
                });
            });
            it("将`+`decode成空格", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=foo+bar"), {
                    name: "foo bar"
                });
            });
            it("将`+`和`%20`混合字符串decode成空格", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=foo+bar%20baz"), {
                    name: "foo bar baz"
                });
            })
        });
        describe("标准模式", function ()
        {
            it("解码空字符串", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString(''), {});
            });
            it("检查简单的键值", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=softboy"), {name: "softboy"});
            });
            it("解码缺少值得数据", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name="), {name: ""});
            });
            it("解码多个键值对", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=softboy&age=12"),
                    { name: "softboy", age: "12" });
            });
            it("解码uri encode数据", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("a%20property=%24300%20%26%205%20cents"),
                    { "a property": "$300 & 5 cents" });
            });
            it("解码数组", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("foo=1&foo=2&foo=3"),
                    { foo: [ '1', '2', '3' ] });
            });
        });
        describe("递归解码", function ()
        {
            it("解压空字符串", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("", true),
                    {});
            });
            it("解压单个键值", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=softboy", true),
                    { name: "softboy" } );
            });
            it("解压空值", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=", true),
                    { name: '' } );
            });
            it("解压多个值", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("name=softboy&age=12", true),
                    { name: "softboy", age: "12" }  );
            });
            it("解压uri encoding数据", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("a%20property=%24300%20%26%205%20cents", true),
                    { 'a property': '$300 & 5 cents' });
            });
            it("递归模式下，键相同会覆盖前一个值", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("foo=1&foo=2&foo=3", true),
                    { foo: '3' });
            });
            it("通过[]生成简单的数组", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("foo[]=1&foo[]=2&foo[]=3", true),
                    { foo: [ '1', '2', '3' ] });
            });
            it("指定数组的索引数据", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("foo[0]=1&foo[1]=2&foo[2]=3", true),
                    { foo: [ '1', '2', '3' ] });
            });
            it("指定的数组的顺序", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("foo[3]=1&foo[1]=2&foo[2]=3&foo[0]=0", true),
                    { foo: [ '0', '2', '3', '1' ] });
            });
            it("数组空洞", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("foo[3]=1&foo[5]=2&foo[2]=3&foo[0]=0", true),
                    { foo: [ '0', , '3', '1', , '2' ] });
            });
            it("嵌套数组", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("some[0][0]=stuff&some[0][1]=morestuff&some[0][]=otherstuff&some[1]=thingelse", true),
                    {  some: [
                        ['stuff', 'morestuff', 'otherstuff'],
                        'thingelse'
                    ] });
            });
            it("嵌套对象", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&dateOfBirth[extra][hour]=4&dateOfBirth[extra][minute]=30", true),
                    {   dateOfBirth: {
                        day: '1',
                        month: '2',
                        year: '1911',
                        extra: {
                            hour: '4',
                            minute: '30'
                        }
                    }
                    });
            });
            it("混合数据类型", function ()
            {
                assert.deepEqual(TopJs.Object.fromQueryString("username=Jacky&dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff", true),
                    {
                        username: 'Jacky',
                        dateOfBirth: {
                            day: '1',
                            month: '2',
                            year: '1911'
                        },
                        hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
                    });
            })
        });
    });
});