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
import {sep as dir_separator, dirname} from 'path';
import {is_object, in_array, rtrim, is_string, change_str_at, file_exist} from '../internal/Funcs';
import Namespace from "./Namespace";

let Class = TopJs.Class;
let makeCtor = Class.makeCtor;
let Manager = TopJs.ClassManager = {};

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
     * @readonly
     * @static
     * @property {string} NS_SEPARATOR 名称空间分隔符
     */
    NS_SEPARATOR: ".",
    /**
     * @readonly
     * @static
     * @property {string} LOAD_NS 参数批量设置的时候名称空间项识别码常量
     */
    LOAD_NS: "namespaces",

    /**
     * @readonly
     * @static
     * @property {string} NAMESPACE_ACCESSOR_KEY 对象代理访问时候获取名称空间对象的特殊键名
     */
    NAMESPACE_ACCESSOR_KEY: "__NAMESPACE_ACCESSOR_KEY__",

    /**
     * @protected
     * @property {Map} namespaces 名称空间到类的文件夹之间的映射
     */
    namespaces: new Map(),

    /**
     * @protected
     * @property {Map} namespaceCache the namespaces lookup cache
     */
    namespaceCache: new Map(),

    /**
     * @property {Map} classes
     * 
     * All classes which were defined through the ClassManager. Keys are the
     * name of the classes and the values are references to the classes.
     * @private
     */
    classes: new Map(),

    /*
     * 'TopJs.foo.Bar': <state enum>
     *
     *  10 = TopJs.define called
     *  20 = TopJs.define/override called
     *  30 = Manager.existCache[<name>] == true for define
     *  40 = Manager.existCache[<name>] == true for define/override
     *  50 = Manager.isCreated(<name>) == true for define
     *  60 = Manager.isCreated(<name>) == true for define/override
     */
    classState: {},

    /**
     * @private
     */
    existCache: {},

    /** @private */
    instantiators: [],

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
     */
    postProcessors: {},

    /**
     * @private
     */
    defaultPostProcessors: [],

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
        if (Manager.classes.has(className) || Manager.existCache[className]) {
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
     * 注册一个名称空间到对应文件夹的映射项
     *
     * @param {string} namespace
     * @param {string} directory
     * @returns {TopJs.Namespace}
     */
    registerNamespace(namespace, directory)
    {
        let sep = Manager.NS_SEPARATOR;
        namespace = rtrim(namespace, sep);
        let parts = namespace.split(sep);
        let nsObj;
        if (this.namespaces.has(parts[0])) {
            nsObj = this.namespaces.get(parts[0]);
        } else {
            nsObj = new Namespace(parts[0], null, null);
            this.namespaces.set(parts[0], nsObj);
        }
        //子名称空间
        for (let i = 1; i < parts.length; i++) {
            let childNsObj = nsObj.getChildNamespace(parts[i]);
            if (null === childNsObj) {
                nsObj = new Namespace(parts[i], nsObj, null);
            } else {
                nsObj = childNsObj;
            }
        }
        try {
            nsObj.setDirectory(this.normalizeDirectory(directory));
        } catch (err) {}
        return nsObj;
    },

    /**
     * 一次性注册多个名称空间到文件目录的映射, `namespace`参数结构如下：
     * ```javascript
     * {
     *    namespace1: dir1,
     *    namespace2: dir2,
     *    ...
     * }
     * ```
     *
     * @param {Object} namespaces 需要注册的名称空间类型
     * @returns {TopJs.ClassManager}
     */
    registerNamespaces(namespaces)
    {
        if (!is_object(namespaces)) {
            throw new Error('arg namespaces must be object');
        }
        for (let [namespace, direcotry] of Object.entries(namespaces)) {
            this.registerNamespace(namespace, direcotry);
        }
        return this;
    },

    /**
     * 通过名称空间名称，获取底层名称空间对象引用
     *
     * @param {Object} name 名称空间的名称
     * @returns {TopJs.Namespace}
     */
    getNamespace(name)
    {
        let ns;
        if (this.namespaceCache.has(name)) {
            ns = this.namespaceCache.get(name);
        } else {
            ns = this.createNamespace(name);
            this.namespaceCache.set(name, ns);
        }
        return ns;
    },

    /**
     * @param {String} namespace 名称空间的字符串描述
     * @return {Namespace}
     */
    createNamespace(namespace)
    {
        let parts = namespace.split(Manager.NS_SEPARATOR);
        let ns;
        let partName;
        let parentNs;
        if (this.namespaces.has(parts[0])) {
            ns = this.namespaces.get(parts[0]);
        } else {
            ns = new Namespace(parts[0], null, parts[0]);
            TopJs.global[parts[0]] = ns;
        }
        for (let i = 1; i < parts.length; i++) {
            partName = parts[i];
            parentNs = ns;
            ns = ns.getChildNamespace(partName);
            if (null == ns) {
                ns = new Namespace(partName, parentNs, parentNs.directory + dir_separator + filename);
            }
        }
        return ns;
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
            if (Manager.classes.has(className)) {
                TopJs.log.warn("[TopJs.define] Duplicate class name '" + className + "' specified, must be a non-empty string");
            }
        }
        //</debug>
        data.$_class_name_$ = className;
        return new Class(ctor, data, function ()
        {
            let postProcessorStack = data.postProcessors || Manager.defaultPostProcessors;
            let registeredPostProcessors = Manager.postProcessors;
            let postProcessors = [];
            delete data.postProcessors;
            for (let i = 0, len = postProcessorStack.length; i < len; i++) {
                let postProcessor = postProcessorStack[i];
                if (typeof postProcessor === "string") {
                    postProcessor = registeredPostProcessors[postProcessor];
                    let postProcessorProperties = postProcessor.properties;
                    if (postProcessorProperties === true) {
                        postProcessors.push(postProcessor.func);
                    } else if (postProcessorProperties) {
                        for (let j = 0, subLen = postProcessorProperties.length; j < subLen; j++) {
                            let postProcessorProperty = postProcessorProperties[j];
                            if (data.hasOwnProperty(postProcessorProperty)) {
                                postProcessors.push(postProcessor.func);
                                break;
                            }
                        }
                    }
                } else {
                    postProcessors.push(postProcessor);
                }
            }
            data.postProcessors = postProcessors;
            data.createdFunc = createdFunc;
            Manager.processCreate(className, this, data);
        });
    },
    
    processCreate (className, cls, clsData)
    {
        let postProcessor = clsData.postProcessors.shift();
        let createFunc = clsData.createFunc;
        if (!postProcessor) {
            //<debug>
            TopJs.classSystemMonitor && TopJs.classSystemMonitor(className, 'TopJs.ClassManager#classCreated', arguments);
            //</debug>
            if (className) {
                this.registerToClassMap(className, cls);
            }
            
            delete cls._classHooks;
            if (createFunc) {
                createFunc.call(cls, cls);
            }
            if (className) {
                this.triggerCreated(className);
            }
            return;
        } 
        if (postProcessor.call(this, className, cls, clsData, this.processCreate) !== false) {
            this.processCreate(className, cls, clsData);
        }
    },

    /**
     * @param {String} name the class name
     * @param {Object} value The Class Object
     * @return {TopJs.ClassManager} this
     */
    registerToClassMap (name, value)
    {
        let targetName = Manager.getClassName(value);
        Manager.classes.set(name, Manager.mountClsToNamespace(name, value));
        if (targetName && targetName !== name) {
            //Manager.addAlternate(targetName, name);
        }
        return this;
    },
    
    mountClsToNamespace (fullClassName, cls)
    {
        let index = fullClassName.lastIndexOf('.');
        let targetScope = TopJs.global;
        let ret;
        if (index < 0) {
            // mount at global scope
            if (targetScope.hasOwnProperty(fullClassName)) {
                //<debug>
                TopJs.log.warn(`[TopJs.ClassManager.mountClsToNamespace] class ${fullClassName} 
                already exist at target scope`);
                //</debug>
                return targetScope[fullClassName];
            }
            ret = targetScope[fullClassName] = cls;
        } else {
            let clsName = fullClassName.substring(index + 1);
            targetScope = this.getNamespace(fullClassName.substring(0, index));
            ret = targetScope[clsName] = cls;
        }
        return ret;
    },

    /**
     * Get the name of the class by its reference or its instance. This is
     * usually invoked by the shorthand {@link TopJs#getClassName}.
     *
     * ```javascript
     *
     *  TopJs.ClassManager.getName(TopJs.SomeClass); // returns "TopJs.SomeClass"
     *
     * ```
     * @param {TopJs.Class|Object} object
     * @return {String} className
     */
    getClassName (object)
    {
        return object && object.$_class_name_$ || '';
    },

    /**
     * Get the class of the provided object; returns null if it's not an instance
     * of any class created with Ext.define. This is usually invoked by the
     * shorthand {@link TopJs#getClass}.
     *
     *  ```javascript
     *  let obj = new TopJs.SomeClass();
     *  TopJs.getClass(obj); // returns TopJs.SomeClass
     *  ```
     * @param {Object} object
     * @return {TopJs.Class} class
     */
    getClass (object)
    {
        return object && object.self || null;
    },

    /**
     * Retrieve Class Object by class name
     * 
     * @param {String} className
     * @return {TopJs.Class}
     * @throws
     */
    getClassByName (className)
    {
        if (!this.classes.has(className)) {
            TopJs.raise({
                sourceClass: 'TopJs.ClassManager',
                sourceMethod: 'getClassByName',
                msg: `Class: ${className} not exist!`
            });
        }
        return this.classes.get(className);
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
    define (className, data, createdFunc)
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
    },

    /**
     * Undefines a class defined using the #define method. Typically used
     * for unit testing where setting up and tearing down a class multiple
     * times is required.  For example:
     * ```javascript
     *
     *     // define a class
     *     TopJs.define('Foo', {
     *        ...
     *     });
     *
     *     // run test
     *
     *     // undefine the class
     *     TopJs.undefine('Foo');
     * ```
     * @param {String} className The class name to undefine in string dot-namespaced format.
     * @private
     */
    undefine (className)
    {
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(className, 'TopJs.ClassManager#undefine', arguments);
        //</debug>
        let classes = Manager.classes;
        let index = className.lastIndexOf('.');
        let clsName;
        let ns;
        classes.delete(className);
        if (index < 0) {
            ns = Manager.getNamespace(className);
            clsName = className;
        } else {
            ns = Manager.getNamespace(className.substring(0, index));
            clsName = className.substring(index + 1);
        }
        if (ns.parent) {
            delete ns[clsName];
        } else {
            delete TopJs.global[clsName];
        }
    }
});