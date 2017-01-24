/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
let assert = require("chai").assert;

const StandardLoader = require("../../../lib/Entry").StandardLoader;

let loader = new StandardLoader({
    [StandardLoader.AUTO_REGISTER_TOPJS]: true
});
loader.register();

describe("测试TopJs.Date", function ()
{
    describe("TopJs.Date.getElapsed", function ()
    {
        let dateValue = 0;
        let increment = 3;
        let OriginalDate = Date;
        let PredictableDate = function ()
        {
            return {
                getTime: function ()
                {
                },
                valueOf: function ()
                {
                    return PredictableDate.now();
                }
            };
        };

        function mockDate()
        {
            Date = PredictableDate;
        }

        beforeEach(function ()
        {
            PredictableDate.now = function ()
            {
                dateValue = dateValue + increment;
                return dateValue;
            };
        });

        it("测试每次实例化都消逝时间", function ()
        {
            mockDate();
            let dateA = new PredictableDate();
            assert.equal(TopJs.Date.getElapsed(dateA), 3);
        });

        it("测试两个对象实例化的消逝时间", function ()
        {
            mockDate();
            let dateA = new PredictableDate();
            let dateB = new PredictableDate();
            assert.equal(TopJs.Date.getElapsed(dateA, dateB), 19);
        });

        afterEach(function ()
        {
            Date = OriginalDate;
            increment += 16;
        });
    });

    describe("TopJs.Date.getShortMonthName", function ()
    {
        it("返回三字母简称", function ()
        {
            assert.equal(TopJs.Date.getShortMonthName(0), "Jan");
            assert.equal(TopJs.Date.getShortMonthName(1), "Feb");
            assert.equal(TopJs.Date.getShortMonthName(2), "Mar");
            assert.equal(TopJs.Date.getShortMonthName(3), "Apr");
            assert.equal(TopJs.Date.getShortMonthName(4), "May");
            assert.equal(TopJs.Date.getShortMonthName(5), "Jun");
            assert.equal(TopJs.Date.getShortMonthName(6), "Jul");
            assert.equal(TopJs.Date.getShortMonthName(7), "Aug");
            assert.equal(TopJs.Date.getShortMonthName(8), "Sep");
            assert.equal(TopJs.Date.getShortMonthName(9), "Oct");
            assert.equal(TopJs.Date.getShortMonthName(10), "Nov");
            assert.equal(TopJs.Date.getShortMonthName(11), "Dec");
        });
    });

    describe("TopJs.Date.getShortDayName", function ()
    {
        it("获取一周每天的三字母简称", function ()
        {
            assert.equal(TopJs.Date.getShortDayName(0), "Sun");
            assert.equal(TopJs.Date.getShortDayName(1), "Mon");
            assert.equal(TopJs.Date.getShortDayName(2), "Tue");
            assert.equal(TopJs.Date.getShortDayName(3), "Wed");
            assert.equal(TopJs.Date.getShortDayName(4), "Thu");
            assert.equal(TopJs.Date.getShortDayName(5), "Fri");
            assert.equal(TopJs.Date.getShortDayName(6), "Sat");
        });
    });

    describe("TopJs.Date.getMonthNumber", function ()
    {
        it("根据月份的全名获取月份数字[0-11]", function ()
        {
            let names = [
                "january",
                "february",
                "march",
                "april",
                "may",
                "june",
                "july",
                "august",
                "september",
                "october",
                "november",
                "december"];
            names.forEach(function (name, idx)
            {
                assert.equal(TopJs.Date.getMonthNumber(name), idx);
                assert.equal(TopJs.Date.getMonthNumber(name.toUpperCase()), idx);
                assert.equal(TopJs.Date.getMonthNumber(TopJs.String.capitalize(name)), idx);
            });
        });

        it("根绝月份的简称获取月份的数字描述[0-11]", function ()
        {
            let names = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            names.forEach(function (name, idx)
            {
                assert.equal(TopJs.Date.getMonthNumber(name), idx);
                assert.equal(TopJs.Date.getMonthNumber(name.toUpperCase()), idx);
                assert.equal(TopJs.Date.getMonthNumber(TopJs.String.capitalize(name)), idx);
            });
        });
    });

    describe("TopJs.Date.formatContainsHourInfo", function ()
    {
        it("如果含有小时的描述符号，返回true", function ()
        {
            assert.isTrue(TopJs.Date.formatContainsHourInfo("d/m/Y H:i:s"));
        });
        it("如果不含小时的描述符号，返回false", function ()
        {
            assert.isFalse(TopJs.Date.formatContainsHourInfo("d/m/Y"));
        });
    });

    describe("TopJs.Date.formatContainsDateInfo", function ()
    {
        it("如果含有天的描述符号，返回true", function ()
        {
            assert.isTrue(TopJs.Date.formatContainsDateInfo("d/m/Y H:i:s"));
        });
        it("如果不含天的描述符号，返回false", function ()
        {
            assert.isFalse(TopJs.Date.formatContainsDateInfo("H:i:s"));
        });
    });

    describe("TopJs.Date.isValid", function ()
    {
        it("合法日期返回true", function ()
        {
            assert.isTrue(TopJs.Date.isValid(1989, 10, 15, 16, 30, 1, 2));
        });
        it("传入不合法的日期返回false", function ()
        {
            assert.isFalse(TopJs.Date.isValid(999999, 10, 15, 16, 30, 1, 2));
            assert.isFalse(TopJs.Date.isValid(1981, 13, 15, 16, 30, 1, 2));
            assert.isFalse(TopJs.Date.isValid(1981, 10, 35, 16, 30, 1, 2));
            assert.isFalse(TopJs.Date.isValid(1981, 10, 35, 33, 30, 1, 2));
            assert.isFalse(TopJs.Date.isValid(1981, 10, 15, 33, 69, 1, 2));
            assert.isFalse(TopJs.Date.isValid(1981, 10, 15, 33, 34, 60, 2));
            assert.isFalse(TopJs.Date.isValid(1981, 10, 15, 33, 34, 32, 100000));
        });
    });

    describe("TopJs.Date.isWeekend", function ()
    {
        let days;
        beforeEach(function ()
        {
            days = TopJs.Date.weekendDays;
        });

        afterEach(function ()
        {
            TopJs.Date.weekendDays = days;
            days = null;
        });

        it("在周末应该返回true", function ()
        {
            // 2017-01-22 星期日
            assert.isTrue(TopJs.Date.isWeekend(new Date(2017, 0, 22)));
            // 2017-07-15 星期六
            assert.isTrue(TopJs.Date.isWeekend(new Date(2017, 6, 15)));
        });
        it("不是周末应该返回false", function ()
        {
            // 2017-07-13 星期四
            assert.isFalse(TopJs.Date.isWeekend(new Date(2017, 6, 13)));
            // 2017-03-17 星期五
            assert.isFalse(TopJs.Date.isWeekend(new Date(2017, 3, 17)));
        });

        describe("模拟本地化的日期", function ()
        {
            beforeEach(function ()
            {
                TopJs.Date.weekendDays = [1, 5]; // Mon, Fri
            });
            it("在周末应该返回true", function ()
            {
                // 2017-03-10 星期五
                assert.isTrue(TopJs.Date.isWeekend(new Date(2017, 2, 10)));
                // 2017-09-04 星期一
                assert.isTrue(TopJs.Date.isWeekend(new Date(2017, 8, 4)));
            });
            it("不是周末应该返回false", function ()
            {
                // 2017-09-09 星期六
                assert.isFalse(TopJs.Date.isWeekend(new Date(2017, 8, 9)));
                // 2017-09-17 星期日
                assert.isFalse(TopJs.Date.isWeekend(new Date(2017, 8, 17)));
            });
        });
    });

    describe("TopJs.Date.parse", function ()
    {
        it("只解析年份", function ()
        {
            let date = TopJs.Date.parse("2011", "Y");
            let expectedDate = new Date();
            expectedDate.setFullYear(2011);
            expectedDate.setHours(0);
            expectedDate.setMinutes(0);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);
            assert.deepEqual(date, expectedDate);
        });

        it("解析年份、月份和天", function ()
        {
            let date = TopJs.Date.parse("2017-01-18", "Y-m-d");
            let expectedDate = new Date();
            expectedDate.setFullYear(2017);
            expectedDate.setMonth(0);
            expectedDate.setDate(18);
            expectedDate.setHours(0);
            expectedDate.setMinutes(0);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);
            assert.deepEqual(date, expectedDate);
        });

        describe("y单独解析parse code", function ()
        {
            let date;
            afterEach(function ()
            {
                date = null;
            });

            it("解析2数字年份", function ()
            {
                date = TopJs.Date.parse('08', 'y');
                assert.equal(date.getFullYear(), 2008);
            });

            it("与其他解析字符配合", function ()
            {
                date = TopJs.Date.parse('170122', 'ymd');
                assert.equal(date.getFullYear(), 2017);
            });

            it("不会解析一个数字的年份", function ()
            {
                date = TopJs.Date.parse('2', 'y');
                assert.isNull(date);
            });

            it("与其他解析字符配合时也不解释一个数字年份", function ()
            {
                date = TopJs.Date.parse('10122', 'ymd');
                assert.isNull(date);
            });
        });

        it("解析格式year-month-date hour:minute:second am/pm", function ()
        {
            let date = TopJs.Date.parse("2017-08-16 9:28:23 pm", "Y-m-d g:i:s a");
            let expectedDate = new Date();
            expectedDate.setFullYear(2017);
            expectedDate.setMonth(7);
            expectedDate.setDate(16);
            expectedDate.setHours(21);
            expectedDate.setMinutes(28);
            expectedDate.setSeconds(23);
            expectedDate.setMilliseconds(0);
            assert.deepEqual(date, expectedDate);
        });

        it("在严格模式,解析错误的时间时候返回null", function ()
        {
            let date = TopJs.Date.parse("2017-02-31", "Y-m-d", true);
            assert.isNull(date);
        });

        it("需要读取am/pm", function ()
        {
            let date = TopJs.Date.parse("2017/01/04 am 12:45", "Y/m/d a G:i");
            let expectedDate = new Date();
            expectedDate.setFullYear(2017);
            expectedDate.setMonth(0);
            expectedDate.setDate(4);
            expectedDate.setHours(0);
            expectedDate.setMinutes(45);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);
            assert.deepEqual(date, expectedDate);
        });

        it("需要能解析原生的时间字符串", function ()
        {
            let expectedDate = new Date(2017, 1, 1, 13, 45, 32, 4);
            let date = TopJs.Date.parse(expectedDate.getTime().toString(), "time");
            assert.deepEqual(date, expectedDate);
        });

        it("需要能解释时间戳", function ()
        {
            let expectedDate = new Date(2017, 1, 1, 13, 45, 32, 0);
            let timestamp = Math.floor(expectedDate.getTime() / 1000);
            let date = TopJs.Date.parse(timestamp.toString(), "timestamp");
            assert.deepEqual(date, expectedDate);
        });

        describe("使用分隔符", function ()
        {
            it("使用`-`作为分隔符号", function ()
            {
                let date = TopJs.Date.parse('2017-01-04', 'Y-m-d');
                let expectedDate = new Date();
                expectedDate.setFullYear(2017);
                expectedDate.setMonth(0);
                expectedDate.setDate(4);
                expectedDate.setHours(0);
                expectedDate.setMinutes(0);
                expectedDate.setSeconds(0);
                expectedDate.setMilliseconds(0);
                assert.deepEqual(date, expectedDate);
            });
        });

        it("使用`/`作为分隔符号", function ()
        {
            let date = TopJs.Date.parse('2017/01/04', 'Y/m/d');
            let expectedDate = new Date();
            expectedDate.setFullYear(2017);
            expectedDate.setMonth(0);
            expectedDate.setDate(4);
            expectedDate.setHours(0);
            expectedDate.setMinutes(0);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);
            assert.deepEqual(date, expectedDate);
        });

        it("使用空格作为分隔符", function ()
        {
            let date = TopJs.Date.parse('2017 01 04', 'Y m d');
            let expectedDate = new Date();
            expectedDate.setFullYear(2017);
            expectedDate.setMonth(0);
            expectedDate.setDate(4);
            expectedDate.setHours(0);
            expectedDate.setMinutes(0);
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);
            assert.deepEqual(date, expectedDate);
        });

        describe("ISO-8601", function ()
        {
            let TopJsDate = TopJs.Date;
            describe("dates", function ()
            {
                describe("星期解析符`W`", function ()
                {
                    it("解析一年中第几个星期 `W`", function ()
                    {
                        assert.isNotNull(TopJsDate.parse("40", 'W'));
                    });
                    it("解析一年中第几个星期, 前置加0`W`", function ()
                    {
                        assert.isNotNull(TopJsDate.parse("03", 'W'));
                    });
                    it("解析一年中第几个星期, 前置不加0`W`不解析", function ()
                    {
                        assert.isNull(TopJsDate.parse("3", 'W'));
                    });

                    it("一年的第一个星期是周一开始`W`", function ()
                    {
                        assert.equal(TopJsDate.parse("01", 'W').getDay(), "1")
                    });
                });

                describe("年解析符`o`", function ()
                {
                    it("按照描述符`o`进行解析", function ()
                    {
                        assert.isNotNull(TopJsDate.parse("2017", 'o'));
                    });

                    it("没有其他描述符的时候应该跟描述符`Y`一样", function ()
                    {
                        assert.deepEqual(TopJsDate.parse("2017", 'o'), TopJsDate.parse("2017", 'Y'));
                    });

                    it("跟解析符`W`配合的时候，如果第一个星期是上一年，那么返回上一年的年份", function ()
                    {
                        assert.equal(TopJsDate.parse("2008-01", "o-W").getFullYear(), "2007");
                    });

                    it("跟解析符`W`配合的时候，如果星期数不是是上一年，那么跟描述符`Y`一样", function ()
                    {
                        assert.equal(TopJsDate.parse("2008-23", "o-W").getFullYear(), "2008");
                    });
                });
            });

            describe("times", function ()
            {
                it("解析ISO的时间格式", function ()
                {
                    let date = TopJsDate.parse('2017-01-23T01:00:00', 'c');
                    let expectedDate = new Date();
                    expectedDate.setFullYear(2017);
                    expectedDate.setMonth(0);
                    expectedDate.setDate(23);
                    expectedDate.setHours(1);
                    expectedDate.setMinutes(0);
                    expectedDate.setSeconds(0);
                    expectedDate.setMilliseconds(0);
                    assert.deepEqual(date, expectedDate);

                    date = TopJsDate.parse('2017-01-13T15:00:00', 'c');
                    expectedDate.setFullYear(2017);
                    expectedDate.setMonth(0);
                    expectedDate.setDate(13);
                    expectedDate.setHours(15);
                    expectedDate.setMinutes(0);
                    expectedDate.setSeconds(0);
                    expectedDate.setMilliseconds(0);
                    assert.deepEqual(date, expectedDate);
                });

                describe("时区相关", function ()
                {
                    it("解析出来的时区应该跟直接指定一样", function ()
                    {
                        let date = TopJsDate.parse("2017-11-03T20:31:24+12:00", "c");
                        let expectedDate = new Date("2017-11-03T20:31:24+12:00");
                        assert.deepEqual(date, expectedDate);
                    });

                    it("不同的时区，就算时间一样也不相等", function ()
                    {
                        let date = TopJsDate.parse("2012-10-03T20:29:24+12:00", "c");
                        let expectedDate = new Date("2012-10-03T20:29:24+13:00");
                        assert.notDeepEqual(date, expectedDate);
                    });
                });
            });
        });

    });

    describe("测试一年中星期相关的解析符号", function ()
    {
        let date;

        function expect_date(year, month, day)
        {
            assert.equal(date.getFullYear(), year);
            assert.equal(date.getMonth(), month);
            assert.equal(date.getDate(), day);
        }

        describe("指定年份的第一个星期", function ()
        {
            afterEach(function ()
            {
                date = null;
            });
            it("2014年的第一个星期", function ()
            {
                date = TopJs.Date.parse('01/2014', 'W/Y');
                expect_date(2013, 11, 30);
            });

            it("2015年的第一个星期", function ()
            {
                date = TopJs.Date.parse('01/2015', 'W/Y');
                expect_date(2014, 11, 29);
            });

            it("2016年的第一个星期", function ()
            {
                date = TopJs.Date.parse('01/2016', 'W/Y');
                expect_date(2016, 0, 4);
            });

            it("2017年的第一个星期", function ()
            {
                date = TopJs.Date.parse('01/2017', 'W/Y');
                expect_date(2017, 0, 2);
            });
        });

        it("一年中第x个星期的开始总是周一", function ()
        {
            for (let i = 2013; i <= 2020; i++) {
                for (let j = 1; j < 53; j++) {
                    assert.equal(TopJs.Date.parse(`${i}-${TopJs.String.leftPad(j, 2, '0')}`, "Y-W").getDay(), 1);
                }
            }
        });
    });

    describe("TopJs.Date.isEqual", function ()
    {
        it("两个日期相等应该返回true", function ()
        {
            let date1 = new Date(2017, 0, 1, 22, 37, 15, 0);
            let date2 = new Date(2017, 0, 1, 22, 37, 15, 0);
            assert.isTrue(TopJs.Date.isEqual(date1, date2));
        });

        it("两个日期不能有一毫秒的误差", function ()
        {
            let date1 = new Date(2017, 0, 1, 22, 37, 15, 1);
            let date2 = new Date(2017, 0, 1, 22, 37, 15, 0);
            assert.isFalse(TopJs.Date.isEqual(date1, date2));
        });

        it("跟null或者undefined比较返回false", function ()
        {
            assert.isFalse(TopJs.Date.isEqual(null, new Date()));
            assert.isFalse(TopJs.Date.isEqual(undefined, new Date()));
            assert.isFalse(TopJs.Date.isEqual(new Date(), null));
            assert.isFalse(TopJs.Date.isEqual(new Date(), undefined));
        });

        it("null与unde之间的相互比较返回true", function ()
        {
            assert.isTrue(TopJs.Date.isEqual(null, undefined));
            assert.isTrue(TopJs.Date.isEqual(null, null));
            assert.isTrue(TopJs.Date.isEqual(undefined, null));
            assert.isTrue(TopJs.Date.isEqual(undefined, undefined));
        })
    });

    describe("TopJs.Date.getDayOfYear", function ()
    {
        it("不是闰年返回`0`到`364`之间的数字", function ()
        {
            assert.equal(TopJs.Date.getDayOfYear(new Date(2017, 0, 1)), 0);
            assert.equal(TopJs.Date.getDayOfYear(new Date(2017, 11, 31)), 364);
        });

        it("闰年的话返回`0`到`365`之间的数字", function ()
        {
            assert.equal(TopJs.Date.getDayOfYear(new Date(2000, 0, 1)), 0);
            assert.equal(TopJs.Date.getDayOfYear(new Date(2000, 11, 31)), 365);
        });
    });

    describe("TopJs.Date.getFirstDayOfMonth", function ()
    {
        it("获取指定月份的第一天是周几", function ()
        {
            assert.equal(TopJs.Date.getFirstDayOfMonth(new Date(2016, 8, 2)), 4);
            assert.equal(TopJs.Date.getFirstDayOfMonth(new Date(2012, 8, 2)), 6);
            assert.equal(TopJs.Date.getFirstDayOfMonth(new Date(2035, 7, 2)), 3);
            assert.equal(TopJs.Date.getFirstDayOfMonth(new Date(1968, 8, 2)), 0);
            assert.equal(TopJs.Date.getFirstDayOfMonth(new Date(1988, 6, 2)), 5);
        });
    });

    describe("TopJs.Date.getLastDateOfMonth", function ()
    {
        it("返回传入日期的当月的最后一天的日期", function ()
        {
            assert.deepEqual(TopJs.Date.getLastDateOfMonth(new Date(2016, 8, 2)), new Date(2016, 8, 30));
            assert.deepEqual(TopJs.Date.getLastDateOfMonth(new Date(2012, 8, 2)), new Date(2012, 8, 30));
            assert.deepEqual(TopJs.Date.getLastDateOfMonth(new Date(2035, 7, 2)), new Date(2035, 7, 31));
            assert.deepEqual(TopJs.Date.getLastDateOfMonth(new Date(1968, 8, 2)), new Date(1968, 8, 30));
            assert.deepEqual(TopJs.Date.getLastDateOfMonth(new Date(1988, 6, 2)), new Date(1988, 6, 31));
            assert.deepEqual(TopJs.Date.getLastDateOfMonth(new Date(2000, 1, 2)), new Date(2000, 1, 29));
        });
    });

    describe("TopJs.Date.clone", function ()
    {
        it("克隆一个给定的日期对象", function ()
        {
            let originalDate = new Date();
            let clonedDate = TopJs.Date.clone(originalDate);
            assert.notEqual(originalDate, clonedDate);
            assert.deepEqual(originalDate, clonedDate);
        });
    });

    describe("TopJs.Date.clearTime", function ()
    {
        it("当前日期不合法的返回`Invalid Date`", function ()
        {
            let date = new Date('foo');
            let clearedTimeDate = TopJs.Date.clearTime(date);
            assert.isNaN(clearedTimeDate.getTime());
        });

        it("清空时间将小时/分钟/秒数/毫秒都重置为`0`", function ()
        {
            let date = new Date(2016, 6, 6, 6, 6, 6, 6);
            TopJs.Date.clearTime(date);
            assert.equal(date.getHours(), 0);
            assert.equal(date.getMinutes(), 0);
            assert.equal(date.getSeconds(), 0);
            assert.equal(date.getMilliseconds(), 0);
        });

        it("如果开启clone选项，清空克隆对象时间将小时/分钟/秒数/毫秒都重置为`0`，原对象不变", function ()
        {
            let date = new Date(2016, 6, 6, 6, 6, 6, 6);
            let cloneDate = TopJs.Date.clearTime(date, true);
            assert.equal(date.getHours(), 6);
            assert.equal(date.getMinutes(), 6);
            assert.equal(date.getSeconds(), 6);
            assert.equal(date.getMilliseconds(), 6);
            assert.equal(cloneDate.getHours(), 0);
            assert.equal(cloneDate.getMinutes(), 0);
            assert.equal(cloneDate.getSeconds(), 0);
            assert.equal(cloneDate.getMilliseconds(), 0);
        });
    });

    describe("TopJs.Date.add", function ()
    {
        let date = new Date(2016, 0, 1, 0, 0, 0, 0);
        it("各种单位的add测试", function ()
        {
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.MILLI, 1), new Date(2016, 0, 1, 0, 0, 0, 1));
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.SECOND, 1), new Date(2016, 0, 1, 0, 0, 1, 0));
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.MINUTE, 1), new Date(2016, 0, 1, 0, 1, 0, 0));
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.HOUR, 1), new Date(2016, 0, 1, 1, 0, 0, 0));
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.DAY, 1), new Date(2016, 0, 2, 0, 0, 0, 0));
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.MONTH, 1), new Date(2016, 1, 1, 0, 0, 0, 0));
            assert.deepEqual(TopJs.Date.add(date, TopJs.Date.YEAR, 1), new Date(2017, 0, 1, 0, 0, 0, 0));
        });

        it("加月份的时候考虑月份最后一天", function ()
        {
            assert.deepEqual(TopJs.Date.add(new Date(2017, 0, 29), TopJs.Date.MONTH, 1), new Date(2017, 1, 28));
            assert.deepEqual(TopJs.Date.add(new Date(2017, 0, 30), TopJs.Date.MONTH, 1), new Date(2017, 1, 28));
            assert.deepEqual(TopJs.Date.add(new Date(2017, 0, 27), TopJs.Date.MONTH, 1), new Date(2017, 1, 27));
            // 看闰年
            assert.deepEqual(TopJs.Date.add(new Date(2000, 0, 27), TopJs.Date.MONTH, 1), new Date(2000, 1, 27));
            assert.deepEqual(TopJs.Date.add(new Date(2000, 0, 28), TopJs.Date.MONTH, 1), new Date(2000, 1, 28));
            assert.deepEqual(TopJs.Date.add(new Date(2000, 0, 29), TopJs.Date.MONTH, 1), new Date(2000, 1, 29));
            assert.deepEqual(TopJs.Date.add(new Date(2000, 0, 30), TopJs.Date.MONTH, 1), new Date(2000, 1, 29));
        });

        it("闰年跨年添加月份", function ()
        {
            assert.deepEqual(TopJs.Date.add(new Date(2000, 1, 29), TopJs.Date.YEAR, 1), new Date(2001, 1, 28));
        });
    });

    describe("TopJs.Date.between", function ()
    {
        let startDate = new Date(2017, 0, 1);
        let endDate = new Date(2017, 0, 31);
        it("当传入日期为起始日期返回true", function ()
        {
            assert.isTrue(TopJs.Date.between(new Date(2017, 0, 1), startDate, endDate));
        });

        it("当传入日期为结束日期返回true", function ()
        {
            assert.isTrue(TopJs.Date.between(new Date(2017, 0, 31), startDate, endDate));
        });

        it("当传入日期在起始和结束之间时候true", function ()
        {
            assert.isTrue(TopJs.Date.between(new Date(2017, 0, 5), startDate, endDate));
        });

        it("当传入日期在起始之前返回false", function ()
        {
            assert.isFalse(TopJs.Date.between(new Date(2016, 11, 30), startDate, endDate));
        });
        it("当传入日期在结束之后返回false", function ()
        {
            assert.isFalse(TopJs.Date.between(new Date(2016, 2, 1), startDate, endDate));
        });
    });

    describe("TopJs.Date.formatting", function ()
    {
        let baseline = Date.UTC(2010, 0, 1, 21, 45, 32, 4);
        let tzOffset = (new Date(baseline)).getTimezoneOffset();
        let ms = baseline + (tzOffset * 60000);
        let date = new Date(ms);
        let format = TopJs.Date.format;

        it("测试格式描述符`d`", function ()
        {
            assert.equal(format(date, "d"), "01");
        });

        it("测试格式化描述符`D`", function ()
        {
            assert.equal(format(date, "D"), "Fri");
        });

        it("测试格式描述符`j`", function ()
        {
            assert.equal(format(date, "j"), "1");
        });

        it("测试格式描述符`l`", function ()
        {
            assert.equal(format(date, "l"), "Friday");
        });

        it("测试格式描述符`N`", function ()
        {
            assert.equal(format(date, "N"), "5");
        });

        it("测试格式描述符`S`", function ()
        {
            assert.equal(format(date, "S"), "st");
        });

        it("测试格式描述符`w`", function ()
        {
            assert.equal(format(date, "w"), "5");
        });

        it("测试格式描述符`z`", function ()
        {
            assert.equal(format(date, "z"), "0");
        });

        it("测试格式描述符`W`", function ()
        {
            assert.equal(format(date, "W"), "53");
        });

        it("测试格式描述符`F`", function ()
        {
            assert.equal(format(date, "F"), "January");
        });

        it("测试格式描述符`m`", function ()
        {
            assert.equal(format(date, "m"), "01");
        });

        it("测试格式描述符`M`", function ()
        {
            assert.equal(format(date, "M"), "Jan");
        });

        it("测试格式描述符`n`", function ()
        {
            assert.equal(format(date, "n"), "1");
        });

        it("测试格式描述符`t`", function ()
        {
            assert.equal(format(date, "t"), "31");
        });

        it("测试格式描述符`L`", function ()
        {
            assert.equal(format(date, "L"), "0");
        });

        it("测试格式描述符`o`", function ()
        {
            assert.equal(format(date, "o"), "2009");
        });

        it("测试格式描述符`Y`", function ()
        {
            assert.equal(format(date, "Y"), "2010");
        });

        it("测试格式描述符`y`", function ()
        {
            assert.equal(format(date, "y"), "10");
        });

        it("测试格式描述符`a`", function ()
        {
            assert.equal(format(date, "a"), "pm");
        });

        it("测试格式描述符`A`", function ()
        {
            assert.equal(format(date, "A"), "PM");
        });

        it("测试格式描述符`g`", function ()
        {
            assert.equal(format(date, "g"), "9");
        });

        it("测试格式描述符`G`", function ()
        {
            assert.equal(format(date, "G"), "21");
        });

        it("测试格式描述符`h`", function ()
        {
            assert.equal(format(date, "h"), "09");
        });

        it("测试格式描述符`H`", function ()
        {
            assert.equal(format(date, "H"), "21");
        });

        it("测试格式描述符`i`", function ()
        {
            assert.equal(format(date, "i"), "45");
        });

        it("测试格式描述符`s`", function ()
        {
            assert.equal(format(date, "s"), "32");
        });

        it("测试格式描述符`u`", function ()
        {
            assert.equal(format(date, "u"), "004");
        });

        it("测试格式描述符`O`", function ()
        {
            //依赖时区，没法静态化
            let offset = TopJs.Date.getGMTOffset(date);
            assert.equal(format(date, "O"), offset);
        });

        it("测试格式描述符`P`", function ()
        {
            //依赖时区，没法静态化
            let offset = TopJs.Date.getGMTOffset(date, true);
            assert.equal(format(date, "P"), offset);
        });

        it("测试格式描述符`T`", function ()
        {
            //依赖时区，没法静态化
            let tz = TopJs.Date.getTimezone(date);
            assert.equal(format(date, "T"), tz);
        });

        it("测试格式描述符`Z`", function ()
        {
            //依赖时区，没法静态化
            let offset = (date.getTimezoneOffset() * -60).toString();
            assert.equal(format(date, "Z"), offset);
        });

        it("测试格式描述符`c`", function ()
        {
            //依赖时区，没法静态化
            let expect = "2010-01-01T21:45:32" + TopJs.Date.getGMTOffset(date, true);
            assert.equal(format(date, "c"), expect);
        });

        it("测试格式描述符`C`", function ()
        {
            assert.equal(format(new Date(baseline), "C"), "2010-01-01T21:45:32.004Z");
        });

        it("测试格式描述符`U`", function ()
        {
            assert.equal(format(new Date(baseline), "U"), "1262382332");
        });

        it("测试格式描述符`MS`", function ()
        {
            let expect = '\\/Date(' + date.getTime() + ')\\/';
            assert.equal(format(date, "MS"), expect);
        });

        it("测试格式描述符`time`", function ()
        {
            assert.equal(format(date, "time"), date.getTime().toString());
        });

        it("测试格式描述符`timestamp`", function ()
        {
            let expect = Math.floor(date.getTime() / 1000).toString();
            assert.equal(format(date, "timestamp"), expect);
        });

        it("应该返回字符串的情况", function ()
        {
            assert.equal(format(undefined, "d"), '');
            assert.equal(format(null, "d"), '');
            assert.equal(format({}, "d"), '');
            assert.equal(format([], "d"), '');
            assert.equal(format('', "d"), '');
            assert.equal(format(true, "d"), '');
            assert.equal(format(false, "d"), '');
            assert.equal(format(2017, "d"), '');
        });

        it("不应该返回空字符串的情况", function ()
        {
            assert.notEqual(format(new Date(), "d"), '');
        });
    });
});