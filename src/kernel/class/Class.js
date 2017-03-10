/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let Base = TopJs.Base;
let baseStaticMembers = Base.$_static_members_$;
/**
 * @class TopJs.Class
 * @classdesc
 *
 * This is a low level factory that is used by {@link TopJs#define TopJs.define} and should not be used
 * directly in application code.
 *
 * The configs of this class are intended to be used in `TopJs.define` calls to describe the class you
 * are declaring. For example:
 * 
 * ```javascript
 * 
 * TopJs.define('App.util.Thing', {
 *     extend: 'App.util.Other',
 *     alias: 'util.thing',
 *     config: {
 *         foo: 42
 *     }
 * });
 * 
 * ```
 * 
 * TopJs.Class is the factory and **not** the superclass of everything. For the base class that **all**
 * classes inherit from, see {@link TopJs.Base}.
 */
let TopJsClass = TopJs.Class = function (Class, data, onCreated)
{
    if (typeof Class != "function") {
        onCreated = data;
        data = Class;
        Class = null; 
    }
    if (!data) { 
        data = {};
    }
    Class = TopJsClass.create(Class, data);
    TopJsClass.process(Class, data, onCreated);
    return Class;
};

function make_constructor(className)
{
    function constructor()
    {
    }

    //<debug>
    if (className) {
        constructor.className = className;
    }
    //</debug>
    return constructor;
}

TopJs.apply(TopJsClass, /** @lends TopJs.Class */{
    /**
     * @private
     */
    defaultPreprocessors: [],

    /**
     * @private
     */
    preprocessors: {},

    /**
     * @private
     */
    makeCtor: make_constructor,

    /**
     * @private
     */
    onBeforeCreated (Class, data, hooks)
    {
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(Class, '>> TopJs.Class#onBeforeCreated', arguments);
        //</debug>
        Class.addMembers(data);
        hooks.onCreated.call(Class, Class);
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(Class, '<< TopJs.Class#onBeforeCreated', arguments);
        //</debug>
    },

    /**
     * @private
     */
    create: function (Class, data)
    {
        let i = baseStaticMembers.length;
        let name;
        if (!Class) {
            Class = makeCtor(
                //<debug>
                data.$_class_name
                //</debug>
            );
        }
        while (i--) {
            name = baseStaticMembers[i];
            Class[name] = Base[name];
        }
        return Class;
    },

    /**
     * @private
     */
    process(Class, data, onCreated)
    {
        let preprocessorStack = data.preprocessors || TopJsClass.defaultPreprocessors;
        let registeredPreprocessors = this.preprocessors;
        let hooks = {
            onBeforeCreated: this.onBeforeCreated
        };
        let preprocessors = [];
        let preprocessor;
        let preprocessorsProperties;
        let preprocessorProperty;
        delete data.preprocessors;
        Class._classHooks = hooks;
        for (let i = 0, len = preprocessorStack.length; i < len; i++) {
            preprocessor = preprocessorStack[i];
            if (typeof preprocessor == "string") {
                preprocessor = registeredPreprocessors[preprocessor];
                preprocessorsProperties = preprocessor.properties;
                if (preprocessorsProperties === true) {
                    preprocessors.push(preprocessor.func);
                } else if (preprocessorsProperties) {
                    for (let j = 0, subLen = preprocessorsProperties.length; j < subLen; j++) {
                        preprocessorProperty = preprocessorsProperties[j];
                        if (data.hasOwnProperty(preprocessorProperty)) {
                            preprocessors.push(preprocessor.func);
                            break;
                        }
                    }
                }
            } else {
                preprocessors.push(preprocessor);
            }
        }
        hooks.onCreated = onCreated ? onCreated : TopJs.emptyFn;
        hooks.preprocessors = preprocessors;
        this.doProcess(Class, data, hooks);
    },

    doProcess(Class, data, hooks)
    {
        let preprocessors = hooks.preprocessors;
        let preprocessor = preprocessors.shift();
        let doProcess = this.doProcess;
        while (preprocessor) {
            if (preprocessor.call(this, Class, data, hooks, doProcess) === false) {
                return;
            }
            preprocessor = preprocessors.shift();
        }
        hooks.onBeforeCreated.apply(this, arguments);
    },

    registerPreprocessor (name, func, properties, position, relativeTo)
    {
        if (!position) {
            position = 'last';
        }
        if (!properties) {
            properties = [name];
        }
        this.preprocessors[name] = {
            name: name,
            properties: properties || false,
            func: func
        };
        this.setDefaultPreprocessorPosition(name, position, relativeTo);
        return this;
    },

    /**
     * Retrieve a pre-processor callback function by its name, which has been registered before
     *
     * @param {String} name
     * @return {Function} preprocessor
     * @private
     * @static
     */
    getPreprocessor (name)
    {
        return this.preprocessors[name];
    },

    /**
     * @private
     */
    getProprocessors ()
    {
        return this.preprocessors;
    },

    /**
     * Retrieve the array stack of default pre-processors
     * @return {Function[]} defaultPreprocessors
     * @private
     * @static
     */
    getDefaultPreprocessors ()
    {
        return this.defaultPreprocessors;
    },

    /**
     * Set the default array stack of default pre-processors
     *
     * @private
     * @param {Array} preprocessors
     * @return {TopJs.Class} this
     * @static
     */
    setDefaultPreprocessors (preprocessors)
    {
        this.defaultPreprocessors = Array.from(preprocessors);
        return this;
    },

    /**
     * Insert this pre-processor at a specific position in the stack, optionally relative to
     * any existing pre-processor. For example:
     * ```javascript
     * 
     * TopJs.Class.registerPreprocessor('debug', function(cls, data, fn) {
     *     // Your code here
     *     if (fn) {
     *         fn.call(this, cls, data);
     *     }
     * }).setDefaultPreprocessorPosition('debug', 'last');
     * 
     * ```
     * @private
     * @param {String} name The pre-processor name. Note that it needs to be registered with
     * {@link TopJs.Class#registerPreprocessor registerPreprocessor} before this
     * @param {String} offset The insertion position. Four possible values are:
     * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
     * @param {String} relativeName
     * @return {TopJs.Class} this
     * @static
     */
    setDefaultPreprocessorPosition (name, offset, relativeName)
    {
        let defaultPreprocessors = this.defaultPreprocessors;
        let index;
        if (typeof offset == 'string') {
            if (offset === 'first') {
                defaultPreprocessors.unshift(name);
                return this;
            } else if (offset == 'last') {
                defaultPreprocessors.push(name);
                return this;
            }
            offset = (offset === 'after') ? 1 : -1;
        }
        index = Array.indexOf(defaultPreprocessors, relativeName);
        if (index !== -1) {
            Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
        }
        return this;
    }
});

/**
 * The parent class that this class extends. For example:
 *
 * ```javascript
 * 
 * TopJs.define('Person', {
 *     say: function(text) { console.log(text); }
 * });
 *
 * TopJs.define('Developer', {
 *     extend: 'Person',
 *     say: function(text) { this.callParent(["print "+text]); }
 * });
 * 
 * ```
 */
TopJsClass.registerPreprocessor('extend', function (Class, data, hooks)
{
    //<debug>
    TopJs.classSystemMonitor && TopJs.classSystemMonitor(Class, 'TopJs.Class#extendPreProcessor', arguments);
    //</debug>
    let Base = TopJs.Base;
    let basePrototype = Base.prototype;
    let extend = data.extend;
    let Parent;
    delete data.extend;
    if (TopJs.isString(extend)) {
        extend = TopJs.ClassManager.getClassByName(extend);
    }
    if (extend && extend !== Object) {
        Parent = extend;
    } else {
        Parent = Base;
    }
    
    let parentPrototype = Parent.prototype;
    if (!Parent.$_is_class_$) {
        for (let key in basePrototype) {
            if (!parentPrototype[key]) {
                parentPrototype[key] = basePrototype[key];
            }
        }
    }
    Class.extend(Parent);
    Class.triggerExtended.apply(Class, arguments);
    if (data.onClassExtended) {
        Class.onExtended(data.onClassExtended, Class);
        delete data.onClassExtended;
    }
}, true);  // true to always run this preprocessor even w/o "extend" keyword

/**
 * The `privates` config is a list of methods intended to be used internally by the
 * framework.  Methods are placed in a `privates` block to prevent developers from
 * accidentally overriding framework methods in custom classes.
 *
 * ```javascript
 * 
 * TopJs.define('Computer', {
 *     privates: {
 *         runFactory: function(brand) {
 *             // internal only processing of brand passed to factory
 *             this.factory(brand);
 *         }
 *     },
 *     factory: function (brand) {}
 * });
 * 
 *  ```
 * In order to override a method from a `privates` block, the overridden method must
 * also be placed in a `privates` block within the override class.
 *
 * ```javascript
 * 
 * TopJs.define('Override.Computer', {
 *     override: 'Computer',
 *     privates: {
 *         runFactory: function() {
 *             // overriding logic
 *         }
 *     }
 * });
 *     
 * ```
 */
TopJsClass.registerPreprocessor('privates', function (Class, data)
{
    //<debug>
    TopJs.classSystemMonitor && TopJs.classSystemMonitor(Class, 'TopJs.Class#privatePreprocessor', arguments);
    //</debug>

    let privates = data.privates;
    let statics = privates.statics;
    let privacy = privates.privacy || true;
    delete data.privates;
    delete privates.statics;
    // We have to add this preprocessor so that private getters/setters are picked up
    // by the config system. This also catches duplication in the public part of the
    // class since it is an error to override a private method with a public one.
    Class.addMembers(privates, false, privacy);
    if (statics) {
        Class.addMembers(statics, true, privacy);
    }
});

//<feature classSystem.config>
/**
 * List of configuration options with their default values.
 *
 * __Note:__ You need to make sure {@link TopJs.Base#initConfig} is called from your constructor if you are defining
 * your own class or singleton, unless you are extending a Component. Otherwise the generated getter and setter
 * methods will not be initialized.
 *
 * Each config item will have its own setter and getter method automatically generated inside the class prototype
 * during class creation time, if the class does not have those methods explicitly defined.
 *
 * As an example, let's convert the name property of a Person class to be a config item, then add extra age and
 * gender items.
 * 
 * ```javascript
 * 
 * TopJs.define('My.sample.Person', {
 *    config: {
 *        name: 'Mr. Unknown',
 *        age: 0,
 *        gender: 'Male'
 *    },
 *    constructor: function(config) {
 *        this.initConfig(config);
 *        return this;
 *    }
 * });
 * 
 * ```
 *
 * Within the class, this.name still has the default value of "Mr. Unknown". However, it's now publicly accessible
 * without sacrificing encapsulation, via setter and getter methods.
 * 
 * ```javascript
 * 
 * let jacky = new Person({
 *     name: "Jacky",
 *     age: 35
 * });
 *
 * console.log(jacky.getAge());      // console.logs 35
 * console.log(jacky.getGender());   // console.logs "Male"
 * jacky.walk(10);             // console.logs "Jacky is walking 10 steps"
 * jacky.setName("Mr. Nguyen");
 * console.log(jacky.getName());     // console.logs "Mr. Nguyen"
 * jacky.walk(10);             // console.logs "Mr. Nguyen is walking 10 steps"
 *     
 * ```
 * 
 * Notice that we changed the class constructor to invoke this.initConfig() and pass in the provided config object.
 * Two key things happened:
 *
 *  - The provided config object when the class is instantiated is recursively merged with the default config object.
 *  - All corresponding setter methods are called with the merged values.
 *
 * Beside storing the given values, throughout the frameworks, setters generally have two key responsibilities:
 *
 *  - Filtering / validation / transformation of the given value before it's actually stored within the instance.
 *  - Notification (such as firing events) / post-processing after the value has been set, or changed from a
 *    previous value.
 *
 * By standardize this common pattern, the default generated setters provide two extra template methods that you
 * can put your own custom logics into, i.e: an "applyFoo" and "updateFoo" method for a "foo" config item, which are
 * executed before and after the value is actually set, respectively. Back to the example class, let's validate that
 * age must be a valid positive number, and fire an 'agechange' if the value is modified.
 *
 * ```javascript
 *
 * TopJs.define('My.sample.Person', {
 *     config: {
 *             // ...
 *     },
 *     constructor: {
 *             // ...
 *     },
 *     applyAge: function(age) {
 *         if (typeof age !== 'number' || age < 0) {
 *             console.warn("Invalid age, must be a positive number");
 *             return;
 *         }
 *         return age;
 *     },
 *     
 *     updateAge: function(newAge, oldAge) {
 *         // age has changed from "oldAge" to "newAge"
 *         this.fireEvent('agechange', this, newAge, oldAge);
 *     }
 *
 *     // ...
 * });
 *
 * let jacky = new Person({
 *     name: "Jacky",
 *     age: 'invalid'
 * });
 *
 * console.log(jacky.getAge());      // console.logs 0
 * console.log(jacky.setAge(-100));  // console.logs 0
 * console.log(jacky.getAge());      // console.logs 0
 * console.log(jacky.setAge(35));    // console.logs 0
 * console.log(jacky.getAge());      // console.logs 35
 *     
 * ```
 * 
 * In other words, when leveraging the config feature, you mostly never need to define setter and getter methods
 * explicitly. Instead, "apply*" and "update*" methods should be implemented where necessary. Your code will be
 * consistent throughout and only contain the minimal logic that you actually care about.
 *
 * When it comes to inheritance, the default config of the parent class is automatically, recursively merged with
 * the child's default config. The same applies for mixins.
 * @name config
 * @property {Object} config
 * @memberOf TopJs.Class.prototype
 */
TopJsClass.registerPreprocessor('config', function(Class, data) 
{
    // Need to copy to the prototype here because that happens after preprocessors
    if (data.hasOwnProperty('$_config_prefixed_$')) {
        Class.prototype.$_config_prefixed_$ = data.$_config_prefixed_$;
    }
    Class.addConfig(data.config);
    // We need to remove this or it will be applied by addMembers and smash the
    // "config" placed on the prototype by Configurator (which includes *all* configs
    // such as cachedConfigs).
    delete data.config;
});
//</feature>