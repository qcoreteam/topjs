"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * @namespace TopJs.code
 */
TopJs.namespace("TopJs.code");

/**
 * @class TopJs.code.NameInformation
 */
class NameInformation {
    constructor(namespace = null, uses = [])
    {
        /**
         * @property {String} namespace
         */
        this.namespace = null;

        /**
         * @property {Map} uses
         */
        this.uses = new Map();
        
        if (namespace) {
            this.setNamespace(namespace);
        }
        if (uses) {
            this.setUses(uses);
        }
    }

    setNamespace(namespace)
    {
        this.namespace = namespace;
        return this;
    }

    /**
     * @return {String}
     */
    getNamespace()
    {
        return this.namespace;
    }

    /**
     * @return {Boolean}
     */
    hasNamespace()
    {
        return (this.namespace !== null);
    }

    /**
     * @param {Object|Array} uses
     * @return {TopJs.code.NameInformation}
     */
    setUses(uses)
    {
        this.uses.clear();
        this.addUses(uses);
        return this;
    }

    /**
     * @param {Object|Array} uses
     * @return {TopJs.code.NameInformation}
     */
    addUses(uses)
    {
        if (TopJs.isArray(uses)) {
            for (let i = 0; i < uses.length; i++) {
                this.addUse(uses[i]);
            }
        } else if (TopJs.isSimpleObject(uses)) {
            for (let [use, as] of Object.entries(uses)) {
                this.addUse(use, as);
            }
        }
        return this;
    }

    /**
     * @param {String} use the fullclass name
     * @param {String} as the class alias name
     * @return {TopJs.code.NameInformation}
     */
    addUse(use, as = null)
    {
        if (TopJs.isString(as)) {
            as = as.replace(/\./g, '');
        } else {
            as = use;
        }
        this.uses.set(use, as);
        return this;
    }

    /**
     * @return {Object}
     */
    getUses()
    {
        let uses = {};
        this.uses.forEach(function (as, use)
        {
            uses[use] = as;
        });
        return uses;
    }
}

TopJs.registerClass("TopJs.code.NameInfomation", NameInformation);
module.exports = NameInformation;
