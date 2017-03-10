/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * @class TopJs.Config
 * @classdesc
 *
 * This class manage a config property. Instance of this type are created and cached
 * as classes declare their config properties. One instance of this class is created per
 * config property name.
 *
 * ```javascript
 * TopJs.define('MyClass', {
 *   config: {
 *      name: 'softboy'
 *   }
 * })
 * ```
 *
 * This uses the cached `TopJs.Config` instance for the "name" property.
 *
 * When config properties apply options to config properties a prototype chained object is
 * create from the cached instance. For example:
 *
 * ```javascript
 * TopJs.define({
 *   config: {
 *      data: {
 *         name: 42,
 *         lazy: true
 *      }
 *   }
 * });
 * ```
 * This create a prototype chian to the cached "data" instance of `TopJs.Config` and applies
 * The `lazy` option to that new instance. This chained instance is then kept by the
 * `TopJs.Configurator` for that class.
 * @constructor
 */
TopJs.Config = function (name)
{
    let capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);
    this.name = name;
    this.names = {
        internal: '_' + name,
        initializing: 'is' + capitalizedName + 'Initializing',
        apply: 'apply' + capitalizedName,
        update: 'update' + capitalizedName,
        get: 'get' + capitalizedName,
        set: 'set' + capitalizedName,
        initGet: 'initGet' + capitalizedName
    };
    this.root = this;
};

TopJs.apply(TopJs.Config.prototype, /** @lends TopJs.Config.prototype */{
    /**
     * @property {String} name
     * The name of this config property.
     * @readonly
     */
    name: null,

    /**
     * @property {Object} names
     * This object holds the cached names used to lookup properties or methods for this
     * config property. The properties of this object are explained in the context of an
     * example property named "foo".
     *
     * @property {String} names.internal The default backing property ("_foo").
     * @property {String} names.initializing The property that is `true` when the config
     * is being initialized ("isFooInitializing").
     * @property {String} names.apply The name of the applier method ("applyFoo").
     * @property {String} names.update  The name of the updater method ("updateFoo").
     * @property {String} names.get The name of the getter method ("getFoo").
     * @property {String} names.set The name of the setter method ("setFoo").
     * @property {String} names.initGet The name of the initializing getter ("initGetFoo").
     * @property {String} names.changeEvent The name of the change event ("foochange").
     * @readonly
     */
    names: null,

    /**
     * This allows folks to prototype chain on top of these objects and yet still cache
     * generated methods at the bottom of the chain.
     * @private
     */
    root: null,

    /**
     * @property {Function} self The TopJs.Config class Type
     */
    self: TopJs.Config,

    /**
     * @property {Boolean} isConfig for quick type identify
     * @private
     */
    isConfig: true,

    /**
     * @property {Boolean} [cached=false]
     * When set as `true` the config property will be stored on the class prototype once
     * the first instance has had a chance to process the default value.
     * @private
     */
    cached: false,

    /**
     * @property {Boolean} [lazy=false]
     * When set as `true` the config property will not be immediately initialized during
     * the `initConfig` call.
     * @private
     */
    lazy: false,

    /**
     * This function if supplied will be called as classes or instances provide values
     * that need to be combined with inherited values. The function should return the
     * value that will be the config value. Further calls may receive such returned
     * values as `oldValue`.
     * 
     * @property {Function} [merge]
     * @property {Object} merge.newValue The new value to merge with the old.
     * @property {Object} merge.oldValue The current value prior to `newValue` being merged.
     * @property {Object} merge.target The class or instance to which the merged config value
     * will be applied.
     * @property {TopJs.Class} merge.mixinClass The mixin providing the `newValue` or `null` if
     * the `newValue` is not being provided by a mixin.
     */
    merge: null,

    getGetter ()
    {
        return this.getter || (this.root.getter = this.makeGetter());
    },
    
    getSetter ()
    {
        return this.setter || (this.root.setter = this.makeSetter());
    },

    getInitGetter ()
    {
        return this.initGetter || (this.root.initGetter = this.makeInitGetter())
    },

    /**
     * Returns the name of the property that stores this config on the given instance or
     * class prototype.
     * @param {Object} target
     * @return {String}
     */
    getInternalName (target)
    {
        return target.$_config_prefixed_$ ? this.names.internal : this.name;
    },

    mergeNew (newValue, oldValue, target, mixinClass)
    {
        let ret;
        if (!oldValue) {
            ret = newValue;
        } else if (!newValue) {
            ret = oldValue;
        } else {
            ret = TopJs.Object.chain(oldValue);
            for (let key in newValue) {
                if (!mixinClass || !(key in ret)) {
                    ret[key] = newValue[key];
                }
            }
        }
        return ret;
    },

    /**
     * Merges the `newValue` and the `oldValue` assuming that these are basically objects
     * the represent sets. For example something like:
     *
     *      {
     *          foo: true,
     *          bar: true
     *      }
     *
     * The merge process converts arrays like the following into the above:
     *
     *      [ 'foo', 'bar' ]
     *
     * @param {String|String[]|Object} newValue
     * @param {Object} oldValue
     * @param {Boolean} [preserveExisting=false]
     * @return {Object}
     * @private
     */
    mergeSets (newValue, oldValue, preserveExisting = false)
    {
        let ret = oldValue ? TopJs.Object.chain(oldValue) : {};
        let val;
        if (newValue instanceof Array) {
            for (let i = newValue.length; i--; ) {
                val = newValue[i];
                if (!preserveExisting || !(val in ret)) {
                    ret[val] = true;
                }
            }
        } else if (newValue) {
            if (newValue.constructor === Object) {
                for (let i in newValue) {
                    val = newValue[i];
                    if (!preserveExisting || !(i in ret)) {
                        ret[i] = val;
                    }
                }
            } else if (!preserveExisting || !(newValue in ret)) {
                ret[newValue] = true;
            }
        }
        return ret;
    },

    makeGetter ()
    {
        let name = this.name;
        let prefixedName = this.names.internal;
        return function ()
        {
            let internalName = this.$_config_prefixed_$ ? prefixedName : name;
            return this[internalName];
        };
    },

    makeInitGetter ()
    {
        let name = this.name;
        let names = this.names;
        let setName = names.set;
        let getName = names.get;
        let initialzingName = names.initializing;
        return function ()
        {
            this[initialzingName] = true;
            // Remove the initGetter from the instance now that the value has been set.
            delete this[getName];
            this[setName](this.config[name]);
            delete this[initialzingName];
            return this[getName].apply(this, arguments);
        };
    },

    makeSetter ()
    {
        let name = this.name;
        let names = this.names;
        let prefixedName = names.internal;
        let getName = names.get;
        let applyName = names.apply;
        let updateName = names.update;
        // http://jsperf.com/method-call-apply-or-direct
        // http://jsperf.com/method-detect-invoke
        let setter = function (value)
        {
            let internalName = this.$_config_prefixed_$ ? prefixedName : name;
            let oldValue = this[internalName];
            // Remove the initGetter from the instance now that the value has been set.
            delete this[getName];
            if (!this[applyName] || undefined != (value = this[applyName](value, oldValue))) {
                // The old value might have been changed at this point
                // (after the apply call chain) so it should be read again
                if (value !== (oldValue = this[internalName])) {
                    this[internalName] = value;
                    if (this[updateName]) {
                        this[updateName](value, oldValue);
                    }
                }
            }
            return this;
        };
        setter.$_is_default_$ = true;
        return setter;
    }
});

TopJs.apply(TopJs.Config, /** @lends TopJs.Config */{
    /**
     * @private
     */
    map: {},
    
    /**
     * Get the config object by name, if not exist, create a new one.
     *
     * @param {String} name
     */
    get (name)
    {
        let map = TopJs.Config.map;
        return map[name] || (map[name] = new TopJs.Config(name));
    }
});