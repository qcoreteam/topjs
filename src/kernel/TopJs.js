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
const iterableRe = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List)\]/;

//设置几个特殊的标记，以便分辨这几类函数
emptyFn.$nullFn$ = emptyFn.$emptyFn$ = privateFn.$privacy$ = true;
emptyFn.$noClearOnDestroy$ = privateFn.$noClearOnDestroy$ = true;

//这个函数主要在实例上实现调用父类覆盖方法
//只要跨过当前一层就ok了
function call_override_parent()
{
   let method = call_override_parent.caller.caller;
   return method.$owner$.prototype[method.$name$].apply(this, arguments);
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
   /**
    * 有条件的将config的字段复制到object中
    *
    * @memberOf TopJs
    * @param {Object} object
    * @param {Object} config
    * @param {Object} defaults 默认复制对象
    */
   TopJs.apply = function(object, config, defaults)
   {
      if(defaults){
         TopJs.apply(object, defaults);
      }
      if(object && config && typeof config === 'object'){
         for(let key in config){
            object[key] = config[key];
         }
      }
      return object;
   };
   
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
       * @memberOf TopJs
       * @param {Object} 等待测试的值
       * @return {Boolean}
       */
      isObject: InternalFuncs.is_object,

      /**
       * 快速判断传入的对象是否在Object字面类型
       * 
       * @private
       * @memberOf TopJs
       * @param {Object} value
       * @return {Boolean}
       */
      isSimpleObject(value)
      {
         return value instanceof Object && value.constructor === Object;
      },
      
      /**
       * 判断传入的是否为字符串
       *
       * @memberOf TopJs
       * @param {Object} 等待测试的值
       * @return {Boolean}
       */
      isString: InternalFuncs.is_string,

      /**
       * 判断传入的是否为函数
       * 
       * @memberOf TopJs
       * @param {Object} value 等待测试的值
       * @return {Boolean}
       */
      isFunction(value)
      {
         return !!value && typeof value === 'function';
      },

      /**
       * 如果传入的对象为number返回`true`，不是number或者无穷数返回`false`
       * 
       * @memberOf TopJs
       * @param {Object} value
       * @returns {boolean}
       */
      isNumber(value)
      {
         return typeof value === "number" && isFinite(value);
      },

      /**
       * 返回`true`如果传入的对象是`numeric`类型
       * 
       * @memberOf TopJs
       * @param {Object} value 例如：1, '1', '2.34'
       * @return {Boolean} 
       */
      isNumeric(value)
      {
         return !isNaN(parseFloat(value)) && isFinite(value);
      },

      /**
       * 返回`true`如果传入的对象是布尔型
       * 
       * @memberOf TopJs
       * @param {Object} value
       * @return {Boolean}
       */
      isBoolean(value)
      {
         return typeof value === "boolean";
      },

      /**
       * 判断传入的对象是否为JavaScript 'primitive'，字符串, 数字和布尔类型
       * 
       * @memberOf TopJs
       * @param {Object} value
       * @return {Boolean}
       */
      isPrimitive(value)
      {
         let type = typeof value;
         return "string" === type || "number" === type || "boolean" === type;
      },

      /**
       * 判断传入的对象是否为日期类型
       * 
       * @memberOf TopJs
       * @param {Object} value 等待检查的对象
       * @return {Boolean}
       */
      isDate(value)
      {
         return toString.call(value) === "[object Date]";
      },
      
      /**
       * 判断传入的对象是否为空，判断为空的标准是
       * 
       * - `null`
       * - `undefined`
       * - 空数组
       * - 长度为零的字符串(除非参数`allowEmptyString`为`true`)
       * 
       * @memberOf TopJs
       * @param {Object} value
       * @param {Boolean} allowEmptyString 
       * @return {Boolean}
       */
      isEmpty(value, allowEmptyString = false)
      {
         return (value == null) || (!allowEmptyString ? value === "" : false) || TopJs.isArray(value) && value.length === 0;
      },

      /**
       * 判断传入的对象是否已经定义
       * 
       * @memberOf TopJs
       * @param {Object} value
       * @return {Boolean}
       */
      isDefined(value)
      {
         return typeof value !== "undefined";
      },

      /**
       * 探测传入的值是否可遍历
       * 
       * @param {Object} value
       * @return {Boolean}
       */
      isIterable(value)
      {
         if(!value || typeof value.length !== "number" || typeof value === "string" || 
            TopJs.isFunction(value)){
            return false;
         }
         if(!value.propertyIsEnumerable){
            return !!value.item;
         }
         if(value.hasOwnProperty("length") && !value.propertyIsEnumerable("length")){
            return true;
         }
         return iterableRe.test(toString.call(value));
      },

      /**
       * 确保返回值，如果value不为空返回自己，否则返回defaultValue
       *
       * @param {Object} value
       * @param {Object} defaultValuem
       * @param {Object} allowBlank 默认为false，当为true的时候，空字符串不为空
       */
      ensureValue(value, defaultValuem, allowBlank = false)
      {
         return TopJs.isEmpty(value, allowBlank) ? defaultValuem : value;
      },

      /**
       * 销毁传入的对象，如果传入的是数组，那么递归删除
       *
       * 删除的意思是根据传入的参数决定
       *  * `Array` 所有的元素递归的删除
       *  * `Object` 所有的具有`destroy`方法的都会被调用
       *
       * @memberOf TopJs
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
       * 
       * @memberOf TopJs
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
      },

      /**
       * 用给定的值覆盖目标对象的指定的字段
       * 
       * 如果目标的`target`的是通过{@link TopJs#define TopJs.define}定义的类，那么
       * 对象的`override`方法将会调用 (参考 {@link TopJs.Base#override}) 把`overrides`
       * 当做参数传入
       * 
       * 如果传入的`target`是函数，那么我们默认其为构造函数，`overrides'将使用{@link TopJs.apply}
       * 添加到其的原型对象上
       * 
       * 如果目标的`target`的是通过{@link TopJs#define TopJs.define}定义的类的实例化的对象，那么
       * `overrides`将复制到实例对象上，这种情况下，方法拷贝会被特使处理，让其能使用{@link TopJs.Base#callParent}。
       * 
       * ```javascript
       * let controller = new TopJs.Controller({ ... });
       * 
       * TopJs.override(controller, {
       *    forwardRequest: function()
       *    {
       *       //一些语句
       *       this.callParent();
       *    }
       * });
       * 
       * ```
       * 
       * 如果`target`不是以上几种，那么`overrides`将使用{@link TopJs#apply}复制到`target`上
       * 
       * 详情请参考 {@link TopJs#define TopJs.define}和{@link TopJs.Base#override}
       * 
       * @memberOf TopJs
       * @param {Object} target 目标替换对象
       * @param {Object} overrides 替换时使用的值对象
       * @return {Object} 替换之后的对象
       */
      override(target, overrides)
      {
         if(target.$isClass$){
            target.override(overrides);
         }else if(typeof target === "function"){
            TopJs.apply(target.prototype, overrides);
         }else{
            let owner = target.self;
            let privates;
            if(owner && owner.$isClass$){
               // 由 TopJs.define's 类
               privates = overrides.privates;
               if(privates){
                  overrides = TopJs.apply({}, overrides);
                  delete overrides.privates;
                  add_instance_overrides(target, owner, privates);
               }
               add_instance_overrides(target, owner, overrides);
            }else{
               TopJs.apply(target, overrides);
            }
         }
         return target;
      },

      /**
       * 克隆一个指定的对象
       * 
       * @memberOf TopJs
       * @param {Object} item
       * @return {Object}
       */
      clone(item)
      {
         if(null === item || undefined === item){
            return item;
         }
         let type = toString.call(item);
         let clone;
         // Date
         if("[object Date]" === type){
            return new Date(item.getTime());
         }
         
         // Array
         if("[object Array]" === type){
            let i = item.length;
            clone = [];
            while(i--){
               clone[i] = TopJs.clone(item[i]);
            }
         }
         // Object
         else if("[object Object]" === type && item.constructor === Object){
            clone = {};
            for(let key in item){
               clone[key] = TopJs.clone(item[key]);
            }
         }
         return clone || item;
      }
   });
   
}
   
