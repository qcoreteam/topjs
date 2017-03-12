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
     * @property {Set|null} $_interfaces_$ the Class implement interfaces
     */
    $_interfaces_$: null,

    /**
     * implement the passed interfaces, we just record interfaces
     * into a internal set.
     *
     * @param {...Object} interfaces
     * @return {TopJs.Class}
     */
    implements (...interfaces)
    {

    },

    /**
     * check whether implement the passed interface
     * 
     * @param {Object} interfaceCls
     * @return {Boolean}
     */
    hasInterface (interfaceCls) 
    {
        
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
    }
});
