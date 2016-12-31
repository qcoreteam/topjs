/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

import {is_object, in_array, rtrim, is_string, change_str_at} from '../kernel/internal/Funcs';
import {sep as dir_separator} from 'path';

/**
 * 标准自动加载器
 */
class StandardAutoloader
{
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static NS_SEPARATOR = '.';
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static PREFIX_SEPARATOR = '_';
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static LOAD_NS = 'namespace';
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static LOAD_PREFIX = 'prefix';
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static ACT_AS_FALLBACK = 'fallback_autoloader';
   /**
    * @readonly
    * @static
    * @type {string}
    */
   static AUTO_REGISTER_TOPJS = 'autoregister_topjs';
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
    * @type {string[]}
    */
   prefixes = [];
   /**
    * @protected
    * @type {boolean}
    */
   fallbackAutoloaderFlag = false;

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
               if(value){
                  this.registerNamespace('TopJs', __dirname);
               }
               break;
            case StandardAutoloader.LOAD_NS:
               if(is_object(pairs)) {
                  this.registerNamespaces(pairs);
               }
               break;
            case StandardAutoloader.LOAD_PREFIX:
               if(is_object(pairs)){
                  this.registerPrefixes(pairs);
               }
               break;
            case StandardAutoloader.ACT_AS_FALLBACK:
               this.setFallbackAutoloader(pairs);
               break;
            default:
               //ignore
         }
      }
      return this;
   }

   setFallbackAutoloader(flag)
   {
      flag = !!flag;
      this.fallbackAutoloaderFlag = flag;
      return this;
   }

   isFallbackAutoloader()
   {
      return this.fallbackAutoloaderFlag;
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
      namespace = rtrim(namespace, StandardAutoloader.NS_SEPARATOR);
      this.namespaces.set(namespace, this.normalizeDirectory(directory));
      return this;
   }

   registerNamespaces(namespaces)
   {
   }

   registerPrefix(prefix, directory)
   {
      
   }

   registerPrefixes(prefixes)
   {
   }

   autoload()
   {
   }

   register()
   {
   }

   /**
    * 将类的名称映射成文件路径
    * 
    * @param {string} cls
    * @param {string} direcotry
    */
   transformClassNameToFilename(cls, direcotry)
   {
      // $class may contain a namespace portion, in  which case we need
      // to preserve any underscores in that portion.
      let regex = /(.+\.)?([^\.]+$)/;
      let matches = cls.match(regex);
      let clsName = matches[2] === undefined ? '' : matches[2];
      let namespace = matches[1] === undefined ? '' : matches[1];
      return direcotry + namespace.replace(new RegExp(`\\${StandardAutoloader.NS_SEPARATOR}`, 'g'), dir_separator) +
         clsName.replace(StandardAutoloader.PREFIX_SEPARATOR, dir_separator, clsName) +
         '.js'
   }

   loadClass(cls, type)
   {
      if(!in_array(type, [StandardAutoloader.LOAD_NS, StandardAutoloader.LOAD_PREFIX, StandardAutoloader.ACT_AS_FALLBACK])){
         throw new Error("arg type error, not support");
      }
      
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
}
//直接将加载器导出
module.exports = StandardAutoloader;