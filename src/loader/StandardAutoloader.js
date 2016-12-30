/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
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
   static NS_SEPARATOR = '\\';
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
    * @type {string[]}
    */
   namespaces = [];
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
   
   constructor(options = null)
   {
      if(null !== options){
         this.setOptions(options);
      }
   }

   setOptions(options)
   {
      
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

   registerNamespace(namespace, directory)
   {

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
      return 'ok1';
   }

   register()
   {

   }

   transformClassNameToFilename(cls, direcotry)
   {

   }

   loadClass(cls, type)
   {

   }

   normalizeDirectory(directory)
   {
      
   }
}
//直接将加载器导出
module.exports = StandardAutoloader;