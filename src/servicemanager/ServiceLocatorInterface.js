"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.require("TopJs.psr.ContainerInterface");
TopJs.namespace("TopJs.servicemanager");
/**
 * @requires TopJs.psr.ContainerInterface
 * @alias TopJs.servicemanager.ServiceLocatorInterface
 */
class ServiceLocatorInterface
{
    build (name, options = null)
    {}
}

TopJs.registerClass("TopJs.servicemanager.ServiceLocatorInterface", ServiceLocatorInterface);