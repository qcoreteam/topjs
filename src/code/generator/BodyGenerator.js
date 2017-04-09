"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let AbstractGenerator = TopJs.require("TopJs.code.generator.AbstractGenerator");
TopJs.namespace("TopJs.code.generator");

class BodyGenerator extends AbstractGenerator
{
    /**
     * @param {String} content
     * @return {TopJs.code.generator.BodyGenerator}
     */
    setContent(content)
    {
        this.content = content;
        return this;
    }

    /**
     * @return {String}
     */
    getContent()
    {
        return this.content;
    }
    
    generate()
    {
        return this.getContent();
    }
}

TopJs.apply(BodyGenerator.prototype, /** @lends TopJs.code.generator.BodyGenerator.prototype */{
    /**
     * @protected {String} content
     */
    content: null
});

TopJs.registerClass("TopJs.code.generator.BodyGenerator", BodyGenerator);
module.exports = BodyGenerator;