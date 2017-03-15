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
 * @class TopJs.servicemanager.factory.AbstractFactoryInterface
 * @classdesc
 *
 * Interface for an abstract factory.
 *
 * An abstract factory extends the factory interface, but also has an
 * additional "canCreate" method, which is called to check if the abstract
 * factory has the ability to create an instance for the given service. You
 * should limit the number of abstract factories to ensure good performance.
 * Starting from ServiceManager v3, remember that you can also attach multiple
 * names to the same factory, which reduces the need for abstract factories.
 */
class AbstractFactoryInterface {
    /**
     * Can the factory create an instance for the service?
     *
     * @param {TopJs.psr.ContainerInterface} container
     * @param {String} requestedName
     * @return {Boolean}
     */
    canCreate(container, requestedName)
    {
    };
}

TopJs.registerClass("TopJs.servicemanager.factory.AbstractFactoryInterface");
module.exports = FactoryInterface;