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
import {sep as dir_separator} from "path";
import * as TopJsFuncs from "./kernel/TopJs";
import * as TopJsUtil from "./kernel/Util";
import * as TopJsError from "./kernel/lang/Error";
import * as LangArray from "./kernel/lang/Array";
import * as LangFunction from "./kernel/lang/Function";
import * as LangObject from "./kernel/lang/Object";
import * as LangNumber from "./kernel/lang/Number";
import * as LangString from "./kernel/lang/String";
import * as LangDate from "./kernel/lang/Date";
import * as Version from "./kernel/utils/Version"

import {mount as cls_system_mounter} from "./kernel/class/ClassManager";
import StandardAutoloader from "./kernel/loader/StandardAutoloader";

let topJsLibDir = process.cwd() + dir_separator + "lib";
/**
 * @namespace TopJs
 */
StandardAutoloader.addAfterRegisteredCallback(function(){
    //一些比较重要的全局名称空间常量
    TopJs.TOPJS_LIB_DIR = topJsLibDir;
    TopJs.global = global;
    //给全局名称空间挂载比较重要的函数
    TopJsFuncs.mount(TopJs);
    TopJsUtil.mount(TopJs);
    TopJsError.mount(TopJs);
    //初始化对语言的扩展
    LangArray.mount(TopJs);
    LangFunction.mount(TopJs);
    LangObject.mount(TopJs);
    LangNumber.mount(TopJs);
    LangString.mount(TopJs);
    LangDate.mount(TopJs);
    Version.mount(TopJs);
    //初始化类系统
    cls_system_mounter(TopJs);
    //设置框架当前的版本号
    TopJs.setVersion("0.0.1");
});

module.exports.StandardLoader = StandardAutoloader;