/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require("chai").assert;

const StandardLoader = require("../lib/Entry").StandardLoader;

describe("Entry入口测试", function(){
   it("测试暴露接口", function(){
      let loader = new StandardLoader({
         [StandardLoader.AUTO_REGISTER_TOPJS] : true
      });
      loader.register();
      assert.isFunction(StandardLoader);
   });
});