/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
export function mount(TopJs)
{
   let Obj = TopJs.Object = {};
   /**
    * @class TopJs.Object
    * @requires TopJs.Date
    * @singleton
    */
   
   TopJs.apply(Obj, /** @lends TopJs.Object */{
      /**
       * 创建一个拥有指定原型和若干个指定属性的对象
       * 
       * @method
       * @param {Object} proto 一个对象，作为新创建对象的原型。
       * @param {Object} propertiesObject 可选。该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与Object.defineProperties()的第二个参数一样）。注意：该参数对象不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，
       * 也就是说该对象的原型链上属性是无效的。
       * @return {object} 新创建的对象
       * @throws TypeError
       */
      chain : Object.create,
      
   });
}