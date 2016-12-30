/**
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
class StandardAutoloader
{
   static NS_SEPARATOR = '\\';
   static PREFIX_SEPARATOR = '_';
   static LOAD_NS = 'namespace';
   static LOAD_PREFIX = 'prefix';
   static ACT_AS_FALLBACK = 'fallback_autoloader';
   static AUTO_REGISTER_TOPJS = 'autoregister_topjs';

   namespaces = [];
   prefixes = [];
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