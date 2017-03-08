/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../../lib/Entry").TopJs;
let assert = require("chai").assert;

describe("TopJs.Base", function(){
    let Cls;
    afterEach(function() {
        Cls = null;
    });
    describe("deprecated", function ()
    {
        function declare_class (version)
        {
            TopJs.setVersion(version);
            Cls = TopJs.define(null, {
                foo () 
                {
                    return 'a';
                },
                
                deprecated: {
                    name: 'foo',
                    5: {
                        methods: {
                            bar: 'foo',
                            foo ()
                            {
                                return this.callParent() + 'd';
                            }
                        }
                    },
                    5.1: {
                        methods: {
                            foo: {
                                fn ()
                                {
                                    return this.callParent() + 'c';
                                }
                            }
                        }
                    },
                    
                    '5.2': {
                        methods: {
                            foo: {
                                message: 'Foo is bad',
                                fn ()
                                {
                                    return this.callParent() + 'b';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        describe('no backward compatibility', function () 
        {
            beforeEach(function () {
                declare_class('5.2');
            });
            it("should not active methods when compatVersion equals curVersion", function ()
            {
                let obj = new Cls;
                let s = obj.foo();
                assert.equal(s, "a");
            });
            
            it("should install error shim from old block", function ()
            {
                let obj = new Cls;
                let s = "No exception";
                try {
                    obj.bar();
                } catch (e) {
                    s = e.message;
                }
                console.log(s);
            })
        });
    });
});