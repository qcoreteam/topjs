/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const fs = require("fs");

let objectPrototype = Object.prototype;
let arrayPrototype = Array.prototype;
let toString = objectPrototype.toString;
let trimRegex     = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
let ltrimRegex =  /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+/g;
let rtrimRegex =  /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;

export function is_object(target)
{
   return toString.call(target) === "[[object Object]]"
}

export function is_string(value)
{
   return typeof value === 'string';
}

function get_regex_part(charList)
{
   let parts = [];
   let token = "";
   let i = 0;
   while(i < charList.length){
      let c = charList.charAt(i);
      if(c == "\\"){
         i++;
         token = "\\"+regex_escape(charList.charAt(i));
      }else if(c == " "){
         token = "\\s";
      }else{
         token = regex_escape(c);
      }
      i++;
      parts.push(token);
   }
   return parts.join("");
}

export function trim(str, charList = null)
{
   if(str){
      let regex = trimRegex;
      if(charList !== null && is_string(charList) && charList.length > 0){
         let parts = get_regex_part(charList);
         regex = new RegExp(`^[${parts}]+|[${parts}]+$`, "g");
      }
      str = str.replace(regex, "");
   }
   return str || "";
}

export function ltrim(str, charList = null)
{
   if(str){
      let regex = ltrimRegex;
      if(charList !== null && is_string(charList) && charList.length > 0){
         let parts = get_regex_part(charList);
         regex = new RegExp(`^[${parts}]+`, "g");
      }
      str = str.replace(regex, "");
   }
   return str || "";
}

export function rtrim(str, charList = null)
{
   if(str){
      let regex = rtrimRegex;
      if(charList !== null && is_string(charList)){
         let parts = get_regex_part(charList);
         regex = new RegExp(`[${parts}]+$`, "g");
      }
      str = str.replace(regex, "");
   }
   return str || "";
}

export function in_array(item, arr)
{
   return arrayPrototype.indexOf.call(arr, item) !== -1;
}

export function regex_escape(regex)
{
   return regex.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

export function change_str_at(str, pos, subStr)
{
   if(pos < 0 || pos > str.length - 1){
      return str;
   }
   return str.substring(0, pos) + subStr + str.substring(pos + 1);
}

export function file_exist(filename)
{
   try{
      fs.statSync(filename);
      return true;
   }catch (ex){
      return false;
   }
}
