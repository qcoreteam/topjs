"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let ClsManager = TopJs.ClassManager = {};

TopJs.apply(ClsManager, /** @lends TopJs.ClassManager */{
    /**
     * @protected
     * @property {Map} classes
     */
    classes: new Map(),

    /**
     * @param {String} fullClsName the class name
     * @param {Object} cls The Class Object
     * @return {TopJs.Loader} this
     */
    registerClass(fullClsName, cls)
    {
        if (!this.classes.has(fullClsName)) {
            ClsManager.classes.set(fullClsName, TopJs.Loader.mountClsToNamespace(fullClsName, cls));
            cls.$_class_name_$ = fullClsName;
            cls.prototype.self = cls;
            this.mixin(cls, TopJs.Class);
        }
        return this;
    },

    instanceByName(clsName)
    {

    },

    /**
     * check whether class exist by full qualified class name
     *
     * @param {String} fullClsName
     * @return {boolean}
     */
    classExists(fullClsName)
    {
        return this.classes.has(fullClsName);
    },

    /**
     * register interfaces for class
     *
     * @param {Object} Class
     * @param {...Array} interfaces
     */
    implements(Class, ...interfaces)
    {
        if (!Class.hasOwnProperty("$_interfaces_$")) {
            Class.$_interfaces_$ = [];
        }
        for (let i = 0; i < interfaces.length; i++) {
            if (!Class.$_interfaces_$.includes(interfaces[i])) {
                Class.$_interfaces_$.push(interfaces[i]);
            }
        }
    },

    /**
     * get the name of clsObject
     *
     * @param {Class} clsObject
     * @return {String}
     */
    getClassName(clsObject)
    {
        if (clsObject.hasOwnProperty("$_class_name_$")) {
            return clsObject.$_class_name_$;
        }
        return "";
    },

    /**
     * whether clsObject implement interfaceObject
     *
     * @param {Object} classObject
     * @param {Object} interfaceClass
     * @return {boolean}
     */
    implementInterface(classObject, interfaceClass)
    {
        if (!classObject.hasOwnProperty("$_interfaces_$")) {
            return false;
        }
        if (classObject.$_interfaces_$.includes(interfaceClass)) {
            return true;
        }
        for (let currentInterfaceClass of classObject.$_interfaces_$) {
            if ((new currentInterfaceClass) instanceof interfaceClass) {
                classObject.$_interfaces_$.push(interfaceClass);
                return true;
            }
        }
        return false;
    },
    
    mixin(targetClass, mixinClass)
    {
        let mixin = mixinClass.prototype;
        let prototype = targetClass.prototype;
        if (mixin.onClassMixedIn && TopJs.isFunction(mixin.onClassMixedIn)) {
            mixin.onClassMixedIn.call(mixinClass, this);
        }
        for (let key in mixin) {
            if (prototype[key] === undefined) {
                prototype[key] = mixin[key];
            }
        }

        if (mixin.afterClassMixedIn && TopJs.isFunction(mixin.afterClassMixedIn)) {
            mixin.afterClassMixedIn.call(mixinClass, this);
        }
        return targetClass;
    },

    /**
     * Add / override static properties of target class.
     *
     * ```javascript
     *
     * TopJs.ClassManager.addStatics(targetClass, {
     *    someProperty: 'someValue',      // targetClass.someProperty = 'someValue'
     *         method1: function() { ... },    // targetClass.method1 = function() { ... };
     *         method2: function() { ... }     // targetClass.method2 = function() { ... };
     * });
     *
     * ```
     * @param {TopJs.Class} targetClass
     * @param {Object} members
     * @return {TopJs.Class} targetClass
     * @static
     */
    addStatics(targetClass, members)
    {
        return this.addMembers(targetClass, members, true);
    },

    /**
     * Add methods / properties to the prototype of this class.
     *
     * ```javascript
     * class targetClass
     * {}
     *
     * TopJs.ClassManager.addMembers(targetClass, {
     *    meow: function() {
     *       console.log('Meowww...');
     *    }
     * });
     * let kitty = new targetClass();
     * kitty.meow();
     *
     * ```
     * @param {TopJs.Class} targetClass the target class object
     * @param {Object} members The members to add to this class.
     * @param {Boolean} [isStatic=false] Pass `true` if the members are static.
     * only has meaning in debug mode and only for methods.
     */
    addMembers(targetClass, members, isStatic)
    {
        let target = isStatic ? targetClass : targetClass.prototype;
        for (let name in members) {
            target[name] = members[name];
        }
        return targetClass;
    }
});

TopJs.apply(TopJs, /** @lends TopJs */ {
    registerClass: TopJs.Function.alias(ClsManager, 'registerClass'),
    classExists: TopJs.Function.alias(ClsManager, 'classExists'),
    implements: TopJs.Function.alias(ClsManager, 'implements')
});
