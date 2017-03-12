"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.namespace("TopJs.psr");

/**
 * @class TopJs.psr.ContainerInterface
 * @classdesc
 * Describes the interface of a container that exposes methods to read its entries.
 */
class ContainerInterface {
    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param {string} id Identifier of the entry to look for.
     * @return {Object} Entry.
     */
    get (id)
    {}

    /**
     * Returns true if the container can return an entry for the given identifier.
     * Returns false otherwise.
     *
     * `has(id)` returning true does not mean that `get(id)` will not throw an exception.
     * It does however mean that `get(id)` will not throw a `NotFoundException`.
     *
     * @param {String} id Identifier of the entry to look for.
     * @return {Boolean}
     */
    has(id) 
    {}
}

TopJs.mountClsToNamespace("TopJs.psr.ContainerInterface", ContainerInterface);
