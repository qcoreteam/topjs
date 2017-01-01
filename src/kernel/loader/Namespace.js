"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * 定义一个名称空间的包装器
 * 
 * @author Jonathan ARNAULT
 */
export default class Namespace
{
   /**
    * 名称空间的名称
    * 
    * @private {string|null} name
    */
   name;
   
   /**
    * 当前名称空间的父名称空间
    * 
    * @private {string|null} parent
    */
   parent;
   
   /**
    * 当前名称空间对应的文件夹
    * 
    * @private {string|null} directory
    */
   directory;
   
   /**
    * 子名称空间或者本名称空间的类
    * 
    * @private {Map} children
    */
   children = new Map();

   /**
    * @param {string} name
    * @param {Namespace} parent
    * @param {string} directory
    */
   constructor(name = null, parent = null, directory = null)
   {
      this.name = name;
      this.parent = parent;
      this.directory = directory;
      if(this.parent){
         this.parent.setChild(name, this);
      }
   }

   /**
    * 获取当前名称空间的全称
    * 
    * @return {string}
    */
   getFullName()
   {
      if(null !== this.parent){
         return this.parent.getFullName() + "." + this.name;
      }
      return this.name;
   }

   /**
    * 获取名称空间的子项
    * 
    * @return {string[]}
    */
   getChildrenKeys()
   {
      let iterator = this.children.keys();
      let keys = [];
      for(let key of iterator){
         keys.push(key);
      }
      return kyes;
   }
   
   setDirectory(directory)
   {
      if(null !== this.directory){
         throw new Error(`当前名称空间："${this.name}"的文件夹已经设置`);
      }
      this.directory = directory;
   }

   /**
    * 获取当前名称空间的子名称空间，如果不存在则返回false
    * 
    * @param name
    * @returns {Namespace|null}
    * @throws {Error} 当子名称空间名称中含有.的时候抛出
    */
   getChildNamespace(name)
   {
      if(this.children.has(name)){
         let child = this.children.get(name);
         if(child instanceof Namespace){
            return child;
         }
      }
      return null;
   }
   
   getChild(name)
   {
      if(this.children.has(name)){
         return this.children.get(name);
      }
      return null;
   }
   
   setChild(name, ns)
   {
      if(-1 !== name.indexOf(".")){
         throw new Error("child namespace name cannot contains '.'");
      }
      if(null !== ns && ns instanceof Namespace){
         if(this.children.has(name)){
            return;
         }
         this.children.set(name, ns);
      }
   }
}