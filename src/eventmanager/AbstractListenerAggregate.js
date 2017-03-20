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
TopJs.namespace('TopJs.eventmanager');

/**
 * @alias TopJs.eventmanager.AbstractListenerAggregate
 *
 * Abstract aggregate listener
 */
class AbstractListenerAggregate {
    constructor()
    {
        this.listeners = [];
    }
}

TopJs.registerClass("TopJs.eventmanager.AbstractListenerAggregate", AbstractListenerAggregate);
module.exports = AbstractListenerAggregate;
