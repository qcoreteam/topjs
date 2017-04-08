"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.code.generator");
let GeneratorInterface = TopJs.require("TopJs.code.GeneratorInterface");

/**
 * @alias TopJs.code.generator.AbstractGenerator
 */
class AbstractGenerator {
    /**
     * @param {Object} options
     */
    constructor(options = null)
    {
        /**
         * @property {Boolean} isSourceDirty
         */
        this._isSourceDirty = true;

        /**
         * @property {Number|String} 4 spaces by default
         */
        this.indentation = '    ';

        /**
         * @property {String} sourceContent
         */
        this.sourceContent = null;
        
        if (options) {
            this.setOptions(options);
        }
    }

    /**
     * @param {Boolean} isSourceDirty
     * @return AbstractGenerator
     */
    setSourceDirty(isSourceDirty = true)
    {
        this._isSourceDirty = isSourceDirty;
        return this;
    }

    /**
     * @return {Boolean}
     */
    isSourceDirty()
    {
        return this._isSourceDirty;
    }

    /**
     * @param {String} indentation
     * @return AbstractGenerator
     */
    setIndentation(indentation)
    {
        this.indentation = indentation;
        return this;
    }

    /**
     * @return string
     */
    getIndentation()
    {
        return this.indentation;
    }


    /**
     * @param {String} sourceContent
     * @return {TopJs.code.generator.AbstractGenerator}
     */
    setSourceContent(sourceContent)
    {
        this.sourceContent = sourceContent;
        return this;
    }

    /**
     * @return {String}
     */
    getSourceContent()
    {
        return this.sourceContent;
    }

    /**
     * @param {Object} options
     * @return {TopJs.code.generator.AbstractGenerator}
     */
    setOptions(options)
    {
        if (!TopJs.isSimpleObject(options)) {
            TopJs.raise(TopJs.sprintf(
                '%s expects an literal object; received "%s"',
                "TopJs.code.AbstractGenerator.setOptions",
                (typeof options)
            ));
        }
        let methodName;
        for (let [optionName, optionValue] of Object.entries(options)) {
            methodName = `set${optionName}`;
            if (this[methodName] && TopJs.isFunction()) {
                this[methodName](optionValue);
            }
        }
        return this;
    }
}

TopJs.apply(AbstractGenerator, {
    /**
     * Line feed to use in place of os.EOL
     * @static
     * @memberOf TopJs.code.generator.AbstractGenerator
     * @property {String} LINE_FEED
     */
    LINE_FEED: "\n"
});

TopJs.registerClass("TopJs.code.generator.AbstractGenerator", AbstractGenerator);
TopJs.implements(AbstractGenerator, GeneratorInterface);
module.exports = AbstractGenerator;
