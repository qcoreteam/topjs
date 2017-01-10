"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

import {is_object, in_array, rtrim, is_string, change_str_at, file_exist} from '../internal/Funcs';
import {sep as dir_separator, dirname} from 'path';
import {stat, statSync} from 'fs';
import Namespace from "./Namespace";
import path from "path"

/**
 * @namespace TopJs.kernel.loader
 * @memberOf TopJs.kernel
 */
/**
 * 标准自动加载器
 * <font color="red">注意，这个类为底层自动加载类，一般只在入口文件进行实例化。</font>
 * ```javascript
 * 
 *    let loader = new StandardLoader({
 *       [StandardLoader.AUTO_REGISTER_TOPJS] : true
 *    });
 *    loader.register();
 *    
 * ```
 * @name StandardAutoloader
 * @memberOf TopJs.kernel.loader
 * @constructor
 * @param {Object} options
 */
export default function StandardAutoloader(options = null)
{
   if(null !== options){
      this.setOptions(options);
   }
}

Object.assign(StandardAutoloader,
   /** @lends TopJs.kernel.loader.StandardAutoloader */
   {
   /**
    * @readonly
    * @static
    * @property {string} NS_SEPARATOR 名称空间分隔符
    */
   NS_SEPARATOR : ".",
   /**
    * @readonly
    * @static
    * @property {string} LOAD_NS 参数批量设置的时候名称空间项识别码常量
    */
   LOAD_NS : "namespaces",

   /**
    * @readonly
    * @static
    * @property {string} AUTO_REGISTER_TOPJS 参数批量设置的时候是否自动注册`TopJs`框架路径识别码常量
    */
   AUTO_REGISTER_TOPJS : "autoregister_topjs",

   /**
    * @readonly
    * @static
    * @property {string} NAMESPACE_ACCESSOR_KEY 对象代理访问时候获取名称空间对象的特殊键名
    */
   NAMESPACE_ACCESSOR_KEY : "__NAMESPACE_ACCESSOR_KEY__",

   /**
    * @static
    * @property {Function[]} afterRegisteredCallbacks 当autoloader注册完成之后调用的回调函数
    */
   afterRegisteredCallbacks : [],
   
   /**
    * @static
    * @param {Function} callback 向`loader`注册一个回调函数，当`autoloader`完成注册之后调用
    */
   addAfterRegisteredCallback(callback)
   {
      if(callback != null && typeof callback == 'function'){
         StandardAutoloader.afterRegisteredCallbacks.push(callback);
      }
   }
});

Object.assign(StandardAutoloader.prototype,
   /** @lends TopJs.kernel.loader.StandardAutoloader.prototype */
   {
   /**
    * @protected
    * @property {Map[]} namespaces 名称空间到类的文件夹之间的映射
    */
   namespaces : new Map(),

   /**
    * @protected
    * @property {boolean} registered 是否已经注册过，一个loader只能注册一次
    */
   registered : false,

   /**
    * @protected
    * @property {Map} proxyCache proxy对象的缓存
    */
   proxyCache : new Map(),


   /**
    * 可以同时配置"namespace"和"prefix"配置对，使用的结构如下:
    *
    * ```javascript
    * {
    *    namespace : {
    *       TopJs : "/path/to/topjs/library",
    *       Vender : "/path/to/other/vender/library"
    *    },
    *    fallback_autoloader => true
    * }
    * ```
    * @param {Object} options 设置自动加载相关参数
    * @return {StandardAutoloader}
    */
   setOptions(options)
   {
      for(let key in options){
         let pairs = options[key];
         switch(key){
            case StandardAutoloader.AUTO_REGISTER_TOPJS:
               if(pairs){
                  this.registerNamespace('TopJs', dirname(dirname(__dirname)));
               }
               break;
            case StandardAutoloader.LOAD_NS:
               if(is_object(pairs)) {
                  this.registerNamespaces(pairs);
               }
               break;
            default:
            //ignore
         }
      }
      return this;
   },

   /**
    * 注册一个名称空间到对应文件夹的映射项
    *
    * @param {string} namespace
    * @param {string} directory
    * @returns {StandardAutoloader}
    */
   registerNamespace(namespace, directory)
   {
      let sep = StandardAutoloader.NS_SEPARATOR;
      namespace = rtrim(namespace, sep);
      let parts = namespace.split(sep);
      let nsObj;
      if(this.namespaces.has(parts[0])){
         nsObj = this.namespaces.get(parts[0]);
      }else{
         nsObj = new Namespace(parts[0], null, null);
         this.namespaces.set(parts[0], nsObj);
      }
      //子名称空间
      for(let i = 1; i < parts.length; i++){
         let childNsObj = nsObj.getChildNamespace(parts[i]);
         if(null === childNsObj){
            nsObj = new Namespace(parts[i], nsObj, null);
         }else{
            nsObj = childNsObj;
         }
      }
      try{
         nsObj.setDirectory(this.normalizeDirectory(directory));
      }catch(err)
      {}
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
    * @returns {StandardAutoloader}
    */
   registerNamespaces(namespaces)
   {
      if(!is_object(namespaces)){
         throw new Error('arg namespaces must be object');
      }
      for(let [namespace, direcotry] of Object.entries(namespaces)){
         this.registerNamespace(namespace, direcotry);
      }
      return this;
   },

   /**
    * 通过名称空间名称，获取底层名称空间对象引用
    *
    * @param {Object} name 名称空间的名称
    * @returns {TopJs.kernel.loader.Namespace}
    */
   getNamespace(name)
   {
      let parts = name.split(StandardAutoloader.NS_SEPARATOR);
      let ns;
      if(!this.namespaces.has(parts[0])){
         return null;
      }
      ns = this.namespaces.get(parts[0]);
      for(let i = 1; i < parts.length; i++){
         ns = ns.getChildNamespace(parts[i]);
         if(null == ns){
            break;
         }
      }
      return ns;
   },

   /**
    * 向系统注册当前的自动加载器,这次之后咱们就可以按照名称空间的方式进行实例化类了
    * 
    * 比如:
    * 
    * ```javascript
    * 
    * let obj = new TopJs.somenamepace.SomeCls();
    * 
    * 
    * ```
    */
   register()
   {
      if(this.registered){
         //@todo 咱们在这里是抛出异常还是什么都不处理呢？
         return;
      }
      this.registered = true;
      for(let [ns, nsObj] of this.namespaces){
         global[ns] = this.createProxyForNamespace(nsObj);
      }
      if(StandardAutoloader.afterRegisteredCallbacks.length > 0){
         for(let callback of StandardAutoloader.afterRegisteredCallbacks){
            callback();
         }
      }
   },

   /**
    * 向底层的对象的代理注册一个`get`拦截器,实现不存在的类自动加载
    * 
    * @private
    * @param {TopJs.kernel.loader.Namespace} nsObj 原生的名称空间对象
    */
   createProxyForNamespace(nsObj)
   {
      if(!this.proxyCache.has(nsObj)){
         let self = this;
         let proto = Object.getPrototypeOf(nsObj);
         this.proxyCache.set(nsObj, new Proxy(proto, {
            getOwnPropertyDescriptors()
            {
               return Object.getOwnPropertyDescriptors(nsObj)
            },
            getOwnPropertyNames()
            {
               return nsObj.children.keys();
            },
            keys()
            {
               return nsObj.children.keys();
            },
            hasOwn(key)
            {
               return nsObj.children.has(key);
            },
            get(target, key)
            {
               if(StandardAutoloader.NAMESPACE_ACCESSOR_KEY == key){
                  return nsObj;
               }
               let keyType = typeof key;
               let builtInKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(target));
               builtInKeys.push('inspect');// for console.log
               let v = Reflect.get(target, key);
               if(v || "symbol" == keyType || in_array(key, builtInKeys)){
                  return v
               }
               let child = nsObj.getChild(key);
               if(child instanceof Namespace){
                  return self.createProxyForNamespace(child);
               }
               if(child){
                  return child;
               }
               //这个地方有两种处理
               //一个是当前名称空间下面有子文件夹与当前的key同名那我们返回一个
               //名称空间对象，如果有文件名为将加载文件，并且认为这个文件就是类的定义文件
               //首先判断名称空间
               try {
                  let filename = path.resolve(nsObj.directory, key);
                  let stats = statSync(filename);
                  if (stats.isDirectory()) {
                     return self.createProxyForNamespace(new Namespace(key, nsObj, filename));
                  }
               } catch (err) {
                  if("ENOENT" !== err.code) {
                     console.error(err);
                  }
               }
               // 查看是否存在类文件
               try {
                  let filename = path.resolve(nsObj.directory, `${key}.js`);
                  let stats = statSync(filename);
                  if (stats.isFile()) {
                     let Cls = require(filename);
                     Cls._autoload = {
                        filename : filename,
                        namespace : nsObj
                     };
                     nsObj.children.set(key, Cls);
                     return Cls;
                  }

               } catch (err) {
                  console.error(err);
               }
               return null;
            }
         }));
      }
      return this.proxyCache.get(nsObj);
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
      if(in_array(last, ["/", "\\"])){
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
      while(!(nsObj = this.getNamespace(ns)) && parts.length > 0){
         midParts.push(parts.pop());
         ns = parts.join(".");
      }
      if(nsObj){
         dir = nsObj.directory;
      }
      dir = this.normalizeDirectory(dir);
      if(midParts.length > 0){
         dir += midParts.join(dir_separator) + dir_separator;
      }
      return dir + clsName+'.js'
   }
});
