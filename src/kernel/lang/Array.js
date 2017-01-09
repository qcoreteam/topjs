/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

export function mount(TopJs)
{
   let Array = TopJs.Array = {};
   /**
    * @class TopJs.Array
    * @singleton
    */
   TopJs.apply(Array, {
      /**
       * 判断两个数组是否严格相等
       * 
       * @memberof TopJs.Array
       * @param {Array} array1
       * @param {Array} array2
       * @return {Boolean}
       */
      equals(array1, array2)
      {
         let len1 = array1.length;
         let len2 = array2.length;
         //避免引用相等
         if(array1 === array2){
            return true;
         }
         if(len1 !== len2){
            return false;
         }
         for(let i = 0; i < len1; i++){
            if(array1[i] !== array2[i]){
               return false;
            }
         }
         return true;
      },

      /**
       * 过滤数组中为空的项，判断标准 {@link TopJs.isEmpty TopJs.isEmpty}
       * 
       * @memberof TopJs.Array
       * @param {Array} array
       * @return {Array}
       */
      clean(array)
      {
         let ret = [];
         let len = array.length;
         let item;
         for(let i = 0; i < len; i++){
            item = array[i];
            if(!TopJs.isEmpty(item)){
               ret.push(item);
            }
         }
         return ret;
      },

      /**
       * 删除数组中重复的项
       * 
       * @memberof TopJs.Array
       * @param {Array} array
       * @return {Array}
       */
      unique(array)
      {
         let clone = [];
         let item;
         let len;
         for(let i = 0; i < len; i++){
            item = array[i];
            if(!clone.includes(item)){
               clone.push(item);
            }
         }
         return clone;
      },

      /**
       * 删除数组中的值为item的项
       * 
       * @memberof TopJs.Array
       * @param {Array} array 目标操作的数组
       * @param {Object...} items
       * @return {Array} 已经删除过指定的元素的项
       */
      remove(array, ...items)
      {
         let len = items.length;
         let item;
         let index;
         for(let i = 0; i < len; i++){
            item = items[i];
            index = array.indexOf(item);
            if(-1 !== index){
               array.splice(index, 1);
            }
         }
         return array;
      },

      /**
       * 删除数组中指定的元素
       * 
       * @memberof TopJs.Array
       * @param {Array} array 待操作的
       * @param {Number} index 指定要删除的项的索引
       * @param {Number} [count=1] 需要删除的个数
       * @return {Array} 
       */
      removeAt(array, index, count = 1)
      {
         let len = array.length;
         if(index >= 0 && index < len){
            count = Math.min(count, len - index);
            array.splice(index, count);
         }
         return array;
      }
   });
}
