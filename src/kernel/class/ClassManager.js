/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
import * as BaseCls from "./Base";
import * as Cls from "./Class";

export function mount(TopJs)
{
    BaseCls.mount(TopJs);
    Cls.mount(TopJs);
    let Class = TopJs.Class;
    let makeCtor = TopJs.Class.makeCtor;
    let Manager = TopJs.ClassManager = {};
    let nameLookupStack = [];
    let namespaceCache = {
        TopJs: {
            name: 'TopJs',
            value: TopJs
        }
    };
    /**
     * @class TopJs.ClassManager
     * @singleton
     */
    TopJs.apply(Manager, /** @lends TopJs.ClassManager */{
        /**
         * @property {Object} classes
         * 所有通过`TopJs.ClassManager`定义的类的集合，键是类的名称值是类对象
         * @private
         */
        classes: {},

        /*
         * 'TopJs.foo.Bar': <state enum>
         *
         *  10 = Ext.define called
         *  20 = Ext.define/override called
         *  30 = Manager.existCache[<name>] == true for define
         *  40 = Manager.existCache[<name>] == true for define/override
         *  50 = Manager.isCreated(<name>) == true for define
         *  60 = Manager.isCreated(<name>) == true for define/override
         *
         */
        classState: {},

        /**
         * @private
         */
        existCache: {},

        /** @private */
        instantiators: [],

        /**
         * 检查一个类是否已经定义
         *
         * @param {String} className
         * @return {Boolean} `true`代表类已经定义
         */
        isCreated(className)
        {
            //<debug>
            if (typeof className !== 'string' || className.length < 1) {
                throw new Error("[TopJs.ClassManager] Invalid classname, must be a string and must not be empty");
            }
            //</debug>
            if (Manager.classes[className] || Manager.existCache[className]) {
                return true;
            }
            if (!Manager.lookupName(className, false)) {
                return false;
            }
            Manager.triggerCreated(className);
            return true;
        },

        /**
         * @private
         */
        createdListeners: [],

        /**
         * @private
         */
        nameCreatedListeners: {},

        /**
         * @private
         */
        existsListeners: [],

        /**
         * @private
         */
        nameExistsListeners: {},

        /**
         * @private
         * @param {String} className
         * @param {Number} state
         */
        triggerCreated (className, state)
        {
            Manager.existCache[className] = state || 1;
            Manager.classState[className] += 40;
            Manager.notify(className, Manager.createdListeners, Manager.nameCreatedListeners);
        },

        /**
         * @private
         */
        onCreate (fn, scope, className)
        {
            Manager.addListener(fn, scope, className, Manager.createdListeners,
                Manager.nameCreatedListeners);
        },

        /**
         * @private
         */
        notify(className, listeners, nameListeners)
        {
            for (let i = 0, len = listeners.length; i < len; i++) {
                listener = listeners[i];
                listener.func.call(listener.scope, className);
            }
            let clsNamedListeners = nameListeners[className];
            if (clsNamedListeners) {
                for (let i = 0, len = listeners.length; i < len; i++) {
                    listener = listeners[ji];
                    listener.func.call(listener.scope, name);
                }
                delete nameListeners.delete(name);
            }
        },

        /**
         * @private
         * @param {Function} func
         * @param {Object} scope
         * @param {String|String[]} className
         * @param {Array} listeners
         * @param {Object} nameListeners
         */
        addListener(func, scope, className, listeners, nameListeners)
        {
            if (TopJs.isArray(className)) {
                fn = TopJs.Function.createBarrier(className.length, func, scope);
                for (let i = 0; i < className.length; i++) {
                    this.addListener(func, null, className[i], listeners, nameListeners);
                }
            }
            let listener = {
                func: func,
                scope: scope
            };
            if (className) {
                if (this.isCreated(className)) {
                    func.call(scope, className);
                    return;
                }
                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }
                nameListeners[className].push(listener);
            } else {
                listeners.push(listener);
            }
        },

        /**
         * Supports namespace rewriting.
         * @private
         */
        $_namespace_cache_$: namespaceCache,

        /**
         * See `{@link TopJs#addRootNamespaces Ext.TopJs}`.
         * @private
         */
        addRootNamespaces (namespaces)
        {
            for (let name in namespaces) {
                namespaceCache[name] = {
                    name: name,
                    value: namespaces[name]
                };
            }
        },

        /**
         * Clears the namespace lookup cache. After application launch, this cache can
         * often contain several hundred entries that are unlikely to be needed again.
         * These will be rebuilt as needed, so it is harmless to clear this cache even
         * if its results will be used again.
         * @private
         */
        clearNamespaceCache()
        {
            nameLookupStack.length = 0;
            for (let name in namespaceCache) {
                if (!namespaceCache[name].value) {
                    delete namespaceCache[name];
                }
            }
        },

        /**
         * Return the namespace cache entry for the given a class name or namespace
         *
         * @param {String} namespace The namespace or class name to lookup.
         * @return {Object} The cache entry.
         * @return {String} return.name The leaf name
         * @return {Object} return.parent The entry of the parent namespace
         * @return {Object} return.value The namespace object. This is only set for
         * top-level namespace entries to support renaming them for sandboxing
         * @private
         */
        getNamespaceEntry(namespace)
        {
            if (typeof namespace !== 'string') {
                return namespace;  // assume we've been given an entry object
            }
            let entry = namespaceCache[namespace];
            let i;
            if (!entry) {
                i = namespace.lastIndexOf('.');
                if (i < 0) {
                    entry = {
                        name: namespace
                    };
                } else {
                    entry = {
                        name: namespace.substring(i + 1),
                        parent: Manager.getNamespaceEntry(namespace.substring(0, i))
                    };
                }
                namespaceCache[namespace] = entry;
            }
            return entry;
        },

        /**
         * Return the value of the given "dot path" name. This supports remapping (for use
         * in sandbox builds) as well as auto-creating of namespaces.
         *
         * @param {String} namespace The name of the namespace or class.
         * @param {Boolean} [autoCreate] Pass `true` to create objects for undefined names.
         * @return {Object} The object that is the namespace or class name.
         * @private
         */
        lookupName: function (namespace, autoCreate = true)
        {
            let entry = Manager.getNamespaceEntry(namespace);
            let scope = TopJs.global;
            let parent;
            let i = 0;
            // Put entries on the stack in reverse order: 
            // TopJs.Some.Class => ["Class", "Some", "TopJs"]
            for (let e = entry; e; e = e.parent) {
                // since we process only what we add to the array, and that always
                // starts at index=0, we don't need to clean up the array (that would
                // just encourage the GC to do something pointless).
                nameLookupStack[i++] = e;
            }

            while (scope && i-- > 0) {
                // We'll process entries in top-down order ("TopJs", "Some" then "Class").
                e = nameLookupStack[i];
                parent = scope;
                scope = e.value || scope[e.name];
                if (!scope && autoCreate) {
                    parent[e.name] = scope = {};
                }
            }
            return scope;
        },

        /**
         * Creates a namespace and assign the `value` to the created object.
         *
         *     TopJs.ClassManager.setNamespace('MyCompany.pkg.Example', someObject);
         *
         *     console.log(MyCompany.pkg.Example === someObject); // console true
         *
         * @param {String} namespace
         * @param {Object} value
         */
        setNamespace (namespace, value) 
        {
            let entry = Manager.getNamespaceEntry(namespace);
            let scope = TopJs.global;

            if (entry.parent) {
                scope = Manager.lookupName(entry.parent, true);
            }
            scope[entry.name] = value;
            return value;
        },

        /**
         * @param {String} className
         * @param {Object} data
         * @param {Function} createdFunc
         */
        create(className, data, createdFunc)
        {
            //<debug>
            if (className != null && typeof className !== 'string') {
                throw new Error("[TopJs.define] Invalid class name '" + className + "' specified, must be a non-empty string");
            }
            //</debug>
            let ctor = makeCtor(className);
            if (typeof data === 'function') {
                data = data(ctor);
            }
            //<debug>
            if (className) {
                if (Manager.classes[className]) {
                    TopJs.log.warn("[TopJs.define] Duplicate class name '" + className + "' specified, must be a non-empty string");
                }
            }
            //</debug>
            data.$_class_name_$ = className;
            return new Class(ctor, data, function ()
            {
                
            });
        }
    });

    TopJs.apply(TopJs, /** @lends TopJs */{
        define(className, data, createdFunc)
        {
            //<debug>
            TopJs.classSystemMonitor && Ext.classSystemMonitor(className, 'ClassManager#define', arguments);
            //</debug>
            if (data.override) {
                Manager.classState[className] = 20;
                return Manager.createOverride.apply(Manager, arguments);
            }
            Manager.classState[className] = 10;
            return Manager.create.apply(Manager, arguments);
        }
    });
}