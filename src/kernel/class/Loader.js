"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

import {in_array, change_str_at} from '../internal/Funcs';
import {sep as dir_separator, dirname} from 'path';
import {stat, statSync} from 'fs';
import path from "path"
require("./ClassManager");

/**
 * 标准自动加载器
 * <font color="red">注意，这个类为底层自动加载类，一般只在入口文件进行实例化。</font>
 * 
 * ```javascript
 *
 *    let loader = new StandardLoader({
 *       [StandardLoader.AUTO_REGISTER_TOPJS] : true
 *    });
 *    loader.register();
 *
 * ```
 * @class TopJs.Loader
 * @singleton
 */
let Loader = TopJs.Loader = {};
let ClassManager = TopJs.ClassManager;

TopJs.apply(Loader, /** @lends TopJs.Loader */{

    registerNamespace (namespace, directory)
    {
        return ClassManager.registerNamespace(namespace, directory);
    },

    registerNamespaces (namespaces)
    {
        ClassManager.registerNamespaces(namespaces);
    },
    
    require(fullClsName)
    {
        let parts = fullClsName.split(".");
        let clsName = parts.pop();
        let ns = parts.join(".");
        let nsObject = ClassManager.createNamespace(ns);
        try {
            let filename = path.resolve(nsObject.directory, `${clsName}.js`);
            let stats = statSync(filename);
            if (stats.isFile()) {
                // here we only care about the file loading.
                return require(filename);
            }
        } catch (err) {
            if ("ENOENT" === err.code) {
                let filename = nsObject.directory + `${clsName}.js`;
                err.message = `require: class file ${filename} not exist`;
            }
            throw err;
        }
    },
    
    /**
     * 格式化加载目录，主要就是在路径的末尾加上路径分隔符
     *
     * @protected
     * @param {string} directory 需要进行处理的文件夹路径
     * @return {string}
     */
    normalizeDirectory(directory)
    {
        let len = directory.length;
        let last = directory.charAt(len - 1);
        if (in_array(last, ["/", "\\"])) {
            return change_str_at(directory, len - 1, dir_separator);
        }
        directory += dir_separator;
        return directory;
    },

    /**
     * 将类的全名转换成名称空间对应的文件夹路径
     *
     * @param {string} fullClsName 带名称空间的类的名称
     * @param {string} [dir=process.cwd()] 起点文件夹路径
     * @returns {string}
     */
    transformClassNameToFilenameByNamespace(fullClsName, dir = process.cwd())
    {
        let parts = fullClsName.split(".");
        let clsName = parts.pop();
        let ns = parts.join(".");
        let nsObj = null;
        let midParts = [];
        while (!(nsObj = this.getNamespace(ns)) && parts.length > 0) {
            midParts.push(parts.pop());
            ns = parts.join(".");
        }
        if (nsObj) {
            dir = nsObj.directory;
        }
        dir = this.normalizeDirectory(dir);
        if (midParts.length > 0) {
            dir += midParts.join(dir_separator) + dir_separator;
        }
        return dir + clsName + '.js'
    }
});

/**
 * 加载指定的类
 * @method
 */
TopJs.require = TopJs.Function.alias(Loader, 'require');