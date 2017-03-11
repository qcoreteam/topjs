/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require("chai").assert;

const TopJs = require("../lib/Index");

describe("test TopJs index module", function(){
    it("test loader class", function() {
        assert.isNotNull(TopJs);
        assert.isTrue(TopJs.hasOwnProperty('now'));
    });
});