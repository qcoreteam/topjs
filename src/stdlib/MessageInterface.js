"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.stdlib");

class MessageInterface
{
    /**
     * Set metadata
     *
     * @param {String|Number|Object} spec
     * @param {mixed} value
     */
    setMetadata(spec, value = null)
    {}

    /**
     * Get metadata
     *
     * @param  {String|Number|Null} key
     * @return {mixed}
     */
    getMetadata(key = null)
    {}

    /**
     * Set content
     *
     * @param {mixed} content
     * @return {mixed}
     */
    setContent(content)
    {}

    /**
     * Get content
     *
     * @return {mixed}
     */
    getContent()
    {}
}

TopJs.registerClass("TopJs.stdlib.MessageInterface", MessageInterface);
module.exports = MessageInterface;
