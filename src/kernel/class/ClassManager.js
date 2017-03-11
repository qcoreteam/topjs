/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
"use strict";

import {sep as dir_separator, dirname} from 'path';
import {is_object, in_array, rtrim, is_string, change_str_at, file_exist} from '../internal/Funcs';
import Namespace from "./Namespace";

let Manager = TopJs.ClassManager = {};

/**
 * @class TopJs.ClassManager
 * @singleton
 * @classdesc
 */
TopJs.apply(Manager, /** @lends TopJs.ClassManager */{
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
        let sep = Manager.NS_SEPARATOR;
        namespace = rtrim(namespace, sep);
        let parts = namespace.split(sep);
        let nsObj;
        if (this.namespaces.has(parts[0])) {
            nsObj = this.namespaces.get(parts[0]);
        } else {
            nsObj = new Namespace(parts[0], null, null);
            this.namespaces.set(parts[0], nsObj);
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
        try {
            nsObj.setDirectory(this.normalizeDirectory(directory));
        } catch (err) {}
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
     * @returns {TopJs.ClassManager}
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
     * @returns {TopJs.Namespace}
     */
    getNamespace(name)
    {
        let ns;
        if (this.namespaceCache.has(name)) {
            ns = this.namespaceCache.get(name);
        } else {
            ns = this.createNamespace(name);
            this.namespaceCache.set(name, ns);
        }
        return ns;
    },

    /**
     * @param {String} namespace 名称空间的字符串描述
     * @return {Namespace}
     */
    createNamespace(namespace)
    {
        let parts = namespace.split(Manager.NS_SEPARATOR);
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
            if (null == ns) {
                ns = new Namespace(partName, parentNs, parentNs.directory + dir_separator + filename);
            }
        }
        return ns;
    },
  
    /**
     * @param {String} fullClsName the class name
     * @param {Object} cls The Class Object
     * @return {TopJs.ClassManager} this
     */
    registerToClassMap (fullClsName, cls)
    {
        Manager.classes.set(name, Manager.mountClsToNamespace(fullClsName, cls));
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
                TopJs.log.warn(`[TopJs.ClassManager.mountClsToNamespace] class ${fullClassName} 
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
    }
});

TopJs.apply(TopJs, /** @lends TopJs */{
   registerCls: TopJs.Function.alias(Manager, 'registerToClassMap')
});