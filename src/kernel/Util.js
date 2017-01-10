/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

/**
 * 定义一些挂载在TopJs名称空间上的帮助函数
 * 
 * @private
 */
export function mount(TopJs)
{
   /**
    * @class TopJs
    */
   TopJs.apply(TopJs,{
      /**
       * 在指定的作用域上面执行传入的回调函数，当传入的是一个纯函数的时候，让该函数在指定的作用域下
       * 执行，如果传入的函数是字符串，那么我们在传入的作用域对象下寻找是否有这个方法，有就执行。
       * 如果什么都不传，那么我们忽略这个调用。
       * 
       * ```javascript
       * //下面几个调用时等价的
       * 
       * let fn = this.fn;
       * 
       * TopJs.callback(fn, this, [arg1, arg2]);
       * TopJs.callback("fn", this, [arg1, arg2]);
       * 
       * ```
       * 
       * @memberOf TopJs
       * @param {Function|String} callback 一个函数引用或者一个作用域下的方法名称
       * @param {Object} scope 第一个参数指定的`callback`的执行作用域，如果第一个参数为字符串，那么必须在这个作用域下
       * 存在名字为`callback`所指字符串的方法,如果`scope`为`null`那么`callback`将在`defaultScope`指定的作用域下执行
       * @param {Array} args 传给`callback`的参数
       * @param {Number} defer `callback`延迟调用的毫秒数
       * @param {Object} caller 如果没有显示的提供`scope`，那么`callback`调用时将用`caller`参数进行解析方法
       * @param {Object} defaultScope 默认的作用域，最后的容错对象
       * @return {Mixed|undefined} 返回`callback`的返回值，如果指定`defer`或者`callback`不是一个函数则返回`undefined`
       */
      callback(callback, scope, args, defer, caller, defaultScope)
      {
         
      }
   });
}