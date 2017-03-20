"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * @namespace TopJs.eventmanager
 */
TopJs.namespace("TopJs.eventmanager");

/**
 * @alias TopJs.eventmanager.EventManagerAwareInterface
 * 
 * @classdesc
 * 
 * Interface to automate setter injection for an EventManager instance
 */
class EventManagerAwareInterface
{
    /**
     * Inject an EventManager instance
     *
     * @param {TopJs.eventmanager.EventManagerInterface} eventManager
     * @return void
     */
    setEventManager(eventManager)
    {
        
    }
}

TopJs.registerClass("TopJs.eventmanager.EventManagerAwareInterface");
module.exports = EventManagerAwareInterface;
