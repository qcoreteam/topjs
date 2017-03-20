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
 * @alias TopJs.servicemanager.factory.FactoryInterface
 * @classdesc 
 * 
 * Interface for a factory
 *
 * A factory is an callable object that is able to create an object. It is
 * given the instance of the service locator, the requested name of the class
 * you want to create, and any additional options that could be used to
 * configure the instance state.
 */
class FactoryInterface
{
    /**
     * Create an object
     *
     * @param {TopJs.psr.ContainerInterface} container
     * @param {String} requestedName
     * @param {null|Object} options
     * @return object
     */
    invoke(container, requestedName, options = null)
    {
    };
}

TopJs.registerClass("TopJs.servicemanager.factory.FactoryInterface");
module.exports = FactoryInterface;
