"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../lib/Index");

let AbstractOptions = TopJs.require("TopJs.stdlib.AbstractOptions");

let assert = require("chai").assert;

describe("TopJs.stdlib.AbstractOptions", function()
{
    class Cfg extends AbstractOptions
    {
        setName(name)
        {
            this.name = name;
        }
        getName()
        {
            return this.name;
        }
    }
    TopJs.apply(Cfg.prototype, {
        name: "softboy"
    });
    let opts;
    beforeEach(function ()
    {
        opts = new Cfg();
        
    });
    
    it("test get and set proxy method", function ()
    {
        let setterCalled = false;
        let getterCalled = false;
        class Cfg extends AbstractOptions
        {
            setName(name)
            {
                setterCalled = true;
                this.name = name;
            }
            getName()
            {
                getterCalled = true;
                return this.name;
            }
            
            setAge(age)
            {
                this.age = age;
            }
            getAge()
            {
                return this.age;
            }

        }
        TopJs.apply(Cfg.prototype, {
            name: "softboy"
        });
        opts = new Cfg();
        assert.isFalse(getterCalled);
        assert.equal(opts.name, "softboy");
        assert.isTrue(getterCalled);
        assert.isFalse(setterCalled);
        assert.isTrue("name" in opts);
        assert.isFalse("age" in opts);
        opts.name = "tom";
        assert.isTrue(setterCalled);
        assert.equal(opts.name, "tom");
        opts.age = 12;
        assert.deepEqual(opts.toLiteralObject(), { name: 'tom', age: 12 } );
    });
});
