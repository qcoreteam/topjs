/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
"use strict";
let NumberObject = TopJs.Number = {};
let ClipDefault = {
    count: false,
    inclusive: false,
    wrap: true
};
/**
 * @class TopJs.Number
 * @singleton
 */
TopJs.apply(NumberObject, /** @lends TopJs.Number */{
    /**
     * 安全的最小整形
     *
     * @static
     * @readonly
     */
    MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -(math.pow(2, 53) - 1),

    /**
     * 安全的最大整形
     *
     * @static
     * @readonly
     */
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || math.pow(2, 53) - 1,

    Clip: {
        DEFAULT: ClipDefault,

        COUNT: TopJs.applyIf({
            count: true
        }, ClipDefault),

        INCLUSIVE: TopJs.applyIf({
            inclusive: true
        }, ClipDefault),

        NOWRAP: TopJs.applyIf({
            wrap: false
        }, ClipDefault)
    },

    /**
     * 按照长度，将一个给定的`index`强制变成一个正确范围的`index`
     *
     * 负的`index`解释成从集合的尾部进行计算，`-1`指定的是数组最后一个元素或者是`length - 1`
     * 当一个函数需要传递`begin`和`end`参数的时候，这个方法可以向下面这样用：
     *
     * ```javascript
     * function foo (array, begin, end) {
         *    let range = TopJs.Number.clipIndices(array.length, [begin, end]);
         *    begin = range[0];
         *    end   = range[1];
         *    // 0 <= begin <= end <= array.length
         *    let length = end - begin;
         * }
     * ```
     * 比如以下的例子：
     * ```
     *  +---+---+---+---+---+---+---+---+
     *  |   |   |   |   |   |   |   |   |  length = 8
     *  +---+---+---+---+---+---+---+---+
     *  0   1   2   3   4   5   6   7
     * -8  -7  -6  -5  -4  -3  -2  -1
     *
     * console.log(TopJs.Number.clipIndices(8, [3, 10]); // logs "[3, 8]"
     * console.log(TopJs.Number.clipIndices(8, [-5]);    // logs "[3, 8]"
     * console.log(TopJs.Number.clipIndices(8, []);
     * console.log(TopJs.Number.clipIndices(8, []);
     * ```
     *
     * @param {Number} length 数组的长度
     * @param {Number[]} [indices] 指定的索引数据
     * @param {Object} [options] 相关选项
     * @param {Boolean} [options.count=false] 当这个选项为`true`的时候, `indices`的第二个数字
     * 代表`count`而不是一个`index`
     * @param {Boolean} [options.inclusive=false] 当这个选项为`true`, `indices`的第二个数字包含到
     * 范围里面，默认第二个数字不包含在范围里面
     * @param {Boolean} [options.wrap=true] 当这个选项为`true`, 函数会处理负的`index`将其解释为从数组的
     * 末尾开始，设置为`false`的话，简单的解释负`index`为`0`
     * @return {Number[]} 经过处理的`[begin, end]`数组，`end`不包含在范围里面`length = end - begin`，所有的
     * 值都包含在`0`和`length`之间，`end`参数不会小于`begin`
     */
    clipIndices(length, indices = [], options = ClipDefault)
    {
        let defaultValue = 0;
        let wrap = options.wrap;
        let begin;
        let end;
        indices = indices || [];
        for (let i = 0; i < 2; i++) {
            begin = end;
            end = indices[i];
            if (null == end) {
                end = defaultValue;
            } else if (i && options.count) {
                end += begin;
                end = (end > length) ? length : end;
            } else {
                if (wrap) {
                    end = (end < 0) ? (length + end) : end;
                }
                if (i && options.inclusive) {
                    end++;
                }
                end = (end < 0) ? 0 : ((end > length) ? length : end);
            }
            defaultValue = length;
        }
        indices[0] = begin;
        indices[1] = (end < begin) ? begin : end;
        return indices;
    },

    /**
     * 检查传入的数字是否在指定的范围里面，如果已经在指定的范围里面那么直接返回，
     *
     *
     * @param {Number} number 等待检查的数字
     * @param {Number} min 范围的下限
     * @param {Number} max 范围的上限
     * @return {Number} 处理之后的数字
     */
    constrain(number, min, max)
    {
        let x = parseFloat(number);
        if (min === null) {
            min = number;
        }
        if (max === null) {
            max = number;
        }
        // Operators are faster than Math.min/max. See http://jsperf.com/number-constrain
        return (x < min) ? min : ((x > max) ? max : x);
    },

    /**
     * 获取给定的数的符号，详情请看`MDN for Math.sign documentation`这里是个快捷连接
     *
     * @method
     * @param {Number} x 需要测试的值
     * @return {Number} 返回`1`代表正数, `-1`代表负数, `0`代表是零
     */
    sign: Math.sign,

    /**
     * 四舍五入到最近的间隔
     *
     * @param {Number} value 等待四舍五入的值
     * @param {Number} [interval=1] 四舍五入的间隔
     * @return {Number} 已经操作完成的数
     */
    roundToNearest(value, interval = 1)
    {
        interval = interval || 1;
        return interval * Math.round(value / interval);
    },

    /**
     * 判断想个数字是否在给定的精度`epsilon`范围内相等
     *
     * @param {Number} n1 待比较的数字
     * @param {Number} n2 待比较的数字
     * @param {Number} epsilon 指定比较的精度边界
     * @return {Boolean} 比较的结果`true`代表两个数相等
     */
    isEqual(n1, n2, epsilon)
    {
        //<debug>
        if (!(typeof n1 === 'number' && typeof n2 === 'number' && typeof epsilon === 'number')) {
            throw Error("所有的参数都必须是数字");
        }
        //</debug>
        return Math.abs(n1 - n2) < epsilon;
    },

    /**
     * 判断`value`是否为数字，如果是将其转换成数字，如果不是我们返回默认的数字
     *
     * ```javascript
     * TopJs.Number.from('2.42', 1); // returns 2.42
     * TopJs.Number.from('abc', 1); // returns 1
     * ```
     *
     * @param {Object} value
     * @param {Number} defaultValue
     * @return {Number} 处理结果数字
     */
    from(value, defaultValue)
    {
        if (isFinite(value)) {
            value = Number.parseFloat(value);
        }
        return (undefined !== value && !isNaN(value)) ? value : defaultValue;
    },

    /**
     * 返回一个在`from`跟`to`之间的随机数，边界包含在内
     *
     * @param {Number} from 范围下限
     * @param {Number} to 范围上限
     */
    randomInt(from, to)
    {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },

    /**
     * 获取一个正确的浮点类型, 比如`0.1 + 0.2`结果就不正确
     *
     * @param {Number} f 等待处理的数字
     * @return {Number} 处理之后的数字
     */
    correctFloat(f)
    {
        //将浮点的表述变长，这样进行计算的时候就能获取正确的结果
        return Number.parseFloat(f.toPrecision(14))
    }
});