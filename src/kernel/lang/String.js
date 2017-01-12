/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
import {trim, ltrim, rtrim, is_string, change_str_at} from '../internal/Funcs';

export function mount(TopJs)
{
   let StringObject = Topjs.String = {};
   let charToEntity = new Map();
   let entityToChar = new Map();
   let charToEntityRegex;
   let entityToCharRegex;
   let escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g;
   let escapeRe      = /('|\\)/g;
   function bounds_check(str, other)
   {
      if(null === str || undefined === str || null === other || undefined === other){
         return false;
      }
      return other.length <= str.length;
   }
   
   function html_encode_replace(match, capture)
   {
      return charToEntity[capture];
   }
   
   function html_decode_replace(match, capture)
   {
      return (capture in entityToChar) ? entityToChar[capture] : 
         String.fromCharCode(parseInt(capture.substr(2), 10));
   }
   
   //@requires TopJs.Array
   /**
    * @class TopJs.String
    * @singleton
    */
   TopJs.apply(StringObject, /** @lends TopJs.String */{
      /**
       * 向目标字符串插入子串到指定的位置
       *
       * ```javascript
       * TopJs.String.insert("abcdefg", "h", -1);
       * // abcdefhg
       * 
       * ```
       * @param {String} str 原始的字符串
       * @param {String} value 需要插入的子字符串
       * @param {Number} index 需要插入的位置
       * @return {String} 插入子串的结果字符串
       */
      insert(str, value, index)
      {
         if(!str){
            return value;
         }
         if(!value){
            return str;
         }
         let len = str.length;
         if(!index && index !== 0){
            index = len;
         }
         if(index < 0){
            index *= -1;
            if(index >= len){
               index = 0;
            }else{
               index = len - index;
            }
         }
         if(0 === index){
            str = value + str;
         }else if(index >= str.length){
            str += value;
         }else{
            str += s.substr(0, index) + value + str.substr(index);
         }
         return str;
      },

      /**
       * 检查一个字符是否以指定的子串开始
       * 
       * @param {String} str 原始字符串
       * @param {Number} start 子串检查的起始位移
       * @param {Number} position 在`str`中搜索`start`的开始位置，默认值为 0，也就是真正的字符串开头处
       * @param {Boolean} [ignoreCase=false] 是否忽略大小写
       * @return {Boolean} 检查的结果
       */
      startsWith(str, start, position = 0, ignoreCase = false)
      {
         let result = bounds_check(str, start);
         if(result){
            if(ignoreCase){
               str = str.toLowerCase();
               start = start.toLowerCase();
            }
            result = str.startsWith(start, position);
         }
         return result;
      },

      /**
       * 检查一个字符是否以指定的子串结束
       *
       * @param {String} str 原始字符串
       * @param {Number} end 子串检查的结束位移
       * @param {Number} [position=str.length] 在`str`中搜索`end`的结束位置，默认值为`str.length`，也就是真正的字符串结尾处
       * @param {Boolean} [ignoreCase=false] 是否忽略大小写
       * @return {Boolean} 检查的结果
       */
      endsWith(str, end, position, ignoreCase = false)
      {
         let result = bounds_check(str, end);
         if(result){
            if(ignoreCase){
               str = str.toLowerCase();
               start = end.toLowerCase();
            }
            position = position ? position : str.length;
            result = str.endsWith(end, position);
         }
         return result;
      },

      /**
       * 将当前的字符串 `(&, <, >, ', and ")` 转换成html实体代码，便于在前端展示
       * 
       * @param {String} value 等待转义的字符串
       * @return {String}
       */
      htmlEncode(value)
      {
         return (!value) ? value : String(value).replace(charToEntity, html_encode_replace);
      },

      /**
       * 将html实体代码转换成，`(&, <, >, ', and ")`字符
       * 
       * @param {String} value 等待转义的字符串
       * @return {String}
       */
      htmlDecode(value)
      {
         return (!value) ? value : String(value).replace(entityToCharRegex, html_decode_replace);
      },

      /**
       * 判断字符串是否包含需要转义的html字符
       * 
       * @param {String} str 判断字符串是否含有html实体
       * @return {Boolean}
       */
      hasHtmlChars(str)
      {
         return charToEntityRegex.test(str);
      },

      /**
       * 增加html实体集定义，用于支持函数{@link TopJs.String.htmlEncode}和函数{@link TopJs.String.htmlDecode}
       * 
       * ```javascript
       * TopJs.String.addCharEntities({
       *    '&amp;Uuml;':'Ü',
       *    '&amp;ccedil;':'ç',
       *    '&amp;ntilde;':'ñ',
       *    '&amp;egrave;':'è'
       * });
       * let s = TopJs.String.htmlEncode("A string with entities: èÜçñ");
       * ```
       * 您可以使用函数对实体集合进行重置{@link TopJs.String.resetCharEntities}
       * 
       * @param {Object} entities
       * @param {String} entities.key html实体定义
       * @param {String} entities.value html实体对应的字符表示
       * @return {Null}
       */
      addCharEntities(entities)
      {
         let charKeys = [];
         let entityKeys = [];
         for(let [key, echar] of entities){
            entityToChar.set(key, echar);
            charToEntity.set(echar, key);
            charKeys.push(echar);
            entityKeys.push(key);
         }
         charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
         entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
      },

      /**
       * 重置字符实体定义到默认状态，这个定义在函数{@link TopJs.String.htmlEncode}和函数{@link TopJs.String.htmlDecode}
       * 中使用
       * 
       * @return {Null}
       */
      resetCharEntities()
      {
         charToEntity.clear();
         entityToChar.clear();
         //添加默认的集合
         this.addCharEntities({
            "&amp;"     :   '&',
            "&gt;"      :   '>',
            "&lt;"      :   '<',
            "&quot;"    :   '"',
            "&#39;"     :   "'"
         });
      },

      /**
       * 给一个`url`字符串添加查询子串，自动判断
       * 
       * @param {String} url 目标字符串
       * @param {String} string 将要添加到`url`的字符串
       * @return {String} 结果字符串
       */
      urlAppend(url, string)
      {
         if(!TopJs.isEmpty(string)){
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
         }
         return url;
      },

      /**
       * 删除字符串首尾的空格，中间的空格不处理
       *
       * ```javascript
       * let s = "  hello TopJs  ";
       * console.log(TopJs.String.trim(s));  //console.log("hello TopJs")
       * ```
       *
       * @method
       * @param {String} str 等待处理字符串
       * @param {String} [charList] 需要过滤的字符集
       */
      trim: trim,
      
      /**
       * 删除字符串左边的空格，其余地方的空格不处理
       *
       * ```javascript
       * let s = "  hello word  ";
       * console.log(TopJs.String.trim(s));  //console.log("hello word  ")
       * ```
       * @method
       * @param {String} str 等待处理字符串
       * @param {String} [charList] 需要过滤的字符集
       * @return {String} 处理后的字符串
       */
      ltrim: ltrim,

      /**
       * 删除字符串右边的空格，其余地方的空格不处理
       *
       * ```javascript
       * let s = "  foo bar  ";
       * console.log(TopJs.String.trim(s));  //console.log("  foo bar")
       * ```
       * @method
       * @param {String} str 等待处理字符串
       * @param {String} [charList] 需要过滤的字符集
       * @return {String} 处理后的字符串
       */
      rtrim: rtrim,

      /**
       * 将给定的字符串的首字母大写
       * 
       * @param {String} string 等待处理的字符串
       * @return {String} 处理之后的字符串
       */
      capitalize(string)
      {
         if(string){
            string = string.charAt(0).toUpperCase() + string.substr(1);
         }
         return string || '';
      },

      /**
       * 将给定的字符串的首字母小写
       *
       * @param {String} string 等待处理的字符串
       * @return {String} 处理之后的字符串
       */
      uncapitalize(string)
      {
         if(string){
            string = string.charAt(0).toLowerCase() + string.substr(1);
         }
         return string || '';
      },

      /**
       * 当给定的字符串`value`长度超过指定`length`的时候显示`...`
       *
       * @param {String} value 需要处理的字符串
       * @param {Number} length 显示省略号的最小长度
       * @param {Boolean} [word=false] `true`智能分割单词
       * @return {String} 转换后的字符串
       */
      ellipsis(value, length, word = false)
      {
         if(value && value.length > length){
            if(word){
               let vs = value.substr(0, length - 2);
               let index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
               if (index !== -1 && index >= (length - 15)) {
                  return vs.substr(0, index) + "...";
               }
            }
            return value.substr(0, length - 3) + "...";
         }
      },

      /**
       * 对传入的字符进行转义，处理里面的正则的特殊符号
       * 
       * @param {String} string 等待处理的字符串
       * @return {String} 过滤之后的字符串
       */
      escapeRegex(string)
      {
         return string.replace(escapeRegexRe, "\\$1");
      },

      /**
       * 通过制定的字符串，创建正则表达式对象
       * 
       * @param {String/RegExp} value 转换成正则的字符串
       * @param {Boolean} startsWith 正则表达式开始的部分
       * @param {Boolean} endsWith 正则表达式结束的部分
       * @param {Boolean} ignoreCase 是否忽略大小写
       * @return {RegExp} 创建的正则表达式
       */
      createRegex(value, startsWith, endsWith, ignoreCase)
      {
         let ret = value;
         if(value !== null && !value.exec){
            StringObject.escapeRegex(value);
            if(startsWith !== false){
               ret = '^' + ret;
            }
            if(endsWith !== false){
               ret += '$';
            }
            ret = new RegExp(ret, (false !== ignoreCase) ? 'i' : '');
         }
         return ret;
      },

      /**
       * 转义字符串里面的`'`和`\`
       * 
       * @param {String} string 等待转换的字符串
       * @return {String} 转换完成的字符串
       */
      escape(string)
      {
         return string.replace(escapeRe, "\\$1");
      },

      /**
       * 工具函数，根据`string`当前的值，让函数的返回值在`value1`和`value2`之间来回切换
       * 
       * @param {String} string 用来比对的字符串
       * @param {String} value1 可能的值之一
       * @param {String} value2 可能的值之一
       * @return {String} 返回翻转之后的值
       */
      toggle(string, value1, value2)
      {
         return (string === value1) ? value2 : value1;
      },

      /**
       * 根据指定的宽度`size`在字符串`string`左边补充`char`指定的字符
       * 
       * @param {String} string
       * @param {Number} size
       * @param {String} [char=' '] 
       */
      leftPad(string, size, char = ' ')
      {
         let ret = String(string);
         if(ret.length < size){
            ret = char + ret;
         }
         return ret;
      },

      /**
       * 将模式字符串重复指定的次数，使用`sep`指定的参数进行分隔
       * 
       * @param {String} pattern 用来重复的模式字符串
       * @param {Number} count 重复的次数
       * @param {String} [sep=''] 分隔字符
       * @return {String}  
       */
      repeat(pattern, count, sep = '')
      {
         if(count < 1){
            count = 0;
         }
         let ret = [];
         for(let i = 0; i < count; i++){
            ret.push(pattern);
         }
         return ret.join(sep);
      }
   });
}