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
    }
};