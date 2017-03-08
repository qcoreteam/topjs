/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../../lib/Entry").TopJs;
let assert = require("chai").assert;

describe("TopJs.Class", function ()
{
    let emptyFn = function () {};
    let defaultInitConfig = function (config) {
        this.initConfig(config);
    };
    let Cls, sub, func, SubClass, ParentCls, MixinClass1, MixinClass2, o;
    
    // beforeEach(function ()
    // {
    //     func = function () {};
    //     MixinClass1 = TopJs.define(null, {
    //         config: {
    //             mixinConfig: 'mixinConfig'
    //         },
    //
    //         mixinProperty1: 'mixinProperty1',
    //        
    //         constructor ()
    //         {
    //             this.initConfig(config);
    //             this.mixinConstructor1Called = true;
    //         },
    //
    //         mixinMethod1 ()
    //         {
    //             this.mixinMethodCalled = true;
    //         }
    //     });
    //    
    //     MixinClass2 = TopJs.define(null, {
    //         mixinProperty2: 'mixinProperty2',
    //        
    //         constructor (config)
    //         {
    //             this.initConfig(config);
    //             this.mixinConstructor2Called = true;
    //         },
    //
    //         mixinMethod2 ()
    //         {
    //             this.mixinMethodCalled = true;
    //         }
    //     });
    //    
    //     ParentCls = TopJs.define(null, {
    //         mixins: {
    //             mixin1: MixinClass1
    //         },
    //
    //         parentProperty: 'parentProperty',
    //        
    //         config: {
    //             name: "parentClass",
    //             isCool: false,
    //             members: {
    //                 abe: "Abraham Elias",
    //                 ed: "Ed Spencer"
    //             },
    //             hobbies: ['football', 'bowling']
    //         },
    //
    //         constructor (config) 
    //         {
    //             this.initConfig(config);
    //             this.parentConstructorCalled = true;
    //             this.mixins.mixin1.constructor.apply(this, arguments);
    //         },
    //
    //         parentMethod ()
    //         {
    //             this.parentMethodCalled = true;
    //         }
    //     });
    //
    //     SubClass = TopJs.define(null, {
    //         extend: ParentCls,
    //         mixins: {
    //             mixin1: MixinClass1,
    //             mixin2: MixinClass2
    //         },
    //         config: {
    //             name: 'subClass',
    //             isCool: true,
    //             members: {
    //                 jacky: 'Jacky Nguyen',
    //                 tommy: 'Tommy Maintz'
    //             },
    //             hobbies: ['sleeping', 'eating', 'movies'],
    //             isSpecial: true
    //         },
    //         constructor (config) 
    //         {
    //             this.initConfig(config);
    //             this.subConstructorCalled = true;
    //             SubClass.superclass.constructor.apply(this, arguments);
    //             this.mixins.mixin2.constructor.apply(this, arguments);
    //         },
    //         myOwnMethod ()
    //         {
    //             this.myOwnMethodCalled = true;
    //         }
    //     });
    // });
    //
    // afterEach(function()
    // {
    //     o = SubClass = ParentCls = MixinClass1 = MixinClass2 = sub = Cls = null;
    // });
    
    describe("extend", function ()
    {
        // beforeEach(function() {
        //     func = function() {};
        //     TopJs.define('Spec.Base', {
        //         aProp: 1,
        //         aFn: func
        //     });
        // });
        //
        // afterEach(function() {
        //     TopJs.undefine('Spec.Base');
        // });
        
        it("should extend from TopJs.Base if no 'extend' property found", function ()
        {
            Cls = TopJs.define(null, {});
            assert.instanceOf(new Cls, TopJs.Base);
        });
    });
});