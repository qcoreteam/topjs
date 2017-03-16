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
            this.setupClass(cls);
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
     * @param {Array} interfaces
     */
    implements(Class, interfaces)
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
     * @param {Object} clsObject
     * @param {Object} interfaceObject
     * @return {boolean}
     */
    implementInterface(clsObject, interfaceObject)
    {
        if (!clsObject.hasOwnProperty("$_interfaces_$")) {
            return false;
        }
        return clsObject.$_interfaces_$.includes(interfaceObject);
    },

    /**
     * @private
     */
    setupClass(cls)
    {
        TopJs.apply(cls.prototype, {
            self: cls,
            getClassName()
            {
                return this.self.$_class_name_$;
            },
            
            instanceOf(targetClass)
            {
                if (this instanceof targetClass) {
                    return true;
                }
                return this.self.$_interfaces_$.includes(targetClass);
            }
        });
        TopJs.apply(cls, {
            getClassName()
            {
                return this.$_class_name_$;
            }
        });
    }
});

TopJs.apply(TopJs, /** @lends TopJs */ {
    registerClass: TopJs.Function.alias(ClsManager, 'registerClass'),
    classExists: TopJs.Function.alias(ClsManager, 'classExists'),
    implements: TopJs.Function.alias(ClsManager, 'implements')
});
