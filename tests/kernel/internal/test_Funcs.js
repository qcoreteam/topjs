/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let Mocha = require("mocha");
let assert = require("chai").assert;
let Funcs = require("../../../lib/kernel/internal/Funcs");

describe("kernel/internal/Funcs测试用例", function(){
   
   it("测试trim", function(){
      let str = Funcs.trim(" test str   ");
      assert.equal(str, "test str");
      str = Funcs.trim("babaab test str  . babaab", ".ab \t\n\r\0\d");
      assert.equal(str, "test str");
   });

   it("测试ltrim", function(){
      let str = Funcs.ltrim(" test str   ");
      assert.equal(str, "test str   ");
      str = Funcs.ltrim("babaab . \t test str  . babaab", ".ab \t\n\r\0\d");
      assert.equal(str, "test str  . babaab");
   });

   it("测试rtrim", function(){
      let str = Funcs.rtrim(" test str   ");
      assert.equal(str, " test str");
      str = Funcs.rtrim("babaab . \t test str  . babaab\t\n", ".ab \t\n\r\0\d");
      assert.equal(str, "babaab . \t test str");
   });
   
   it("测试regex_escape", function(){
      let str = Funcs.regex_escape(" test str.[(^*+})");
      assert.equal(str, " test str\\.\\[\\(\\^\\*\\+\\}\\)");
   });
});