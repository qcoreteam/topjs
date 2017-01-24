/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

"use strict";
export function mount(TopJs)
{
    let checkVerTemp = [''];
    let endOfVersionRe = /([^\d\.])/;
    let notDigitsRe = /[^\d]/g;
    let plusMinusRe = /[\-+]/g;
    let stripRe = /\s/g;
    let underscoreRe = /_/g;
    let Version;
    /**
     * @class TopJs.Version
     * @classdesc
     *
     * 一个工具类重新封装一个版本字符串数据，然后提供一些很方便的函数用于比较不同的版本号
     * 一个版本字符串可以像下面这样的格式：
     *
     * `major[.minor[.patch[.build[release]]]]`
     */
    let Verson = TopJs.Version = function (version, defaultMode)
    {
        let padModes = this.padModes;
        let ch, pad,
            parts, release,
            releaseStartIndex, ver;
        if (version.isVersion) {
            version = version.version;
        }
        this.version = ver = String(version).toLowerCase()
        .replace(underscoreRe, '').replace(plusMinusRe, '');
        ch = ver.charAt(0);
        if (ch in padModes) {
            ver = ver.substring(1);
            pad = padModes[ch];
        } else {
            pad = defaultMode ? padModes[defaultMode] : 0; // careful - NaN is falsey!
        }
        this.pad = pad;
        releaseStartIndex = ver.search(endOfVersionRe);
        this.shortVersion = ver;
        if (releaseStartIndex !== -1) {
            this.release = release = ver.substr(releaseStartIndex, version.length);
            this.shortVersion = ver.substr(0, releaseStartIndex);
            release = Version.releaseValueMap[release] || release;
        }

        this.releaseValue = release || pad;
        this.shortVersion = this.shortVersion.replace(notDigitsRe, '');
        /**
         * @property {Array} parts 版本字符串的数组切分部分
         * 例如 "1.2.3" 转换成 [1, 2, 3]
         * @readonly
         * @private
         */
        this.parts = parts = ver.split('.');
        for (let i = parts.length; i--;) {
            parts[i] = parseInt(parts[i], 10);
        }
        if (pad === Infinity) {
            // have to add this to the end to create an upper bound:
            parts.push(pad);
        }
        /**
         * @property {Number} major 版本字符串第一部分
         * @readonly
         */
        this.major = parts[0] || pad;
        /**
         * @property {Number} minor 版本字符串第二部分
         * @readonly
         */
        this.minor = parts[1] || pad;
        /**
         * @property {Number} minor 版本字符串第三部分
         * @readonly
         */
        this.patch = parts[2] || pad;
        /**
         * @property {Number} minor 版本字符串第四部分
         * @readonly
         */
        this.build = parts[3] || pad;
    };

    TopJs.apply(Version.prototype, /** @lends TopJs.Version.prototype */ {
        /**
         * @private
         */
        isVersion: true,
        /**
         * @private
         * @property {Object} padModes 边界类型，两种类型一种是`NaN`一种是`Infinity`
         */
        padModes: {
            '~': NaN,
            '^': Infinity
        },

        /**
         * 支持如下类型：
         *
         *  * `dev`
         *  * `alpha` 或者 `a`
         *  * `beta` 或者 `b`
         *  * `RC` 或者 `rc`
         *  * `#`
         *  * `pl` 或者 `p`
         *
         * @property {String} [release=""]  发布级别字符串
         *
         */
        release: '',

        /**
         * 将当前的版本对象跟传入的`other`进行版本比较
         * @param {String|Number|TopJs.Version} other 用来比较的版本信息
         * @return {Number} `-1` 代表小于传入对象，`0`代表与传入对象相等，`1`代表大于传入对象
         */
        compareTo(other)
        {
            let lhsPad = this.pad;
            let lhsParts = this.parts;
            let lhsLength = lhsParts.length;
            let rhsVersion = other.isVersion ? other : new Version(other);
            let rhsPad = rhsVersion.pad;
            let rhsParts = rhsVersion.parts;
            let rhsLength = rhsParts.length;
            let length = Math.max(lhsLength, rhsLength);
            let lhs;
            let rhs;
            for (let i = 0; i < length; i++) {
                lhs = (i < lhsLength) ? lhsParts[i] : lhsPad;
                rhs = (i < rhsLength) ? rhsParts[i] : rhsPad;
                if (lhs < rhs) {
                    return -1;
                }
                if (lhs > rhs) {
                    return 1;
                }
            }
            
            lhs = this.releaseValue;
            rhs = rhsVersion.releaseValue;
            if (lhs < rhs) {
                return -1;
            }
            if (lhs > rhs) {
                return 1;
            }
            return 0;
        },

        /**
         * @private
         * @return {String} 版本字符串
         */
        toString()
        {
            return this.version;
        },

        /**
         * @private
         * @return {String} 版本字符串
         */
        valueOf()
        {
            return this.version;
        },

        /**
         * 获取版本字符串的`major`部分
         * 
         * @return {Number} 
         */
        getMajor()
        {
            return this.major;
        },

        /**
         * 获取版本字符串的`minor`部分
         *
         * @return {Number}
         */
        getMinor()
        {
            return this.minor;
        },

        /**
         * 获取版本字符串的`patch`部分
         *
         * @return {Number}
         */
        getPatch()
        {
            return this.patch;
        },

        /**
         * 获取版本字符串的`build`部分
         *
         * @return {Number}
         */
        getBuild()
        {
            return this.build;
        },

        /**
         * 获取版本字符串的`release`文本，(例如: `beta`)
         * 
         * @return {String}
         */
        getRelease: function() 
        {
            return this.release;
        },

        /**
         * 获取版本的`release`值，这个值用于版本比较大小
         * 
         * @return {Number|String}
         */
        getReleaseValue()
        {
            return this.releaseValue;
        },

        /**
         * 判断当前的版本是否大于`target`指定的版本
         * 
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果大于指定的版本对象
         */
        isGreaterThan(target)
        {
            return this.compareTo(target) > 0;
        },

        /**
         * 判断当前的版本是否大于或者等于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果大于或者等于指定的版本对象
         */
        isGreaterThanOrEqual(target)
        {
            return this.compareTo(target) >= 0;
        },

        /**
         * 判断当前的版本是否小于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果小于指定的版本对象
         */
        isLessThan(target)
        {
            return this.compareTo(target) < 0;
        },

        /**
         * 判断当前的版本是否小于或者等于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果小于或者等于指定的版本对象
         */
        isLessThanOrEqual(target)
        {
            return this.compareTo(target) <= 0;
        },

        /**
         * 判断当前的版本是否等于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果者等于指定的版本对象
         */
        equals(target)
        {
            return this.compareTo(target) === 0;
        },

        /**
         * 判断提供的版本数据是否跟当前的版本匹配
         * 
         * ```javascript
         * let version = new TopJs.Version('1.0.2beta');
         * console.log(version.match(1)); // true
         * console.log(version.match(1.0)); // true
         * console.log(version.match('1.0.2')); // true
         * console.log(version.match('1.0.2RC')); // false
         * 
         * ```
         * 
         * @param {String|Number} target 用来比较的版本数据
         * @return {Boolean} `true`代表`target`版本字符串匹配当前的版本
         */
        match(target)
        {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        /**
         * 返回版本数据的数组表示，便于比较版本的大小
         * 
         * @return {Number[]}
         */
        toArray()
        {
            return [
                this.getMajor(), this.getMinor(),
                this.getPatch(), this.getBuild(),
                this.getRelease()
            ];
        },

        /**
         * 获取版本的简洁描述，去掉点和release信息
         * 
         * @return {String} 
         */
        getShortVersion()
        {
            return this.shortVersion;
        },

        /**
         * 判断当前的版本是否大于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果大于指定的版本对象
         */
        gt(target)
        {
            return this.compareTo(target) > 0;
        },

        /**
         * 判断当前的版本是否小于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果小于指定的版本对象
         */
        lt(target)
        {
            return this.compareTo(target) < 0;
        },

        /**
         * 判断当前的版本是否大于或者等于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果大于或者等于指定的版本对象
         */
        gte(target)
        {
            return this.compareTo(target) >= 0;
        },

        /**
         * 判断当前的版本是否小于或者等于`target`指定的版本
         *
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} `true`如果小于或者等于指定的版本对象
         */
        lte(target)
        {
            return this.compareTo(target) <= 0;
        }
    });

    TopJs.apply(Version, /** @lends TopJs.Version */ {
        /**
         * @private
         */
        releaseValueMap: {
            dev:   -6,
            alpha: -5,
            a:     -5,
            beta:  -4,
            b:     -4,
            rc:    -3,
            '#':   -2,
            p:     -1,
            pl:    -1
        },

        /**
         * 将版本号的`release`部分转换成可比较的值
         * 
         * @param {object} value 获取`release`部分的可比较的值
         * @return {Object}
         */
        getCompValue(value)
        {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        /**
         * 比较两个版本
         * 
         * @param {String|Number|TopJs.Version} current 当前的版本
         * @param {String|Number|TopJs.Version} target 目标比较的版本
         * @return {Boolean} 如果`current`版本数据小于`target`版本返回`-1`，如果`current`版本等于`target`
         * 返回`0`，如果`current`版本大于`target`返回`1`
         */
        compare(current, target)
        {
            let ver = current.isVersion ? current : new Version(current);
            return ver.compareTo(target);
        }
    });
}