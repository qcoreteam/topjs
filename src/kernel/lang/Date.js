/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
export function mount(TopJs)
{
    let dateObj = TopJs.Date = {};
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
    let nativeDate = Date;
    let stripEscapeRe = /(\\.)/g;
    let hourInfoRe = /([gGhHisucUOPZ]|MS)/;
    let dateInfoRe = /([djzmnYycU]|MS)/;
    let slashRe = /\\/gi;
    let numberTokenRe = /\{(\d+)\}/g;
    let MSFormatRe = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
    let pad = TopJs.String.leftPad;
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Most of the date-formatting functions below are the excellent work of Baron Schwartz.
    // (see http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/)
    // They generate precompiled functions from format patterns instead of parsing and
    // processing each pattern every time a date is formatted.
    let code = `
   let me = this;
   let def = me.defaults;
   let dt, y, m, d, h, i, s, ms, o, O, z, zz, u, v, W, year, jan4, week1monday, daysInMonth, dayMatched;
   let sn;
   let hr;
   let mn;
   let from = TopJs.Number.from;
   let results = String(input).match(me.parseRegexes[{0}]);// either null, or an array of matched strings
   if(results){
      {1}
      if(u != null){
         // i.e. unix time is defined
         v = new Date(u * 1000);
      }else{
         // create Date object representing midnight of the current day;
         // this will provide us with our date defaults
         // (note: clearTime() handles Daylight Saving Time automatically)
         dt = me.clearTime(new Date);
         y = from(y, from(def.y, dt.getFullYear()));
         m = from(m, from(def.m - 1, dt.getMonth()));
         dayMatched = d !== undefined;
         d = from(d, from(def.d, dt.getDate()));
         // Attempt to validate the day. Since it defaults to today, it may go out
         // of range, for example parsing m/Y where the value is 02/2000 on the 31st of May.
         // It will attempt to parse 2000/02/31, which will overflow to March and end up
         // returning 03/2000. We only do this when we default the day. If an invalid day value
         // was set to be parsed by the user, continue on and either let it overflow or return null
         // depending on the strict value. This will be in line with the normal Date behaviour.
         if(!dayMatched){
            dt.setDate(1);
            dt.setMonth(m);
            dt.setFullYear(y);
            daysInMonth = me.getDaysInMonth(dt);
            if(d > daysInMonth){
               d = daysInMonth;
            }
         }
         h = from(h, from(def.h, dt.getHours()));
         i = from(i, from(def.i, dt.getMinutes()));
         s = from(s, from(def.s, dt.getSeconds()));
         ms = from(ms, from(def.ms, dt.getMilliseconds()));
         if(z >= 0 && y >= 0){
            // both the year and zero-based day of year are defined and >= 0.
            // these 2 values alone provide sufficient info to create a full date object
            // create Date object representing January 1st for the given year
            // handle years < 100 appropriately
            v = me.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);
            // then add day of year, checking for Date "rollover" if necessary
            v = !strict ? v : (strict === true && (z <= 364 || (me.isLeapYear(v) && z <= 365)) ? me.add(v, me.DAY, z) : null);
         }else if(strict === true && !me.isValid(y, m + 1, d, h, i, s, ms)){
            v = null;
         }else{
            if(W){
               // support ISO-8601
               // http://en.wikipedia.org/wiki/ISO_week_date
               //
               // Mutually equivalent definitions for week 01 are:
               // a. the week starting with the Monday which is nearest in time to 1 January
               // b. the week with 4 January in it
               // ... there are many others ...
               //
               // We'll use letter b above to determine the first week of the year.
               //
               // So, first get a Date object for January 4th of whatever calendar year is desired.
               //
               // Then, the first Monday of the year can easily be determined by (operating on this Date):
               // 1. Getting the day of the week.
               // 2. Subtracting that by one.
               // 3. Multiplying that by 86400000 (one day in ms).
               // 4. Subtracting this number of days (in ms) from the January 4 date (represented in ms).
               //
               // Example #1 ...
               //
               //       January 2012
               //   Su Mo Tu We Th Fr Sa
               //    1  2  3  4  5  6  7
               //    8  9 10 11 12 13 14
               //   15 16 17 18 19 20 21
               //   22 23 24 25 26 27 28
               //   29 30 31
               //
               // 1. January 4th is a Wednesday.
               // 2. Its day number is 3.
               // 3. Simply substract 2 days from Wednesday.
               // 4. The first week of the year begins on Monday, January 2. Simple!
               //
               // Example #2 ...
               //       January 1992
               //   Su Mo Tu We Th Fr Sa
               //             1  2  3  4
               //    5  6  7  8  9 10 11
               //   12 13 14 15 16 17 18
               //   19 20 21 22 23 24 25
               //   26 27 28 29 30 31
               //
               // 1. January 4th is a Saturday.
               // 2. Its day number is 6.
               // 3. Simply subtract 5 days from Saturday.
               // 4. The first week of the year begins on Monday, December 30. Simple!
               //
               // v = Ext.Date.clearTime(new Date(week1monday.getTime() + ((W - 1) * 604800000 + 43200000)));
               // (This is essentially doing the same thing as above but for the week rather than the day)
               year = y || (new Date()).getFullYear();
               jan4 = new Date(year, 0, 4, 0, 0, 0);
               d = jan4.getDay();
               // If the 1st is a Thursday, then the 4th will be a Sunday, so we need the appropriate
               // day number here, which is why we use the day === checks.
               week1monday = new Date(jan4.getTime() - ((d === 0 ? 6 : d - 1) * 86400000));
               // The reason for adding 43200000 (12 hours) is to avoid any complication with daylight saving
               // switch overs. For example,  if the clock is rolled back, an hour will repeat, so adding 7 days
               // will leave us 1 hour short (Sun <date> 23:00:00). By setting is to 12:00, subtraction
               // or addition of an hour won't make any difference.
               v = TopJs.Date.clearTime(new Date(week1monday.getTime() + ((W - 1) * 604800000 + 43200000)));
            }else{
               // plain old Date object
               // handle years < 100 properly
               v = me.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);
            }
         }
      }
   }
   if(v){
      // favor UTC offset over GMT offset
      if(zz != null){
         // reset to UTC, then add offset
         v = me.add(v, me.SECOND, -v.getTimezoneOffset() * 60 - zz);
      }else if(o){
         v = me.add(v, me.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));
      }
   }
   return (v != null) ? v : null;
`;
    //为TopJs.Date.getWeekOfYear()函数定义两个常量
    const ms1d = 864e5; // 一天的毫秒数
    const ms7d = 7 * ms1d; // 一周的毫秒数

    function xf(format, ...args)
    {
        return format.replace(numberTokenRe, function (m, i)
        {
            return args[i];
        });
    }

    /**
     * @private
     * @param {Date} date 等待转换的日期
     * @return {String} 转换的结果字符串
     */
    function to_string()
    {
        if (!date) {
            date = new nativeDate();
        }
        return date.getFullYear() + '-'
            + pad(date.getMonth() + 1, 2, '0') + '-'
            + pad(date.getDate(), 2, '0') + 'T'
            + pad(date.getHours(), 2, '0') + ':'
            + pad(date.getMinutes(), 2, '0') + ':'
            + pad(date.getSeconds(), 2, '0');
    }

    function from_code_to_regex(character, currentGroup)
    {
        //currentGroup是正则识别之后的结果数组的索引
        let p = dateObj.parseCodes[character];
        if (p) {
            p = typeof p === 'function' ? p() : p;
            // 重新赋值，防止重复执行
            dateObj.parseCodes[character] = p;
        }
        return p ?
            TopJs.applyIf({
                c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
            }, p) : {
                g: 0,
                c: null,
                s: TopJs.String.escapeRegex(character)//没有识别的当做字符串常量
            };
    }

    TopJs.apply(dateObj, /** @lends TopJs.Date */{
        /**
         * 全局标志变量，如果为`true`那么将开启严格模式去解析`date`,严格模式将不会对日期进行容错处理
         * 这个是`javascript`的`Date`对象的默认行为
         *
         * @property {Boolean} [useStrict=false]
         */
        useStrict: false,

        /**
         * @private
         *  @property {String[]} parseRegexes 解析正则集合
         */
        parseRegexes: [],

        /**
         * 日期解析函数对象，一个`key`对应一个解析函数
         * 这些函数自动添加到`this`对象上面
         * ```javascript
         * TopJs.Date.parseFunctions['my-date-format'] = myDateParser;
         * ```
         * 解析函数有两个参数
         * 1. date将要被解析的日期的字符串表示
         * 2. strict是否使用严格模式去解析
         *
         * @property {Object} parseFunctions 日期解析函数对象
         */
        parseFunctions: {
            "MS": function (input, strict)
            {
                let r = (input || '').match(MSFormatRe);
                return r ? new nativeDate(((r[1] || '') + r[2]) * 1) : null;
            },

            "time": function (input, strict)
            {
                let num = Number.parseInt(input, 10);
                if (num || 0 === num) {
                    return new nativeDate(num);
                }
                return null;
            },

            "timestamp": function (input, strict)
            {
                let num = Number.parseInt(input, 10);
                if (num || 0 === num) {
                    return new nativeDate(num * 1000);
                }
                return null;
            }
        },

        /**
         * 将指定的日期转换成字符串表示
         *
         * @param {Date} date 待转换的日期
         * @return {string} 日期字符串
         */
        toString: function (date)
        {
            if (!date) {
                date = new nativeDate();
            }

            return date.getFullYear() + "-"
                + pad(date.getMonth() + 1, 2, '0') + "-"
                + pad(date.getDate(), 2, '0') + "T"
                + pad(date.getHours(), 2, '0') + ":"
                + pad(date.getMinutes(), 2, '0') + ":"
                + pad(date.getSeconds(), 2, '0');
        },

        /**
         * 日期解析函数对象，一个`key`对应一个解析函数
         * 这些函数自动添加到`this`对象上面，必须返回一个日期的描述字符串
         * ```javascript
         * TopJs.Date.formatFunctions['my-date-format'] = myDateFormatter;
         * ```
         *
         * @property {Object} formatFunctions 日期格式化函数对象
         */
        formatFunctions: {
            "MS": function ()
            {
                // UTC milliseconds since Unix epoch (MS-AJAX serialized date format (MRSF))
                return '\\/Date(' + this.getTime() + ')\\/';
            },

            "time": function ()
            {
                return this.getTime().toString();
            },

            "timestamp": function ()
            {
                return dateObj.format(this, 'U');
            }
        },
        /**
         * @type {String}
         * @static
         * @readonly
         */
        y2kYear: 50,

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        MILLI: "ms",

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        SECOND: "s",

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        MINUTE: "mi",

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        HOUR: "h",

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        DAY: "d",

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        MONTH: "mo",

        /**
         * Date间隔常量
         *
         * @type {String}
         * @static
         * @readonly
         */
        YEAR: "y",

        /**
         * 一星期的天数
         *
         * @type {String}
         * @static
         * @readonly
         */
        DAYS_IN_WEEK: 7,

        /**
         * 一年的月份数
         *
         * @static
         * @readonly
         * @type {String}
         */
        MONTHS_IN_YEAR: 12,

        /**
         * 一个月天数最多的数量
         *
         * @static
         * @readonly
         * @type {Number}
         */
        MAX_DAYS_IN_MONTH: 31,
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,

        /**
         * 在解析期间使用的默认的日期值
         * 对象的属性用于自定义在`TopJs.Date.parse`函数里面使用的相关值
         *
         * __Note:__</br>
         * In countries which experience Daylight Saving Time (i.e. DST), the `h`, `i`, `s`
         * and `ms` properties may coincide with the exact time in which DST takes effect.
         * It is the responsibility of the developer to account for this.
         *
         * ```javascript
         * //设置默认的天的值为一个月的第一天
         * TopJs.Date.defaults.d = 1;
         * //这个选项在解析不带天数数据的日期字符串的时候很有用
         * TopJs.Date.parse('2009-02', 'Y-m');// returns a Date object representing February 1st 2009.
         * ```
         *
         * @property {Object} defaults    默认日期相关值对象
         * @property {Number} defaults.y  Number 默认的年份值，默认值为`undefined`
         * @property {Number} defaults.m  以`1`起始的月份值，默认值为`undefined`
         * @property {Number} defaults.d  默认的天数的值，默认为`undefined`
         * @property {Number} defaults.h  默认的小时的值，默认为`undefined`
         * @property {Number} defaults.i  默认的分钟的值，默认为`undefined`
         * @property {Number} defaults.s  默认的秒数的值, 默认为`undefined`
         * @property {Number} defaults.ms 默认的毫秒数的值，默认为`undefined`
         */
        defaults: {},

        //<locale type="array">
        /**
         * 一星期的天数的名称，可以用来实现多语言
         * **这个属性可以在本地化文件中可以重写**
         *
         * ```javascript
         * TopJs.Date.dayNames = [
         *    "SundayInYourLang",
         *    "MondayInYourLang"
         *    // ...
         * ];
         * ```
         *
         * @property {String[]} dayNames  一星期的天数的名称
         */
        dayNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        //</locale>

        //<locale type="array">
        /**
         * 一年中月份的名称，可以用来实现多语言
         * **这个属性可以在本地化文件中可以重写**
         *
         * ```javascript
         * TopJs.Date.monthNames = [
         *    "JanInYourLang",
         *    "FebInYourLang"
         *    // ...
         * ];
         * ```
         *
         * @property {String[]} monthNames 一年中月份的名称
         */
        monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        //</locale>

        //<locale type="object">
        /**
         * 月份的简称和对应的以`0`的数字月份的映射
         *
         * **这个属性可以在本地化文件中可以重写**
         * __Note:__ `keys`大小写敏感
         *
         * ```javascript
         * TopJs.Date.monthNumbers = {
       *    "LongJanNameInYourLang": 0,
       *    "ShortJanNameInYourLang":0,
       *    "LongFebNameInYourLang":1,
       *    "ShortFebNameInYourLang":1
       *    // ...
       * };
         * ```
         *
         * @property {Object} monthNumbers 月份的简称和对应的以`0`的数字月份的映射
         */
        monthNumbers: {
            January: 0,
            Jan: 0,
            February: 1,
            Feb: 1,
            March: 2,
            Mar: 2,
            April: 3,
            Apr: 3,
            May: 4,
            June: 5,
            Jun: 5,
            July: 6,
            Jul: 6,
            August: 7,
            Aug: 7,
            September: 8,
            Sep: 8,
            October: 9,
            Oct: 9,
            November: 10,
            Nov: 10,
            December: 11,
            Dec: 11
        },
        //</locale>

        //<locale>
        /**
         * 默认的日期格式字符串 {@link TopJs.util.Format.dateRenderer}
         * 和{@link TopJs.util.Format.date}会使用
         *
         * **这个属性可以在本地化文件中可以重写**
         *
         * @property {String} defaultFormat
         */
        defaultFormat: "m/d/Y",
        //</locale>

        //<locale>
        /**
         * 一周的第一天，`0`代表周日，`6`代表周六
         *
         * **这个属性可以在本地化文件中可以重写**
         * @property {Number} [firstDayOfWeek=0] 一星期的第一天
         */
        firstDayOfWeek: 0,
        //</locale>

        //<locale>
        /**
         * `0`代表周日，`6`代表周六
         * **这个属性可以在本地化文件中可以重写**
         *
         * @property {Number[]} weekendDays 一周的两端数字
         */
        weekendDays: [0, 6],
        //</locale>

        /**
         * 函数 {@link TopJs.Date.format}用到的基础的解释字符映射数据
         *
         * __Note:__ 如果有字符不在此映射中那么`TopJs.Date.format()`将会将其解释为常量字符串
         *
         * ```javascript
         * TopJs.Date.formatCodes.x = "TopJs.util.Format.leftPad(this.getDate(), 2, '0')";
         * console.log(TopJs.Date.format(new Date(), 'X'); // returns 当前月份的的天数
         * ```
         * @property {Object} formatCodes 解析`code`和代表的的`action`的映射
         */
        formatCodes: {
            d: "TopJs.String.leftPad(m.getDate(), 2, '0')",
            D: "TopJs.Date.getShortDayName(m.getDay())",//获取本地化的天的名字的简称
            j: "m.getDate()",
            l: "TopJs.Date.dayNames[m.getDay()]",
            N: "(m.getDay() ? m.getDay() : 7)",
            S: "TopJs.Date.getSuffix(m)",
            w: "m.getDay()",
            z: "TopJs.Date.getDayOfYear(m)",
            W: "TopJs.String.leftPad(TopJs.Date.getWeekOfYear(m), 2, '0')",
            F: "TopJs.Date.monthNames[m.getMonth()]",
            m: "TopJs.String.leftPad(m.getMonth() + 1, 2, '0')",
            M: "TopJs.Date.getShortMonthName(m.getMonth())",//获取本地化的月份的名字的简称
            n: "(m.getMonth() + 1)",
            t: "TopJs.Date.getDaysInMonth(m)",
            L: "(TopJs.Date.isLeapYear(m) ? 1 : 0)",
            o: "(m.getFullYear() + (TopJs.Date.getWeekOfYear(m) == 1 && m.getMonth() > 0 ? +1 : (TopJs.Date.getWeekOfYear(m) >= 52 && m.getMonth() < 11 ? -1 : 0)))",
            Y: "TopJs.String.leftPad(m.getFullYear(), 4, '0')",
            y: "('' + m.getFullYear()).substring(2, 4)",
            a: "(m.getHours() < 12 ? 'am' : 'pm')",
            A: "(m.getHours() < 12 ? 'AM' : 'PM')",
            g: "((m.getHours() % 12) ? m.getHours() % 12 : 12)",
            G: "m.getHours()",
            h: "TopJs.String.leftPad((m.getHours() % 12) ? m.getHours() % 12 : 12, 2, '0')",
            H: "TopJs.String.leftPad(m.getHours(), 2, '0')",
            i: "TopJs.String.leftPad(m.getMinutes(), 2, '0')",
            s: "TopJs.String.leftPad(m.getSeconds(), 2, '0')",
            u: "TopJs.String.leftPad(m.getMilliseconds(), 3, '0')",
            O: "TopJs.Date.getGMTOffset(m)",
            P: "TopJs.Date.getGMTOffset(m, true)",
            T: "TopJs.Date.getTimezone(m)",
            Z: "(m.getTimezoneOffset() * -60)",
            c: function ()
            {
                let c = "Y-m-dTH:i:sP";
                let code = [];
                let len = c.length;
                for (let i = 0; i < len; i++) {
                    let element = c.charAt(i);
                    code.push(element === "T" ? "'T'" : dateObj.getFormatCode(element));// 视T为字符常量
                }
                return code.join(" + ")
            },

            C: function ()
            {
                // ISO-1601 -- browser format. UTC numerics with the 'Z' TZ id.
                return "m.toISOString()";
            },

            U: "Math.round(m.getTime() / 1000)"
        },


        //<locale type="function">
        /**
         * 根据月份的数字获取月份名称的简称**不同的语言，可以覆盖整个默认的实现**
         *
         * @param {Number} month 月份的数字，以`0`开始计算
         * @return {String} 月份的简称
         */
        getShortMonthName(month)
        {
            return dateObj.monthNames[month].substring(0, 3);
        },
        //</locale>

        //<locale type="function">
        /**
         * 根据一周的天的数字获取该天的名字的简称**不同的语言，可以覆盖整个默认的实现**
         *
         * @param {Number} day 一周的天的数字表示，从`0`开始
         * @return {String}
         */
        getShortDayName(day)
        {
            return dateObj.dayNames[day].substring(0, 3);
        },
        //</locale>

        //<locale type="function">
        /**
         * 通过月份的名称获取月份的数字表示，以`0`开始计算 **不同的语言，可以覆盖整个默认的实现**
         * @param {String} name 月份的名称
         * @return {Number} The 以`0`开始的月份的数字表示
         */
        getMonthNumber(name)
        {
            // handle camel casing for English month names (since the keys for the TopJs.Date.monthNumbers hash are case sensitive)
            return dateObj.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        },
        //</locale>

        /**
         * 判断日期格式字符串中是否含有小时相关的数据
         *
         * @param {String} format 日期的格式化字符串
         * @return {Boolean} `true`代表含有
         */
        formatContainsHourInfo(format)
        {
            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
        },

        /**
         * 判断日期格式字符串中是否含有日期相关的数据
         *
         * @param format 日期的格式化字符串
         * @return {Boolean} `true`代表含有
         */
        formatContainsDateInfo(format)
        {
            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
        },

        /**
         * 转义日期字符串中的特殊字符，使用`\`进行转义
         *
         * @param {String} format 需要转义的日期格式字符串
         */
        unescapeFormat(format)
        {
            return format.replace(slashRe, '');
        },

        /**
         * 使用传入的`format`格式化字符串去解析获取一个`Date`日期类型变量
         *
         * ```javascript
         * //dt = Fri May 25 2007 (current date)
         * let dt = new Date();
         *
         * //dt = Thu May 25 2006 (today&#39;s month/day in 2006)
         * dt = TopJs.Date.parse("2006", "Y");
         *
         * //dt = Sun Jan 15 2006 (all date parts specified)
         * dt = TopJs.Date.parse("2006-01-15", "Y-m-d");
         *
         * //dt = Sun Jan 15 2006 15:20:01
         * dt = TopJs.Date.parse("2006-01-15 3:20:01 PM", "Y-m-d g:i:s A");
         *
         * // attempt to parse Sun Feb 29 2006 03:20:01 in strict mode
         * dt = TopJs.Date.parse("2006-02-29 03:20:01", "Y-m-d H:i:s", true); // returns null
         * ```
         *
         * @param {String} input 原生的`date`字符串
         * @param {String} format 格式化字符串
         * @param {Boolean} [strict=false] 是否是否严格模式
         * @return {Date} 生成的对象
         */
        parse(input, format, strict = false)
        {
            let p = dateObj.parseFunctions;
            if (p[format] == null) {
                dateObj.createParser(format);
            }
            return p[format].call(dateObj, input, TopJs.isDefined(strict) ? strict : dateObj.useStrict);
        },

        /**
         * 使用指定的格式符字符串格式给定的日期对象
         *
         * @param {Date} date 需要格式化的日期对象
         * @param {String} format 格式字符串
         * @return {String} 格式化完成的字符串，当`date`参数不是js `Date`参数返回空字符串
         */
        format(date, format)
        {
            let formatFunctions = dateObj.formatFunctions;
            if (!TopJs.isDate(date)) {
                return '';
            }
            if (formatFunctions[format] == null) {
                dateObj.createFormat(format);
            }
            return formatFunctions[format].call(date) + '';
        },

        /**
         * @private
         */
        formatCodeToRegex(character, currentGroup)
        {
            let p = dateObj.parseCodes[character];
            if (p) {
                p = typeof p === "function" ? p() : p;
                dateObj.parseCodes[character] = p;
            }
            return p ? TopJs.applyIf({
                    c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
                }, p) : {
                    g: 0,
                    c: null,
                    s: TopJs.String.escapeRegex(character)
                };
        },

        /**
         * @private
         */
        createFormat(format)
        {
            let code = [];
            let special = false;
            let ch = '';
            let len = format.length;
            for (let i = 0; i < len; i++) {
                ch = format.charAt(i);
                if (!special && ch === "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    code.push("'" + TopJs.String.escape(ch) + "'")
                } else {
                    if (ch === '\n') {
                        code.push("'\\n'");
                    } else {
                        code.push(dateObj.getFormatCode(ch));
                    }
                }
            }
            dateObj.formatFunctions[format] = new Function("var m = this; return " + code.join('+'));
        },

        /**
         * @private
         */
        getFormatCode(character)
        {
            let f = dateObj.formatCodes[character];
            if (f) {
                f = typeof f === "function" ? f() : f;
                dateObj.formatCodes[character] = f;// 重新复制防止重复执行
            }
            // 不识别的code直接按照常量来识别
            return f || ("'" + TopJs.String.escape(character) + "'");
        },

        /**
         * @private
         */
        createParser(format)
        {
            let regexNum = dateObj.parseRegexes.length;
            let currentGroup = 1;
            let calc = [];
            let regex = [];
            let special = false;
            let ch = '';
            let len = format.length;
            let atEnd = [];
            let obj;
            for (let i = 0; i < len; i++) {
                ch = format.charAt(i);
                if (!special && ch === "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(TopJs.String.escape(ch));
                } else {
                    obj = dateObj.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        if (obj.calcAtEnd) {
                            atEnd.push(obj.c);
                        } else {
                            calc.push(obj.c);
                        }
                    }
                }
            }
            calc = calc.concat(atEnd);
            dateObj.parseRegexes[regexNum] = new RegExp('^' + regex.join('') + '$', 'i');
            dateObj.parseFunctions[format] = new Function("input", "strict", xf(code, regexNum, calc.join('')));
        },

        /**
         * @private
         * @property {Object} parseCodes 解析代码元信息
         */
        parseCodes: {
            /*
             * g = {Number} calculation group (0 or 1. only group 1 contributes to date calculations.)
             * c = {String} calculation method (required for group 1. null for group 0. {0} = currentGroup - position in regex result array)
             * s = {String} regex pattern. all matches are stored in results[], and are accessible by the calculation mapped to 'c'
             */
            d: {
                g: 1,
                c: "d = parseInt(results[{0}], 10);\n",
                s: "(3[0-1]|[1-2][0-9]|0[1-9])" // 一个月的天的数字表示，带前置`0`
            },

            j: {
                g: 1,
                c: "d = parseInt(results[{0}], 10);\n",
                s: "(3[0-1]|[1-2][0-9]|[1-9])" // 一个月的天的数字表示,不带前置`0`
            },

            D: function ()
            {
                let dayNames = [];
                for (let i = 0; i < 7; i++) {
                    dayNames.push(dateObj.getShortDayName(i));
                }
                return {
                    g: 0,
                    c: null,
                    s: "(?:)" + a.join('|') + ')'
                };
            },

            l: function ()
            {
                return {
                    g: 0,
                    c: null,
                    s: "(?:" + dateObj.dayNames.join('|') + ')'
                };
            },

            N: {
                g: 0,
                c: null,
                s: "[1-7]" // ISO-8601 day number (1 (monday) - 7 (sunday))
            },

            //<locale type="object" property="parseCodes">
            S: {
                g: 0,
                c: null,
                s: "(?:st|nd|rd|th)"
            },
            //</locale>

            w: {
                g: 0,
                c: null,
                s: "[0-6]" // JavaScript day number (0 (sunday) - 6 (saturday))
            },

            z: {
                g: 1,
                c: "z = parseInt(results[{0}], 10);\n",
                s: "(\\d{1,3})" // 一年的天的数字描述，0-364（闰年0-365）
            },

            W: {
                g: 1,
                c: "W = parseInt(results[{0}], 10);\n",
                s: "(\\d{2})" // ISO-8601标准的周数字表示 (带前置0)
            },

            F: function ()
            {
                return {
                    g: 1,
                    c: "m = parseInt(me.getMonthNumber(results[{0}]), 10);\n",
                    s: '(' + dateObj.monthNames.join('|') + ')'
                };
            },

            M: function ()
            {
                let monthNames = [];
                for (let i = 0; i < 12; i++) {
                    monthNames.push(dateObj.getShortMonthName(i));
                }
                return TopJs.applyIf({
                    s: '(' + monthNames.join('|') + ')'
                }, dateObj.formatCodeToRegex('F'));
            },

            m: {
                g: 1,
                c: "m = parseInt(results[{0}], 10) - 1;\n",
                s: "(1[0-2]|0[1-9])" // 前置带`0`的月份数字
            },

            n: {
                g: 1,
                c: "m = parseInt(results[{0}], 10) - 1;\n",
                s: "(1[0-2]|[1-9])" // 前置不带`0`的月份数字
            },

            t: {
                g: 0,
                c: null,
                s: "(?:\\d{2})" // 一年中月份的天使 28 - 31
            },

            L: {
                g: 0,
                c: null,
                s: "(?:1|0)"
            },

            o: {
                g: 1,
                c: "y = parseInt(results[{0}], 10);\n",
                s: "(\\d{4})" // ISO-8601标准的年份数字，带前置0
            },

            Y: {
                g: 1,
                c: "y = parseInt(results[{0}], 10);\n",
                s: "(\\d{4})" // 4个数字的年份
            },

            y: {
                g: 1,
                c: `let ty = parseInt(results[{0}], 10);\n
                y = ty > me.y2kYear ? 1900 + ty : 2000 + ty;\n`, //两数字年份表示
                s: "(\\d{2})"
            },

            /*
             * 在am和pm解析的时候，我们不区分大小写，这样更加实用
             */
            //<locale type="object" property="parseCodes">
            a: {
                g: 1,
                c: `if(/(am)/i.test(results[{0}])){\n
                      if(!h || h == 12){
                         h = 0;
                      }
                    } else {
                      if(!h || h < 12){
                         h = (h || 0) + 12;  
                      }
                    }`,
                s: "(am|pm|AM|PM)",
                calcAtEnd: true
            },
            //</locale>

            //<locale type="object" property="parseCodes">
            A: {
                g: 1,
                c: `if (/(am)/i.test(results[{0}])) {\n
                  if(!h || h == 12){
                     h = 0;
                  }
                } else {
                  if(!h || h < 12){
                     h = (h || 0) + 12;
                  }
                }`,
                s: "(AM|PM|am|pm)",
                calcAtEnd: true
            },
            //</locale>

            g: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(1[0-2]|[0-9])" // 12小时制，不带前置0 (1 - 12)
            },

            G: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(2[0-3]|1[0-9]|[0-9])" // 24小时制, 不带前置0 (0-23)
            },

            h: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(1[0-2]|0[1-9])" // 12小时制，带前置0 (01 - 12)
            },

            H: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n", // 24小时制, 带前置0 (00-23)
                s: "(2[0-3]|[0-1][0-9])"
            },

            i: {
                g: 1,
                c: "i = parseInt(results[{0}], 10);\n",
                s: "([0-5][0-9])" // 分钟数，带前置0
            },

            s: {
                g: 1,
                c: "s = parseInt(results[{0}], 10);\n",
                s: "([0-5][0-9])" // 秒数，带前置0
            },

            u: {
                g: 1,
                c: "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
                s: "(\\d+)" // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
            },

            O: {
                g: 1,
                c: `
                   o = results[{0}];
                   sn = o.substring(0, 1);//符号
                   hr = o.substring(1, 3) * 1 + Math.floor(o.substring(3, 5) / 60);//获取小时数
                   mn = o.substring(3, 5) % 60;//获取分钟数
                   o = ((-12 <= (hr * 60 + mn) / 60) && ((hr * 60 + mn) / 60 <= 14)) ?
                   (sn + TopJs.String.leftPad(hr, 2, '0') + TopJs.String.leftPad(mn, 2, '0')) : null;// -12hrs <= GMT offset <= 14hrs\n`,
                s: "([+-]\\d{4})"// GMT offset in hrs and mins
            },

            P: {
                g: 1,
                c: `
                   o = results[{0}];
                   sn = o.substring(0, 1);//获取符号
                   hr = o.substring(1, 3) * 1 + Math.floor(o.substring(4, 6) / 60); // 获取小时数
                   mn = o.substring(4, 6) % 60;// 获取分钟数
                   o = ((-12 <= (hr * 60 + mn) / 60) && ((hr * 60 + mn) / 60 <= 14)) ?
                   (sn + TopJs.String.leftPad(hr, 2, '0') + TopJs.String.leftPad(mn, 2, '0')) : null;// -12hrs <= GMT offset <= 14hrs\n`,
                s: "([+-]\\d{2}:\\d{2})" // GMT offset in hrs and mins (使用冒号分隔)
            },

            T: {
                g: 0,
                c: null,
                s: "[A-Z]{1, 5}" // 时区的简称， 1-5的字符
            },

            Z: {
                g: 1,
                c: `zz = results[{0}] * 1;\n // -43200 <= UTC offset <= 50400
                zz = (-43200 <= zz && zz <= 50400) ? zz : null;\n`,
                s: "([+-]?\\d{1, 5})" // 前置+对UTC offset是可选的
            },

            c: function ()
            {
                let calc = [];
                let arr = [
                    dateObj.formatCodeToRegex('Y', 1), // year
                    dateObj.formatCodeToRegex('m', 2), // month
                    dateObj.formatCodeToRegex('d', 3), // day
                    dateObj.formatCodeToRegex('H', 4), // hour
                    dateObj.formatCodeToRegex('i', 5), // minute
                    dateObj.formatCodeToRegex('s', 6), // second
                    {
                        c: "ms = results[7] || '0'; ms = parseInt(ms, 10) / Math.pow(10, ms.length - 3);\n"// decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
                    },
                    {
                        c: `if(results[8]){
                                if(results[8] == 'Z'){
                                   zz = 0;// UTC
                                }else if(results[8].indexOf(':') > -1){
                                   //时区偏移使用分号分隔
                                   ${dateObj.formatCodeToRegex('P', 8).c}
                                }else{
                                   //时区偏移不使用分号分隔
                                   ${dateObj.formatCodeToRegex('O', 8).c}
                                }
                            }`
                    }
                ];
                for (let i = 0, l = arr.length; i < l; i++) {
                    calc.push(arr[i].c);
                }
                return {
                    g: 1,
                    c: calc.join(''),
                    s: [
                        arr[0].s, // year (必选)
                        "(?:", "-", arr[1].s, // month (可选)
                        "(?:", "-", arr[2].s, // day (可选)
                        "(?:",
                        "(?:T| )?", // 时间分隔符 要么是`T`要么是空格
                        arr[3].s, ":", arr[4].s,// 小时和分钟，使用`:`分隔，前面必须有`T`或者空格
                        "(?::", arr[5].s, ")?", // seconds (可选)
                        "(?:(?:\\.|,)(\\d+))?", // 秒数的小数部分 (可选)
                        "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", // "Z" (UTC) 或者 `-0530`(不带`:`UTC偏移)或者"+08:00"(带有`:`UTC偏移)
                        ")?",
                        ")?",
                        ")?"
                    ].join('')
                };
            },

            U: {
                g: 1,
                c: "u = parseInt(results[{0}], 10);\n",
                s: "(-?\\d+)"// 在`UNIX epoch`前置的`-`符号
            }
        },

        /**
         * 返回两个日期之间的毫秒数
         *
         * @param {Date} dateA 参与比较的第一个日期
         * @param {Date} [dateB=new Date()] 参与比较的第二个日期
         * @return {Number} 两个日期的毫秒数
         */
        getElapsed(dateA, dateB = new Date())
        {
            return Math.abs(dateA - dateB);
        },

        /**
         * 比较两个日期的值是否相等
         *
         * @param {Date} date1 参与比较的日期1
         * @param {Date} date2 参与比较的日期2
         * @return {Boolean} `true`如果两个日期相等
         */
        isEqual(date1, date2)
        {
            if (date1 && date2) {
                return (date1.getTime() === date2.getTime());
            }
            //只有两个日期都是`false`才相等
            return !(date1 || date2);
        },

        /**
         * 获取时区的简称，等价与格式化描述符`T`
         * ```javascript
         * let dt = new Date('9/17/2011');
         * console.log(TopJs.Date.getTimezone(dt));
         * ```
         * @param {Date} date 用于获取时区的日期对象
         * @return {String} 时区的简称，"CST", "PDT", "EDT", "MPST" ...
         */
        getTimezone(date)
        {
            return date.toString().replace(/^.* (?:\((.*)\))$/, "$1$2").replace(/[^A-Z]/g, "");
        },

        /**
         * 获取当前时间对象的`GMT`偏移值（等价于格式化描述符`O`）
         *
         * ```javascript
         * let dt = new Date('9/17/2011');
         * console.log(TopJs.Date.getGMTOffset(dt));
         * ```
         *
         * @param {Date} date 传入的日期对象
         * @param {Boolean} [colon=false] `true`用`:`分割小时和分钟
         * @return {String} 以 正号或者负号开头的长度为4的字符串(e.g. '-0600').
         */
        getGMTOffset(date, colon = false)
        {
            let offset = date.getTimezoneOffset();
            return (offset > 0 ? '-' : '+')
                + TopJs.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, '0')
                + (colon ? ':' : '')
                + TopJs.String.leftPad(Math.abs(offset % 60), 2, '0');
        },

        /**
         * 获取当前传入的日期是一年中的第几天，对闰年进行相应的处理
         *
         * ```javascript
         * let dt = new Date('9/17/2011');
         * console.log(TopJs.Date.getDayOfYear(dt)); // 259
         * ```
         *
         * @param {Date} date 传入的日期对象
         * @return {Number} `0`到`364`(闰年是`365`)
         */
        getDayOfYear(date)
        {
            let num = 0;
            let d = dateObj.clone(date);
            let m = date.getMonth();
            let i;
            for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
                num += dateObj.getDaysInMonth(d);
            }
            return num + date.getDate() - 1;
        },

        /**
         * 获取一年中的`ISO-8601`标准的星期数，等价与格式化描述符`W`,除了不带前置`0`
         * ```javascript
         * let dt = new Date('9/17/2011');
         * console.log(TopJs.Date.getWeekOfYear(dt)); // 37
         * ```
         *
         * @param {Date} date 传入的日期对象
         * @return {Number} 一年中的星期数`1`到`53`
         */
        getWeekOfYear(date)
        {
            // 计算绝对得天数
            let dc3 = nativeDate.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d;
            // 计算绝对得星期数
            let awn = Math.floor(dc3 / 7);
            let wyr = new nativeDate(awn * ms7d).getUTCFullYear();
            return awn - Math.floor(nativeDate.UTC(wyr, 0, 7) / ms7d) + 1;
        },

        /**
         * 判断传入的对象是否是闰年
         *
         * @param {Date} date 传入的日期对象
         * @return {Boolean} 如果传入的对象闰年就返回`true`
         */
        isLeapYear(date)
        {
            let year = date.getFullYear();
            return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
        },

        /**
         * 获取传入日期当月的第一天的数字表示，函数会考虑闰年，返回的数字
         * 配合{@link TopJs.Date.monthNames}可以获取这个的文字描述
         *
         * ```javascript
         * let dt = new Date('1/10/2007');
         * firstDay = TopJs.Date.getFirstDayOfMonth(dt);
         *
         * console.log(TopJs.Date.dayNames[firstDay]); // output: 'Monday'
         * ```
         *
         * @param {Date} date 传入的日期
         * @return {Number} 天的数字描述`0`到`6`
         */
        getFirstDayOfMonth(date)
        {
            let day = (date.getDay() - (date.getDate() - 1)) % 7;
            return (day < 0) ? (day + 7) : day;
        },

        /**
         * 获取传入日期当月的最后一天的数字表示，函数会考虑闰年，返回的数字
         * 配合{@link TopJs.Date.monthNames}可以获取这个的文字描述
         *
         * ```javascript
         * let dt = new Date('1/10/2007');
         * lastDay = TopJs.Date.getLastDayOfMonth(dt);
         *
         * console.log(TopJs.Date.dayNames[lastDay]); // 输出: 'Wednesday'
         * ```
         *
         * @param {Date} date 传入的日期
         * @return {Number} 天的数字描述`0`到`6`
         */
        getLastDayOfMonth(date)
        {
            return dateObj.getLastDateOfMonth(date).getDay();
        },

        /**
         * 获取传入日期对象的月份的第一天的日期对象
         *
         * @param {Date} date 传入的日期
         * return {Date} 传入对象的月份的第一天
         */
        getFirstDateOfMonth(date)
        {
            return new nativeDate(date.getFullYear(), date.getMonth(), 1);
        },

        /**
         * 获取传入日期对象的月份的最后一天的日期对象
         *
         * @param {Date} date 传入的日期
         * @return {Date} 传入对象的月份的最后一天
         */
        getLastDateOfMonth(date)
        {
            return new nativeDate(date.getFullYear(), date.getMonth(), dateObj.getDaysInMonth(date));
        },

        /**
         * 获取传入的日期对象的月份的天数
         *
         * @param {Date} date 需要检车的日期对象
         * @return {Number} 月份的天数
         */
        getDaysInMonth(date)
        {
            let m = date.getMonth();
            return m === 1 && dateObj.isLeapYear(date) ? 29 : daysInMonth[m];
        },

        //<locale type="function">
        /**
         * 获取传入日期的英文回后缀，(等价与格式描述符`S`)
         *
         * @param {Date} date 获取当前日期的
         * @return {String} 'st, 'nd', 'rd'或者'th'.
         */
        getSuffix(date)
        {
            switch (date.getDate()) {
                case 1:
                case 21:
                case 31:
                    return "st";
                case 2:
                case 22:
                    return "nd";
                case 3:
                case 23:
                    return "rd";
                default:
                    return "th";
            }
        },
        //</locale>

        /**
         * 判断一个时间是否受`Daylight Saving Time (DST)`影响
         *
         * @param {Date} date 需要判断的日期对象
         * @return {Boolean} `true`代表传入的日期受`DST`影响
         */
        isDST(date)
        {
            // adapted from http://sencha.com/forum/showthread.php?p=247172#post247172
            // courtesy of @geoffrey.mcgill
            return new nativeDate(date.getFullYear(), 0, 1).getTimezoneOffset() !== date.getTimezoneOffset();
        },

        /**
         * 判断一个日期是否会造成日期翻转
         *
         * @param {Number} year 四数字的年份
         * @param {Number} month 从`1`开始算的月份
         * @param {Number} day 一个月的第几天
         * @param {Number} [hour=0] 小时数
         * @param {Number} [minute=0] 分钟数
         * @param {Number} [second=0] 秒数
         * @param {Number} [millisecond=0] 毫秒数
         * @return {Boolean} 返回`true`代表日期会翻转，`false`的话日期不会翻转
         */
        isValid(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0)
        {
            let dt = dateObj.add(new nativeDate(year < 100 ? 100 : year, month - 1, day, hour, minute, second, millisecond), dateObj.YEAR, year < 100 ? year - 100 : 0);
            return year === dt.getFullYear() &&
                month === dt.getMonth() + 1 &&
                day === dt.getDate() &&
                hour === dt.getHours() &&
                minute === dt.getMinutes() &&
                second === dt.getSeconds() &&
                millisecond === dt.getMilliseconds();
        },

        /**
         * 清空指定的日期对象的时间信息
         *
         * @param {Date} date 等待清空的对象
         * @param {Boolean} [clone=false] `true`的话先克隆日期对象清空数据然后返回
         * @return {Date} 本身或者克隆的日期对象
         */
        clearTime(date, clone)
        {
            if (Number.isNaN(date.getTime())) {
                return date;
            }
            if (clone) {
                return dateObj.clearTime(dateObj.clone(date));
            }
            let d = date.getDate();
            let cur;
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if (d !== date.getDate()) {
                // note: DST adjustments are assumed to occur in multiples of 1 hour (this is almost always the case)
                // refer to http://www.timeanddate.com/time/aboutdst.html for the (rare) exceptions to this rule
                let hour = 1;
                cur = dateObj.add(date, dateObj.HOUR, hour);
                while (cur.getDate() !== d) {
                    hour++;
                    cur = dateObj.add(date, dateObj.HOUR, hour);
                }
                date.setDate(d);
                date.setHours(cur.getHours());
            }
            return date;
        },

        /**
         * 提供一个方便的函数进行日期的计算，这个函数不影响传入的`date`对象
         * 函数生成一个新的`Date`对象
         *
         * ```javascript
         * // 基本用法：
         *
         * let dt = TopJs.Date.add(new Date('10/29/2006'), TopJs.Date.DAY, 5);
         * console.log(dt); // 返回 'Fri Nov 03 2006 00:00:00'
         *
         * // 负值将进行减法计算：
         *
         * let dt2 = TopJs.Date.add(new Date('10/1/2006'), TopJs.Date.DAY, -5);
         * console.log(dt2); // 返回 'Tue Sep 26 2006 00:00:00'
         *
         * // 小数也可以进行计算：
         * let dt3 = TopJs.Date.add(new Date('10/1/2006'), TopJs.Date.DAY, 1.25);
         * console.log(dt3); // 返回 'Mon Oct 02 2006 06:00:00'
         * ```
         *
         * @param {Date} date 需要计算的日期对象
         * @param {String} interval 一个日期间隔的常量
         * @param {Number} value 需要加在`date`参数上的数
         * @return {Date} 新创建的时期对象实例
         */
        add(date, interval, value)
        {
            let d = dateObj.clone(date);
            let base = 0;
            let day;
            let decimalValue;
            if (!interval || value === 0) {
                return d;
            }
            decimalValue = value - Number.parseInt(value, 10);
            value = Number.parseInt(value, 10);
            if (value) {
                switch (interval.toLowerCase()) {
                    case dateObj.MILLI:
                        d.setTime(d.getTime() + value);
                        break;
                    case dateObj.SECOND:
                        d.setTime(d.getTime() + value * 1000);
                        break;
                    case dateObj.MINUTE:
                        d.setTime(d.getTime() + value * 60 * 1000);
                        break;
                    case dateObj.HOUR:
                        d.setTime(d.getTime() + value * 60 * 60 * 1000);
                        break;
                    case dateObj.DAY:
                        d.setTime(d.getTime() + value * 24 * 60 * 60 * 1000);
                        break;
                    case dateObj.MONTH:
                        day = date.getDate();
                        if (day > 28) {
                            day = Math.min(day, dateObj.getLastDateOfMonth(dateObj.add(dateObj.getFirstDateOfMonth(date), dateObj.MONTH, value)).getDate());
                        }
                        d.setDate(day);
                        d.setMonth(date.getMonth() + value);
                        break;
                    case dateObj.YEAR:
                        day = date.getDate();
                        if (day > 28) {
                            day = Math.min(day, dateObj.getLastDateOfMonth(dateObj.add(dateObj.getFirstDateOfMonth(date), dateObj.YEAR, value)).getDate());
                        }
                        d.setDate(day);
                        d.setFullYear(date.getFullYear() + value);
                        break;
                }
            }
            if (decimalValue) {
                switch (interval.toLowerCase()) {
                    case dateObj.MILLI:
                        base = 1;
                        break;
                    case dateObj.SECOND:
                        base = 1000;
                        break;
                    case dateObj.MINUTE:
                        base = 1000 * 60;
                        break;
                    case dateObj.HOUR:
                        base = 1000 * 60 * 60;
                        break;
                    case dateObj.DAY:
                        base = 1000 * 60 * 60 * 24;
                        break;
                    case dateObj.MONTH:
                        day = dateObj.getDaysInMonth(d);
                        base = 1000 * 60 * 60 * 24 * day;
                        break;
                    case dateObj.YEAR:
                        day = (dateObj.isLeapYear(d) ? 366 : 365);
                        base = 1000 * 60 * 60 * 24 * day;
                        break;
                }
                if (base) {
                    d.setTime(d.getTime() + base * decimalValue);
                }
            }

            return d;
        },

        /**
         * 提供一个方便的日期对象相减的函数
         *
         * ```javascript
         * // 基本的用法：
         * let dt = TopJs.Date.subtract(new Date('10/29/2006'), TopJs.Date.DAY, 5);
         * console.log(dt); // 返回 'Tue Oct 24 2006 00:00:00'
         *
         * // value参数为负，相当于加上相关的日期
         * let dt2 = TopJs.Date.subtract(new Date('10/1/2006'), TopJs.Date.DAY, -5);
         * console.log(dt2); // 返回 'Fri Oct 6 2006 00:00:00'
         *
         * // 小数值也可以参与计算
         * let dt3 = TopJs.Date.subtract(new Date('10/1/2006'), TopJs.Date.DAY, 1.25);
         * console.log(dt3); // 返回 'Fri Sep 29 2006 06:00:00'
         * ```
         *
         * @param {Date} date 需要计算的日期对象
         * @param {String} interval 一个日期间隔的常量
         * @param {Number} value 需要加在`date`参数上的数
         * @return {Date} 新创建的时期对象实例
         */
        substract: function (date, interval, value)
        {
            return dateObj.add(date, interval, -value);
        },

        /**
         * 检查指定的日期对象是否在指定的日期范围里
         *
         * @param {Date} date 等待检查的日期对象引用
         * @param {Date} start 开始日期
         * @param {Date} end 结束日期
         * @return {Boolean} `true`代表传入的日期在`start`和`end`之间
         */
        between(date, start, end)
        {
            let t = date.getTime();
            return start.getTime() <= t && t <= end.getTime();
        },

        /**
         * 克隆一个指定的日期对象，因为对象是通过引用传递的，为了不影响原来的对象，我们
         * 需要克隆一个对象
         *
         * 克隆一个日期对象
         * ```javascript
         * //错误的做法
         * let orig = new Date("10/1/2006");
         * let copy = orig;
         * copy.setDate(5);
         * console.log(orig);  // 返回 'Thu Oct 05 2006'!
         *
         * //正确的做法
         * let orig = new Date('10/1/2006');
         * let copy = TopJs.Date.clone(orig);
         * copy.setDate(5);
         * console.log(orig);  // 返回 'Thu Oct 01 2006'
         * ```
         * @param {Date} date 等待克隆的对象
         * @return {Date} 克隆的日期对象
         */
        clone(date)
        {
            return new nativeDate(date.getTime());
        },

        /**
         * 根据指定的单位对齐日期对象
         *
         * @param {Date} date 需要对齐的日期对象
         * @param {String} unit 需要对齐操作的单位
         * @param {Number} step 需要对齐的跨度
         * @return {Date} 对齐之后的日期对象
         */
        align(date, unit, step)
        {
            let num = new nativeDate(date.getTime());
            switch (unit.toLowerCase()) {
                case dateObj.MILLI:
                    return num;
                    break;
                case dateObj.SECOND:
                    num.setUTCSeconds(num.getUTCSeconds() - num.getUTCSeconds() % step);
                    num.setUTCMilliseconds(0);
                    break;
                case dateObj.MINUTE:
                    num.setUTCMinutes(num.getUTCMinutes() - num.getUTCMinutes() % step);
                    num.setUTCSeconds(0);
                    num.setUTCMilliseconds(0);
                    break;
                case dateObj.HOUR:
                    num.setUTCHours(nun.getUTCHours() - num.getUTCHours() % step);
                    num.setUTCMinutes(0);
                    num.setUTCSeconds(0);
                    num.setUTCMilliseconds(0);
                    break;
                case dateObj.DAY:
                    if (step === 7 || step === 14) {
                        num.setUTCDate(num.getUTCDate() - num.getUTCDay() + 1);
                    }
                    num.setUTCHours(0);
                    num.setUTCMinutes(0);
                    num.setUTCSeconds(0);
                    num.setUTCMilliseconds(0);
                    break;
                case dateObj.MONTH:
                    num.setUTCMonth(num.getUTCMonth() - (num.getUTCMonth() - 1) % step, 1);
                    num.setUTCHours(0);
                    num.setUTCMinutes(0);
                    num.setUTCSeconds(0);
                    num.setUTCMilliseconds(0);
                    break;
                case dateObj.YEAR:
                    num.setUTCFullYear(num.getUTCFullYear() - num.getUTCFullYear() % step, 1, 1);
                    num.setUTCHours(0);
                    num.setUTCMinutes(0);
                    num.setUTCSeconds(0);
                    num.setUTCMilliseconds(0);
                    break;
            }
            return num;
        },

        /**
         * 检查传入的日期对象是否是周末
         *
         * @param {Date} date 传入检查的日期对象
         * @return {Boolean} `true`代表是周末
         */
        isWeekend(date)
        {
            return dateObj.weekendDays.includes(date.getDay());
        },

        /**
         * 将传入的UTC时间转换成本地的时间
         *
         * @param {Date} date 需要转换的时间对象
         * @return {Date} 转换之后的日期对象
         */
        utcToLocal(date)
        {
            return new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                date.getUTCMilliseconds()
            );
        },

        /**
         * 将传入的本地时间转换成`utc`时间
         *
         * `Wed Jun 01 2016 00:00:00 GMT+1000 (AUS Eastern Standard Time)`, 那么转换之后的日期
         * 是`Wed Jun 01 2016 10:00:00 GMT+1000 (AUS Eastern Standard Time)`。
         *
         * @param {Date} date
         * @return {Date} 转换之后的日期对象
         */
        localToUtc(date)
        {
            return dateObj.utc(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        },

        /**
         * 创建一个UTC时间对象
         *
         * @param {Number} year 指定的时间
         * @param {Number} month 指定的月份
         * @param {Number} day 指定的天数
         * @param {Number} [hour=0] 指定的小时
         * @param {Number} [min=0] 指定的分钟数
         * @param {Number} [s=0] 指定的秒数
         * @param {Number} [ms=0] 指定的毫秒数
         */
        utc(year, month, day, hour = 0, min = 0, s = 0, ms = 0)
        {
            return new Date(Date.UTC(year, month, day, hour, min, s, ms));
        },

        /**
         * 计算两个日期的差值，使用指定的单位描述
         *
         * @param {Date} min 第一个时间
         * @param {Date} max 第二个时间
         * @param {String} unit 时间值的单位
         * @return {Number} 返回差值`n`，其满足如下关系`min + n * unit <= max`
         */
        diff(min, max, unit)
        {
            let est;
            let diff = max.getTime() - min.getTime();
            switch (unit) {
                case dateObj.MILLI:
                    return diff;
                case dateObj.SECOND:
                    return Math.floor(diff / 1000);
                case dateObj.MINUTE:
                    return Math.floor(diff / 60000);
                case dateObj.HOUR:
                    return Math.floor(diff / 3600000);
                case dateObj.DAY:
                    return Math.floor(diff / 86400000);
                case 'w':
                    return Math.floor(diff / 604800000);
                case dateObj.MONTH:
                    est = (max.getFullYear() * 12 + max.getMonth()) - (min.getFullYear() * 12 + min.getMonth());
                    if (dateObj.add(min, unit, est) > max) {
                        return est - 1;
                    }
                    return est;
                case dateObj.YEAR:
                    est = max.getFullYear() - min.getFullYear();
                    if (dateObj.add(min, unit, est) > max) {
                        return est - 1;
                    }
                    return est;
            }
        }
    });
}