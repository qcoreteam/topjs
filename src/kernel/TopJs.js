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
}
   
