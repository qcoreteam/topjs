/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require('chai').assert;
let StandardAutoloader = require('../../lib/loader/StandardAutoloader');

describe('StandardAutoloader测试用例', function() {
   it("测试参数设置", function(){
      let loader = new StandardAutoloader();
      // assert.notEqual(1, 1, "这两个值必须不相等");
      assert.equal(StandardAutoloader.LOAD_PREFIX, 'prefix');
      assert.equal('ok', loader.autoload());
   });
   it("测试返回值", function(){
      let loader = new StandardAutoloader();
      // assert.notEqual(1, 1, "这两个值必须不相等");
      assert.equal('ok1', loader.autoload());
   });
});