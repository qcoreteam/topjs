"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.eventmanager");

/**
 * @class
 * @classdesc
 *
 * Interface indicating that an object composes or can compose a
 * SharedEventManagerInterface instance.
 */
class SharedEventsCapableInterface {
    /**
     * Retrieve the shared event manager, if composed.
     *
     * @return {null|TopJs.eventmanager.SharedEventManagerInterface}
     */
    getSharedManager()
    {
    }
}

TopJs.registerClass("TopJs.eventmanager.SharedEventsCapableInterface", SharedEventsCapableInterface);
module.exports = SharedEventsCapableInterface;
