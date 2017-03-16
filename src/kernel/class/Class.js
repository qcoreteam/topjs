"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let Class = TopJs.Class = function () {};

TopJs.apply(Class, /** @lends TopJs.Class */ {
    /**
     * @private
     * @property {String} $_class_name_$ the class name
     */
    $_class_name_$: '',
    
    /**
     * @private
     * @property {Set|null} $_interfaces_$ the Class implement interfaces
     */
    $_interfaces_$: new Map(),

    /**
     * implement the passed interfaces, we just record interfaces
     * into a internal set.
     *
     * @param {...Object} interfaces
     * @return {TopJs.Class}
     */
    implements (...interfaces)
    {
        TopJs.ClassManager.implements(this, ...interfaces);
    },
    
    /**
     * mount self to namespace
     * 
     * @param {String} namespace the namespace name
     * return {TopJs.Class}
     */
    mount (namespace)
    {
        TopJs.mountToNamespace(namespace, this);
        return this;
    },

    /**
     * Get the class name
     *
     * @return {String}
     */
    getClassName()
    {
        return this.$_class_name_$;
    }
});

TopJs.apply(Class.prototype, /** @lends TopJs.Class.prototype */{

    /**
     * Get the class name 
     * 
     * @return {String}
     */
    getClassName()
    {
        return this.self.$_class_name_$;
    },

    /**
     * chech current instance whether instanceof interfaceClass
     * 
     * @param {Function} interfaceClass
     * @return {Boolean}
     */
    instanceOf(interfaceClass)
    {
        return TopJs.ClassManager.implementInterface(this.self, interfaceClass);
    }
});
