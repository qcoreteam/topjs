/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

const StandardLoader = require("../../../lib/Entry").StandardLoader;
let assert = require("chai").assert;
let loader = new StandardLoader({
    [StandardLoader.AUTO_REGISTER_TOPJS]: true
});
loader.register();

describe("TopJs.ClassManager", function ()
{
    
    // let manager = TopJs.ClassManager;
    // describe("TopJs.ClassManager.create", function ()
    // {
    //     let subClass, parentClass, mixinClass1, subSubClass;
    //     let mixinClass2 = manager.create('I.am.the.MixinClass2', {
    //         constructor: function() {
    //             this.mixinConstructor2Called = true;
    //         },
    //
    //         mixinProperty2: 'mixinProperty2',
    //
    //         mixinMethod2: function() {
    //             this.mixinMethodCalled = true;
    //         }
    //     });
    // });
});