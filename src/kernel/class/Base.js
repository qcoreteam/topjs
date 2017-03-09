/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let noArgs;
let baseStaticMembers = [];
let proxySetter = TopJs.Function.proxySetter;
function get_config(name, peek)
{
    let ret;
    let cfg;
    let getterName;
    if (name) {
        cfg = TopJs.Config.map[name];
        //<debug>
        if (!cfg) {
            TopJs.Logger.error("Invalid property name for getter: '" + name + "' for '" + me.$_className_$ + "'.");
        }
        //</debug>
        getterName = cfg.names.get;
        if (peek && this.hasOwnProperty(getterName)) {
            ret = this.config[name];
        } else {
            ret = this[getterName]();
        }
    } else {
        retr = this.getCurrentConfig();
    }
    return ret;
}

//<debug>
function make_deprecated_method(oldName, newName, msg)
{
    let message = `"${oldName}" 已经被弃用。`;
    if (msg) {
        message += " " + msg;
    } else if (newName) {
        message += `请使用${newName}代替。`;
    }
    return function ()
    {
        TopJs.raise(message);
    }
}

function add_deprecated_property(object, oldName, newName, message)
{
    if (!message) {
        message = `${oldName}已经被弃用。`;
    }
    if (newName) {
        message += `请使用${newName}代替。`;
    }
    if (message) {
        Object.defineProperty(object, oldName, {
            get: function ()
            {
                TopJs.raise(message);
            },
            set: function (value)
            {
                TopJs.raise(message);
            },
            configurable: true
        });
    }
}

//</debug>
function make_alias(name)
{
    return function (...args)
    {
        return this[name](...args);
    }
}

let Version = TopJs.Version;
let leadingDigitRe = /^\d/;
let oneMember = {};
let aliasOneMember = {};
let Base;
/**
 * @class TopJs.Base
 */
TopJs.Base = Base = function ()
{
};

let BasePrototype = Base.prototype;
let Reaper;
TopJs.Reater = Reaper = {
    delay: 100,
    queue: [],
    timer: null,

    add(obj)
    {
        if (!Reaper.timer) {
            Reaper.timer = TopJs.defer(Reaper.tick, Reaper.delay);
        }
        Reaper.queue.push(obj);
    },

    flush()
    {
        if (Reaper.timer) {
            clearTimeout(Reaper.timer);
            Reaper.timer = null;
        }
        let queue = Reaper.queue;
        let n = queue.length;
        let obj;
        Reaper.queue = [];
        for (let i = 0; i < n; i++) {
            obj = queue[i];
            if (obj && obj.$_reap_$) {
                obj.$_reap_$();
            }
        }
    },

    tick()
    {
        Reaper.timer = null;
        Reaper.flush();
    }
};

// 这些静态属性将会复制到用{@link TopJs.define}定义的所有的类中
TopJs.apply(Base, /** @lends TopJs.Base */{
    /**
     * @private
     */
    $_class_name_$: "TopJs.Base",

    /**
     * @private
     */
    $_is_class_$: true,

    /**
     * 创建当前类的一个实例
     * ```javascript
     *  TopJs.define('My.cool.Class', {
         *     ...
         *  });
     *
     *  My.cool.Class.create({
         *     someConfig: true
         *  });
     * ```
     * 所有的参数都传递给类的构造函数
     * @inheritable
     * @return {Object} 新创建的实例
     */
    create(...args)
    {
        args.unshift(this);
        return TopJs.create(...args);
    },

    /**
     * @private
     * @param {Object} deprecations 废弃定义
     */
    addDeprecations(deprecations)
    {
        let all = [];
        let topJsVersion = TopJs.getVersion();
        //<debug>
        let configurator = this.getConfigurator();
        let displayName = (this.$_class_name_$ || '') + '#';
        //</debug>
        let deprecate, index, message, target,
            enabled, existing, fn, names, oldName, newName, member, statics, version;
        for (let versionSpec in deprecations) {
            if (leadingDigitRe.test(versionSpec)) {
                version = new TopJs.Version(versionSpec);
                version.deprecations = deprecations[versionSpec];
            }
        }
        all.sort(Version.compare);
        for (let index = all.length; index--;) {
            deprecate = (version = all[index]).deprecations;
            target = this.prototype;
            statics = deprecate.statics;
            // If user specifies, say 4.2 compatibility and we have a 5.0 deprecation
            // then that block needs to be "enabled" to "revert" to behaviors prior
            // to 5.0. By default, compatVersion === currentVersion, so there are no
            // enabled blocks. In dev mode we still want to visit all the blocks and
            // possibly add shims to detect use of deprecated methods, but in a build
            // (if the deprecated block remains somehow) we just break the loop.
            enabled = topJsVersion && topJsVersion.lt(version);
            //<debug>
            if (!enabled) {} else
            //</debug>
            if (!enabled) {
                // we won't get here in dev mode when !enabled
                break;
            }
            while (deprecate) {
                names = deprecate.methods;
                if (names) {
                    for (oldName in names) {
                        member = names[oldName];
                        fn = null;
                        if (!member) {
                            /*
                             * Something like:
                             *
                             *      '5.1': {
                             *          methods: {
                             *              removedMethod: null
                             *          }
                             *      }
                             *
                             * Since there is no recovering the method, we always put
                             * on a shim to catch abuse.
                             */
                            //<debug>
                            // The class should not already have a method by the oldName
                            TopJs.Assert.isNotDefinedProp(target, oldName);
                            fn = make_deprecated_method(displayName + oldName);
                            //</debug>
                        } else if (TopJs.isString(member)) {
                            /*
                             * Something like:
                             *
                             *      '5.1': {
                             *          methods: {
                             *              oldName: 'newName'
                             *          }
                             *      }
                             *
                             * If this block is enabled, we just put an alias in place.
                             * Otherwise we need to inject a
                             */
                            //<debug>
                            // The class should not already have a method by the oldName
                            TopJs.Assert.isNotDefinedProp(target, oldName);
                            TopJs.Assert.isDefinedProp(target, member);
                            if (enabled) {
                                // This call to the real method name must be late
                                // bound if it is to pick up overrides and such.
                                fn = make_alias(member);
                            }
                            //<debug>
                            else {
                                fn = make_deprecated_method(displayName + oldName, member);
                            }
                            //</debug>
                        } else {
                            /*
                             * Something like:
                             *
                             *      '5.1': {
                             *          methods: {
                             *              foo: function () { ... }
                             *          }
                             *      }
                             *
                             * Or this:
                             *
                             *      '5.1': {
                             *          methods: {
                             *              foo: {
                             *                  fn: function () { ... },
                             *                  message: 'Please use "bar" instead.'
                             *              }
                             *          }
                             *      }
                             *
                             * Or just this:
                             *
                             *      '5.1': {
                             *          methods: {
                             *              foo: {
                             *                  message: 'Use something else instead.'
                             *              }
                             *          }
                             *      }
                             *
                             * If this block is enabled, and "foo" is an existing
                             * method, than we apply the given method as an override.
                             * If "foo" is not existing, we simply add the method.
                             *
                             * If the block is not enabled and there is no existing
                             * method by that name, than we add a shim to prevent
                             * abuse.
                             */
                            message = '';
                            if (member.message || member.fn) {
                                //<debug>
                                message = member.message;
                                //</debug>
                                member = member.fn;
                            }
                            existing = target.hasOwnProperty(oldName) && target[oldName];
                            if (enabled && member) {
                                member.$_owner_$ = this;
                                member.$_name_$ = oldName;
                                //<debug>
                                member.name = displayName + oldName;
                                //</debug>
                                if (existing) {
                                    member.$_previous_$ = existing;
                                }
                                fn = member;
                            }
                            //<debug>
                            else if (!existing) {
                                fn = make_deprecated_method(displayName + oldName, null,
                                    message);
                            }
                            //</debug>
                        }
                        if (fn) {
                            target[oldName] = fn;
                        }
                    }
                }
                //-------------------------------------
                // Debug only
                //<debug>
                names = deprecate.configs;
                if (names) {
                    //
                    //  '6.0': {
                    //      configs: {
                    //          dead: null,
                    //
                    //          renamed: 'newName',
                    //
                    //          removed: {
                    //              message: 'This config was replaced by pixie dust'
                    //          }
                    //      }
                    //  }
                    //
                    configurator.addDeprecations(names);
                }
                names = deprecate.properties;
                if (names && !enabled) {
                    // For properties about the only thing we can do is , 
                    // add warning shims for accessing them. So if the
                    // block is enabled, we don't want those.
                    for (oldName in names) {
                        newName = names[oldName];
                        if (TopJs.isString(newName)) {
                            add_deprecated_property(target, displayName + oldName, newName);
                        } else if (newName && newName.message) {
                            add_deprecated_property(target, displayName + oldName, null,
                                newName.message);
                        } else {
                            add_deprecated_property(target, displayName + oldName);
                        }
                    }
                }
                //</debug>
                //-------------------------------------
                // reset to handle statics and apply them to the class
                deprecate = statics;
                statics = null;
                target = this;
            }
        }
    },

    /**
     * @private
     * @inheritable
     * @param {Object} parent 属性定义常量对象
     */
    extend(parent)
    {
        let parentPrototype = parent.prototype;
        let prototype;
        let statics;
        prototype = this.prototype = TopJs.Object.chain(parentPrototype);
        prototype.self = this;
        this.superClass = prototype.superClass = parentPrototype;
        if (!parent.$_is_class_$) {
            for (let name in BasePrototype) {
                if (name in prototype) {
                    prototype[name] = BasePrototype[name];
                }
            }
        }
        //<feature classSystem.inheritableStatics>
        // Statics inheritance
        statics = parentPrototype.$_inheritable_statics_$;
        if (statics) {
            for (let name in statics) {
                if (!this.hasOwnProperty(name)) {
                    this[name] = parent[name];
                }
            }
        }
        //</feature>
        if (parent.$_on_extended_$) {
            this.$_on_extended_$ = parent.$_on_extended_$.slice();
        }
        //<feature classSystem.config>
        this.getConfigurator();
        //</feature>
    },

    /**
     * @private
     * @inheritable
     */
    $_on_extended_$: [],

    /**
     * @private
     * @inheritable
     */
    triggerExtended ()
    {
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(this, 'TopJs.Base#triggerExtended', arguments);
        //</debug>
        let callbacks = this.$_on_extended_$;
        let len = callbacks.length;
        let callback;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                callback = callbacks[i];
                callback.func.apply(callback.scope || this, arguments);
            }
        }
    },

    /**
     * @private
     * @inheritable
     */
    onTopJsended(func, scope)
    {
        this.onTopJsended({
            func: func,
            scope: scope
        });
        return this;
    },

    /**
     * 增加或者覆盖当前类
     * ```javascript
     * TopJs.define('SomeSystem.CoolCls', {
     *      ...
     * });
     * SomeSystem.CoolCls.addStatics({
     *      someProperty: 'someValue',      // SomeSystem.CoolCls.someProperty = 'someValue'
     *      method1: function() { ... },    // SomeSystem.CoolCls.method1 = function() { ... };
     *      method2: function() { ... }     // SomeSystem.CoolCls.method2 = function() { ... };
     * });
     * ```
     *
     * @inheritable
     * @param {Object} members 需要添加的属性方法
     * @return {TopJs.Base} this
     */
    addStatics(members)
    {
        this.addMembers(members, true);
        return this;
    },

    /**
     * @private
     * @inheritable
     * @param {Object} members
     */
    addInheritableStatics(members)
    {
        let proto = this.prototype;
        let inheritableStatics = this.$_inheritable_statics_$;
        let name;
        let member;
        let current;
        if (!inheritableStatics) {
            inheritableStatics = TopJs.apply({}, proto.$_inheritable_statics_$);
            this.$_inheritable_statics_$ = proto.$_inheritable_statics_$ = inheritableStatics;
        }
        //<debug>
        let className = TopJs.getClassName(this) + '.';
        //</debug>
        for (let name in members) {
            if (members.hasOwnProperty(name)) {
                member = members[name];
                current = this[name];
                //<debug>
                if (typeof member === "function") {
                    member.name = className + name;
                }
                //</debug>
                if (typeof current === "function" && !current.$_is_class_$ && !current.$_null_fn_$) {
                    member.$_previous_$ = current;
                }
                this[name] = member;
                inheritableStatics[name] = true;
            }
        }
        return this;
    },

    /**
     * 添加方法或者属性到当前的类的原型
     *
     * ```javascript
     * TopJs.define('My.awesome.Cat', {
     *    constructor: function() {
     *       ...
     *    }
     * });
     *
     * My.awesome.Cat.addMembers({
     *   meow: function() {
     *      console.log('Meowww...');
     *   }
     * });
     *
     * let kitty = new My.awesome.Cat();
     * kitty.meow();
     * ```
     * @inheritable
     * @param {Object} members 将要添加到类的属性和方法列表
     * @param {Boolean} [isStatic=false] `true`添加的方法或者属性是静态
     * @param {Boolean} [privacy=false] `true`则添加的为私有属性，只在`debug`模式并且只对方法有用
     */
    addMembers(members, isStatic, privacy)
    {
        let cloneFunction = TopJs.Function.clone;
        let target = isStatic ? this : this.prototype;
        let defaultConfig = !isStatic && target.defaultConfig;
        let privates = members.privates;
        let configs;
        let member;
        let subPrivacy;
        let privateStatics;
        //<debug>
        let displayName = (this.$_class_name_$ || '') + '#';
        //</debug>
        if (privates) {
            // This won't run for normal class private members but will pick up all
            // others (statics, overrides, etc).
            delete members.privates;
            if (!isStatic) {
                privateStatics = privates.statics;
                delete privates.statics;
            }
            //<debug>
            subPrivacy = privates.privacy || privacy || 'framework';
            //</debug>
            this.addMembers(privates, isStatic, subPrivacy);
            if (privateStatics) {
                this.addMembers(privateStatics, true, subPrivacy);
            }
        }

        for (let name in members) {
            if (members.hasOwnProperty(name)) {
                member = members[name];
                //<debug>
                if (privacy === true) {
                    privacy = "framework";
                }
                if (member && member.$_null_fn_$ && privacy !== member.$_privacy_$) {
                    TopJs.raise('Cannot use stock function for private method ' +
                        (this.$_class_name_$ ? this.$_class_name_$ + '#' : '') + name);
                }
                //</debug>
                if (typeof member === "function" && !member.$_is_class_$ && !member.$_null_fn_$) {
                    if (member.$_owner_$) {
                        member = cloneFunction(member);
                    }
                    if (target.hasOwnProperty(name)) {
                        member.$_previous_$ = target[name];
                    }
                    // This information is needed by callParent() and callSuper() as
                    // well as statics()
                    member.$_owner_$ = this;
                    member.$_name_$ = name;
                    //<debug>
                    member.methodName = displayName + name;
                    let existing = target[name];
                    if (privacy) {
                        member.$_privacy_$ = privacy;
                        // The general idea here is that an existing, non-private
                        // method can be marked private. This is because the other
                        // way is strictly forbidden (private method going public)
                        // so if a method is in that gray area it can only be made
                        // private in doc form which allows a derived class to make
                        // it public.
                        if (existing && existing.$_privacy_$ && existing.$_privacy_$ !== privacy) {
                            TopJs.privacyViolation(this, existing, member, isStatic);
                        }
                    } else if (existing && existing.$_privacy_$) {
                        TopJs.privacyViolation(this, existing, member, isStatic);
                    }
                    //</debug>
                    // The last part of the check here resolves a conflict if we have the same property
                    // declared as both a config and a member on the class so that the config wins.
                } else if (defaultConfig && (name in defaultConfig) && !target.config.hasOwnProperty(name)) {
                    // This is a config property so it must be added to the configs
                    // collection not just smashed on the prototype...
                    (configs || (configs = {}))[name] = member;
                    continue;
                }
                target[name] = member;
            }
        }
        if (configs) {
            // Add any configs found in the normal members arena:
            this.addConfig(configs);
        }
        return this;
    },
    
    /**
     * @private
     * @inheritable
     * @param {String} name
     * @param {Object} member
     */
    addMember (name, member)
    {
        oneMember[name] = member;
        this.addMembers(oneMember);
        delete oneMember[name];
        return this;
    },

    /**
     * 将其他的类的属性和方法添加到当前类的原型里面
     *
     * ```javascript
     * 
     * TopJs.define('Bank', {  
     *     money: '$$$',
     *     printMoney: function() {
     *         console.log('$$$$$$$');
     *     }
     * });
     *
     * TopJs.define('Thief', {
     *    ...
     * });
     *
     * Thief.borrow(Bank, ['money', 'printMoney']);
     *
     * let steve = new Thief();
     *
     * console.log(steve.money); // console.logs '$$$'
     * steve.printMoney(); // console.logs '$$$$$$$'
     * 
     * ```
     * @inheritable
     * @private
     * @param {TopJs.Base} fromClass
     * @param {Array/String} members
     * @return {TopJs.Base} this
     */
    borrow (fromClass, members)
    {
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(this, 'TopJs.Base#borrow', arguments);
        //</debug>
        let prototype = fromClass.prototype;
        let membersObj = {};
        let name;
        let len = members.length;
        members = Array.from(members);
        for (let i = 0; i < len; i++) {
            name = members[i];
            membersObj[name] = prototype[name];
        }
        return this.addMembers(membersObj);
    },

    /**
     * 重载这个类的方法，被重载的方法可以通过 {@link TopJs.Base.callParent}进行调用
     * ```javascript
     * 
     * TopJs.define('My.Cat', {
     *    constructor: function() {
     *       console.log("I'm a cat!");
     *    }
     * });
     *
     * My.Cat.override({
     *    constructor: function() {
     *       console.log("I'm going to be a cat!");
     *       this.callParent(arguments);
     *       console.log("Meeeeoooowwww");
     *    }
     * });
     * let kitty = new My.Cat();
     * // console "I'm going to be a cat!"
     * // console "I'm a cat!"
     * // console "Meeeeoooowwww"
     * 
     * ```
     * 我们一般很少直接使用这个方法，我们一般通过{@link TopJs.define}方法进行使用，例如：
     * ```javascript
     * 
     * TopJs.define('My.CatOverride', {
     *    override: 'My.Cat',
     *    constructor: function() {
     *       console.log("I'm going to be a cat!");
     *       this.callParent(arguments);
     *       console.log("Meeeeoooowwww");
     *    }
     * });
     * 
     * ```
     * @inheritable
     * @param {Object} members 将要重载的方法列表
     * @return {TppJs.Base} this class
     */
    override(members)
    {
        let statics = members.statics;
        let inheritableStatics = members.inheritableStatics;
        let config = members.config;
        let mixins = members.mixins;
        let cachedConfig = members.cachedConfig;
        if (statics || inheritableStatics || config) {
            members = TopJs.apply({}, members);
        }
        if (statics) {
            this.addMembers(statics, true);
            delete members.statics;
        }
        if (inheritableStatics) {
            this.addInheritableStatics(inheritableStatics);
            delete members.inheritableStatics;
        }
        if (config) {
            this.addConfig(config);
            delete members.config;
        }
        if (cachedConfig) {
            this.addCachedConfig(cachedConfig);
            delete members.cachedConfig;
        }
        delete members.mixins;
        this.addMembers(members);
        if (mixins) {
            this.mixin(mixins);
        }
        return this;
    },

    /**
     * @protected
     * @static
     * @inheritable
     */
    callParent (args)
    {
        let method;
        // This code is intentionally inlined for the least amount of debugger stepping
        return (method = this.callParent.caller) && (method.$_previous_$ ||
            ((method = method.$owner ? method : method.caller) &&
            method.$_owner_$.superclass.self[method.$_name_$])).apply(this, args || noArgs);
    },

    /**
     * @protected
     * @static
     * @inheritable
     */
    callSuper (args)
    {
        let method;

        // This code is intentionally inlined for the least amount of debugger stepping
        return (method = this.callSuper.caller) &&
            ((method = method.$_owner_ ? method : method.caller) &&
            method.$_owner_$.superclass.self[method.$_name_$]).apply(this, args || noArgs);
    },

    //<feature classSystem.mixins>
    /**
     * Used internally by the mixins pre-processor
     * @private
     * @static
     * @inheritable
     */
    mixin (name, mixinClass)
    {
        if (typeof name != 'string') {
            let mixins = name;
            if (mixins instanceof Array) {
                for (let i = 0, len = mixins.length; i < len; i++) {
                    let mixin = mixins[i];
                    this.mixin(mixin.prototype.mixinId || mixin.$_class_name_$, mixin);
                }
            } else {
                // Not a string or array - process the object form:
                // mixins: {
                //     foo: ...
                // }
                for (let mixinName in mixins) {
                    this.mixin(mixinName, mixins[mixinName]);
                }
            }
            return;
        }
        let mixin = mixinClass.prototype;
        let prototype = this.prototype;
        if (mixin.onClassMixedIn) {
            mixin.onClassMixedIn.call(mixinClass, this);
        }
        if (!prototype.hasOwnProperty('mixins')) {
            if ('mixins' in prototype) {
                prototype.mixins = TopJs.Object.chain(prototype.mixins);
            } else {
                prototype.mixins = {};
            }
        }
        for (key in mixin) {
            let mixinValue = mixin[key];
            if ('mixins' === key) {
                // if 2 superclasses (e.g. a base class and a mixin) of this class both
                // have a mixin with the same id, the first one wins, that is to say,
                // the first mixin's methods to be applied to the prototype will not
                // be overwritten by the second one.  Since this is the case we also
                // want to make sure we use the first mixin's prototype as the mixin
                // reference, hence the "applyIf" below.  A real world example of this
                // is TopJs.Widget which mixes in TopJs.mixin.Observable.  TopJs.Widget can
                // be mixed into subclasses of TopJs.Component, which mixes in
                // TopJs.util.Observable.  In this example, since the first "observable"
                // mixin's methods win, we also want its reference to be preserved.
                TopJs.applyIf(prototype.mixins, mixinValue);
            } else if (!(key === 'mixinId' ||
                key === 'config' ||
                key === '$_inheritable_statics_$') &&
                (prototype[key] === undefined)) {
                prototype[key] = mixinValue;
            }
        }
        //<feature classSystem.inheritableStatics>
        let statics = mixin.$_inheritable_statics_$;
        if (statics) {
            let mixinStatics = {};
            for (let name in statics) {
                if (!this.hasOwnProperty(name)) {
                    mixinStatics[name] = mixinClass[name];
                }
            }
            this.addInheritableStatics(mixinStatics);
        }
        //</feature>
        //<feature classSystem.config>
        if ('config' in mixin) {
            this.addConfig(mixin.config, mixinClass);
        }
        //</feature>
        prototype.mixins[name] = mixin;
        if (mixin.afterClassMixedIn) {
            mixin.afterClassMixedIn.call(mixinClass, this);
        }
        return this;
    },

    //</feature>

    //<feature classSystem.config>
    /**
     * Adds new config properties to this class. This is called for classes when they
     * are declared, then for any mixins that class may define and finally for any
     * overrides defined that target the class.
     *
     * @param {Object} config
     * @param {TopJs.Class} [mixinClass] The mixin class if the configs are from a mixin.
     * @private
     * @static
     */
    addConfig (config, mixinClass)
    {
        let cfg = this.$_config_$ || this.getConfigurator();
        cfg.add(config, mixinClass);
    },

    addCachedConfig (config, isMixin)
    {
        let cached = {};
        let key;
        for (let key in config) {
            cached[key] = {
                cached: true,
                $_value_$: config[key]
            };
        }
        this.addConfig(cached, isMixin);
    },

    /**
     * 返回当前类的`TopJs.Configurator`对象
     *
     * @private
     * @inheritable
     * @return {TopJs.Configurator}
     */
    getConfigurator()
    {
        return this.$_config_$ || new TopJs.Configurator(this);
    },
    //</feature>
    /**
     * Get the current class' name in string format.
     * 
     * ```javascript
     * 
     *     TopJs.define('My.cool.Class', {
     *         constructor: function() {
     *             console.log(this.self.getName()); // console 'My.cool.Class'
     *         }
     *     });
     *
     *     My.cool.Class.getName(); // 'My.cool.Class'
     * ```
     * 
     * @return {String} className
     * @static
     * @inheritable
     */
    getName () 
    {
        return TopJs.getClassName(this);
    },

    /**
     * Create aliases for existing prototype methods. Example:
     * ```javascript
     * 
     *     TopJs.define('My.cool.Class', {
     *         method1: function() { ... },
     *         method2: function() { ... }
     *     });
     *
     *     let test = new My.cool.Class();
     *
     *     My.cool.Class.createAlias({
     *         method3: 'method1',
     *         method4: 'method2'
     *     });
     *     test.method3(); // test.method1()
     *     My.cool.Class.createAlias('method5', 'method3');
     *     test.method5(); // test.method3() -> test.method1()
     *     
     * ```
     * @param {String|Object} alias The new method name, or an object to set multiple aliases. See
     * {@link TopJs.Function#proxySetter proxySetter}
     * @param {String|Object} origin The original method name
     * @static
     * @inheritable
     * @method
     */
    createAlias: proxySetter(function (alias, origin)
    {
        aliasOneMember[alias] = function ()
        {
            return this[origin].apply(this, arguments);
        };
        this.override(aliasOneMember);
        delete aliasOneMember[alias];
    })
});

// Capture the set of static members on TopJs.Base that we want to copy to all
// derived classes. This array is used by TopJs.Class as well as the optimizer.
for (let baseStaticMember in Base) {
    if (Base.hasOwnProperty(baseStaticMember)) {
        baseStaticMembers.push(baseStaticMember);
    }
}

Base.$_static_members_$ = baseStaticMembers;

//<feature classSystem.config>
Base.getConfigurator(); // lazily create now so as not capture in $_static_members_$
//</feature>

Base.addMembers(/** @lends TopJs.Base.prototype */{
    /** @private */
    $_class_name_$: "TopJs.Base",

    /**
     * @property {Boolean} isInstance
     * This value is `true` and is used to identify plain objects from instances of
     * a defined class.
     * @protected
     * @readonly
     */
    isInstance: true,

    /**
     * @property {Boolean} [$configPrefixed]
     * The value `true` causes `config` values to be stored on instances using a
     * property name prefixed with an underscore ("_") character. A value of `false`
     * stores `config` values as properties using their exact name (no prefix).
     * @private
     */
    $_config_prefixed_$: true,

    /**
     * @property {Boolean} [$configStrict]
     * The value `true` instructs the `initConfig` method to only honor values for
     * properties declared in the `config` block of a class. When `false`, properties
     * that are not declared in a `config` block will be placed on the instance.
     * @private
     */
    $_config_strict_$: true,

    /**
     * @property {Boolean} isConfiguring
     * This property is set to `true` during the call to `initConfig`.
     * @protected
     * @readonly
     */
    isConfiguring: false,

    /**
     * @property {Boolean} isFirstInstance
     * This property is set to `true` if this instance is the first of its class.
     * @protected
     * @readonly
     */
    isFirstInstance: false,

    /**
     * @property {Boolean} destroyed
     * This property is set to `true` after the `destroy` method is called.
     * @protected
     */
    destroyed: false,

    /**
     * @property {Boolean} [clearPropertiesOnDestroy=true]
     * Setting this property to `false` will prevent nulling object references
     * on a Class instance after destruction. Setting this to `"async"` will delay
     * the clearing for approx 50ms.
     * @protected
     */
    clearPropertiesOnDestroy: true,

    /**
     * @property {Boolean} [clearPrototypeOnDestroy=false]
     * Setting this property to `true` will result in setting the object's
     * prototype to `null` after the destruction sequence is fully completed.
     * After that, most attempts at calling methods on the object instance
     * will result in "method not defined" exception. This can be very helpful
     * with tracking down otherwise hard to find bugs like runaway Ajax requests,
     * timed functions not cleared on destruction, etc.
     *
     * Note that this option can only work in host environment that support `Object.setPrototypeOf`
     * method, and is only available in debugging mode.
     * @private
     */
    clearPrototypeOnDestroy: false,

    /**
     *  Get the reference to the current class from which this object was instantiated. Unlike {@link TopJs.Base#statics},
     * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance. See {@link TopJs.Base#statics}
     * for a detailed comparison
     *
     * ```javascript
     * 
     * TopJs.define('MyClass', {
     *  statics: {
     *      speciesName: 'ClassName' // MyClass.Cat.speciesName = 'ClassName'
     *  },
     *  constructor: function()
     *  {
     *      console.log(this.self.speciesName); // dependent on this
     *  },
     *  
     *  clone: function()
     *  {
     *      return new this.self();
     *  }
     * });
     *
     * TopJs.define('MyExtendClass', {
     *     extend: 'MyClass',
     *     statics: {
     *         speciesName: 'TopJsendClassName' // MyExtendClass.MyClass.speciesName = 'TopJsendClassName'
     *     }
     * });
     *
     * let parent = new MyClass(); // console 'ClassName'
     * let child = new MyExtendClass(); // console 'TopJsendClassName'
     * let clone = child.clone();
     * console.log(TopJs.getClassName(clone)); // console 'MyExtendClass'
     *
     * ```
     *
     * @property {TopJs.Class} self self Class Object
     * @protected
     */
    self: Base,

    constructor ()
    {
        return this;
    },

    /**
     * Get the reference to the class from which this object was instantiated. Note that unlike {@link TopJs.Base#self},
     * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
     * `this` points to during run-time
     *
     * ```javascript
     * 
     *     TopJs.define('My.Cat', {
     *         statics: {
     *             totalCreated: 0,
     *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
     *         },
     *
     *         constructor: function() {
     *             var statics = this.statics();
     *
     *             console.log(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to
     *                                             // equivalent to: My.Cat.speciesName
     *
     *             console.log(this.self.speciesName);   // dependent on 'this'
     *
     *             statics.totalCreated++;
     *         },
     *
     *         clone: function() {
     *             var cloned = new this.self();   // dependent on 'this'
     *
     *             cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName
     *
     *             return cloned;
     *         }
     *     });
     *
     *
     *     TopJs.define('My.SnowLeopard', {
     *         extend: 'My.Cat',
     *
     *         statics: {
     *             speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'
     *         },
     *
     *         constructor: function() {
     *             this.callParent();
     *         }
     *     });
     *
     *     var cat = new My.Cat();                 // console.logs 'Cat', then console.logs 'Cat'
     *
     *     var snowLeopard = new My.SnowLeopard(); // console.logs 'Cat', then console.logs 'Snow Leopard'
     *
     *     var clone = snowLeopard.clone();
     *     console.log(TopJs.getClassName(clone));         // console.logs 'My.SnowLeopard'
     *     console.log(clone.groupName);                 // console.logs 'Cat'
     *
     *     console.log(My.Cat.totalCreated);             // console.logs 3
     * ```
     * 
     * @protected
     * @return {TopJs.Class}
     */
    statics ()
    {
        let method = this.statics.caller;
        let self = this.self;
        if (!method) {
            return self;
        }
        return method.$_owner_$;
    },

    /**
     * Call the "parent" method of the current method. That is the method previously
     * overridden by derivation or by an override (see {@link TopJs#define}).
     *
     * ```javascript 
     * 
     *      TopJs.define('My.Base', {
     *          constructor: function (x) {
     *              this.x = x;
     *          },
     *
     *          statics: {
     *              method: function (x) {
     *                  return x;
     *              }
     *          }
     *      });
     *
     *      TopJs.define('My.Derived', {
     *          extend: 'My.Base',
     *
     *          constructor: function () {
     *              this.callParent([21]);
     *          }
     *      });
     *
     *      var obj = new My.Derived();
     *
     *      console.log(obj.x);  // console.logs 21
     * ```
     * 
     * This can be used with an override as follows:
     * 
     * ```javascript
     * 
     *      TopJs.define('My.DerivedOverride', {
     *          override: 'My.Derived',
     *
     *          constructor: function (x) {
     *              this.callParent([x*2]); // calls original My.Derived constructor
     *          }
     *      });
     *
     *      var obj = new My.Derived();
     *
     *      console.log(obj.x);  // now console.logs 42
     * ```
     * 
     * This also works with static and private methods.
     * ```javascript
     * 
     *      TopJs.define('My.Derived2', {
     *          extend: 'My.Base',
     *
     *          // privates: {
     *          statics: {
     *              method: function (x) {
     *                  return this.callParent([x*2]); // calls My.Base.method
     *              }
     *          }
     *      });
     *
     *      console.log(My.Base.method(10));     // console.logs 10
     *      console.log(My.Derived2.method(10)); // console.logs 20
     * ```
     * 
     * Lastly, it also works with overridden static methods.
     *
     * ```javascript 
     * 
     *      TopJs.define('My.Derived2Override', {
     *          override: 'My.Derived2',
     *
     *          // privates: {
     *          statics: {
     *              method: function (x) {
     *                  return this.callParent([x*2]); // calls My.Derived2.method
     *              }
     *          }
     *      });
     *
     *      console.log(My.Derived2.method(10); // now console.logs 40
     * ```
     * 
     * To override a method and replace it and also call the superclass method, use
     * {@link #method-callSuper}. This is often done to patch a method to fix a bug.
     *
     * @protected
     * @param {Array|Arguments} args The arguments, either an array or the `arguments` object
     * from the current method, for example: `this.callParent(arguments)`
     * @return {Object} Returns the result of calling the parent method
     */
    callParent (args)
    {
        // NOTE: this code is deliberately as few expressions (and no function calls)
        // as possible so that a debugger can skip over this noise with the minimum number
        // of steps. Basically, just hit Step Into until you are where you really wanted
        // to be.
        let method;
        let superMethod = (method = this.callParent.caller) && (method.$_previous_$ ||
            ((method = method.$_owner_$ ? method : method.caller) &&
            method.$_owner_$.superClass[method.$_name_$]));
        //<debug>
        if (!superMethod) {
            method = this.callParent.caller;
            let parentClass;
            let methodName;
            if (!method.$_owner_$) {
                if (!method.caller) {
                    throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                }
                method = method.caller;
            }
            parentClass = method.$_owner_.superClass;
            methodName = method.$_name_$;
            if (!(methodName in parentClass)) {
                throw new Error("this.callParent() was called but there's no such method (" + methodName +
                    ") found in the parent class (" + (TopJs.getClassName(parentClass) || 'Object') + ")");
            }
        }
        //</debug>
        return superMethod.apply(this, args || noArgs);
    },

    /**
     * This method is used by an **override** to call the superclass method but
     * bypass any overridden method. This is often done to "patch" a method that
     * contains a bug but for whatever reason cannot be fixed directly.
     *
     * Consider:
     * ```javascript
     * 
     *      TopJs.define('TopJs.some.Class', {
     *          method: function () {
     *              console.log('Good');
     *          }
     *      });
     *
     *      TopJs.define('TopJs.some.DerivedClass', {
     *          extend: 'TopJs.some.Class',
     *          
     *          method: function () {
     *              console.log('Bad');
     * 
     *              // ... logic but with a bug ...
     *              
     *              this.callParent();
     *          }
     *      });
     * ```
     *
     * To patch the bug in `TopJs.some.DerivedClass.method`, the typical solution is to create an
     * override:
     * 
     *  ```javascript
     *  
     *      TopJs.define('App.patches.DerivedClass', {
     *          override: 'TopJs.some.DerivedClass',
     *          
     *          method: function () {
     *              console.log('Fixed');
     * 
     *              // ... logic but with bug fixed ...
     *
     *              this.callSuper();
     *          }
     *      });
     * ```
     *
     * The patch method cannot use {@link #method-callParent} to call the superclass
     * `method` since that would call the overridden method containing the bug. In
     * other words, the above patch would only produce "Fixed" then "Good" in the
     * console log, whereas, using `callParent` would produce "Fixed" then "Bad"
     * then "Good".
     *
     * @protected
     * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
     * from the current method, for example: `this.callSuper(arguments)`
     * @returan {Object} Returns the result of calling the superclass method
     */
    callSuper (args)
    {
        // NOTE: this code is deliberately as few expressions (and no function calls)
        // as possible so that a debugger can skip over this noise with the minimum number
        // of steps. Basically, just hit Step Into until you are where you really wanted
        // to be.
        let method;
        let superMethod = (method = this.callSuper.caller) &&
            ((method = method.$_owner_$ ? method : method.caller) &&
            method.$_owner_$.super_class_$[method.$_name_$]);
        //<debug>
        if (!superMethod) {
            method = this.callParent.caller;
            let parentClass;
            let methodName;
            if (!method.$_owner_$) {
                if (!method.caller) {
                    throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                }
                method = method.caller;
            }
            parentClass = method.$_owner_$.superclass;
            methodName = method.$_name_$;
            if (!(methodName in parentClass)) {
                throw new Error("this.callSuper() was called but there's no such method (" + methodName +
                    ") found in the parent class (" + (TopJs.getClassName(parentClass) || 'Object') + ")");
            }
        }
        //</debug>
        return superMethod.apply(this, args || noArgs);
    },

    //<feature classSystem.config>
    /**
     * Initialize configuration for this class. a typical example:
     * ```javascript
     * 
     *     TopJs.define('My.awesome.Class', {
     *         // The default config
     *         config: {
     *             name: 'Awesome',
     *             isAwesome: true
     *         },
     *
     *         constructor: function(config) {
     *             this.initConfig(config);
     *         }
     *     });
     *
     *     let awesome = new My.awesome.Class({
     *         name: 'Super Awesome'
     *     });
     *
     *     console.log(awesome.getName()); // 'Super Awesome'
     *     
     *  ```
     * @protected
     * @param {Object} instanceConfig
     * @return {TopJs.Base} this
     */
    initConfig (instanceConfig)
    {
        let cfg = this.self.getConfigurator();
        this.initConfig = TopJs.emptyFn;
        this.initialConfig = instanceConfig || {};
        cfg.configure(this, instanceConfig);
        return this;
    },

    beforeInitConfig: TopJs.emptyFn,

    /**
     * Returns a specified config property value. If the name parameter is not passed,
     * all current configuration options will be returned as key value pairs.
     * @method
     * @param {String} [name] The name of the config property to get.
     * @param {Boolean} [peek=false] `true` to peek at the raw value without calling the getter.
     * @return {Object} The config property value.
     */
    getConfig: get_config,

    /**
     * Sets a single/multiple configuration options.
     * @method
     * @param {String|Object} name The name of the property to set, or a set of key value pairs to set.
     * @param {Object} [value] The value to set for the name parameter.
     * @return {TopJs.Base} this
     */
    setConfig (name, value, /* private */ options)
    {
        // options can have the following properties:
        // - defaults `true` to only set the config(s) that have not been already set on
        // this instance.
        // - strict `false` to apply properties to the instance that are not configs,
        // and do not have setters.
        if (name) {
            if (typeof name === 'string') {
                config = {};
                config[name] = value;
            } else {
                config = name;
            }
            this.self.getConfigurator().reconfigure(this, config, options);
        }
        return this;
    },

    /**
     * @private
     */
    getCurrentConfig ()
    {
        let cfg = this.self.getConfigurator();
        return cfg.getCurrentConfig(this);
    },

    /**
     * @private
     * @param {String} name config key name
     * @return {boolean}
     */
    hasConfig (name)
    {
        return name in this.defaultConfig;
    },

    /**
     * Returns the initial configuration passed to the constructor when
     * instantiating this class.
     *
     * Given this example TopJs.button.Button definition and instance:
     * ```javascript 
     * 
     *     TopJs.define('Class', {
     *         extend: 'ParentClass',
     *         xtype: 'myclasstype',
     *         name: 'myname',
     *         age: 12
     *     });
     *
     *     var obj = TopJs.create({
     *         xtype: 'myclasstype',
     *         address: 'my address',
     *         text: 'hello world'
     *     });
     * ```
     *
     * Calling `obj.getInitialConfig()` would return an object including the config
     * options passed to the `create` method:
     *
     *     xtype: 'myclasstype',
     *     address: 'my address',
     *     text: 'hello world'
     *
     * Calling `obj.getInitialConfig('address')`returns **'my address'**.
     *
     * @param {String} [name] Name of the config option to return.
     * @return {Object|Mixed} The full config object or a single config value
     * when `name` parameter specified.
     */
    getInitialConfig (name)
    {
        let config = this.config;
        if (!name) {
            return config;
        }
        return config[name];
    },
    //</feature>

    $_links_$: null,

    /**
     * Adds a "destroyable" object to an internal list of objects that will be destroyed
     * when this instance is destroyed (via `{@link #destroy}`).
     * @param {String} name
     * @param {Object} value
     * @return {Object} The `value` passed.
     * @private
     */
    link (name)
    {
        let links = this.$_links_$ || (this.$_links_$ = {});
        links[name] = true;
        this[name] = value;
        return value;
    },

    /**
     * Destroys a given set of `{@link #link linked}` objects. This is only needed if
     * the linked object is being destroyed before this instance.
     * @param {String[]} names The names of the linked objects to destroy.
     * @return {TopJs.Base} this
     * @private
     */
    unlink (names)
    {
        //<debug>
        if (!TopJs.isArray(names)) {
            TopJs.raise('Invalid argument - expected array of strings');
        }
        //</debug>
        for (let i = 0, ln = names.length; i < ln; i++) {
            let link = names[i];
            value = this[link];

            if (value) {
                if (value.isInstance && !value.destroyed) {
                    value.destroy();
                }
            }
            this[link] = null;
        }
    },

    reap ()
    {
        let protectedProps = this.$_no_clear_on_destroy_$;
        for (let prop in this) {
            if ((!protectedProps || !protectedProps[prop]) && this.hasOwnProperty(prop)) {
                let value = this[prop];
                let type = typeof value;
                // Object may retain references to other objects. Functions can do too
                // if they are closures, and most of the *own* function properties
                // are closures indeed. We skip TopJs.emptyFn and the like though,
                // they're mostly harmless.
                if (type === 'object' || (type === 'function' && !value.$_no_clear_on_destroy_$)) {
                    this[prop] = null;
                }
            }
        }
        //<debug>
        // We also want to make sure no methods are called on the destroyed object,
        // because that may lead to accessing nulled properties and resulting exceptions.
        if (this.clearPrototypeOnDestroy && !this.$_veto_clearing_prototype_on_destroy_$ &&
            Object.setPrototypeOf) {
            Object.setPrototypeOf(this, null);
        }
        //</debug>
    },

    /**
     * This method is called to cleanup an object and its resources. After calling
     * this method, the object should not be used any further in any way, including
     * access to its methods and properties.
     *
     * To prevent potential memory leaks, all object references will be nulled
     * at the end of destruction sequence, unless {@link #clearPropertiesOnDestroy}
     * is set to `false`.
     */
    destroy ()
    {
        let links = this.$_links_$;
        let clearPropertiesOnDestroy = this.clearPropertiesOnDestroy;
        if (links) {
            this.$_links_$ = null;
            this.unlink(TopJs.Object.getKeys(links));
        }
        this.destory = TopJs.emptyFn;
        // isDestroyed added for compat reasons
        this.isDestroyed = this.destroyed = true;
        // By this time the destruction is complete. Now we can make sure
        // no objects are retained by the husk of this ex-Instance.
        if (clearPropertiesOnDestroy === true) {
            this.reap();
        } else if (clearPropertiesOnDestroy) {
            //<debug>
            if (clearPropertiesOnDestroy !== 'async') {
                TopJs.raise('Invalid value for clearPropertiesOnDestroy');
            }
            //</debug>
            Reaper.add(this);
        }
    }
});

//<debug>
TopJs.privacyViolation = function (cls, existing, member, isStatic)
{
    let name = member.$_name_$;
    let conflictCls = existing.$_owner_$ && existing.$_owner_$.$_class_name_$;
    let s = isStatic ? 'static ' : '';
    let msg = member.$_privacy_$
        ? 'Private ' + s + member.$_privacy_$ + ' method "' + name + '"'
        : 'Public ' + s + 'method "' + name + '"';

    if (cls.$_class_name_$) {
        msg = cls.$_class_name_$ + ': ' + msg;
    }

    if (!existing.$_privacy_$) {
        msg += conflictCls
            ? ' hides public method inherited from ' + conflictCls
            : ' hides inherited public method.';
    } else {
        msg += conflictCls
            ? ' conflicts with private ' + existing.$_privacy_$ +
            ' method declared by ' + conflictCls
            : ' conflicts with inherited private ' + existing.$_privacy_$ + ' method.';
    }

    let compat = TopJs.getCompatVersion();
    let ver = TopJs.getVersion();

    // When compatibility is enabled, log problems instead of throwing errors.
    if (ver && compat && compat.lt(ver)) {
        TopJs.log.error(msg);
    } else {
        TopJs.raise(msg);
    }
};
//</debug>