"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.servicemanager.factory");

let FactoryInterface = require("TopJs.servicemanager.factory.FactoryInterface");

/**
 * @class TopJs.servicemanager.factory.InvokableFactory
 * @classdesc
 * 
 * Factory for instantiating classes with no dependencies or which accept a single array.
 *
 * The InvokableFactory can be used for any class that:
 *
 * - has no constructor arguments;
 * - accepts a single array of arguments via the constructor.
 *
 * It replaces the "invokables" and "invokable class" functionality of the v2
 * service manager.
 */
class InvokableFactory {
    /**
     * Create an object
     *
     * @param {TopJs.psr.ContainerInterface} container
     * @param {String} requestedName
     * @param {null|Object} options
     * @return object
     * @throws ServiceNotFoundException if unable to resolve the service.
     * @throws ServiceNotCreatedException if an exception is raised when
     *     creating a service.
     * @throws ContainerException if any other error occurs
     */
    invoke(container, requestedName, options = null)
    {
    };
}

TopJs.registerClass("TopJs.servicemanager.factory.InvokableFactory");
TopJs.implements(InvokableFactory, FactoryInterface);
module.exports = InvokableFactory;
