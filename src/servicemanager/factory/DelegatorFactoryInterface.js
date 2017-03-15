
"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.servicemanager.factory");

/**
 * @class TopJs.servicemanager.factory.DelegatorFactoryInterface
 * @classdesc
 *
 * Delegator factory interface.
 *
 * Defines the capabilities required by a delegator factory. Delegator
 * factories are used to either decorate a service instance, or to allow
 * decorating the instantiation of a service instance (for instance, to
 * provide optional dependencies via setters, etc.).
 */
class DelegatorFactoryInterface {
    /**
     * Can the factory create an instance for the service?
     *
     * @param {TopJs.psr.ContainerInterface} container
     * @param {String} requestedName
     * @return {Boolean}
     */
    /**
     * A factory that creates delegates of a given service
     *
     * @param  {TopJs.psr.ContainerInterface} container
     * @param  {String} name
     * @param  {Function} callback
     * @param  {Null|Object} options
     * @return {Object}
     */
    invoke(container, name, callback, options = null)
    {
    };
}

TopJs.registerClass("TopJs.servicemanager.factory.DelegatorFactoryInterface");
module.exports = DelegatorFactoryInterface;
