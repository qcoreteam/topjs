"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

TopJs.namespace("TopJs.stdlib");

/**
 * @alias TopJs.stdlib.PriorityList
 */
class PriorityList {

    constructor()
    {
        /**
         * Internal list of all items.
         *
         * @property {Map} items
         */
        this.items = new Map();

        /**
         * Internal use for sort
         *
         * @property {Array} itemNames
         */
        this.itemNames = [];

        /**
         * Serial assigned to items to preserve LIFO.
         *
         * @property {Number} serial
         */
        this.serial = 0;

        /**
         * Serial order mode
         * @property {Number} isLifoFlag
         */
        this.isLifoFlag = 1;

        /**
         * Internal counter to avoid usage of count().
         *
         * @property {Number} count
         */
        this.count = 0;

        /**
         * Whether the list was already sorted.
         *
         * @property {Boolean} sorted
         */
        this.sorted = false;
    }
    /**
     * Insert a new item.
     *
     * @param {String} name
     * @param {Object} value
     * @param {Number} priority
     */
    insert(name, value, priority = 0)
    {
        if (!this.items.has(name)) {
            this.count++;
            this.itemNames.push(name);
        }
        priority = parseInt(priority);
        priority = isNaN(priority) ? 0 : priority;
        this.sorted = false;
        this.items.set(name, {
            data: value,
            priority: priority,
            serial: this.serial++
        });
    }

    /**
     * change target item priority
     *
     * @param {String} name the item name
     * @param {Number} priority the priority
     * @return {TopJs.stdlib.PriorityList}
     */
    setPriority(name, priority)
    {
        if (this.items.has(name)) {
            let target = this.items.get(name);
            target.priority = priority;
            this.sorted = false;
        }
        return this;
    }

    /**
     * delete item
     *
     * @param {String} name the name of target item to be delete
     * @return {TopJs.stdlib.PriorityList}
     */
    remove(name)
    {
        if (this.items.has(name)) {
            this.count--;
        }
        this.items.delete(name);
        return this;
    }

    /**
     * remove all items
     */
    clear()
    {
        this.items.clear();
        this.serial = 0;
        this.count = 0;
        this.sorted = false;
    }

    /**
     * Get a item by name
     *
     * @param {String} name
     * @return {Object|null}
     */
    get(name)
    {
        if (!this.items.has(name)) {
            return null;
        }
        let target = this.items.get(name);
        return target.data;
    }

    sort()
    {
        if (!this.sorted) {
            let items = this.items;
            let isLifoFlag = this.isLifoFlag;
            TopJs.Array.sort(this.itemNames, function (leftName, rightName)
            {
                let left = items.get(leftName);
                let right = items.get(rightName);
                return (left.priority === right.priority)
                    ? (left.serial > right.serial ? -1 : 1) * isLifoFlag
                    : (left.priority > right.priority ? -1 : 1);
            });
            this.sorted = true;
        }
    }

    /**
     * Get/Set serial order mode
     *
     * @param {Boolean|null} flag
     * @return {Boolean}
     */
    setIsLifoFlag(flag = null)
    {
        if (null !== flag) {
            let isLifo = flag === true ? 1 : -1;
            if (isLifo !== this.isLifoFlag) {
                this.isLifoFlag = isLifo;
                this.sorted = false;
            }
        }
        return 1 === this.isLifoFlag;
    }

    /**
     * get the items count
     *
     * @return {Number}
     */
    getCount()
    {
        return this.count;
    }

    /**
     * Return list as array
     *
     * @param {Number} flag
     * @return {Array}
     */
    toArray(flag = PriorityList.EXTRA_DATA)
    {
        this.sort();
        let items = [];
        if (flag == PriorityList.EXTRA_BOTH) {
            for (let [key, value] of this.items) {
                items.push([key, value]);
            }
            return items;
        }
        let itemMap = this.items;
        this.itemNames.forEach(function (name)
        {
            let item = itemMap.get(name);
            if (flag == PriorityList.EXTRA_PRIORITY) {
                items.push(item.priority);
            } else if (flag == PriorityList.EXTRA_DATA) {
                items.push(item.data);
            }
        });
        return items;
    }

    [Symbol.iterator]()
    {
        this.sort();
        let itemNames = this.itemNames;
        let items = this.items;
        return {
            current: 0,
            next ()
            {
                if (this.current < itemNames.length) {
                    let key = itemNames[this.current++];
                    let item = items.get(key);
                    return {
                        value: [key, item.data],
                        done: false
                    };
                } else {
                    return {
                        value: undefined,
                        done: true
                    };
                }
            }
        };
    }
}

TopJs.apply(PriorityList, {
    /**
     * when extra priority data, you can use this flag to extra both priority and value
     * @memberOf TopJs.stdlib.PriorityList
     * @property {Symbol} EXTRA_DATA
     */
    EXTRA_DATA: 0x00000001,
    
    /**
     * when extra priority data, you can use this flag to extra priority data
     * @memberOf TopJs.stdlib.PriorityList
     * @property {Symbol} EXTRA_PRIORITY
     */
    EXTRA_PRIORITY: 0x00000002,
    
    /**
     * when extra priority data, you can use this flag to extra value data
     * @memberOf TopJs.stdlib.PriorityList
     * @property {Symbol} EXTRA_BOTH
     */
    EXTRA_BOTH: 0x00000003
});

TopJs.registerClass("TopJs.stdlib.PriorityList", PriorityList);
module.exports = PriorityList;
