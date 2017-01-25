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
require("./kernel/TopJs");
require("./kernel/Util");
require("./kernel/lang/Error");
require("./kernel/lang/Array");
require("./kernel/lang/Function");
require("./kernel/lang/Object");
require("./kernel/lang/Number");
require("./kernel/lang/String");
require("./kernel/lang/Date");
require("./kernel/utils/Version");
require("./kernel/loader/StandardLoader");

import {mount as cls_system_mounter} from "./kernel/class/ClassManager";

let topJsLibDir = process.cwd() + dir_separator + "lib";

TopJs.TOPJS_LIB_DIR = topJsLibDir;
TopJs.global = global;
TopJs.setVersion("0.0.1");
//注册标准加载器
TopJs.Loader.registerNamespace("TopJs", __dirname);
module.exports.TopJs = TopJs;