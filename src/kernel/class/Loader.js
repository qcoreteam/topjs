"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

import {in_array, change_str_at, rtrim, is_object} from '../internal/Funcs';
import {sep as dir_separator, dirname} from 'path';
import {stat, statSync} from 'fs';
import path from "path"
const Namespace = require("./Namespace");

/**
 * 标准自动加载器
 * <font color="red">注意，这个类为底层自动加载类。</font>
 *
 * @class TopJs.Loader
 * @singleton
 */
let Loader = TopJs.Loader = {};

TopJs.apply(Loader, /** @lends TopJs.Loader */{

    /**
     * @readonly
     * @static
     * @property {string} NS_SEPARATOR 名称空间分隔符
     */
    NS_SEPARATOR: ".",
    /**
     * @readonly
     * @static
     * @property {string} LOAD_NS 参数批量设置的时候名称空间项识别码常量
     */
    LOAD_NS: "namespaces",

    /**
     * @readonly
     * @static
     * @property {string} NAMESPACE_ACCESSOR_KEY 对象代理访问时候获取名称空间对象的特殊键名
     */
    NAMESPACE_ACCESSOR_KEY: "__NAMESPACE_ACCESSOR_KEY__",

    /**
     * @protected
     * @property {Map} namespaces 名称空间到类的文件夹之间的映射
     */
    namespaces: new Map(),

    /**
     * @protected
     * @property {Map} namespaceCache the namespaces lookup cache
     */
    namespaceCache: new Map(),

    /**
     * @protected
     * @property {Map} classes
     */
    classes: new Map(),

    /**
     * 注册一个名称空间到对应文件夹的映射项
     *
     * @param {string} namespace
     * @param {string} directory
     * @returns {TopJs.Namespace}
     */
    registerNamespace(namespace, directory)
    {
        let sep = Loader.NS_SEPARATOR;
        namespace = rtrim(namespace, sep);
        let parts = namespace.split(sep);
        let nsObj;
        let rootNamespace = parts[0];
        if (this.namespaces.has(rootNamespace)) {
            nsObj = this.namespaces.get(parts[0]);
        } else {
            nsObj = new Namespace(rootNamspace, null, null);
            this.namespaces.set(rootNamspace, nsObj);
            TopJs.global[rootNamspace] = nsObj;
        }
        //子名称空间
        for (let i = 1; i < parts.length; i++) {
            let childNsObj = nsObj.getChildNamespace(parts[i]);
            if (null === childNsObj) {
                nsObj = new Namespace(parts[i], nsObj, null);
            } else {
                nsObj = childNsObj;
            }
        }
        nsObj.setDirectory(this.normalizeDirectory(directory));
        return nsObj;
    },

    /**
     * 一次性注册多个名称空间到文件目录的映射, `namespace`参数结构如下：
     * ```javascript
     * {
     *    namespace1: dir1,
     *    namespace2: dir2,
     *    ...
     * }
     * ```
     *
     * @param {Object} namespaces 需要注册的名称空间类型
     * @returns {TopJs.Loader}
     */
    registerNamespaces(namespaces)
    {
        if (!is_object(namespaces)) {
            throw new Error('arg namespaces must be object');
        }
        for (let [namespace, direcotry] of Object.entries(namespaces)) {
            this.registerNamespace(namespace, direcotry);
        }
        return this;
    },

    /**
     * 通过名称空间名称，获取底层名称空间对象引用
     *
     * @param {Object} name 名称空间的名称
     * @param {Boolean} autoCreate auto create namespace that does not exist
     * @returns {TopJs.Namespace}
     */
    getNamespace (name, autoCreate = false)
    {
        if (this.namespaceCache.has(name)) {
            return this.namespaceCache.get(name);
        }
        let ns = this.findNamespace(name, autoCreate);
        if (null !== ns) {
            this.namespaceCache.set(name, ns);
        }
        return ns;
    },
    
    findNamespace (namespace, autoCreate = false)
    {
        let parts = namespace.split(Loader.NS_SEPARATOR);
        let ns;
        let partName;
        let parentNs;
        if (this.namespaces.has(parts[0])) {
            ns = this.namespaces.get(parts[0]);
        } else {
            ns = new Namespace(parts[0], null, parts[0]);
            TopJs.global[parts[0]] = ns;
        }
        for (let i = 1; i < parts.length; i++) {
            partName = parts[i];
            parentNs = ns;
            ns = ns.getChildNamespace(partName);
            if (null == ns && autoCreate) {
                ns = new Namespace(partName, parentNs, parentNs.directory + dir_separator + partName);
            } else if (null == ns) {
                break;
            }
        }
        return ns;
    },

    /**
     * @param {String} namespace 名称空间的字符串描述
     * @return {Namespace}
     */
    createNamespace (namespace)
    {
        let parts = namespace.split(Loader.NS_SEPARATOR);
        let ns;
        let partName;
        let parentNs;
        let rootNamespace = parts[0];
        if (this.namespaces.has(rootNamespace)) {
            ns = this.namespaces.get(rootNamespace);
        } else {
            // TODO throw not exist error?
            ns = new Namespace(rootNamespace, null, parts[0]);
            TopJs.global[rootNamespace] = ns;
        }
        for (let i = 1; i < parts.length; i++) {
            partName = parts[i];
            parentNs = ns;
            ns = ns.getChildNamespace(partName);
            if (null == ns) {
                ns = new Namespace(partName, parentNs, parentNs.directory + partName + dir_separator);
                parentNs[partName] = ns;
            }
        }
        return ns;
    },

    /**
     * @param {String} fullClsName the class name
     * @param {Object} cls The Class Object
     * @return {TopJs.Loader} this
     */
    registerToClassMap (fullClsName, cls)
    {
        Loader.classes.set(name, Loader.mountClsToNamespace(fullClsName, cls));
        return this;
    },

    mountClsToNamespace (fullClassName, cls)
    {
        let index = fullClassName.lastIndexOf('.');
        let targetScope = TopJs.global;
        let ret;
        if (index < 0) {
            // mount at global scope
            if (targetScope.hasOwnProperty(fullClassName)) {
                //<debug>
                TopJs.log.warn(`[TopJs.ClassLoader.mountClsToNamespace] class ${fullClassName} 
                already exist at target scope`);
                //</debug>
                return targetScope[fullClassName];
            }
            ret = targetScope[fullClassName] = cls;
        } else {
            let clsName = fullClassName.substring(index + 1);
            targetScope = this.getNamespace(fullClassName.substring(0, index));
            ret = targetScope[clsName] = cls;
        }
        return ret;
    },
    
    require(fullClsName)
    {
        let parts = fullClsName.split(".");
        let clsName = parts.pop();
        let ns = parts.join(".");
        let nsObject = Loader.createNamespace(ns);
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
     * clear all about registered namespaces
     */
    unmountRegisteredNamespaces ()
    {
        let global = TopJs.global;
        let namespaces = this.namespaces;
        this.namespaces.forEach(function (cls, namespace) {
            let parts = namespace.split(Loader.NS_SEPARATOR);
            if ("TopJs" !== parts[0]) {
                delete global[parts[0]];
                namespaces.delete(parts[0]);
            }
        });
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

TopJs.Loader.namespaces.set("TopJs", TopJs);

TopJs.apply(TopJs, /** @lends TopJs */{
    registerCls: TopJs.Function.alias(Loader, 'registerToClassMap'),
    require: TopJs.Function.alias(Loader, 'require'),
    mountToNamespace: TopJs.Function.alias(Loader, 'mountClsToNamespace'),
    directory: TOPJS_ROOT_DIR + dir_separator,
    getChildNamespace (name)
    {
        if (TopJs.hasOwnProperty(name)) {
            return TopJs[name];
        }
        return null;
    },
    
    setChildNamespace (name, targetNamespace)
    {
        this[name] = targetNamespace;
    }
});