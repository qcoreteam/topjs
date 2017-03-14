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
 * @class TopJs.stdlib.DoubleLinkedList
 * @author https://github.com/vovazolotoy/TypeScript-STL
 */
class DoubleLinkedList
{
    /**
     * Count of elements in list
     *
     * @property {Number} length
     * @private
     */
    length = 0;

    /**
     * Iteration pointer
     *
     * @property {Number} _key
     * @private
     */
    _key = 0;

    /**
     * Reference to head(first) element in list
     *
     * @property {Object} head
     * @private
     */
    head = null;

    /**
     * Reference to tail(last) element in list
     *
     * @property {Object} tail
     * @private
     */
    tail = null;
    
    /**
     * Reference to iterated element in list
     *
     * @property {Object} _current
     * @private
     */
    _current = null;

    /**
     * Insert a new value at the specified index
     *
     * @param {Number} index The index where the new value is to be inserted.
     * @param {Object} value The new value for the index.
     * @return {void}
     */
    insert (index, value)
    {
        if (index < 0 || index >= this.length) {
            TopJs.raise("Out of bounds");
        }
        let i = 0;
        let target;
        if (0 === index) {
            let node = {
                value: value,
                prev: null,
                next: this.head
            };
            this.head.prev = node;
            this.head = node;
        } else {
            let current = this.head;
            while (i < index) {
                current = current.next;
                i++;
            }
            target = current.prev;
            target.next = {
                value: value,
                prev: target,
                next: target.next
            };
        }
    }

    /**
     * Pops a node from the end of the doubly linked list
     *
     * @return {Object} any The value of the popped node.
     */
    pop ()
    {
        if (0 == this.length) {
            // TODO really need throws?
            TopJs.raise("can't pop from empty list");
        }
        let value = this.tail.value;
        this.tail = this.tail.prev;
        if (this.tail) {
            delete this.tail.next;
            this.tail.next = null;
        }
        this.length--;
        if (0 == this.length) {
            this.head = null;
        }
        return value;
    }

    /**
     * Shifts a node from the beginning of the doubly linked list
     *
     * @return {Object} any The value of the shifted node.
     */
    shift ()
    {
        if (0 == this.length) {
            // TODO really need throws?
            TopJs.raise("can't pop from empty list");
        }
        let value = this.head.value;
        this.head = this.head.next;
        if (this.head) {
            delete this.head.prev;
            this.head.prev = null;
        }
        this.length--;
        return value;
    }

    /**
     * Pushes an element at the end of the doubly linked list
     *
     * @param {Object} value The value to push.
     * @return {void}
     */
    push (value)
    {
        let node = {
            value: value,
            prev: this.tail,
            next: null
        };
        if (0 === this.length) {
            this.head = this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.length++;
    }

    /**
     * Prepends the doubly linked list with an element
     *
     * @param {Object} value The value to unshift.
     * @return {void}
     */
    unshift (value)
    {
        let node = {
            value: value,
            prev: null,
            next: this.head
        };
        if (0 === this.length) {
            this.head = this.length = node;
        } else {
            this.head.prev = node;
            this.head = node;
        }
        this.length++;
    }

    /**
     * Peeks at the node from the end of the doubly linked list
     *
     * @return {Object|null} any The value of the last node.
     */
    top ()
    {
        if (this.tail) {
            return this.tail.value;
        }
        return null;
    }


    /**
     * Peeks at the node from the beginning of the doubly linked list
     *
     * @return {Object|null} any  The value of the first node.
     */
    bottom ()
    {
        if (this.head) {
            return this.head.value;
        }
        return null;
    }

    /**
     * Counts the number of elements in the doubly linked list
     * 
     * @return {Number}
     */
    count ()
    {
        return this.length;
    }

    /**
     * Checks whether the doubly linked list is empty
     * 
     * @return {Boolean} whether the doubly linked list is empty.
     */
    isEmpty()
    {
        return 0 === this.length;
    }

    /**
     * Rewind iterator back to the start
     * 
     * @return {void}
     */
    rewind ()
    {
        this.key = 0;
        this._current = this.head;
    }

    /**
     * Return {Object|null} current list entry
     */
    current ()
    {
        if (this._current) {
            return this._current.value;
        }
        return null;
    }

    /**
     * Return current node index
     * 
     * @return {Number} he current node index.
     */
    key ()
    {
        return this._key;
    }

    /**
     * Move to next entry
     */
    next ()
    {
        this._current = this._current.next;
        this._key++;
    }

    /**
     * Move to previous entry
     */
    prev ()
    {
        this._current = this._current.prev;
        this._key--;
    }

    /**
     * Check whether the doubly linked list contains more nodes
     *  
     * @return {Boolean} true if the doubly linked list contains any more nodes, false otherwise.
     */
    valid ()
    {
        return (this._key >= 0 && this._key < this.length);
    }

    /**
     * Export the list to array
     * 
     * @return {Array} The exported array
     */
    toArray ()
    {
        let list = [];
        let current = this.head;
        while (current) {
            list.push(current.value);
            current = current.next;
        }
        return list;
    }
    
    [Symbol.iterator]()
    {
        let me = this;
        me.rewind();
        return {
            key: 0,
            current: me._current,
            next ()
            {
                if (this.key < me.length) {
                    let current = this.current;
                    let key = this.key;
                    this.current = this.current.next;
                    this.key++;
                    return {
                        value: [key, current]
                    };
                } else {
                    return {
                        value: undefined,
                        done: true
                    } ;
                }
            }
        };
    }
}

TopJs.registerClass("TopJs.stdlib.DoubleLinkedList", DoubleLinkedList);
module.exports = DoubleLinkedList;
