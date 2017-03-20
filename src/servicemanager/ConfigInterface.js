"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.namespace("TopJs.servicemanager");

/**
 * @alias TopJs.servicemanager.ConfigInterface
 */
class ConfigInterface
{
    configureServiceManager (serviceManager)
    {}
}

TopJs.registerClass("TopJs.servicemanager.ConfigInterface", ConfigInterface);
module.exports = ConfigInterface;