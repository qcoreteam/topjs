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
 * 标准自动加载器
 */
export default class StandardAutoloader
{
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static NS_SEPARATOR = ".";
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static LOAD_NS = "namespaces";

   /**
    * @readonly
    * @static
    * @type {string}
    */
   static AUTO_REGISTER_TOPJS = "autoregister_topjs";

   /**
    * @readonly
    * @static
    * @type {string} NAMESPACE_ACCESSOR_KEY
    */
   static NAMESPACE_ACCESSOR_KEY = "__NAMESPACE_ACCESSOR_KEY__";

   /**
    * 当autoloader注册完成之后调用的回调函数
    * 
    * @static
    * @type {Function[]}
    */
   static afterRegisteredCallbacks = [];
   
   /**
    * 名称空间到类的文件夹之间的映射
    *
    * @protected
    * @type {Map[]}
    */
   namespaces = new Map();
   /**
    * 前缀和文件夹之间的映射
    *
    * @protected
    * @type {Map[]}
    */
   prefixes = new Map();

   /**
    * 是否已经注册过，一个loader只能注册一次
    *
    * @protected
    * @type {boolean}
    */
   registered = false;

   /**
    * proxy对象的缓存
    * 
    * @protected
    * @type {Map}
    */
   proxyCache = new Map();
   /**
    * @param {Object} options
    */
   constructor(options = null)
   {
      if(null !== options){
         this.setOptions(options);
      }
   }

   /**
    * 设置自动加载相关参数
    *
    * 可以同时配置"namespace"和"prefix"配置对，使用的结构如下:
    *
    * ```javascript
    * {
    *    namespace : {
    *       TopJs : "/path/to/topjs/library",
    *       Vender : "/path/to/other/vender/library"
    *    },
    *    prefixes : {
    *       JsLib_ : "/path/to/JsLib/library"
    *    },
    *    fallback_autoloader => true
    * }
    * ```
    *
    * @param {Object} options
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
   }
   
   static addAfterRegisteredCallback(callback)
   {
      if(callback != null && typeof callback == 'function'){
         StandardAutoloader.afterRegisteredCallbacks.push(callback);
      }
   }

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
   }

   /**
    * 一次性注册多个名称空间到文件目录的映射
    *
    * @param namespaces
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
   }
   
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
   }
   
   /**
    * 向系统注册当前的自动加载器
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
   }

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
   }
   
   /**
    * 格式化加载目录，主要就是在路径的末尾加上路径分隔符
    *
    * @protected
    * @param {string} directory
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
   }

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
}
