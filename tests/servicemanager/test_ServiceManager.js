"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const TopJs = require("../../lib/Index");

TopJs.require("TopJs.servicemanager.ServiceManager");

let assert = require("chai").assert;
class A
{

}
class B extends A
{
    
}
class C extends B
{
    
}
class D extends C
{
    
}

describe("TopJs.servicemanager.ServiceManager", function ()
{
    function create_service_manager (config)
    {
        return new TopJs.servicemanager.ServiceManager(config);
    }
    
    let serviceManager;
    
    describe("TopJs.servicemanager.ServiceManager.configure", function(){
        
        it("test configure invokable", function()
        {
            serviceManager = create_service_manager({
                invokables: {
                    "TopJs.servicemanager.factory.InvokableFactory": "TopJs.servicemanager.factory.InvokableFactory"
                }
            });
            
        });
        
        it("test configure invokable alias", function ()
        {
            serviceManager = create_service_manager({
                invokables: {
                    "invokeClsName": "TopJs.servicemanager.factory.InvokableFactory"
                }
            });
        })
    });
    
    describe("TopJs.servicemanager.ServiceManager.get", function(){
        it("test shared by default", function ()
        {
            // serviceManager = create_service_manager({
            //     invokables: {
            //         "invokeClsName": "TopJs.servicemanager.factory.InvokableFactory"
            //     }
            // });
            // let object1 = serviceManager.get("invokeClsName");
            // let object2 = serviceManager.get("invokeClsName");
            // assert.equal(object1, object2);
            // console.log(Object.getPrototypeOf(D));
            // console.log(new D instanceof A);
        });
    });
});
