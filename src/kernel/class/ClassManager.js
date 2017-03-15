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
    registerClass (fullClsName, cls)
    {
        if (!this.classes.has(fullClsName)) {
            ClsManager.classes.set(fullClsName, TopJs.Loader.mountClsToNamespace(fullClsName, cls));
        }
        return this;
    },
    
    instanceByName (clsName)
    {
        
    },

    /**
     * check whether class exist by full qualified class name
     * 
     * @param {String} fullClsName
     * @return {boolean}
     */
    classExists (fullClsName)
    {
        return this.classes.has(fullClsName);
    },
    
    implements (Class, interfaces)
    {
        
    }
});

TopJs.apply(TopJs, /** @lends TopJs */ {
    registerClass: TopJs.Function.alias(ClsManager, 'registerClass'),
    classExists: TopJs.Function.alias(ClsManager, 'classExists'),
    implements: TopJs.Function.alias(ClsManager, 'implements')
});
