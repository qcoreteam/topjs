"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

const serviceMgrNs = TopJs.namespace("TopJs.servicemanager");

TopJs.require("TopJs.servicemanager.ServiceLocatorInterface");

/**
 * @class TopJs.servicemanager.ServiceManager
 */
class ServiceManager extends TopJs.Class {
    constructor(config = {})
    {
        super();
        /**
         * @property {TopJs.servicemanager.Factory.AbstractFactoryInterface[]} abstractFactories
         */
        this.abstractFactories = [];

        /**
         * Whether or not changes may be made to this instance.
         *
         * @property {Boolean}
         */
        this.allowOverride = false;

        /**
         * @property {TopJs.servicemanager.ServiceLocatorInterface} creationContext
         */
        this.creationContext = null;

        /**
         *  A list of already loaded services (this act as a local cache)
         *
         * @property {Object} services
         */
        this.services = {};

        /**
         * A list of factories (either as string name or callable)
         *
         * @property {Object} factories
         */
        this.factories = {};

        /**
         * the alias to real class name map
         *
         * @property {Map} resolvedAliases
         */
        this.resolvedAliases = new Map();

        /**
         * Enable/disable shared instances by service name.
         *
         * @property {Object} shared
         */
        this.shared = {};

        /**
         * @property {String[][]|TopJs.servicemanager.Factory.DelegatorFactoryInterface[][]} delegators
         */
        this.delegators = {};

        /**
         * @property {TopJs.servicemanager.Initializer.InitializerInterface[]} initializers
         */
        this.initializers = [];

        /**
         * Should the services be shared by default?
         *
         * @property {Boolean} sharedByDefault
         */
        this.sharedByDefault = true;

        /**
         * Service manager was already configured?
         *
         * @property {Boolean} configured
         */
        this.configured = false;
        this.creationContext = this;
        this.configure(config);
    }

    get(name)
    {
        let requestedName = name;
        // We start by checking if we have cached the requested service (this
        // is the fastest method).
        if (this.services.hasOwnProperty(requestedName)) {
            return this.services[requestedName];
        }
        name = this.resolvedAliases.has(name) ? this.resolvedAliases.get(name) : name;
        // Next, if the alias should be shared, and we have cached the resolved
        // service, use it.
        if (requestedName !== name && (!this.shared.hasOwnProperty(requestedName) || this.shared[requestedName])
            && this.services.hasOwnProperty(name)) {
            this.services[requestedName] = this.services[name];
            return this.services[name];
        }
        // At this point, we need to create the instance; we use the resolved
        // name for that.
        let object = this.doCreate(name);
        // Cache it for later, if it is supposed to be shared.
        if ((this.sharedByDefault && !this.shared.hasOwnProperty(name)) ||
            (this.shared.hasOwnProperty(name) && this.shared[name])) {
            this.services[name] = object;
        }
        // Also do so for aliases; this allows sharing based on service name used.
        if (requestedName !== name &&
            ((this.sharedByDefault && !this.shared.hasOwnProperty(requestedName)) ||
            (this.shared.hasOwnProperty(requestedName) && this.shared[requestedName]))) {
            this.services[requestedName] = object;
        }
        return object;
    }

    /**
     * Create a new instance with an already resolved name
     *
     * This is a highly performance sensitive method, do not modify if you have not benchmarked it carefully
     *
     * @param {String} resolvedName
     * @param {null|array} options
     * @return mixed
     * @throws TopJs.Error
     */
    doCreate(resolvedName, options = null)
    {
        let object;
        try {
            if (!this.delegators.hasOwnProperty(resolvedName)) {
                // Let's create the service by fetching the factory
                let factory = this.getFactory(resolvedName);
                object = factory(this.creationContext, resolvedName, options);
            } else {
                object = this.createDelegatorFromName(resolvedName, options);
            }
        } catch (ex) {
            TopJs.raise(TopJs.sprintf(
                'Service with name "%s" could not be created. Reason: %s',
                resolvedName, ex.message));
        }
        this.initializers.forEach(function (initializer)
        {
            initializer.init(this.creationContext, object);
        });
        return object;
    }

    has(name)
    {

    }

    /**
     * Indicate whether or not the instance is immutable.
     *
     * @param {Boolean} flag
     * @return {TopJs.servicemanager.ServiceManager}
     */
    setAllowOverride(flag)
    {
        this.allowOverride = !!flag;
        return this;
    }

    /**
     * Retrieve the flag indicating immutability status.
     *
     * @return {Boolean}
     */
    getAllowOverride()
    {
        return this.allowOverride;
    }

    configure(config)
    {
        if (config.hasOwnProperty("services") && !TopJs.isEmpty(config.services)) {
            this.services = TopJs.applyIf(config.services, this.services);
        }
        if (config.hasOwnProperty("invokables") && !TopJs.isEmpty(config.invokables)) {
            let aliases = ServiceManager.createAliasesForInvokables(config.invokables);
            let factories = ServiceManager.createFactoriesForInvokables(config.invokables);
            if (!TopJs.isEmpty(aliases)) {
                config.aliases = config.hasOwnProperty("aliases") ?
                    TopJs.apply(config.aliases, aliases) : aliases;
            }
            config.factories = config.hasOwnProperty("factories") ?
                TopJs.apply(config.factories, factories) : factories;
        }
        if (config.hasOwnProperty("factories") && !TopJs.isEmpty(config.factories)) {
            this.factories = TopJs.applyIf(config.factories, this.factories);
        }
        if (config.hasOwnProperty("delegators")) {
            this.delegators = TopJs.Object.merge(this.delegators, config.hasOwnProperty("delegators"));
        }
    }

    static createAliasesForInvokables(invokables)
    {
        let aliases = {};
        for (let [name, clsName] of Object.entries(invokables)) {
            if (name === clsName) {
                continue;
            }
            aliases[name] = clsName;
        }
        return aliases;
    }

    static createFactoriesForInvokables(invokables)
    {
        let factories = {};
        for (let [name, clsName] of Object.entries(invokables)) {
            factories[clsName] = "TopJs.servicemanager.factory.InvokableFactory";
        }
        return factories;
    }

    /**
     * Get a factory for the given service name
     *
     * @param {String} name
     * @return callable
     * @throws TopJs.Error
     */
    getFactory(name)
    {
        let factory = this.factories.hasOwnProperty(name) ? this.factories[name] : null;
        let lazyLoaded = false;
        if (TopJs.isString(factory) && TopJs.classExists(factory)) {
            factory = TopJs.ClassManager.instanceByName(factory);
            lazyLoaded = true;
        }
        if (factory && (TopJs.isFunction(factory) ||
            (factory.hasOwnProperty(factory) && TopJs.isFunction(factory.invoke)))) {
            if (lazyLoaded) {
                this.factories[name] = factory;
            }
            return factory;
        }
        // Check abstract factories
        let length = this.abstractFactories.length;
        for (let i = 0; i < length; i++) {
            let abstractFactory = this.abstractFactories[i];
            if (abstractFactory.canCareate(this.creationContext, name)) {
                return abstractFactory;
            }
        }
        TopJs.raise(TopJs.sprintf(
            'Unable to resolve service "%s" to a factory; are you certain you provided it during configuration?',
            name
        ));
    }
}


ServiceManager.implements(TopJs.servicemanager.ServiceLocatorInterface);

TopJs.registerClass("TopJs.servicemanager.ServiceManager", ServiceManager);