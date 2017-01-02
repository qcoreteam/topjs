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
import * as TopJs from "./kernel/TopJs"
import {mount as cls_system_mounter} from "./kernel/class/ClassManager"

let topJsLibDir = process.cwd() + dir_separator + "lib";
let gvars = {
   TOPJS_LIB_DIR : topJsLibDir
};

export function get_topjs_global_vars()
{
   return gvars;
}

export function init()
{
   //给全局名称孔家挂载比较重要的函数
   TopJs.mount(TopJs);
   //初始化类系统
   cls_system_mounter(TopJs);
}