/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../../lib/Entry").TopJs;
let assert = require("chai").assert;

describe("TopJs.Class", function ()
{
    let emptyFn = function ()
    {
    };
    let defaultInitConfig = function (config)
    {
        this.initConfig(config);
    };
    let Cls, sub, func, SubClass, ParentCls, MixinClass1, MixinClass2, o;

    beforeEach(function ()
    {
        func = function ()
        {
        };
        MixinClass1 = TopJs.define(null, {
            config: {
                mixinConfig: 'mixinConfig'
            },

            mixinProperty1: 'mixinProperty1',

            constructor ()
            {
                this.initConfig(config);
                this.mixinConstructor1Called = true;
            },

            mixinMethod1 ()
            {
                this.mixinMethodCalled = true;
            }
        });

        MixinClass2 = TopJs.define(null, {
            mixinProperty2: 'mixinProperty2',

            constructor (config)
            {
                this.initConfig(config);
                this.mixinConstructor2Called = true;
            },

            mixinMethod2 ()
            {
                this.mixinMethodCalled = true;
            }
        });

        ParentCls = TopJs.define(null, {
            mixins: {
                mixin1: MixinClass1
            },

            parentProperty: 'parentProperty',

            config: {
                name: "parentClass",
                isCool: false,
                members: {
                    abe: "Abraham Elias",
                    ed: "Ed Spencer"
                },
                hobbies: ['football', 'bowling']
            },

            constructor (config)
            {
                this.initConfig(config);
                this.parentConstructorCalled = true;
                this.mixins.mixin1.constructor.apply(this, arguments);
            },

            parentMethod ()
            {
                this.parentMethodCalled = true;
            }
        });

        SubClass = TopJs.define(null, {
            extend: ParentCls,
            mixins: {
                mixin1: MixinClass1,
                mixin2: MixinClass2
            },
            config: {
                name: 'subClass',
                isCool: true,
                members: {
                    jacky: 'Jacky Nguyen',
                    tommy: 'Tommy Maintz'
                },
                hobbies: ['sleeping', 'eating', 'movies'],
                isSpecial: true
            },
            constructor (config)
            {
                this.initConfig(config);
                this.subConstructorCalled = true;
                SubClass.superclass.constructor.apply(this, arguments);
                this.mixins.mixin2.constructor.apply(this, arguments);
            },
            myOwnMethod ()
            {
                this.myOwnMethodCalled = true;
            }
        });
    });

    afterEach(function ()
    {
        o = SubClass = ParentCls = MixinClass1 = MixinClass2 = sub = Cls = null;
    });

    describe("extend", function ()
    {
        beforeEach(function ()
        {
            func = function ()
            {
            };
            TopJs.define('Spec.Base', {
                prop1: 1,
                showInfo: func
            });
        });

        afterEach(function ()
        {
            TopJs.undefine('Spec.Base');
        });

        // it("should extend from TopJs.Base if no 'extend' property found", function ()
        // {
        //     Cls = TopJs.define(null, {});
        //     let obj = new Cls;
        //     assert.instanceOf(obj, TopJs.Base);
        // });


        describe("extending from a parent", function ()
        {
            it("class reference", function ()
            {
                Cls = TopJs.define(null, {
                    extend: Spec.Base
                });
                let obj = new Cls();
                assert.instanceOf(obj, Spec.Base);
            });

            it("class string", function ()
            {
                Cls = TopJs.define(null, {
                    extend: 'Spec.Base'
                });
                let obj = new Cls;
                assert.instanceOf(obj, Spec.Base);
            });
        });

        it("should have superclass reference", function ()
        {
            let parentPrototype = Spec.Base.prototype;
            Cls = TopJs.define(null, {
                extend: Spec.Base
            });
            assert.equal(Cls.superClass, parentPrototype);
            assert.equal((new Cls).superClass, parentPrototype);
        });

        it("should copy properties from the parent", function ()
        {
            Cls = TopJs.define(null, {
                extend: Spec.Base
            });
            assert.equal(Cls.prototype.prop1, 1);
        });

        it("should copy functions from the parent.", function ()
        {
            Cls = TopJs.define(null, {
                extend: Spec.Base
            });
            assert.equal(Cls.prototype.showInfo, func);
        });
    });

    describe("Config", function ()
    {
        beforeEach(function ()
        {
            func = function ()
            {
            };
        });
        describe("getter/setter creation", function ()
        {
            it("should create getter if not exists", function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        address: 'address'
                    }
                });
                assert.isDefined(Cls.prototype.getAddress);
            });

            it("should NOT create getter if already exists", function ()
            {
                Cls = TopJs.define(null, {
                    getAddress: func,
                    config: {
                        address: 'address'
                    }
                });
                assert.equal(Cls.prototype.getAddress, func);
            });

            it("should create setter if not exists", function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        address: 'address'
                    }
                });
                assert.isDefined(Cls.prototype.setAddress);
            });

            it("should not create setter if alreay exists", function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        address: 'address'
                    },
                    setAddress: func
                });
                assert.equal(Cls.prototype.setAddress, func);
            });

            it("should allow a custom getter to call the generated getter", function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        age: 27
                    },
                    constructor: defaultInitConfig,
                    getAge ()
                    {
                        return this.callParent() + 10;
                    }
                });
                let obj = new Cls();
                assert.equal(obj.getAge(), 37);
            });

            it("should allow a custom setter to cal the generated setter", function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        age: 12
                    },
                    constructor: defaultInitConfig,
                    setAge (age)
                    {
                        return this.callParent(age);
                    }
                });
                let obj = new Cls();
                obj.setAge(22);
                assert.equal(obj.getAge(), 22);
            });

            it("should not set the value if the applier returns undefined", function ()
            {
                let called = false;
                Cls = TopJs.define(null, {
                    config: {
                        name: "softboy"
                    },
                    constructor: defaultInitConfig,
                    applyName (name)
                    {
                        if (!called) {
                            called = true;
                            return name;
                        }
                        return undefined;
                    }
                });

                let obj = new Cls();
                obj.setName("xiaoming");
                assert.equal(obj.getName(), "softboy");
            });
            it("should not call the updater if the value does not change", function ()
            {
                let count = 0;
                Cls = TopJs.define(null, {
                    config: {
                        age: 1
                    },
                    constructor: defaultInitConfig,
                    updateAge ()
                    {
                        ++count;
                    }
                });
                let obj = new Cls();
                obj.setAge(1);
                assert.equal(count, 1);
                obj.setAge(11);
                assert.equal(count, 2);
            });
            it("should check using === to see if the value changed", function ()
            {
                let count = 0;
                Cls = TopJs.define(null, {
                    config: {
                        age: 1
                    },
                    constructor: defaultInitConfig,
                    updateAge ()
                    {
                        ++count;
                    }
                });
                let obj = new Cls();
                obj.setAge('1');
                assert.equal(count, 2);
            });

            it("should allow define a config named `configurator`", function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        configurator: 1
                    },
                    constructor: defaultInitConfig,
                    applyConfigurator (v)
                    {
                        return v + 2;
                    }
                });
                let obj = new Cls();
                assert.equal(obj.getConfigurator(), 3);
                obj.setConfigurator(3);
                assert.equal(obj.getConfigurator(), 5);
            });
            describe("when getters called by other configs's updaters", function ()
            {
                let applyCount;
                let updateCount;
                beforeEach(function ()
                {
                    Cls = TopJs.define(null, {
                        config: {
                            foo: 1,
                            bar: 2
                        },
                        constructor: defaultInitConfig,
                        updateFoo: function ()
                        {
                            this.getBar();
                        },
                        applyBar: function (bar)
                        {
                            ++applyCount;
                            return bar;
                        },
                        updateBar: function ()
                        {
                            ++updateCount;
                        }
                    });
                });
                it("should only call applier/updater once for class configs", function ()
                {
                    applyCount = updateCount = 0;
                    let obj = new Cls();
                    assert.equal(applyCount, 1);
                    assert.equal(updateCount, 1);
                });
                it("should only call applier/updaters once for instance configs", function ()
                {
                    applyCount = updateCount = 0;
                    let obj = new Cls({
                        foo: 10,
                        bar: 20
                    });
                    assert.equal(applyCount, 1);
                    assert.equal(updateCount, 1);
                });
            });
            describe("initialization", function ()
            {
                describe("default values - no passed config", function ()
                {
                    describe("null", function ()
                    {
                        it("should not initialize with a custom setter", function ()
                        {
                            let count = 0;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor (config)
                                {
                                    this.initConfig(config);
                                },

                                setFoo ()
                                {
                                    count++;
                                }
                            });
                            let obj = new Cls();
                            assert.equal(count, 0);
                        });

                        it("should not initialize with an applier", function ()
                        {
                            let called = false;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor: defaultInitConfig,
                                applyFoo ()
                                {
                                    called = true;
                                }
                            });
                            let obj = new Cls();
                            assert.isFalse(called);
                        });

                        it('should not initialize with an updater', function ()
                        {
                            let called = false;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: null
                                },
                                constructor: defaultInitConfig,
                                updateFoo ()
                                {
                                    called = true;
                                }
                            });
                            let obj = new Cls();
                            assert.isFalse(called);
                        })
                    });

                    describe("other values", function ()
                    {
                        it("should not call the setter", function ()
                        {
                            let called = false;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: defaultInitConfig,
                                setFoo () {
                                    called = true;
                                }
                            });
                            let obj = new Cls();
                            assert.isTrue(called);
                        });

                        it("should call the setter if this is an applier", function ()
                        {
                            let called = false;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: defaultInitConfig,
                                applyFoo ()
                                {
                                    called = true;
                                }
                            });
                            let obj = new Cls();
                            assert.isTrue(called);
                        });

                        it("should call the setter if this is an updater", function ()
                        {
                            let called = false;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: 1
                                },
                                constructor: defaultInitConfig,
                                applyFoo ()
                                {
                                    called = true;
                                }
                            });
                            let obj = new Cls();
                            assert.isTrue(called);
                        });

                        it("should call the setter if the value is an object", function ()
                        {
                            let called = false;
                            Cls = TopJs.define(null, {
                                config: {
                                    foo: {}
                                },
                                constructor: defaultInitConfig,
                                setFoo ()
                                {
                                    called = true;
                                }
                            });
                            let obj = new Cls();
                            assert.isTrue(called);
                        });
                    });
                });

                describe("dependencies", function ()
                {
                    it("should force an initialization if the getter is called during init time for a primitive",
                        function ()
                        {
                            let secondVal;
                            Cls = TopJs.define(null, {
                                config: {
                                    first: undefined,
                                    second: undefined
                                },
                                constructor: defaultInitConfig,
                                updateFirst ()
                                {
                                    secondVal = this.getSecond();
                                }
                            });
                            new Cls({
                                first: 1,
                                second: 2
                            });
                            assert.equal(secondVal, 2);
                        });

                    it("should have a non-config applied by the time any setter is called  with non-strict mode",
                        function ()
                        {
                            let secondVal;
                            Cls = TopJs.define(null, {
                                config: {
                                    first: undefined
                                },
                                constructor: defaultInitConfig,
                                $_config_strict_$: false,
                                applyFirst ()
                                {
                                    secondVal = this.second;
                                }
                            });
                            new Cls({
                                first: 1,
                                second: 2
                            });
                            assert.equal(secondVal, 2);
                        });
                });
            });
        });

        describe("get/setConfig", function ()
        {
            beforeEach(function ()
            {
                Cls = TopJs.define(null, {
                    config: {
                        foo: 1,
                        bar: 2
                    },
                    constructor: defaultInitConfig
                });
            });

            describe("dependency ordering", function ()
            {
                let order;

                function declare_class()
                {
                    order = [];
                    Cls = TopJs.define(null, {
                        config: {
                            b: 'bbb',
                            c: 'ccc',
                            a: 'aaa'
                        },
                        constructor: defaultInitConfig,
                        applyA (value)
                        {
                            order.push('a=' + value);
                        },
                        applyB (value)
                        {
                            this.getA();
                            order.push('b=' + value);
                        },
                        applyC (value)
                        {
                            this.getB();
                            order.push('c=' + value);
                        }
                    });
                }

                it("should initialize dependent config first", function ()
                {
                    declare_class();
                    let obj = new Cls();
                    assert.deepEqual(order, ['a=aaa', 'b=bbb', 'c=ccc']);
                });
                it("should update configs in dependency order", function ()
                {
                    declare_class();
                    let obj = new Cls();
                    order = [];
                    // Because the objects tend to be enumerated in order of keys
                    // declared, we deliberately put these *not* in the order that
                    // we expect them to be processed.
                    obj.setConfig({
                        a: 1,
                        c: 3,
                        b: 2
                    });
                    assert.deepEqual(order, ['a=1', 'b=2', 'c=3']);
                });
            });

            describe("getConfig", function ()
            {
                it("should be able to get a config by name", function ()
                {
                    let obj = new Cls();
                    assert.equal(obj.getConfig('bar'), 2);
                });

                it("should return all configs if no name is passed", function ()
                {
                    let obj = new Cls();
                    assert.deepEqual(obj.getConfig(), {
                        foo: 1,
                        bar: 2
                    });
                });
                it("should throw an exception when asking for config that doesn't exist", function ()
                {
                    let obj = new Cls();
                    assert.throws(function ()
                    {
                        obj.getConfig('fake');
                    }, Error);
                });

                describe("peek", function ()
                {
                    let called = false;
                    beforeEach(function ()
                    {
                        Cls = TopJs.define(null, {
                            constructor (config){
                                this.initConfig(config);
                            },
                            config: {
                                foo: {
                                    lazy: true,
                                    $_value_$: 120
                                }
                            },

                            getFoo ()
                            {
                                called = true;
                            }
                        });
                    });
                    afterEach(function ()
                    {
                        called = false;
                    });
                    it("should not call the getter if initGetter has not yet been called", function ()
                    {
                        let obj = new Cls({
                            foo: 1
                        });
                        obj.getConfig('foo', true);
                        assert.isFalse(called);
                    });

                    it("should return the pending value configured on this instance", function ()
                    {
                        let obj = new Cls({
                            foo: 1
                        });
                        assert.equal(obj.getConfig('foo', true), 1);
                    });

                    it("should return the pending value configured on the class", function ()
                    {
                        let obj = new Cls();
                        assert.equal(obj.getConfig('foo', true), 120);
                    });

                });
            });

            describe("setConfig", function ()
            {
                it("should be able to set a config by name", function ()
                {
                    let obj = new Cls();
                    obj.setConfig('foo', 7);
                    assert.equal(obj.getFoo(), 7);
                });
                
                it("should be able to set a group of configs at once", function ()
                {
                    let obj = new Cls();
                    obj.setConfig({
                        foo: 6,
                        bar: 8
                    });
                    assert.equal(obj.getFoo(), 6);
                    assert.equal(obj.getBar(), 8);
                });
                
                it("should call the setter for non-config property if one exits and $_config_strict_$ is false", function ()
                {
                    let arg;
                    Cls = TopJs.define(null, {
                       $_config_strict_$: false,
                        constructor: defaultInitConfig,
                        setBaz (value)
                        {
                            arg = value;
                        }
                    });
                    let obj = new Cls();
                    obj.setConfig({
                        baz: 100
                    });
                    assert.equal(arg, 100);
                });
                
                it("should set non-config properties on the instance when the strict option is false " +
                    "and $_config_strict_$ is false", function ()
                {
                    Cls = TopJs.define(null, {
                        $_config_strict_$: false,
                        constructor: defaultInitConfig
                    });
                    let obj = new Cls();
                    obj.setConfig('baz', 100, {
                        strict: false
                    });
                    assert.equal(obj.baz, 100);
                });
                
                it("should be able to handle undefined/null configs", function(){
                    let obj = new Cls();
                    assert.doesNotThrow(function(){
                        obj.setConfig(null);
                        obj.setConfig(undefined);
                    });
                });
                
                it("should return the current instance", function()
                {
                    let obj = new Cls();
                    assert.equal(obj.setConfig(), obj);
                });
            });
        });
    });
});