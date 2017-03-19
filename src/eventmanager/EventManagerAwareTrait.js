"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.eventmanager");

let EventManager = TopJs.require("TopJs.eventmanager.EventManager");

/**
 * @class TopJs.eventmanager.EventManagerAwareInterface
 * @classdesc
 *
 * A trait for objects that provide events.
 *
 * If you use this trait in an object, you will probably want to also implement
 * EventManagerAwareInterface, which will make it so the default initializer in
 * a TopJs MVC application will automatically inject an instance of the
 * EventManager into your object when it is pulled from the ServiceManager.
 *
 * @see Topjs.mvc.service.ServiceManagerConfig
 */
class EventManagerAwareTrait
{
    constructor()
    {
        /**
         * @property {TopJs.eventmanager.EventManagerInterface} events
         */
        this.events = null;
    }
    /**
     * Set the event manager instance used by this context.
     *
     * For convenience, this method will also set the class name / LSB name as
     * identifiers, in addition to any string or array of strings set to the
     * this.eventIdentifier property.
     *
     * @param {TopJs.eventmanager.EventManagerInterface} events
     */
    setEventManager(events)
    {
        let identifiers = [this.getClassName(events)];
        if (this.hasOwnProperty("eventIdentifiers") && TopJs.isArray(this.eventIdentifiers)) {
            for (let i = 0; i < this.eventIdentifiers.length; i++) {
                if (!identifiers.includes(this.eventIdentifiers[i])) {
                    identifiers.push(this.eventIdentifiers[i]);
                }
            } 
        }
        events.setIdentifiers(identifiers);
        this.events = events;
        if (this.attachDefaultListeners && TopJs.isFunction(this.attachDefaultListeners)) {
            this.attachDefaultListeners();
        }
    }

    /**
     * Retrieve the event manager
     *
     * Lazy-loads an EventManager instance if none registered.
     *
     * @return {TopJs.eventmanager.EventManagerInterface}
     */
    getEventManager()
    {
        if (!this.instanceOf(TopJs.eventmanager.EventManagerInterface)) {
            this.setEventManager(new EventManager());
        }
        return this.events;
    }
}

TopJs.registerClass("TopJs.eventmanager.EventManagerAwareTrait", EventManagerAwareTrait);
module.exports = EventManagerAwareTrait;
