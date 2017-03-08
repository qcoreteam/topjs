/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
"use strict";
require("./Config");
require("./Configurator");
require("./Base");
require("./Class");

let Class = TopJs.Class;
let makeCtor = Class.makeCtor;
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
 * @classdesc

 * TopJs.ClassManager manages all classes and handles mapping from string class name to
 * actual class objects throughout the whole framework. It is not generally accessed directly, rather through
 * these convenient shorthands:
 *
 * - {@link TopJs#define TopJs.define}
 * - {@link TopJs#create TopJs.create}
 * - {@link TopJs#getClass TopJs.getClass}
 * - {@link TopJs#getClassName TopJs.getClassName}
 *
 * ### Basic syntax:
 *
 *     TopJs.define(className, properties);
 *
 * in which `properties` is an object represent a collection of properties that apply to the class. See
 * {@link TopJs.ClassManager#create} for more detailed instructions.
 * ```javascript
 *     TopJs.define('Person', {
 *          name: 'Unknown',
 *
 *          constructor: function(name) {
 *              if (name) {
 *                  this.name = name;
 *              }
 *          },
 *
 *          eat: function(foodType) {
 *              console.log("I'm eating: " + foodType);
 *
 *              return this;
 *          }
 *     });
 *
 *     let aaron = new Person("Aaron");
 *     aaron.eat("Sandwich"); // console.log("I'm eating: Sandwich");
 *  ```
 * TopJs.Class has a powerful set of extensible {@link TopJs.Class#registerPreprocessor pre-processors} which takes care of
 * everything related to class creation, including but not limited to inheritance, mixins, configuration, statics, etc.
 *
 * ### Inheritance:
 *
 *     TopJs.define('Developer', {
 *          extend: 'Person',
 *
 *          constructor: function(name, isGeek) {
 *              this.isGeek = isGeek;
 *
 *              // Apply a method from the parent class' prototype
 *              this.callParent([name]);
 *          },
 *
 *          code: function(language) {
 *              console.log("I'm coding in: " + language);
 *
 *              this.eat("Bugs");
 *
 *              return this;
 *          }
 *     });
 *
 *     let jacky = new Developer("Jacky", true);
 *     jacky.code("JavaScript"); // console.log("I'm coding in: JavaScript");
 *                               // console.log("I'm eating: Bugs");
 *
 * See {@link TopJs.Base#callParent} for more details on calling superclass' methods
 *
 * ### Mixins:
 *  ```javascript
 *     TopJs.define('CanPlayGuitar', {
 *          playGuitar: function() {
 *             console.log("F#...G...D...A");
 *          }
 *     });
 *
 *     TopJs.define('CanComposeSongs', {
 *          composeSongs: function() { ... }
 *     });
 *
 *     TopJs.define('CanSing', {
 *          sing: function() {
 *              console.log("For he's a jolly good fellow...")
 *          }
 *     });
 *
 *     TopJs.define('Musician', {
 *          extend: 'Person',
 *
 *          mixins: {
 *              canPlayGuitar: 'CanPlayGuitar',
 *              canComposeSongs: 'CanComposeSongs',
 *              canSing: 'CanSing'
 *          }
 *     })
 *
 *     TopJs.define('CoolPerson', {
 *          extend: 'Person',
 *
 *          mixins: {
 *              canPlayGuitar: 'CanPlayGuitar',
 *              canSing: 'CanSing'
 *          },
 *
 *          sing: function() {
 *              console.log("Ahem....");
 *
 *              this.mixins.canSing.sing.call(this);
 *
 *              console.log("[Playing guitar at the same time...]");
 *
 *              this.playGuitar();
 *          }
 *     });
 *
 *     let me = new CoolPerson("Jacky");
 *
 *     me.sing(); // console.log("Ahem...");
 *                // console.log("For he's a jolly good fellow...");
 *                // console.log("[Playing guitar at the same time...]");
 *                // console.log("F#...G...D...A");
 *  ```
 * ### Config:
 *  ```javascript
 *     TopJs.define('SmartPhone', {
 *          config: {
 *              hasTouchScreen: false,
 *              operatingSystem: 'Other',
 *              price: 500
 *          },
 *
 *          isExpensive: false,
 *
 *          constructor: function(config) {
 *              this.initConfig(config);
 *          },
 *
 *          applyPrice: function(price) {
 *              this.isExpensive = (price > 500);
 *
 *              return price;
 *          },
 *
 *          applyOperatingSystem: function(operatingSystem) {
 *              if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {
 *                  return 'Other';
 *              }
 *
 *              return operatingSystem;
 *          }
 *     });
 *
 *     let iPhone = new SmartPhone({
 *          hasTouchScreen: true,
 *          operatingSystem: 'iOS'
 *     });
 *
 *     iPhone.getPrice(); // 500;
 *     iPhone.getOperatingSystem(); // 'iOS'
 *     iPhone.getHasTouchScreen(); // true;
 *
 *     iPhone.isExpensive; // false;
 *     iPhone.setPrice(600);
 *     iPhone.getPrice(); // 600
 *     iPhone.isExpensive; // true;
 *
 *     iPhone.setOperatingSystem('AlienOS');
 *     iPhone.getOperatingSystem(); // 'Other'
 *  ```
 * ### Statics:
 *  ```javascript
 *     TopJs.define('Computer', {
 *          statics: {
 *              factory: function(brand) {
 *                 // 'this' in static methods refer to the class itself
 *                  return new this(brand);
 *              }
 *          },
 *
 *          constructor: function() { ... }
 *     });
 *
 *     let dellComputer = Computer.factory('Dell');
 *  ```
 * Also see {@link TopJs.Base#statics} and {@link TopJs.Base#self} for more details on accessing
 * static properties within class methods
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
     *  10 = TopJs.define called
     *  20 = TopJs.define/override called
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
        let listener;
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
     * See `{@link TopJs#addRootNamespaces TopJs.TopJs}`.
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
        let e;
        // Put entries on the stack in reverse order: 
        // TopJs.Some.Class => ["Class", "Some", "TopJs"]
        for (e = entry; e; e = e.parent) {
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
    /**
     * Defines a class or override. A basic class is defined like this:
     *  ```javascript
     *      TopJs.define('My.awesome.Class', {
     *          someProperty: 'something',
     *          someMethod: function(s) {
     *              console.log(s + this.someProperty);
     *          }
     *
     *          ...
     *      });
     *
     *      var obj = new My.awesome.Class();
     *
     *      obj.someMethod('Say '); // console.logs 'Say something'
     *  ```
     * To create an anonymous class, pass `null` for the `className`:
     *  ```javascript
     *      TopJs.define(null, {
     *          constructor: function () {
     *              // ...
     *          }
     *      });
     *  ```
     * In some cases, it is helpful to create a nested scope to contain some private
     * properties. The best way to do this is to pass a function instead of an object
     * as the second parameter. This function will be called to produce the class
     * body:
     *  ```javascript
     *      TopJs.define('MyApp.foo.Bar', function () {
     *          var id = 0;
     *
     *          return {
     *              nextId: function () {
     *                  return ++id;
     *              }
     *          };
     *      });
     *  ```
     * _Note_ that when using override, the above syntax will not override successfully, because
     * the passed function would need to be executed first to determine whether or not the result
     * is an override or defining a new object. As such, an alternative syntax that immediately
     * invokes the function can be used:
     *  ```javascript
     *      TopJs.define('MyApp.override.BaseOverride', function () {
     *          var counter = 0;
     *
     *          return {
     *              override: 'TopJs.Component',
     *              logId: function () {
     *                  console.log(++counter, this.id);
     *              }
     *          };
     *      }());
     * ```
     *
     * When using this form of `TopJs.define`, the function is passed a reference to its
     * class. This can be used as an efficient way to access any static properties you
     * may have:
     *  ```javascript
     *      TopJs.define('MyApp.foo.Bar', function (Bar) {
     *          return {
     *              statics: {
     *                  staticMethod: function () {
     *                      // ...
     *                  }
     *              },
     *
     *              method: function () {
     *                  return Bar.staticMethod();
     *              }
     *          };
     *      });
     *  ```
     * To define an override, include the `override` property. The content of an
     * override is aggregated with the specified class in order to extend or modify
     * that class. This can be as simple as setting default property values or it can
     * extend and/or replace methods. This can also extend the statics of the class.
     *
     * One use for an override is to break a large class into manageable pieces.
     *
     *      // File: /src/app/Panel.js
     *  ```javascript
     *      TopJs.define('My.app.Panel', {
     *          extend: 'TopJs.panel.Panel',
     *          requires: [
     *              'My.app.PanelPart2',
     *              'My.app.PanelPart3'
     *          ]
     *
     *          constructor: function (config) {
     *              this.callParent(arguments); // calls TopJs.panel.Panel's constructor
     *              //...
     *          },
     *
     *          statics: {
     *              method: function () {
     *                  return 'abc';
     *              }
     *          }
     *      });
     *
     *      // File: /src/app/PanelPart2.js
     *      TopJs.define('My.app.PanelPart2', {
     *          override: 'My.app.Panel',
     *
     *          constructor: function (config) {
     *              this.callParent(arguments); // calls My.app.Panel's constructor
     *              //...
     *          }
     *      });
     *  ```
     * Another use of overrides is to provide optional parts of classes that can be
     * independently required. In this case, the class may even be unaware of the
     * override altogether.
     *  ```javascript
     *      TopJs.define('My.ux.CoolTip', {
     *          override: 'TopJs.tip.ToolTip',
     *
     *          constructor: function (config) {
     *              this.callParent(arguments); // calls TopJs.tip.ToolTip's constructor
     *              //...
     *          }
     *      });
     * ```
     *
     * The above override can now be required as normal.
     *  ```javascript
     *      TopJs.define('My.app.App', {
     *          requires: [
     *              'My.ux.CoolTip'
     *          ]
     *      });
     * ```
     * Overrides can also contain statics, inheritableStatics, or privates:
     * 
     * ```javascript
     *      TopJs.define('My.app.BarMod', {
     *          override: 'TopJs.foo.Bar',
     *
     *          statics: {
     *              method: function (x) {
     *                  return this.callParent([x * 2]); // call TopJs.foo.Bar.method
     *              }
     *          }
     *      });
     *  ```
     * Starting in version 4.2.2, overrides can declare their `compatibility` based
     * on the framework version or on versions of other packages. For details on the
     * syntax and options for these checks, see `TopJs.checkVersion`.
     *
     * The simplest use case is to test framework version for compatibility:
     * ```javascript
     *      TopJs.define('App.overrides.grid.Panel', {
     *          override: 'TopJs.grid.Panel',
     *
     *          compatibility: '4.2.2', // only if framework version is 4.2.2
     *
     *          //...
     *      });
     * ```
     * An array is treated as an OR, so if any specs match, the override is
     * compatible.
     * ```javascript
     *      TopJs.define('App.overrides.some.Thing', {
     *          override: 'Foo.some.Thing',
     *
     *          compatibility: [
     *              '4.2.2',
     *              'foo@1.0.1-1.0.2'
     *          ],
     *
     *          //...
     *      });
     * ```
     * To require that all specifications match, an object can be provided:
     * ```javascript
     *      TopJs.define('App.overrides.some.Thing', {
     *          override: 'Foo.some.Thing',
     *
     *          compatibility: {
     *              and: [
     *                  '4.2.2',
     *                  'foo@1.0.1-1.0.2'
     *              ]
     *          },
     *
     *          //...
     *      });
     *  ```
     * Because the object form is just a recursive check, these can be nested:
     * ```javascript
     *      TopJs.define('App.overrides.some.Thing', {
     *          override: 'Foo.some.Thing',
     *
     *          compatibility: {
     *              and: [
     *                  '4.2.2',  // exactly version 4.2.2 of the framework *AND*
     *                  {
     *                      // either (or both) of these package specs:
     *                      or: [
     *                          'foo@1.0.1-1.0.2',
     *                          'bar@3.0+'
     *                      ]
     *                  }
     *              ]
     *          },
     *
     *          //...
     *      });
     *  ```
     *
     * @param {String} className The class name to create in string dot-namespaced format, for example:
     * 'My.very.awesome.Class', 'FeedViewer.plugin.CoolPager'
     * It is highly recommended to follow this simple convention:
     *  - The root and the class name are 'CamelCased'
     *  - Everything else is lower-cased
     * Pass `null` to create an anonymous class.
     * @param {Object} data The key - value pairs of properties to apply to this class. Property names can be of any valid
     * strings, except those in the reserved listed below:
     *
     *  - {@link TopJs.Class#cfg-alias alias}
     *  - {@link TopJs.Class#cfg-alternateClassName alternateClassName}
     *  - {@link TopJs.Class#cfg-cachedConfig cachedConfig}
     *  - {@link TopJs.Class#cfg-config config}
     *  - {@link TopJs.Class#cfg-extend extend}
     *  - {@link TopJs.Class#cfg-inheritableStatics inheritableStatics}
     *  - {@link TopJs.Class#cfg-mixins mixins}
     *  - {@link TopJs.Class#cfg-override override}
     *  - {@link TopJs.Class#cfg-privates privates}
     *  - {@link TopJs.Class#cfg-requires requires}
     *  - `self`
     *  - {@link TopJs.Class#cfg-singleton singleton}
     *  - {@link TopJs.Class#cfg-statics statics}
     *  - {@link TopJs.Class#cfg-uses uses}
     *
     * @param {Function} [createdFunc] Callback to execute after the class is created, the execution scope of which
     * (`this`) will be the newly created class itself.
     * @return {TopJs.Base}
     */
    define(className, data, createdFunc)
    {
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(className, 'ClassManager#define', arguments);
        //</debug>
        if (data.override) {
            Manager.classState[className] = 20;
            return Manager.createOverride.apply(Manager, arguments);
        }
        Manager.classState[className] = 10;
        return Manager.create.apply(Manager, arguments);
    }
});