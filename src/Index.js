/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * 框架引导文件
 *
 * 我们在这个里面初始化一些内部的类，挂载一些快捷函数到TopJs名称空间上面
 */
import {sep as dir_separator, dirname} from "path";

global["TOPJS_ROOT_DIR"] = __dirname;
let TopJs = global.TopJs = {};
TopJs.global = global;

require("./kernel/TopJs");
require("./kernel/utils/Sprintf");
require("./kernel/Util");
require("./kernel/lang/Error");
require("./kernel/lang/Array");
require("./kernel/lang/Function");
require("./kernel/lang/Object");
require("./kernel/lang/Number");
require("./kernel/lang/String");
require("./kernel/lang/Date");
require("./kernel/utils/Version");
require("./kernel/class/Loader");
require("./kernel/class/Class");
require("./kernel/class/ClassManager");

TopJs.setVersion("0.0.1");
module.exports = TopJs;

/**
 * @namespace TopJs.code
 */
/**
 * @namespace TopJs.code.generator
 */
/**
 * @namespace TopJs.servicemanager
 */
/**
 * @namespace TopJs.servicemanager.initializer
 */
/**
 * @namespace TopJs.servicemanager.factory
 */
/**
 * @namespace TopJs.psr
 */
/**
 * @namespace TopJs.eventmanager
 */
/**
 * @namespace TopJs.eventmanager.filter
 */