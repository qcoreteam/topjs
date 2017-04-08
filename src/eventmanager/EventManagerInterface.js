"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
TopJs.namespace("TopJs.eventmanager");

let SharedEventsCapableInterface = TopJs.require("TopJs.eventmanager.SharedEventsCapableInterface");

/**
 * @class
 * @classdesc TopJs.eventmanager.EventManagerInterface
 *
 * Interface for EventManager
 */
class EventManagerInterface extends SharedEventsCapableInterface {
    /**
     * Create and trigger an event.
     *
     * Use this method when you do not want to create an EventInterface
     * instance prior to triggering. You will be required to pass:
     *
     * - the event name
     * - the event target (can be null)
     * - any event parameters you want to provide (empty array by default)
     *
     * It will create the Event instance for you and then trigger all listeners
     * related to the event.
     *
     * @param {string} eventName
     * @param {null|Object|String} target
     * @param {Object} argv
     * @return {TopJs.eventmanager.ResponseCollection}
     */
    trigger(eventName, target = null, argv = null)
    {
    }
   
    /**
     * Create and trigger an event, applying a callback to each listener result.
     *
     * Use this method when you do not want to create an EventInterface
     * instance prior to triggering. You will be required to pass:
     *
     * - the event name
     * - the event target (can be null)
     * - any event parameters you want to provide (empty array by default)
     *
     * It will create the Event instance for you, and trigger all listeners
     * related to the event.
     *
     * The result of each listener is passed to callback; if callback returns
     * a boolean true value, the manager must short-circuit listener execution.
     *
     * @param {TopJs.eventmanager.Callable} callback
     * @param {String} eventName
     * @param {null|Object|String} target
     * @param {Object} argv
     * @return {TopJs.eventmanager.ResponseCollection}
     */
    
    triggerUntil(callback, eventName, target = null, argv = null)
    {
    }

    /**
     * Trigger an event
     *
     * Provided an EventInterface instance, this method will trigger listeners
     * based on the event name, raising an exception if the event name is missing.
     *
     * @param {TopJs.eventmanager.EventInterface} event
     * @return {TopJs.eventmanager.ResponseCollection}
     */
    triggerEvent(event)
    {
    }

    /**
     * Trigger an event, applying a callback to each listener result.
     *
     * Provided an EventInterface instance, this method will trigger listeners
     * based on the event name, raising an exception if the event name is missing.
     *
     * The result of each listener is passed to $callback; if $callback returns
     * a boolean true value, the manager must short-circuit listener execution.
     *
     * @param {TopJs.eventmanager.Callable} callback
     * @param {TopJs.eventmanager.EventInterface} event
     * @return {TopJs.eventmanager.ResponseCollection}
     */
    triggerEventUntil(callback, event)
    {
    }

    /**
     * Attach a listener to an event
     *
     * The first argument is the event, and the next argument is a
     * callable that will respond to that event.
     *
     * The last argument indicates a priority at which the event should be
     * executed; by default, this value is 1; however, you may set it for any
     * integer value. Higher values have higher priority (i.e., execute first).
     *
     * You can specify "*" for the event name. In such cases, the listener will
     * be triggered for every event *that has registered listeners at the time
     * it is attached*. As such, register wildcard events last whenever possible!
     *
     * @param {String} eventName Event to which to listen.
     * @param {TopJs.eventmanager.Callable} listener
     * @param {Number} priority Priority at which to register listener.
     * @return {TopJs.eventmanager.Callable}
     */
    attach(eventName, listener, priority = 1)
    {
    }


    /**
     * Detach a listener.
     *
     * If no $event or '*' is provided, detaches listener from all events;
     * otherwise, detaches only from the named event.
     *
     * @param {TopJs.eventmanager.Callable} listener
     * @param {null|String}eventName Event from which to detach; null and '*' indicate all events.
     * @return {void}
     */
    detach(listener, eventName = null)
    {
    }

    /**
     * Clear all listeners for a given event
     *
     * @param {String} eventName
     * @return {void}
     */
    clearListeners(eventName)
    {
    }

    /**
     * Provide an event prototype to use with trigger().
     *
     * When `trigger()` needs to create an event instance, it should clone the
     * prototype provided to this method.
     *
     * @param {TopJs.eventmanager.EventInterface} prototype
     * @return {void}
     */
    setEventPrototype(prototype)
    {
    }

    /**
     * Get the identifier(s) for this EventManager
     *
     * @return {Array}
     */
    getIdentifiers()
    {
    }

    /**
     * Set the identifiers (overrides any currently set identifiers)
     *
     * @param {String[]} identifiers
     * @return {void}
     */
    setIdentifiers(identifiers)
    {
    }

    /**
     * Add identifier(s) (appends to any currently set identifiers)
     *
     * @param {String[]} identifiers
     * @return {void}
     */

    addIdentifiers(identifiers)
    {
    }
}

TopJs.registerClass("TopJs.eventmanager.EventManagerInterface", EventManagerInterface);
module.exports = EventManagerInterface;
