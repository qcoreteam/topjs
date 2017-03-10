/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
"use strict";

let TopJsConfig = TopJs.Config;
let configPropMap = TopJsConfig.map;
let TopJsObject = TopJs.Object;

/**
 * @class Ext.Configurator
 * @constructor
 * @classdesc
 *
 * This class manages the config properties for a class.
 */
TopJs.Configurator = function (cls)
{
    let prototype = cls.prototype;
    let superCfg = cls.superClass ? cls.superClass.self.$_config_$ : null;

    /**
     * @property {TopJs.Class} cls The class to which this instance is associated.
     * @private
     * @readonly
     */
    this.cls = cls;

    /**
     *  The super class `Configurator` instance or `null` if there is no super class.
     *
     * @property {TopJs.Configurator} superCfg
     * @private
     * @readonly
     */
    this.superCfg = superCfg;

    if (superCfg) {
        /**
         * This object holds an `TopJs.Config` value for each config property keyed by name.
         * This object has as its prototype object the `configs` of its super class.
         *
         * This map is maintained as each property is added via the `add` method.
         *
         * @property {Object} configs
         * @private
         * @readonly
         */
        this.configs = TopJsObject.chain(superCfg.configs);

        /**
         * This object holds a bool value for each cachedConfig property keyed by name.
         *
         * This map is maintained as each property is added via the `add` method.
         *
         * @property {Object} cachedConfigs
         * @private
         * @readonly
         */
        this.cachedConfigs = TopJsObject.chain(superCfg.cachedConfigs);

        /**
         * This object holds a `Number` for each config property keyed by name. This object has
         * as its prototype object the `initMap` of its super class. The value of each property
         * has the following meaning:
         *
         *   * `0` - initial value is `null` and requires no processing.
         *   * `1` - initial value must be set on each instance.
         *   * `2` - initial value can be cached on the prototype by the first instance.
         *
         * Any `null` values will either never be added to this map or (if added by a base
         * class and set to `null` by a derived class) will cause the entry to be 0.
         *
         * This map is maintained as each property is added via the `add` method.
         *
         * @property {Object} initMap
         * @private
         * @readonly
         */
        this.initMap = TopJsObject.chain(superCfg.initMap);

        /**
         * This object holds the default value for each config property keyed by name. This
         * object has as its prototype object the `values` of its super class.
         *
         * This map is maintained as each property is added via the `add` method.
         *
         * @property {Object} values
         * @private
         * @readonly
         */
        this.values = TopJsObject.chain(superCfg.values);

        this.needsFork = superCfg.needsFork;

        //<debug>
        // The reason this feature is debug only is that we would have to create this
        // map for all classes because deprecations could be added to bases after the
        // derived class had created its Configurator.
        this.deprecations = TopJsObject.chain(superCfg.deprecations);
        //</debug>
    } else {
        this.configs = {};
        this.cachedConfigs = {};
        this.initMap = {};
        this.values = {};
        //<debug>
        this.deprecations = {};
        //</debug>
    }
    prototype.config = prototype.defaultConfig = this.values;
    cls.$_config_$ = this;
};

TopJs.Configurator.prototype = {
    self: TopJs.Configurator,
    needsFork: false,

    /**
     * This array holds the properties that need to be set on new instances.
     *
     * This array is populated when the first instance is passed to `configure` (basically
     * when the first instance is created). The entries in `initMap` are iterated to find
     * those configs needing per-instance processing.
     *
     * @property {TopJs.Config[]} initList
     * @private
     */
    initList: null,

    /**
     * This method adds new config properties. This is called for classes when they are
     * declared, then for any mixins that class may define and finally for any overrides
     * defined that target the class.
     *
     * @param {Object} config The config object containing the new config properties.
     * @param {TopJs.Class} [mixinClass] The mixin class if the configs are from a mixin.
     * @private
     */
    add(config, mixinClass)
    {
        let Cls = this.cls;
        let configs = this.configs;
        let cachedConfigs = this.cachedConfigs;
        let initMap = this.initMap;
        let prototype = Cls.prototype;
        let mixinConfigs = mixinClass && mixinClass.$_config_$.configs;
        let values = this.values;
        let cfg;
        let names;
        for (let name in config) {
            let value = config[name];
            let isObject = value && value.constructor === Object;
            let meta = isObject && '$_value_$' in value ? value : null;
            let isCached = false;
            if (meta) {
                isCached = !!meta.cached;
                value = meta.$_value_$;
                isObject = value && value.constructor === Object;
            }
            let merge = meta && meta.merge;
            cfg = configs[name];
            if (cfg) {
                // Only proceed with a mixin if we have a custom merge.
                if (mixinClass) {
                    merge = cfg.merge;
                    if (!merge) {
                        continue;
                    }
                    // Don't want the mixin meta modifying our own
                    meta = null;
                } else {
                    merge = merge || cfg.merge;
                }
                //<debug>
                // This means that we've already declared this as a config in a superclass
                // Let's not allow us to change it here.
                if (!mixinClass && isCached && !cachedConfigs[name]) {
                    TopJs.raise('Redefining config as cached: ' + name + ' in class: ' + Cls.$_class_name_$);
                }
                //</debug>
                // There is already a value for this config and we are not allowed to
                // modify it. So, if it is an object and the new value is also an object,
                // the result is a merge so we have to merge both on to a new object.
                let currentValue = values[name];
                if (merge) {
                    value = merge.call(cfg, value, currentValue, Cls, mixinClass);
                } else if (isObject) {
                    if (currentValue && currentValue.constructor === Object) {
                        // We favor moving the cost of an "extra" copy here because this
                        // is likely to be a rare thing two object values for the same
                        // property. The alternative would be to clone the initial value
                        // to make it safely modifiable even though it is likely to never
                        // need to be modified.
                        value = TopJs.Object.merge({}, currentValue, value);
                    }
                    // else "currentValue" is a primitive so "value" can just replace it
                }
            } else {
                // This is a new property value, so add it to the various maps "as is".
                // In the majority of cases this value will not be overridden or need to
                // be forked.
                if (mixinConfigs) {
                    // Since this is a config from a mixin, we don't want to apply its
                    // meta-ness because it already has. Instead we want to use its cfg
                    // instance:
                    cfg = mixinConfigs[name];
                    meta = null;
                } else {
                    cfg = TopJsConfig.get(name);
                }
                configs[name] = cfg;
                if (cfg.cached || isCached) {
                    cachedConfigs[name] = true;
                }
                // Ensure that the new config has a getter and setter. Because this method
                // is called during class creation as the "config" (or "cachedConfig") is
                // being processed, the user's methods will not be on the prototype yet.
                // 
                // This has the following trade-offs:
                // 
                // - Custom getters are rare so there is minimal waste generated by them.
                // 
                // - Custom setters are more common but, by putting the default setter on
                //   the prototype prior to addMembers, when the user methods are added
                //   callParent can be used to call the generated setter. This is almost
                //   certainly desirable as the setter has some very important semantics
                //   that a custom setter would probably want to preserve by just adding
                //   logic before and/or after the callParent.
                //   
                // - By not adding these to the class body we avoid all the "is function"
                //   tests that get applied to each class member thereby streamlining the
                //   downstream class creation process.
                //
                // We still check for getter and/or setter but primarily for reasons of
                // backwards compatibility and "just in case" someone relied on inherited
                // getter/setter even though the base did not have the property listed as
                // a "config" (obscure case certainly).
                //
                names = cfg.names;
                let s;
                if (!prototype[s = names.get]) {
                    prototype[s] = cfg.getter || cfg.getGetter();
                }
                if (!prototype[s = names.set]) {
                    prototype[s] = cfg.setter || cfg.getSetter();
                }
            }

            if (meta) {
                if (cfg.owner != Cls) {
                    configs[name] = cfg = TopJs.Object.chain(cfg);
                    cfg.owner = Cls;
                }
                TopJs.apply(cfg, meta);
                delete cfg.$_value_$;
            }
            // Fork checks all the default values to see if they are arrays or objects
            // Do this to save us from doing it on each run
            if (!this.needsFork && value && (value.constructor === Object || value instanceof Array)) {
                this.needsFork = true;
            }
            // If the value is non-null, we need to initialize it.
            if (value !== null) {
                initMap[name] = true;
            } else {
                if (prototype.$_config_prefixed_$) {
                    prototype[configs[name].names.internal] = null;
                } else {
                    prototype[configs[name].name] = null;
                }
                if (name in initMap) {
                    // Only set this to false if we already have it in the map, otherwise, just leave it out!
                    initMap[name] = false;
                }
            }
            values[name] = value;
        }
    },

    /**
     * This method configures the given `instance` using the specified `instanceConfig`.
     * The given `instance` should have been created by this object's `cls`.
     *
     * @param {Object} instance The instance to configure.
     * @param {Object} instanceConfig The configuration properties to apply to `instance`.
     * @private
     */
    configure (instance, instanceConfig)
    {
        let configs = this.configs;
        //<debug>
        let deprecations = this.deprecations;
        //</debug>
        let initMap = this.initMap;
        let initListMap = this.initListMap;
        let initList = this.initList;
        let prototype = this.cls.prototype;
        let values = this.values;
        let remaining = 0;
        let firstInstance = !initList;
        let cachedInitList;
        values = this.needsFork ? TopJs.Object.fork(values) : TopJs.Object.chain(values);
        // Let apply/update methods know that the initConfig is currently running.
        instance.isConfiguring = true;
        if (firstInstance) {
            // When called to configure the first instance of the class to which we are
            // bound we take a bit to plan for instance 2+.
            this.initList = initList = [];
            this.initListMap = initListMap = {};
            instance.isFirstInstance = true;
            for (let name in initMap) {
                let cfg = configs[name];
                let isCached = cfg.cached;
                if (initMap[name]) {
                    let names = cfg.names;
                    let value = values[name];
                    if (!prototype[names.set].$_is_default_$ ||
                        prototype[names.apply] ||
                        prototype[names.update] ||
                        (typeof value) === 'Object') {
                        if (isCached) {
                            // This is a cachedConfig, so it needs to be initialized with
                            // the default value and placed on the prototype... but the
                            // instanceConfig may have a different value so the value may
                            // need resetting. We have to defer the call to the setter so
                            // that all of the initGetters are set up first.
                            (cachedInitList || (cachedInitList = [])).push(cfg);
                        } else {
                            // Remember this config so that all instances (including this
                            // one) can invoke the setter to properly initialize it.
                            initList.push(cfg);
                            initListMap[name] = true;
                        }
                        // Point all getters to the initGetters. By doing this here we
                        // avoid creating initGetters for configs that don't need them
                        // and we can easily pick up the cached fn to save the call.
                        instance[names.get] = cfg.initGetter || cfg.getInitGetter();
                    } else {
                        // Non-object configs w/o custom setter, applier or updater can
                        // be simply stored on the prototype.
                        prototype[cfg.getInternalName(prototype)] = value;
                    }
                } else if (isCached) {
                    prototype[cfg.getInternalName(prototype)] = undefined;
                }
            }
        }

        // TODO - we need to combine the cached loop with the instanceConfig loop to
        // avoid duplication of init getter setups (for correctness if a cached cfg
        // calls on a non-cached cfg)
        let ln = cachedInitList && cachedInitList.length;
        if (ln) {
            // This is only ever done on the first instance we configure. Any config in
            // cachedInitList has to be set to the default value to allow any side-effects
            // or transformations to occur. The resulting values can then be elevated to
            // the prototype and this property need not be initialized on each instance.
            for (let i = 0; i < ln; ++i) {
                let internalName = cachedInitList[i].getInternalName(prototype);
                // Since these are cached configs the base class will potentially have put
                // its cached values on the prototype so we need to hide these while we
                // run the inits for our cached configs.
                instance[internalName] = null;
            }
            for (let i = 0; i < ln; ++i) {
                let cfg = cachedInitList[i];
                let names = cfg.names;
                let getter = names.get;

                if (instance.hasOwnProperty(getter)) {
                    instance[names.set](values[cfg.name]);
                    delete instance[getter];
                }
            }

            for (let i = 0; i < ln; ++i) {
                let internalName = cachedInitList[i].getInternalName(prototype);
                prototype[internalName] = instance[internalName];
                delete instance[internalName];
            }
            // The cachedConfigs have all been set to the default values including any of
            // those that may have been triggered by their getter.
        }

        if (firstInstance) {
            // Allow the class to do things once the cachedConfig has been processed.
            // We need to call this method always when the first instance is configured
            // whether or not it actually has cached configs
            if (instance.afterCachedConfig && !instance.afterCachedConfig.$_null_fn_$) {
                instance.afterCachedConfig(instanceConfig);
            }
        }

        // Now that the cachedConfigs have been processed we can apply the instanceConfig
        // and hide the "configs" on the prototype. This will serve as the source for any
        // configs that need to initialize from their initial getter call.
        instance.config = values;
        // There are 2 possibilities here:
        // 1) If it's the first time in this function, we may have had cachedConfigs running.
        //    these configs may have called the getters for any of the normal getters, which
        //    means the initial getters have been clobbered on the instance and won't be able
        //    to be called below when we iterate over the initList. As such, we need to
        //    reinitialize them here, even though we've done it up above.
        //
        // 2) If this the second time in this function, the cachedConfigs won't be processed,
        //    so we don't need to worry about them clobbering config values. However, since
        //    we've already done all our setup, we won't enter into the block that sets the
        //    initGetter, so we need to do it here anyway.
        //
        // Also note, that lazy configs will appear in the initList because we need
        // to spin up the initGetter.

        for (let i = 0, ln = initList.length; i < ln; ++i) {
            let cfg = initList[i];
            instance[cfg.names.get] = cfg.initGetter || cfg.getInitGetter();
        }

        // Important: We are looping here twice on purpose. This first loop serves 2 purposes:
        //
        // 1) Ensure the values collection is fully populated before we call any setters. Since
        // a setter may have an updater/applier, it could potentially call another getter() to grab
        // the value for some other property, so this ensures they are all set on the config object.
        //
        // 2) Ensure that the initGetter is set as the getter for any config that doesn't appear in
        // the initList. We need to ensure that the initGetter is pushed on for everything that we will
        // be setting during init time.
        //
        // The merging in this loop cannot be completed by Ext.merge(), since we do NOT want to merge
        // non-strict values, they should always just be assigned across without modification.
        if (instanceConfig) {
            for (name in instanceConfig) {
                let value = instanceConfig[name];
                let cfg = configs[name];
                //<debug>
                if (deprecations[name]) {
                    TopJs.log.warn(deprecations[name]);

                    if (!cfg) {
                        // If there is a Config for this, perhaps the class is emulating
                        // the old config... If there is not a Config we don't want to
                        // proceed and put the property on the instance. That will likely
                        // hide the bug during development.
                        continue;
                    }
                }
                //</debug>
                if (!cfg) {
                    //<debug>
                    let field = instance.self.prototype[name];
                    if (instance.$_config_strict_$ && (typeof field === 'function') && !field.$_null_fn_$) {
                        // In strict mode you cannot override functions
                        TopJs.raise('Cannot override method ' + name + ' on ' + instance.$_class_name_$ + ' instance.');
                    }
                    //</debug>
                    // Not all "configs" use the config system so in this case simply put
                    // the value on the instance:
                    instance[name] = value;
                } else {
                    // However we still need to create the initial value that needs
                    // to be used. We also need to spin up the initGetter.
                    if (!cfg.lazy) {
                        ++remaining;
                    }
                    if (!initListMap[name]) {
                        instance[cfg.names.get] = cfg.initGetter || cfg.getInitGetter();
                    }
                    if (cfg.merge) {
                        value = cfg.merge(value, values[name], instance);
                    } else if (value && value.constructor === Object) {
                        let valuesKey = values[name];
                        if (valuesKey && valuesKey.constructor === Object) {
                            value = TopJsObject.merge(values[name], value);
                        } else {
                            value = TopJs.clone(value);
                        }
                    }
                }
                values[name] = value;
            }
        }
        // Give the class a chance to hook in prior to initializing the configs.
        if (instance.beforeInitConfig && !instance.beforeInitConfig.$_null_fn_$) {
            if (instance.beforeInitConfig(instanceConfig) === false) {
                return;
            }
        }
        if (instanceConfig) {
            for (name in instanceConfig) {
                if (!remaining) {
                    // For classes that have few proper Config properties, this saves us
                    // from making the full 2 passes over the instanceConfig.
                    break;
                }

                // We can ignore deprecated configs here because we warned about them
                // above. Further, since we only process proper Config's here we would
                // not be skipping them anyway.

                let cfg = configs[name];
                if (cfg && !cfg.lazy) {
                    --remaining;
                    // A proper "config" property so call the setter to set the value.
                    let names = cfg.names;
                    let getter = names.get;

                    // At this point the initGetter may have already been called and
                    // cleared if the getter was called from the applier or updater of a
                    // previously processed instance config. checking if the instance has
                    // its own getter ensures the setter does not get called twice.
                    if (instance.hasOwnProperty(getter)) {
                        instance[names.set](values[name]);

                        // The generated setter will remove the initGetter from the instance
                        // but the user may have provided their own setter so we have to do
                        // this here as well:
                        delete instance[names.get];
                    }
                }
            }
        }
        // Process configs declared on the class that need per-instance initialization.
        for (let i = 0, ln = initList.length; i < ln; ++i) {
            let cfg = initList[i];
            let names = cfg.names;
            let getter = names.get;

            if (!cfg.lazy && instance.hasOwnProperty(getter)) {
                // Since the instance still hasOwn the getter, that means we've set an initGetter
                // and it hasn't been cleared by calling any setter. Since we've never set the value
                // because it wasn't passed in the instance, we go and set it here, taking the value
                // from our definition config and passing it through finally clear off the getter.
                instance[names.set](values[cfg.name]);
                delete instance[getter];
            }
        }

        // Expose the value from the prototype chain (false):
        delete instance.isConfiguring;
    },

    getCurrentConfig (instance)
    {
        let defaultConfig = instance.defaultConfig;
        let config = {};
        for (let name in defaultConfig) {
            config[name] = instance[configPropMap[name].names.get]();
        }
        return config;
    },

    /**
     * Merges the values of a config object onto a base config.
     * @param {TopJs.Base} instance
     * @param {Object} baseConfig
     * @param {Object} config
     * @return {Object} the merged config
     * @private
     */
    merge (instance, baseConfig, config)
    {
        let configs = this.configs;
        for (let name in config) {
            let value = config[name];
            let cfg = configs[name];
            if (cfg) {
                if (cfg.merge) {
                    value = cfg.merge(value, baseConfig[name], instance);
                } else if (value && value.constructor === Object) {
                    let baseValue = baseConfig[name];
                    if (baseValue && baseValue.constructor === Object) {
                        value = TopJs.Object.merge(baseValue, value);
                    } else {
                        value = TopJs.clone(value);
                    }
                }
            }
            baseConfig[name] = value;
        }
        return baseConfig;
    },

    reconfigure (instance, instanceConfig, options)
    {
        let currentConfig = instance.config;
        let configList = [];
        let strict = instance.$_config_strict_$ && !(options && options.strict === false);
        let configs = this.configs;
        let defaults = options && options.defaults;
        for (let name in instanceConfig) {
            if (defaults && instance.hasOwnProperty(name)) {
                continue;
            }
            currentConfig[name] = instanceConfig[name];
            let cfg = configs[name];
            //<debug>
            if (this.deprecations[name]) {
                // See similar logic doc in configure() method.
                TopJs.log.warn(this.deprecations[name]);
                if (!cfg) {
                    continue;
                }
            }
            //</debug>
            if (cfg) {
                // To ensure that configs being set here get processed in the proper order
                // we must give them init getters just in case they depend upon each other
                instance[cfg.names.get] = cfg.initGetter || cfg.getInitGetter();
            } else {
                // Check for existence of the property on the prototype before proceeding.
                // If present on the prototype, and if the property is a function we
                // do not allow it to be overridden by a property in the config object
                // in strict mode (unless the function on the prototype is a emptyFn or
                // identityFn).  Note that we always check the prototype, not the instance
                // because calling setConfig a second time should have the same results -
                // the first call may have set a function on the instance.
                let prop = instance.self.prototype[name];
                if (strict) {
                    if ((typeof prop === 'function') && !prop.$_null_fn_$) {
                        //<debug>
                        TopJs.Error.raise("Cannot override method " + name + " on " + instance.$_class_name_$ + " instance.");
                        //</debug>
                        continue;
                        //<debug>
                    } else {
                        if (name !== 'type') {
                            Ext.log.warn('No such config "' + name + '" for class ' +
                                instance.$_class_name_$);
                        }
                        //</debug>
                    }
                }
            }
            configList.push(name);
        }
        for (let i = 0, len = configList.length; i < len; i++) {
            name = configList[i];
            let cfg = configs[name];

            if (cfg) {
                let names = cfg.names;
                getter = names.get;

                if (instance.hasOwnProperty(getter)) {
                    // Since the instance still hasOwn the getter, that means we've set an initGetter
                    // and it hasn't been cleared by calling any setter. Since we've never set the value
                    // because it wasn't passed in the instance, we go and set it here, taking the value
                    // from our definition config and passing it through finally clear off the getter.
                    instance[names.set](instanceConfig[name]);
                    delete instance[getter];
                }
            } else {
                cfg = configPropMap[name] || TopJs.Config.get(name);
                let names = cfg.names;

                if (instance[names.set]) {
                    instance[names.set](instanceConfig[name]);
                } else {
                    // apply non-config props directly to the instance
                    instance[name] = instanceConfig[name];
                }
            }
        }
    }
};