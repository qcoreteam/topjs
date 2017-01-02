/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

/**
 * 我们在这个里面定义一些很重要函数，这个函数直接挂载在名称空间TopJs下面
 * 项目的其他地方调用这些函数，这个属于框架初始化部分
 */
import * as InternalFuncs from "./internal/Funcs"

let emptyFn = function(){};
let privateFn = function(){};
const objProto = Object.prototype;
const toString = objProto.toString;

//设置几个特殊的标记，以便分辨这几类函数
emptyFn.$nullFn$ = emptyFn.$emptyFn$ = privateFn.$privacy$ = true;
emptyFn.$noClearOnDestroy$ = privateFn.$noClearOnDestroy$ = true;

//这个函数主要在实例上实现调用父类覆盖方法
function call_override_parent()
{
   let method = call_override_parent.caller.caller;
   return method.$owner$.prototype[method.$name$].apply(this, arguments);
}

function apply(object, cfg, defaults)
{
   if(defaults){
      apply(object, defaults);
   }
   if(object && cfg && typeof cfg === 'object'){
      for(let key in cfg){
         object[key] = cfg[key];
      }
   }
   return object;
}

function add_instance_overrides(target, owner, overrides)
{
   for(let [name, value] of Object.entries(overrides)){
      if(typeof value === "function"){
         //<debug>
         if(owner.$className$){
            value.name = owner.$className$ + "#" + name;
         }
         //</debug>
         value.$name$ = name;
         value.$owner$ = owner;
         if(target.hasOwnProperty(name)){
            value.$previous$ = target[name];//连接已经建立成功了，直接复用
         }else{
            value.$previous$ = call_override_parent;
         }
      }
      target[name] = value;
   }
}

export function mount(TopJs)
{
   /**
    * 返回当前时间戳
    *
    * @type {Number} Milliseconds since UNIX epoch.
    * @method now
    * @memberof TopJs
    */
   TopJs.now = Date.now || function()
      {
         return +new Date();
      };

   /**
    * 返回当前的时间戳，纳秒分辨率
    *
    * @type {Number}
    * @method now
    * @memberof TopJs
    */
   TopJs.ticks = function()
   {
      let tinfo = process.hrtime();
      return tinfo[0] * 1e9 + tinfo[1]
   };

   TopJs.$startTime = TopJs.ticks();
   TopJs.apply = apply;
   /**
    * @class TopJs
    */
   TopJs.apply(TopJs,{
      /**
       * 可复用的私有方法的模板
       * ```javascript
       *
       * TopJs.define("MyClass", {
       *    nothing: TopJs.emptyFnm
       *    
       *    privates: {
       *       privateNothing: TopJs.privateFn
       *    }
       * })
       *
       * ```
       *
       * @memberOf TopJs
       * @property {Function} privateFn
       */
      privateFn: privateFn,

      /**
       * 可复用的空函数模板
       *
       * @memberOf TopJs
       * @property {Function} emptyFn
       */
      emptyFn: emptyFn,

      /**
       * 有条件的将config的字段复制到object中
       *
       * @memberOf TopJs
       * @param {Object} object
       * @param {Object} config
       */
      applyIf(object, config)
      {
         if(object){
            for(let property in config){
               if(object[property] === undefined){
                  object[property] = config[property];
               }
            }
         }
         return object;
      },

      /**
       * @memberOf TopJs
       * @param {Object} value 等待检查的函数
       * @return {Boolean}
       */
      isArray : ('isArray' in Array) ? Array.isArray:
         function(value){
            return toString.call(value) === "[object Array]";
         },

      /**
       * 判断传入的是否为对象
       *
       * @param {Object} 等待测试的值
       * @return {Boolean}
       */
      isObject: InternalFuncs.is_object,

      /**
       * 判断传入的是否为字符串
       *
       * @param {Object} 等待测试的值
       * @return {Boolean}
       */
      isString: InternalFuncs.is_string,

      /**
       * 判断传入的对象是否为空，判断为空的标准是
       * 
       * - `null`
       * - `undefined`
       * - 空数组
       * - 长度为零的字符串(除非参数`allowEmptyString`为`true`)
       * 
       * @param {Object} value
       * @param {Boolean} allowEmptyString 
       * @return {Boolean}
       */
      isEmpty(value, allowEmptyString = false)
      {
         return (value == null) || (!allowEmptyString ? value === "" : false) || Ext.isArray(value) && value.length === 0;
      },

      /**
       * 销毁传入的对象，如果传入的是数组，那么递归删除
       *
       * 删除的意思是根据传入的参数决定
       *  * `Array` 所有的元素递归的删除
       *  * `Object` 所有的具有`destroy`方法的都会被调用
       *
       * @param {Mixed...} args 任意数量的对象和数组
       */
      destroy()
      {
         let ln = arguments.length;
         for(let i = 0; i < ln; i++){
            let arg = arguments[i];
            if(arg){
               if(TopJs.isArray(arg)){
                  this.destroy(...arg);
               }else if(Ext.isFunction(arg.destroy)){
                  arg.destroy();
               }
            }
         }
      },
      
      /**
       * 删除参数object中指定的字段，在这些字段上调用TopJs.destroy()函数，这些目标删除的字段最终被设置
       * 为`null`。
       * @param {Object} object
       * @param {String...} args 目标被删除的字段的名称
       * @return {Object}
       */
      destroyMembers(object)
      {
         let len = arguments.length;
         let ref;
         let name;
         for(let i = 1, a = arguments[i]; i < len; i++){
            name = a[i];
            ref = object[name];
            if(null != ref){
               TopJs.destroy(ref);
               object[name] = null;
            }
         }
      }
   });
   
}
   
