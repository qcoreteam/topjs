"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.stdlib");

let MessageInterface = TopJs.require("TopJs.stdlib.MessageInterface");

let toString = Object.prototype.toString;

/**
 * @alias TopJs.stdlib.Message
 */
class Message {

    constructor()
    {
        /**
         * @property {String} metadata
         */
        this.metadata = new Map();

        /**
         * @private
         * @property {String} content
         */
        this.content = '';
    }

    /**
     * Set message metadata
     *
     * Non-destructive setting of message metadata; always adds to the metadata, never overwrites
     * the entire metadata container.
     *
     * @param {String|Number|Object} spec
     * @param {mixed} value
     * @return {TopJs.stdlib.Message}
     * @throws {TypeError}
     */
    setMetadata(spec, value = null)
    {
        if (TopJs.isPrimitive(spec)) {
            this.metadata.set(spec, value);
            return this;
        }
        if (!TopJs.isSimpleObject(spec)) {
            throw new TypeError(TopJs.sprintf(
                'Expected a string, literal object argument in first position; received "%s"',
                (typeof spec)
            ));
        }
        for (let [key, value] of Object.entries(spec)) {
            this.metadata.set(key, value);
        }
        return this;
    }

    /**
     * Retrieve all metadata or a single metadatum as specified by key
     *
     * @param {String|Number|Object} key
     * @param {null|mixed} defaultValue
     * @return mixed
     */
    getMetadata(key = null, defaultValue = null)
    {
        if (null === key) {
            return this.getAllMetadata();
        }
        if (!TopJs.isPrimitive(key)) {
            throw new TypeError("Non-scalar argument provided for key");
        }
        if (this.metadata.has(key, this.metadata)) {
            return this.metadata.get(key);
        }
        return defaultValue;
    }

    /**
     * @return {Object}
     */
    getAllMetadata()
    {
        let obj = {};
        for (let [value, key] of this.metadata) {
            obj[key] = value;
        }
        return obj;
    }

    /**
     * Set message content
     *
     * @param {mixed} value
     * @return {TopJs.stdlib.Message}
     */
    setContent(value)
    {
        this.content = value;
        return this;
    }

    /**
     * Get message content
     *
     * @return {mixed}
     */
    getContent()
    {
        return this.content;
    }

    /**
     * @return {String}
     */
    toString()
    {
        let request = '';
        for (let [value, key] of this.metadata) {
            request += TopJs.sprintf(
                "%s: %s\r\n",
                toString.call(key),
                toString.call(value)
            );
        }
        request += "\r\n" + this.getContent();
        return request;
    }
}

TopJs.registerClass("TopJs.stdlib.Message", Message);
TopJs.implements(Message, MessageInterface);
module.exports = Message;
