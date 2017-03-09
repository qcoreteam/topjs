/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * @class TopJs.Inventory
 * @constructor
 */
TopJs.Inventory = function ()
{
    this.names = [];
    this.paths = {};
    this.alternateToName = {};
    this.aliasToName = {};
    this.nameToAliases = {};
    this.nameToAlternates = {};
    this.nameToPrefix = {};
};

TopJs.Inventory.prototype = {
    array1: [0],
    
    prefixes: null,
    dotRegex: /\./g,
    wildcardRegex: /\*/g,
    
};