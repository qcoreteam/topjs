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
 * @class TopJs.stdlib.Heap
 * @author https://github.com/vovazolotoy/TypeScript-STL
 */
class Heap
{
    /**
     * Max heap flag
     *
     * @property {Symbol} MAX
     * @static
     */
     static MAX = 1;

     /**
     * Min heap flag
     *
     * @property {Symbol} MIN
     * @static
     */
    static MIN = -1;
    /**
     * Binary tree storage array
     *
     * @property {Array} tree
     * @private
     */
    tree = [];

    /**
     * Heap type
     *
     * @property {Number} type
     * @private
     */
    type = Heap.MAX;
    
    /**
     * Get index of left child element in binary tree stored in array
     *
     * @param {Number} n
     * @return {Number}
     * @private
     */
    child (n)
    {
        return 2 * n + 1;
    }

    /**
     * Get index of parent element in binary tree stored in array
     *
     * @param {Number} n
     * @return {Number}
     * @private
     */
    parent (n)
    {
        return Math.floor(n / 2);
    }

    /**
     * Swap 2 elements in binary tree
     * 
     * @param {Number} left
     * @param {Number} right
     * @private
     */
    swap (left, right)
    {
        let swap = this.tree[left];
        this.tree[left] = this.tree[right];
        this.tree[right] = swap;
    }

    /**
     * Sift elements in binary tree
     *
     * @param {Number} i
     * @private
     */
    siftUp (i)
    {
        while (i > 0) {
            let parent = this.parent(i);
            if (this.compare(this.tree[i], this.tree[parent]) * this.type > 0) {
                this.swap(i, parent);
                i = parent;
            } else{
                break;
            }
        }
    }

    /**
     * Sift down elements in binary tree
     *
     * @param {Number} i
     * @private
     */
    siftDown (i)
    {
        while (i < this.tree.length) {
            let left = this.child(i);
            let right = left + 1;
            if ((left < this.tree.length) && (right < this.tree.length) &&
                (this.compare(this.tree[i], this.tree[left]) * this.type < 0||
                 this.compare(this.tree[i], this.tree[right]) * this.type < 0)) {
                // there is 2 children and one of them must be swapped
                // get correct element to sift down
                let sift = left;
                if (this.compare(this.tree[left], this.tree[right]) * this.type < 0) {
                    sift = right;
                }
                this.swap(i, sift);
                i = sift;
            } else if (left < this.tree.length &&
                this.compare(this.tree[i], this.tree[left]) * this.type < 0) {
                // only one child exists
                this.swap(i, left);
                i = left;
            } else {
                break;
            }
        }
    }

    /**
     * Extracts a node from top of the heap and sift up
     *
     * @return any The value of the extracted node.
     */
    extra ()
    {
        if (this.tree.length === 0) {
            TopJs.raise("Can't extract from an empty data structure");
        }
        let extracted = this.tree[0];
        if (this.tree.length === 1) {
            this.tree = [];
        } else {
            this.tree[0] = this.tree.pop();
            this.siftDown(0);
        }
        return extracted;
    }

    /**
     * Inserts an element in the heap by sifting it up
     *
     * @param {Object} value The value to insert.
     * @return {void}
     */
    insert (value)
    {
        this.tree.push(value);
        this.siftUp(this.tree.length - 1);
    }

    /**
     * Peeks at the node from the top of the heap
     *
     * @return any The value of the node on the top.
     */
    top ()
    {
        if (this.tree.length === 0) {
            TopJs.raise("Can't peek at an empty heap");
        }
        return this.tree[0];
    }

    /**
     * Counts the number of elements in the heap
     * 
     * @return {Number} the number of elements in the heap.
     */
    count ()
    {
        return this.tree.length;
    }

    /**
     * Compare elements in order to place them correctly in the heap while sifting up.
     *
     * @method compare
     * @param {Number} left The value of the first node being compared.
     * @param {Number} right The value of the second node being compared.
     * @return number Result of the comparison, positive integer if first is greater than second, 0 if they are equal, negative integer otherwise.
     * Having multiple elements with the same value in a Heap is not recommended. They will end up in an arbitrary relative position.
     */
    compare (left, right)
    {
        if (left > right) {
            return 1;
        } else if (first == second) {
            return 0;
        } else {
            return -1;
        }
    }

    /**
     * Visually display heap tree
     *
     * @param {Object} node
     * @param prefix
     * @param last
     * @return String
     * @private
     */
    displayNode (node, prefix, last)
    {
        if (prefix === void 0) {
            prefix = '';
        }
        if (last === void 0) {
            last = true;
        }
        let line = prefix;
        // get child indexes
        let left = this.child(node);
        let right = left + 1;
        if (last) {
            line += (prefix ? '└─' : '  ');
        }  else {
            line += '├─';
        }
        line += this.tree[node];
        prefix += (last ? '  ' : '│ ');
        if (left < this.tree.length) {
            line += '\n' + this.displayNode(left, prefix, (this.tree[right] === undefined));
        }
        if (right < this.tree.length) {
            line += '\n' + this.displayNode(right, prefix, true);
        }
        return line;
    }
    
    /**
     * Serializes the heap to string
     *
     * @return string   The serialized string.
     */
    toString ()
    {
        return this.displayNode(0);
    }
        
    /**
     * Serializes the heap to array
     * 
     * @return {Array}
     */
    toArray ()
    {
        return this.tree;
    }

    [Symbol.iterator]()
    {
        let length = this.tree.length;
        let tree = this.tree;
        return {
            current: 0,
            next ()
            {
                if (this.current < length) {
                    let item = [this.current, tree[this.current]];
                    this.current++;
                    return {
                        value: item
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

TopJs.registerClass("TopJs.stdlib.Heap", Heap);
module.exports = Heap;