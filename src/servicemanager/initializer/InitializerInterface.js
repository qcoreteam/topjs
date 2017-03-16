"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.namespace("TopJs.servicemanager.initializer");

/**
 * @class TopJs.servicemanager.initializer.InitializerInterface
 * @classdesc
 *
 * Interface for an initializer
 *
 * An initializer can be registered to a service locator, and are run after an instance is created
 * to inject additional dependencies through setters
 */
class InitializerInterface {
    /**
     * Initialize the given instance
     *
     * @param {TopJs.psr.ContainerInterface} container
     * @param {Object} instance
     * @return {void}
     */
    invoke(container, instance)
    {
    };
}

TopJs.registerClass("TopJs.servicemanager.initializer.InitializerInterface");
module.exports = InitializerInterface;