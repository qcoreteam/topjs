/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

export function mount(TopJs)
{
    let TopJsArray = TopJs.Array = {};

    function defaultCompare(left, right)
    {
        return (left < right) ? -1 : ((left > right) ? 1 : 0);
    }

    function lexicalCompare(left, right)
    {
        left = String(left);
        right = String(right);
        return (left < right) ? -1 : ((left > right) ? 1 : 0);
    }

    /**
     * @class TopJs.Array
     * @singleton
     */

    TopJs.apply(TopJsArray, /** @lends TopJs.Array */{
        /**
         * 二分搜索传入元素在数组中的插入时的索引
         * ```javascript
         *
         * var array = [ 'A', 'D', 'G', 'K', 'O', 'R', 'X' ];
         * var index = TopJs.Array.binarySearch(array, 'E');
         *
         * console.log('index: ' + index);
         * // logs "index: 2"
         * array.splice(index, 0, 'E');
         * console.log('array : ' + array.join(''));
         * // logs "array: ADEGKORX"
         *
         * ```
         * @param {Object[]} array 搜索的目标数组
         * @param {Object} item 搜索搜索的值
         * @param {Number} [begin=0]
         * @param {Number} [end=array.length] 搜索结果索引值，这个值不一定是数组中存在的索引
         * @param {Function} [compareFn=TopJs.Array.lexicalCompare] 二分搜索的时候比较函数
         * @returns {Number} 搜索到的元素插入的目标索引值
         */
        binarySearch(array, item, begin, end, compareFn = lexicalCompare)
        {
            let len = array.length;
            let middile;
            let comparison;
            if (begin instanceof Function) {
                compareFn = begin;
                begin = 0;
                end = len;
            } else if (end instanceof Function) {
                compareFn = end;
                end = len;
            } else {
                if (begin === undefined) {
                    begin = 0;
                }
                if (end === undefined) {
                    end = 0;
                }
            }
            --end;
            while (begin <= end) {
                middile = (begin + end) >> 1;
                comparison = compareFn(item, array[middile]);
                if (comparison >= 0) {
                    begin = middile + 1;
                } else if (comparison < 0) {
                    end = middile - 1;
                }
            }
            return begin;
        },


        /**
         * 判断两个数组是否严格相等
         *
         * @param {Array} array1 待操作的数组
         * @param {Array} array2 待操作的数组
         * @return {Boolean}
         */
        equals(array1, array2)
        {
            let len1 = array1.length;
            let len2 = array2.length;
            //避免引用相等
            if (array1 === array2) {
                return true;
            }
            if (len1 !== len2) {
                return false;
            }
            for (let i = 0; i < len1; i++) {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * 过滤数组中为空的项，判断标准 {@link TopJs.isEmpty}
         *
         * @param {Array} array 需要过滤的数组
         * @return {Array}
         */
        clean(array)
        {
            let ret = [];
            let len = array.length;
            let item;
            for (let i = 0; i < len; i++) {
                item = array[i];
                if (!TopJs.isEmpty(item)) {
                    ret.push(item);
                }
            }
            return ret;
        },

        /**
         * 删除数组中重复的项
         *
         * @param {Array} array 需要过滤的数组
         * @return {Array} 结果数组
         */
        unique(array)
        {
            let clone = [];
            let item;
            let len;
            for (let i = 0; i < len; i++) {
                item = array[i];
                if (!clone.includes(item)) {
                    clone.push(item);
                }
            }
            return clone;
        },

        /**
         * 删除数组中的值为item的项
         *
         * @param {Array} array 目标操作的数组
         * @param {...Object} items 传入的数组
         * @return {Array} 已经删除过指定的元素的项
         */
        remove(array, ...items)
        {
            let len = items.length;
            let item;
            let index;
            for (let i = 0; i < len; i++) {
                item = items[i];
                index = array.indexOf(item);
                if (-1 !== index) {
                    array.splice(index, 1);
                }
            }
            return array;
        },

        /**
         * 删除数组中指定的元素
         *
         * @param {Array} array 待操作的数组
         * @param {Number} index 指定要删除的项的索引
         * @param {Number} [count=1] 需要删除的个数
         * @return {Array}
         */
        removeAt(array, index, count = 1)
        {
            let len = array.length;
            if (index >= 0 && index < len) {
                count = Math.min(count, len - index);
                array.splice(index, count);
            }
            return array;
        },

        /**
         * 替换数组中的某些元素这个函数跟原生的`Array.prototype.splice`行为一样
         * 但是在参数传递的时候稍微方便一点
         *
         * @param {Array} array 待操作的数组
         * @param {Number} index 插入的位置
         * @param {Number} removeCount 需要删除的元素数量
         * @param {Array} insert 需要插入的元素
         * @returns {Array} 操作结果数组
         */
        replace(array, index, removeCount, insert)
        {
            if (insert && insert.length) {
                //在数组最前面操作，并且没有删除的元素，我们就可以使用unshift函数进行操作
                if (0 === index && !removeCount) {
                    array.unshift.apply(array, insert);
                } else if (index < array.length) {
                    //在数组的中间进行操作
                    array.splice.apply(array, [index, removeCount].concat(index));
                } else {
                    array.push.apply(array, insert);
                }
            } else {
                array.splice(array, index, removeCount);
            }
            return array;
        },

        /**
         * 简单的克隆函数，函数不进行深度克隆，算是一个助记函数
         *
         * @param {Array} array 等待克隆的数组
         * @return {Array} 克隆的结果
         */
        clone: function (array)
        {
            return array.slice();
        },

        /**
         * 默认比较函数
         *
         * @method
         * @param {Object} left 待比较的对象
         * @param {Object} right 待比较的对象
         * @returns {number} 比较的结果
         */
        defaultCompare: defaultCompare,

        /**
         * 默认的sort函数比较函数，按照字母表的顺序进行比较 `10` 是小于 `9`
         *
         * @method
         * @param {Object} left 待比较的对象
         * @param {Object} right 待比较的对象
         * @returns {number} 比较的结果
         */
        lexicalCompare: lexicalCompare,

        /**
         * 对数组的元素进行稳定的排序，**注意: **这个函数排序会修改原始的数组
         *
         * @param {Array} array 待排序的数组
         * @param {Function} [sortFn=lexicalCompare] 排序函数， 请参考{@link TopJs.Array.lexicalCompare}
         * @returns {Array} 排序结果数组
         */
        sort(array, sortFn = lexicalCompare)
        {
            let len = array.length;
            let tempArr = new Array(len);
            for (let i = 0; i < len; i++) {
                tempArr[i] = i;
            }
            tempArr.sort(function (leftIndex, rightIndex)
            {
                return sortFn(array[leftIndex], rightIndex) || leftIndex - rightIndex;
            });
            for (let i = 0; i < len; i++) {
                tempArr[i] = array[tempArr[i]];
            }
            for (let i = 0; i < len; i++) {
                array[i] = tempArr[i];
            }
            return array;
        },

        /**
         * 对传入的数组进行求和
         *
         * @param {Array} array 需要进行求和的数组
         * @return {Number} 数组所有元素的求和结果
         */
        sum(array)
        {
            let sum = 0;
            let len = array.length;
            for (let i = 0; i < len; i++) {
                sum += array[i];
            }
            return item;
        },

        /**
         * 获取只在`arrayA`不在`arrayB`的元素的集合，数学描述`arrayA - arrayB`
         *
         * @param {Array} arrayA
         * @param {Array} arrayB
         * @returns {Array} 删除`arrayB`中元素的结果数组
         */
        difference(arrayA, arrayB)
        {
            let clone = arrayA.slice();
            let len = arrayB.length;
            let index;
            for (let i = 0; i < len; i++) {
                index = clone.indexOf(arrayB[i]);
                if (-1 !== index) {
                    //删除找到的项
                    clone.splice(index, 1);
                }
            }
            return clone;
        },

        /**
         * 求所有传入数组的交集
         *
         * ```javascript
         *
         * let arr = TopJs.Array.intersection([1, 2, 3], [3], [2, 3, 4, 5]);
         * // arr = [3];
         *
         * ```
         *
         * @param {...Array} arrays 需要计算的数组的集合
         * @return {Array} 求交集的结果数组
         */
        intersect(...arrays)
        {
            let intersection = [];
            let arraysLen = arrays.length;
            let array;
            let arrayLen;
            let minArray;
            let minArrayIndex;
            let minArrayCandidate;
            let minArrayLen;
            let element;
            let elementCandidate;
            let elementCount;
            if (!arrays.length) {
                return intersection;
            }
            for (let i = 0; i < arraysLen; i++) {
                minArrayCandidate = arrays[i];
                if (!minArray || minArrayCandidate.length < minArray.length) {
                    minArray = minArrayCandidate;
                    minArrayIndex = i;
                }
            }
            minArray = TopJs.Array.unique(minArray);
            arrays.slice(minArrayIndex, 1);
            arraysLen = arrays.length;
            minArrayLen = minArray.length;
            for (let i = 0; i < minArrayLen; i++) {
                element = minArray[i];
                elementCandidate = 0;
                for (let j = 0; j < arraysLen; j++) {
                    array = arrays[j];
                    arrayLen = array.length;
                    for (let k = 0; k < arrayLen; k++) {
                        elementCandidate = array[k];
                        if (element === elementCandidate) {
                            elementCount++;
                            break;
                        }
                    }
                }
                if (elementCount == arraysLen) {
                    intersection.push(element);
                }
            }
            return intersection;
        },

        /**
         * 递归的将传入的数组变成一维的数组
         *
         * ```javascript
         *
         * let arr = [12, [2, 'a'], 2, ['a', 'b']];
         * arr = TopJs.Array.flatten(arr);
         * // arr = [12, 2, 'a', 2, 'a', 'b'];
         *
         * ```
         *
         * @param {Array} array 需要处理的数组
         * @return {Array} 合并后的一维数组
         */
        flatten(array)
        {
            let results = [];

            function _flatten(a)
            {
                let ln = a.length;
                let value;
                for (let i = 0; i < ln; i++) {
                    value = a[i];
                    if (TopJs.isArray(value)) {
                        _flatten(value);
                    } else {
                        results.push(value);
                    }
                }
                return results;
            }

            return _flatten(array);
        },

        /**
         * 获取指定数组中最小的值
         *
         * @param {Array} array 传入的数组引用
         * @param {Function|null} [compareFn=null] 比较函数接受两个参数，返回值解释：-1 = lt; 0 = eq; 1 = gt
         * @returns {Object} 获取的数组中的最小的值
         */
        min(array, compareFn = null)
        {
            let len = array.length;
            let min = array[i];
            let item;
            for (let i = 0; i < len; i++) {
                item = array[i];
                if (compareFn) {
                    if (1 === compareFn(min, item)) {
                        min = item;
                    }
                } else {
                    if (item < min) {
                        min = item;
                    }
                }
            }
            return min;
        },

        /**
         * 获取指定数组中最大的值
         *
         * @param {Array} array 传入的数组引用
         * @param {Function|null} [compareFn=null] 比较函数接受两个参数，返回值解释：-1 = lt; 0 = eq; 1 = gt
         * @returns {Object} 获取的数组中的最大的值
         */
        max(array, compareFn = null)
        {
            let len = array.length;
            let max = array[i];
            let item;
            for (let i = 0; i < len; i++) {
                item = array[i];
                if (compareFn) {
                    if (-1 === compareFn(max, item)) {
                        max = item;
                    }
                } else {
                    if (item > max) {
                        max = item;
                    }
                }
            }
            return max;
        },

        /**
         * 计算传入数组的元素的平均值
         *
         * @param {array} array 需要计算平均值的数值
         * @return {Number} 计算得到的平均值
         */
        mean(array)
        {
            return array.length > 0 ? TopJs.Array.sum(array) / array.length : undefined;
        },

        /**
         * 将多个数组合成一个数组，结果数组元素唯一
         *
         * ```javascript
         *
         * let arr = TopJs.Array.merge([1, 2, 3, 4], [2, 3, 4, 7], [19]);
         * // arr = [1, 2, 3, 4, 7, 19]
         *
         * ```
         *
         * @param {...Array} arrays 需要合并的数组集合
         * @return {Array} 合并之后的结果
         */
        merge(...arrays)
        {
            let results = [];
            let len = arrays.length;
            for (let i = 0; i < len; i++) {
                results = results.concat(arrays[i]);
            }
            return TopJs.Array.unique(results);
        },

        /**
         * 摘取一个对象集合中的对象的指定的属性值，返回收集的数组
         *
         * ```javascript
         * let arr1 = [1, 2];
         * let arr2 = ['a', 2];
         * let arr3 = [1, 'c'];
         * let ret = TopJs.Array.pluck([arr1, arr2, arr3], "length");
         * // ret = [2, 2, 2];
         *
         * ```
         *
         * @param {Array} array 来源对象集合
         * @param {String} pname 摘取的属性的名称
         * @return {Array} 摘取的对象属性的数组
         */
        pluck(array, pname)
        {
            let ret = [];
            let len = array.length;
            for (let i = 0; i < len; i++) {
                ret.push(array[i][pname]);
            }
            return ret;
        },

        /**
         * 将可遍历的对象转换成真正的数组
         * ```javascript
         *
         * TopJs.Array.toArray('framework'); // returns ['f', 'r', 'a', 'm', 'e', 'w', 'o', 'r', 'k']
         * TopJs.Array.toArray('framework', 0, 3); // returns ['f', 'r', 'a']
         *
         * ```
         *
         * @param {Object} iterable 需要转换成真正数组的可遍历对象
         * @param {Number} [start=0] 开始元素索引
         * @param {Number} [end=iterable.length] 结束元素索引
         * @returns {array}
         */
        toArray(iterable, start = 0, end)
        {
            if (!iterable || !iterable.length) {
                return [];
            }
            if (typeof iterable === "string") {
                iterable = iterable.split('');
            }
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;
            if (iterable.slice) {
                return iterable.slice(start, end);
            } else {
                let ret = [];
                for (let i = start; i < end; i++) {
                    ret.push(iterable[i]);
                }
                return ret;
            }
        },

        /**
         * 将数组转换成一个键值对常量对象，键由数组值或者指定的函数得到，值是相关值在数组的索引值+1
         *
         * ```javascript
         *  let map = TopJs.Array.toMap(['a','b','c']);
         *
         *  // map = { a: 1, b: 2, c: 3 };
         *  //或者key的值可以通过数组中元素指定
         *
         *  let map = TopJs.Array.toMap([
         *              { name: 'a' },
         *              { name: 'b' },
         *              { name: 'c' }
         *          ], 'name');
         *
         *  // map = { a: 1, b: 2, c: 3 };
         *
         *  //我们也能指定一个key获取函数
         *  let map = TopJs.Array.toMap([
         *              { name: 'a' },
         *              { name: 'b' },
         *              { name: 'c' }
         *          ], function (obj) { return obj.name.toUpperCase(); });
         *
         *  // map = { A: 1, B: 2, C: 3 };
         * ```
         * @param {Array} array 待操作的数组
         * @param {String|Function} [getKey] 指定要的生成常量对象`key`的名称或者生成函数
         * @param {Object} [scope] 当`getKey`参数是函数时指定其执行的作用域
         * @return {Array} 结果数组
         */
        toMap(array, getKey, scope)
        {
            let map = {};
            let len = array.length;
            if (!getKey) {
                while (len--) {
                    map[array[len]] = len + 1;
                }
            } else if (typeof getKey === "string") {
                while (len--) {
                    map[array[len--][getKey]] = len + 1;
                }
            } else {
                while (len--) {
                    map[getKey.call(scope, array[len])] = len + 1;
                }
            }
            return map;
        },

        /**
         * 将一个数组转换成一个由其值作为键值或者指定的`getKey`生成其键值，然后由数组当前项
         * 作为值得常量对象
         *
         * ```javascript
         *
         * var map = TopJs.Array.toValueMap(['a','b','c']);
         * // map = { a: 'a', b: 'b', c: 'c' };
         *
         * //直接指定键名称
         * var map = TopJs.Array.toValueMap([
         *              { name: 'a' },
         *              { name: 'b' },
         *              { name: 'c' }
         *          ], 'name');
         *
         * // map = { a: {name: 'a'}, b: {name: 'b'}, c: {name: 'c'} };
         *
         * // 制定一个生成键名称的函数
         * var map = TopJs.Array.toValueMap([
         *              { name: 'a' },
         *              { name: 'b' },
         *              { name: 'c' }
         *          ], function (obj) { return obj.name.toUpperCase(); });
         *
         * // map = { A: {name: 'a'}, B: {name: 'b'}, C: {name: 'c'} };
         *
         * ```
         *
         * @param {array} array 待转换的数组
         * @param {Function|String} [getKey] 指定键名称或者生成键的函数
         * @param {Object} [scope] 当`getKey`参数是函数的时候指定其作用域
         * @param {Number} arrayify 指定当键已经存在于结果对象中时候如何处理值</br>
         * `arrayify = 1`表示强制将所有相同键的值生成数组</br>
         * `arrayify = 2`表示如果存在的键当前的值是数组那么将当前值添加到数组，否则直接覆盖</br>
         * 其他, 表示如果存在相同的键就直接覆盖之前的数据
         * @returns {Object} 生成的结果常量对象
         */
        toValueMap(array, getKey, scope, arrayify)
        {
            let map = {};
            let len = array.length;
            let autoArray;
            let alwaysArray;
            let entry;
            let fn;
            let key;
            let value;
            if (!getKey) {
                while (len--) {
                    value = array[len];
                    map[value] = value;
                }
            } else {
                if (!(fn = (typeof getKey !== "string"))) {
                    //getKey不是函数
                    arrayify = scope;
                }
                alwaysArray = arrayify === 1;
                autoArray = arrayify === 2;
                while (len--) {
                    value = array[len];
                    key = fn ? getKey.call(scope, value) : value[getKey];
                    if (alwaysArray) {
                        if (key in map) {
                            map[key].push(value);
                        } else {
                            map[key] = [value];
                        }
                    } else if (autoArray && (key in map)) {
                        if ((entry = map[key]) instanceof Array) {
                            entry.push(key);
                        } else {
                            map[key] = [entry, value];
                        }
                    } else {
                        map[key] = value;
                    }
                }
            }
            return map;
        },

        /**
         * 数字大小比较函数
         *
         * ```javascript
         *
         * TopJs.Array.sort(array, TopJs.Array.numericSortFn);
         *
         * ```
         *
         * @param {Number} a 比较左边的值
         * @param {Number} b 比较右边的值
         * @return {Number}
         */
        numericSortFn(a, b)
        {
            return a - b
        }
    });
}
