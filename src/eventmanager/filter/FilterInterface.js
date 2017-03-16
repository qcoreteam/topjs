"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace('TopJs.eventmanager.filter');

/**
 * @class TopJs.eventmanager.FilterInterface
 * @classdesc
 *
 *  Interface for intercepting filter chains
 */
class FilterInterface {
    /**
     * Execute the filter chain
     *
     * @param {String|Object} context
     * @param {Object} params
     * @return {Object}
     */
    run(context, params = null)
    {
    }

    /**
     * Attach an intercepting filter
     *
     * @param {Function} callback
     */
    detach(callback)
    {
    }

    /**
     * Get all intercepting filters
     *
     * @return {Object[]}
     */
    getFilters()
    {
    }

    /**
     * Clear all filters
     *
     * @return {void}
     */
    clearFilters()
    {
    }

    /**
     * Get all filter responses
     *
     * @return {TopJs.eventmanager.ResponseCollection}
     */
    getResponses()
    {
    }
}

TopJs.registerClass("TopJs.eventmanager.FilterInterface", FilterInterface);
module.exports = FilterInterface;
