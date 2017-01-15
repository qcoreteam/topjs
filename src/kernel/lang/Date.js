/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
export function mount(TopJs)
{
   let DateObj = Topjs.Date = {};
   /**
    * @class TopJs.Date
    * @singleton
    * 
    * @classdesc
    * 日期处理和格式化支持部分`date()`函数的语法[PHP的date()函数的语法](http://www.php.net/date)
    * 并且支持的部分使用方法跟`PHP`的一样
    *
    * 以下是当前支持的格式符列表
    *
    *      格式符       描述                                                                       例子和返回值
    *      ------      -----------------------------------------------------------------------   -----------------------
    *        d         一个月的当前是第几天，当为个位数的时候前置加`0`                                   `01`到`31`
    *        D         一个星期的第几天的名字简称                                                     `Mon`到`Sun`
    *        j         一个月的当前是第几天, 当为个位数的时候前置不加`0`                                 `1`到`31`
    *        l         一个星期的第几天的名字全称                                                     `Sunday`到`Saturday`
    *        N         使用`ISO-8601`标准描述一个星期的第几天                                         `1` (代表星期一)到`7`(代表星期天)
    *        S         一个月第几天的英文两字母名称                                                   `st`, `nd`, `rd` or `th`. Works well with `j`
    *        w         一个星期第几天的数字表示                                                       `0` (代表代表星期天)到`6`(代表星期六)
    *        z         一年的第几天，从`0`开始计数                                                    `0`到`364`(闰年的话`365`)
    *        W         使用`ISO-8601`描述一年的第几个星期，一星期开始从周一开始算起                       `01`到`53`
    *        F         月份的英文全称描述, 比如January或者March                                       从`January`到`December`
    *        m         月份的数字描述                                                               `01`到`12`
    *        M         月份的英文简单描述                                                            `Jan`到`Dec`
    *        n         月份的数字描述，前置不加`0`                                                    `1`到`12`
    *        t         给定日期对象特定月份的天数                                                     `28`到`31`
    *        L         当前日期对象的年份是否是闰年                                                   `1`代表闰年，`0`代表不是闰年
    *        o         ISO-8601 year number (identical to (Y), but if the ISO week number (W)    例如: `1998`或者`2004`
    *                  belongs to the previous or next year, that year is used instead)
    *        Y         年份的四个数字表示法                                                         例如: `1999`或者`2003`
    *        y         年份的两个数字表示法                                                         例如: `99`或者`03`
    *        a         上午或者下午的小写英文表示                                                    `am`或者`pm`
    *        A         上午或者下午的大写英文表式                                                    `AM`或者`PM`
    *        g         12小时制时间，不加前缀`0`                                                    `1`到`12`
    *        G         24小时制时间，加前缀`0`                                                      `0`到`23`
    *        h         12小时制时间，加前缀`0`                                                      `01`到`12`
    *        H         24小时制时间，加前缀`0`                                                      `00`到`23`
    *        i         当前时间分钟数,加前缀`0`                                                     `00`到`59`
    *        s         当前时间的秒数，加前缀`0`                                                    `00`到`59`
    *        u         Decimal fraction of a second                                              Examples:
    *                  (minimum 1 digit, arbitrary number of digits allowed)                     001 (i.e. 0.001s) or
    *                                                                                            100 (i.e. 0.100s) or
    *                                                                                            999 (i.e. 0.999s) or
    *                                                                                            999876543210 (i.e. 0.999876543210s)
    *        O         当前日期对象到Greenwich time (GMT)的小时和分钟数                               例如: +1030
    *        P         当前日期对象到Greenwich time (GMT)的小时和分钟数，用分号隔开                     例如: -08:00
    *        T         执行代码的机器的时区的缩写                                                     例如: EST, MDT, PDT ...
    *        Z         Timezone offset in seconds (negative if west of UTC, positive if east)    -43200 to 50400
    *        c         ISO 8601 date represented as the local time with an offset to UTC appended.
    *                  Notes:                                                                    Examples:
    *                  1) If unspecified, the month / day defaults to the current month / day,   1991 or
    *                     the time defaults to midnight, while the timezone defaults to the      1992-10 or
    *                     browser's timezone. If a time is specified, it must include both hours 1993-09-20 or
    *                     and minutes. The "T" delimiter, seconds, milliseconds and timezone     1994-08-19T16:20+01:00 or
    *                     are optional.                                                          1995-07-18T17:21:28-02:00 or
    *                  2) The decimal fraction of a second, if specified, must contain at        1996-06-17T18:22:29.98765+03:00 or
    *                     least 1 digit (there is no limit to the maximum number                 1997-05-16T19:23:30,12345-0400 or
    *                     of digits allowed), and may be delimited by either a '.' or a ','      1998-04-15T20:24:31.2468Z or
    *                  Refer to the examples on the right for the various levels of              1999-03-14T20:24:32Z or
    *                  date-time granularity which are supported, or see                         2000-02-13T21:25:33
    *                  http://www.w3.org/TR/NOTE-datetime for more info.                         2001-01-12 22:26:34
    *        C         An ISO date string as implemented by the native Date object's             1962-06-17T09:21:34.125Z
    *                  [Date.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)
    *                  method. This outputs the numeric part with *UTC* hour and minute
    *                  values, and indicates this by appending the `'Z'` timezone
    *                  identifier.
    *        U         January 1 1970 00:00:00 GMT到现在的秒数                                     1193432466 or -2138434463
    *        MS        Microsoft AJAX serialized dates                                           \/Date(1238606590509)\/ (i.e. UTC milliseconds since epoch) or
    *                                                                                            \/Date(1238606590509+0800)\/
    *        time      javascript毫秒时间戳                                                        1350024476440
    *        timestamp UNIX时间戳，跟(U)效果一样                                                    1350024866
    */
   let utilDate;
   let nativeDate = Date;
   let stripEscapeRe = /(\\.)/g;
   let hourInfoRe = /([gGhHisucUOPZ]|MS)/;
   let dateInfoRe = /([djzmnYycU]|MS)/;
   let slashRe = /\\/gi;
   let numberTokenRe = /\{(\d+)\}/g;
   let MSFormatRe = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
   let pad = TopJs.String.leftPad;
   // Most of the date-formatting functions below are the excellent work of Baron Schwartz.
   // (see http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/)
   // They generate precompiled functions from format patterns instead of parsing and
   // processing each pattern every time a date is formatted.
   
   
   TopJs.apply(DateObj, /** @lends TopJs.Date */{
      
   });
}