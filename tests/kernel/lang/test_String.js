/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
const StandardLoader = require("../../../lib/Entry").StandardLoader;
let assert = require("chai").assert;
let loader = new StandardLoader({
    [StandardLoader.AUTO_REGISTER_TOPJS]: true
});
loader.register();

describe("TopJs.String", function ()
{
    describe("TopJs.String.ellipsis", function ()
    {
        let shortString = "A short string";
        let longString = "A somewhat longer string";
        let Chinese = "大家好，我是软件男孩";
        it("限制的长度大于字符串，保持字符串不变", function ()
        {
            assert.equal(TopJs.String.ellipsis(shortString, 50), shortString);
        });
        it("字符串超过限制长度加上...", function ()
        {
            assert.equal(TopJs.String.ellipsis(longString, 10), "A somew...");
        });
        it("中文测试", function ()
        {
            assert.equal(TopJs.String.ellipsis(Chinese, 5), "大家...");
        });
        describe("在单词边界切", function ()
        {
            let longStringWithDot = "www.topjs.org",
                longStringWithExclamationMark = "Yeah!Yeah!Yeah!",
                longStringWithQuestionMark = "Who?When?What?";
            it("空格切分", function ()
            {
                assert.equal(TopJs.String.ellipsis(longString, 10, true), "A...");
            });
            it("`.`进行切分", function ()
            {
                assert.equal(TopJs.String.ellipsis(longStringWithDot, 10, true), "www...");
            });
            it("`!`进行切分", function ()
            {
                assert.equal(TopJs.String.ellipsis(longStringWithExclamationMark, 10, true), "Yeah...");
            });
            it("?`进行切分", function ()
            {
                assert.equal(TopJs.String.ellipsis(longStringWithQuestionMark, 10, true), "Who...");
            });
        });
    });
    describe("TopJs.String.escapeRegex", function ()
    {
        it("过滤`-`字符", function ()
        {
            assert.equal(TopJs.String.escapeRegex("a-b"), "a\\-b");
        });
        it("过滤`.`字符", function ()
        {
            assert.equal(TopJs.String.escapeRegex("i am softboy."), "i am softboy\\.");
        });
        it("过滤`*`字符", function ()
        {
            assert.equal(TopJs.String.escapeRegex("12 * 12"), "12 \\* 12");
        });
        it("过滤`?`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("who are you ?"), "who are you \\?");
        });
        it("过滤`^^`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("^^"), "\\^\\^");
        });
        it("过滤`$`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("500$"), "500\\$");
        });
        it("过滤`{}`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("{some string}"), "\\{some string\\}");
        });
        it("过滤`[]`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("[some string]"), "\\[some string\\]");
        });
        it("过滤`()`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("(some string)"), "\\(some string\\)");
        });
        it("过滤`|`", function ()
        {
            assert.equal(TopJs.String.escapeRegex("some|string"), "some\\|string");
        });
        it("过滤`/`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("some/string"), "some\\/string");
        });
        it("过滤`\\`符号", function ()
        {
            assert.equal(TopJs.String.escapeRegex("some\\string"), "some\\\\string");
        });
    });
    describe("TopJs.String.htmlEncode", function ()
    {
        it("转义`&`符号", function ()
        {
            assert.equal(TopJs.String.htmlEncode("dog & cat"), "dog &amp; cat");
        });
        it("转义`>和<`符号", function ()
        {
            assert.equal(TopJs.String.htmlEncode("</img>"), "&lt;/img&gt;");
        });
        it("转义`'`符号", function ()
        {
            assert.equal(TopJs.String.htmlEncode("i love ' you"), "i love &#39; you");
        });
        it('转义`"`符号', function ()
        {
            assert.equal(TopJs.String.htmlEncode('i love " you'), "i love &quot; you");
        });
        describe("测试增加实体定义", function ()
        {
            let src = "A string with entities: \u00e9\u00dc\u00e7\u00f1\u00b6";
            let encoded = "A string with entities: &egrave;&Uuml;&ccedil;&ntilde;&para;";
            beforeEach(function ()
            {
                TopJs.String.addCharEntities({
                    "&Uuml;": "\u00dc",
                    "&ccedil;": "\u00e7",
                    "&ntilde;": "\u00f1",
                    "&egrave;": "\u00e9",
                    "&para;": "\u00b6"
                });
            });
            afterEach(function ()
            {
                TopJs.String.resetCharEntities();
            });
            it("转义新添加的html实体", function ()
            {
                assert.equal(TopJs.String.htmlEncode(src), encoded);
            });
        });
    });
    describe("TopJs.String.htmlDecode", function ()
    {
        it("解析 `&amp;`符号", function ()
        {
            assert.equal(TopJs.String.htmlDecode("dog &amp; cat"), "dog & cat");
        });
        it("解析`&gt;`符号", function ()
        {
            assert.equal(TopJs.String.htmlDecode("dog &gt; cat"), "dog > cat");
        });
        it("解析`&lt;`符号", function ()
        {
            assert.equal(TopJs.String.htmlDecode("dog &lt; cat"), "dog < cat");
        });
        it("解析`&quot;`符号", function ()
        {
            assert.equal(TopJs.String.htmlDecode("dog &quot; cat"), 'dog " cat');
        });
        it("解析`&#39;`符号", function ()
        {
            assert.equal(TopJs.String.htmlDecode("dog &#39; cat"), "dog ' cat");
        });
        describe("测试增加实体定义", function ()
        {
            let src = "A string with entities: \u00e9\u00dc\u00e7\u00f1\u00b6";
            let encoded = "A string with entities: &egrave;&Uuml;&ccedil;&ntilde;&para;";
            beforeEach(function ()
            {
                TopJs.String.addCharEntities({
                    "&Uuml;": "\u00dc",
                    "&ccedil;": "\u00e7",
                    "&ntilde;": "\u00f1",
                    "&egrave;": "\u00e9",
                    "&para;": "\u00b6"
                });
            });

            afterEach(function ()
            {
                TopJs.String.resetCharEntities();
            });
            it("应该decode自定义的实体", function ()
            {
                assert.equal(TopJs.String.htmlDecode(encoded), src);
            });
        });
    });

    describe("TopJs.String.escape", function ()
    {
        it("空数组不改变", function ()
        {
            assert.equal(TopJs.String.escape(''), '');
        });
        it("字符串里面没有需要反义的保持原样", function ()
        {
            assert.equal(TopJs.String.escape("i am softboy"), "i am softboy");
        });
        it("转义`\\`", function ()
        {
            assert.equal(TopJs.String.escape("i am \\softboy"), "i am \\\\softboy");
        });
        it("转义单个反斜杠", function ()
        {
            assert.equal(TopJs.String.escape("i am \'softboy"), "i am \\\'softboy");
        });
        it("混合单个斜杠和双斜杠", function ()
        {
            assert.equal(TopJs.String.escape('i am \'softboy\\'), "i am \\\'softboy\\\\");
        });
    });
    describe("TopJs.String.leftPad", function ()
    {
        it("在空字符串左边进行填充", function ()
        {
            assert.equal(TopJs.String.leftPad("", 5), "     ");
        });
        it("在非空字符串左边填充", function ()
        {
            assert.equal(TopJs.String.leftPad("abc", 5), "  abc");
        });
        it("当字符串长度大于指定的值时候不填充", function ()
        {
            assert.equal(TopJs.String.leftPad("abcefg", 5), "abcefg");
        });
        it("自定义填充符", function ()
        {
            assert.equal(TopJs.String.leftPad("abc", 5, '0'), "00abc");
        })
    });

    describe("TopJs.String.toggle", function ()
    {
        it("不相等返回自己", function ()
        {
            assert.equal(TopJs.String.toggle("c", "a", 'b'), "a");
        });
        it("等于第一个返回第二个值", function ()
        {
            assert.equal(TopJs.String.toggle("a", "a", 'b'), "b");
        });
        it("等于第二个值返回第一个值", function ()
        {
            assert.equal(TopJs.String.toggle("b", "a", 'b'), "a");
        });
    });

    describe("TopJs.String.urlAppend", function ()
    {
        it("第二个参数不指定不进行任何操作", function ()
        {
            assert.equal(TopJs.String.urlAppend("www.topjs.com"), "www.topjs.com");
        });
        it("如果不存在？则添加一个？", function ()
        {
            assert.equal(TopJs.String.urlAppend("www.topjs.com", "name=softboy"), "www.topjs.com?name=softboy");
        });
        it("如果存在则不添加？", function ()
        {
            assert.equal(TopJs.String.urlAppend("www.topjs.com?age=11", "name=softboy"),
                "www.topjs.com?age=11&name=softboy");
        });
    });
    describe("TopJs.String.capitalize", function ()
    {
        it("正确处理空字符串", function ()
        {
            assert.equal(TopJs.String.capitalize(""), "");
        });
        it("已经是大写了，不进行处理", function ()
        {
            assert.equal(TopJs.String.capitalize("Softboy"), "Softboy");
        });
        it("大写第一个字符", function ()
        {
            assert.equal(TopJs.String.capitalize("softboy"), "Softboy");
        });
        it("正确处理单个字符", function ()
        {
            assert.equal(TopJs.String.capitalize("a"), "A");
        });
        it("正确处理有空格的字符串", function ()
        {
            assert.equal(TopJs.String.capitalize("i am softboy"), "I am softboy");
        })
    });

    describe("TopJs.String.uncapitalize", function ()
    {
        it("处理空字符串", function ()
        {
            assert.equal(TopJs.String.uncapitalize(""), "");
        });
        it("小写第一个字符", function ()
        {
            assert.equal(TopJs.String.uncapitalize("Softboy"), "softboy");
        });
        it("只处理第一个字符", function ()
        {
            assert.equal(TopJs.String.uncapitalize("SoftBoy"), "softBoy");
        });
        it("处理单个字符", function ()
        {
            assert.equal(TopJs.String.uncapitalize("A"), "a");
        });
        it("处理有空格的字符串", function ()
        {
            assert.equal(TopJs.String.uncapitalize("I am softboy"), "i am softboy");
        });
    });
    describe("TopJs.String.repeat", function ()
    {
        it("返回空字符串如果count = 0", function ()
        {
            assert.equal(TopJs.String.repeat("I am softboy", 0), "");
        });
        it("返回空字符串如果count < 0", function ()
        {
            assert.equal(TopJs.String.repeat("I am softboy", 0), "");
        });
        it("重复指定数目", function ()
        {
            assert.equal(TopJs.String.repeat("i am softboy", 1, '/'), "i am softboy");
            assert.equal(TopJs.String.repeat("i am softboy", 2, '&'), "i am softboy&i am softboy");
            assert.equal(TopJs.String.repeat("i am softboy", 3, '%'), "i am softboy%i am softboy%i am softboy");
        });
        it("无分割符连接字符串", function ()
        {
            assert.equal(TopJs.String.repeat("softboy", 1), "softboy");
            assert.equal(TopJs.String.repeat("softboy", 2), "softboysoftboy");
            assert.equal(TopJs.String.repeat("a b", 3), "a ba ba b");
        });
    });
    describe("TopJs.String.insert", function ()
    {
        describe("相关的控制操作", function ()
        {
            it("待插入的是undefined", function()
            {
                assert.equal(TopJs.String.insert(undefined, "softboy"), "softboy");
            });
            it("待插入的是null", function()
            {
                assert.equal(TopJs.String.insert(null, "softboy"), "softboy");
            });
            it("待插入的是空字符串", function()
            {
                assert.equal(TopJs.String.insert('', "softboy"), "softboy");
            });
            it("插入的值是undefined", function ()
            {
                assert.equal(TopJs.String.insert("softboy", undefined), "softboy");
            });
            it("插入的值是undefined", function ()
            {
                assert.equal(TopJs.String.insert("softboy", null), "softboy");
            });
            it("插入的值是undefined", function ()
            {
                assert.equal(TopJs.String.insert("softboy", ""), "softboy");
            });
        });
        describe("带索引的插入", function ()
        {
            describe("不合法的索引", function ()
            {
                assert.equal(TopJs.String.insert("foo", "bar", -50), "barfoo");
                assert.equal(TopJs.String.insert("foo", "bar", 50), "foobar");
            });
            describe("合法的索引", function ()
            {
                it("默认的索引", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar"), "foobar");
                });
                it("在字符串最前面插入", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar", 0), "barfoo");
                });
                it("在字符串末尾插入", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar", 3), "foobar");
                });
                it("使用负索引在字符串头部插入", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar", -3), "barfoo");
                });
                it("在倒数第一个字符前面插入", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar", -1), "fobaro");
                });
                it("在第一个字符后面插入", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar", 1), "fbaroo");
                });
                it("在倒数第二个字符前面插入", function ()
                {
                    assert.equal(TopJs.String.insert("foo", "bar", -2), "fbaroo");
                });
            });
        });
    });
    describe("TopJs.String.startsWith", function ()
    {
        describe("错误的参数", function ()
        {
            it("第一个参数为undefined，返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith(undefined, ''));
            });
            it("第一个参数为null，返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith(null, ''));
            });
            it("第二个参数为null，返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith("", null));
            });
            it("第二个参数为undefined，返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith("", undefined));
            });
            it("第二个参数的长度大于第一个参数，返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith("a", "some other string"));
            });
        });
        describe("正常参数相关", function()
        {
            it("空字符串比较返回，返回true", function ()
            {
                assert.isTrue(TopJs.String.startsWith("", ""));
            });
            it("第二个参数为空字符串，返回true", function ()
            {
                assert.isTrue(TopJs.String.startsWith("a string", ""));
            });
            it("第二个参数是第一个参数的开始子串，返回true", function ()
            {
                assert.isTrue(TopJs.String.startsWith("foobar", "foo"));
            });
            it("第二个参数是第一个参数的开始子串,并且其他地方还出现，返回true", function ()
            {
                assert.isTrue(TopJs.String.startsWith("foobarfoo", "foo"));
            });
            it("第二个参数不是是第一个参数的开始子串，返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith("foobarbaz", "bar"));
            });
            it("第二个参数是第一个参数的结束子串返回false", function ()
            {
                assert.isFalse(TopJs.String.startsWith("foobarbaz", "baz"));
            });
        });
        describe("忽略大小写", function ()
        {
            it("第一个参数大写，第二个参数小写", function ()
            {
                assert.isTrue(TopJs.String.startsWith("FOOBAR", "foo", 0, true));
            });
            it("第一个参数大写，第二个参数大写", function ()
            {
                assert.isTrue(TopJs.String.startsWith("FOOBAR", "FOO", 0, true));
            });
            it("第一个参数小写，第二个参数大写", function ()
            {
                assert.isTrue(TopJs.String.startsWith("foobar", "FOO", 0, true));
            });
            it("混合大小写", function ()
            {
                assert.isTrue(TopJs.String.startsWith("fOobar", "FoO", 0, true));
            });
        });
        describe("指定开始比较的位置", function ()
        {
            it("指定一个比较开始的位置",function ()
            {
                assert.isTrue(TopJs.String.startsWith("afoobar", "foo", 1));
                assert.isFalse(TopJs.String.startsWith("foobar", "foo", 1));
            });
        });
    });
    describe("TopJs.String.endsWith", function ()
    {
        describe("错误的参数", function ()
        {
            it("第一个参数为undefined，返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith(undefined, ''));
            });
            it("第一个参数为null，返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith(null, ''));
            });
            it("第二个参数为null，返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith("", null));
            });
            it("第二个参数为undefined，返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith("", undefined));
            });
            it("第二个参数的长度大于第一个参数，返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith("a", "some other string"));
            });
        });
        describe("正常参数相关", function()
        {
            it("空字符串比较返回，返回true", function ()
            {
                assert.isTrue(TopJs.String.endsWith("", ""));
            });
            it("第二个参数为空字符串，返回true", function ()
            {
                assert.isTrue(TopJs.String.endsWith("a string", ""));
            });
            it("第二个参数是第一个参数的结束子串，返回true", function ()
            {
                assert.isTrue(TopJs.String.endsWith("foobar", "bar"));
            });
            it("第二个参数是第一个参数的结束子串,并且其他地方还出现，返回true", function ()
            {
                assert.isTrue(TopJs.String.endsWith("foobarfoo", "foo"));
            });
            it("第二个参数不是是第一个参数的结束子串，返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith("foobarbaz", "bar"));
            });
            it("第二个参数是第一个参数的开始子串返回false", function ()
            {
                assert.isFalse(TopJs.String.endsWith("foobarbaz", "foo"));
            });
        });
        describe("忽略大小写", function ()
        {
            it("第一个参数大写，第二个参数小写", function ()
            {
                assert.isTrue(TopJs.String.endsWith("FOOBAR", "bar", 0, true));
            });
            it("第一个参数大写，第二个参数大写", function ()
            {
                assert.isTrue(TopJs.String.endsWith("FOOBAR", "BAR", 0, true));
            });
            it("第一个参数小写，第二个参数大写", function ()
            {
                assert.isTrue(TopJs.String.endsWith("foobar", "BAR", 0, true));
            });
            it("混合大小写", function ()
            {
                assert.isTrue(TopJs.String.endsWith("fOoBar", "bAR", 0, true));
            });
        });
        describe("指定比较结束的位置", function ()
        {
            it("指定一个比较结束的位置",function ()
            {
                assert.isTrue(TopJs.String.endsWith("afoobara", "bar", 7));
                assert.isFalse(TopJs.String.endsWith("foobar", "bar", 5));
            });
        });
    });
});