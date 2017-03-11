"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */
/**
 * 定义一个名称空间的包装器
 *
 * @author Jonathan ARNAULT
 *
 * @private
 * @constructor
 * @param {string} [name=null] 名称空间的名字
 * @param {Namespace} [parent=null] 当前的名称空间的父名称空间
 * @param {string} [directory=null] 当前名称空间关联的文件系统路径
 */

function Namespace(name = null, parent = null, directory = null)
{
    this.name = name;
    this.parent = parent;
    this.directory = directory;
    if (this.parent) {
        this.parent.setChild(name, this);
    }
}

Object.assign(Namespace.prototype, /** @lends TopJs.Namespace.prototype */{
    /**
     * @protected
     * @property {string|null} name 名称空间的名称
     */
    name: null,
    /**
     * @protected
     * @property {Namespace|null} parent 当前名称空间的父名称空间
     */
    parent: null,

    /**
     * @protected
     * @property {string|null} directory 当前名称空间对应的文件夹
     */
    directory: null,

    /**
     * @protected
     * @property {Map} children 子名称空间或者本名称空间的类
     */
    children: new Map(),

    /**
     * 获取当前名称空间的全称
     *
     * @return {string}
     */
    getFullName()
    {
        if (null !== this.parent) {
            return this.parent.getFullName() + "." + this.name;
        }
        return this.name;
    },

    /**
     * 获取名称空间的子项
     *
     * @return {string[]}
     */
    getChildrenKeys()
    {
        let iterator = this.children.keys();
        let keys = [];
        for (let key of iterator) {
            keys.push(key);
        }
        return keys;
    },

    setDirectory(directory)
    {
        if (directory !== this.directory) {
            this.directory = directory;
        }
        return this;
    },

    /**
     * 获取当前名称空间的子名称空间，如果不存在则返回false
     *
     * @param {string} name 需要获取的名称空间的名称
     * @returns {Namespace|null}
     * @throws {Error} 当子名称空间名称中含有`.`字符的时候抛出
     */
    getChildNamespace(name)
    {
        if (this.children.has(name)) {
            let child = this.children.get(name);
            if (child instanceof Namespace) {
                return child;
            }
        }
        return null;
    },
    /**
     * 获取当前名称空间指定的子名称对象引用
     *
     * @param {String} name 指定的子名称空间的名称
     * @returns {Namespace|null}
     */
    getChild(name)
    {
        if (this.children.has(name)) {
            return this.children.get(name);
        }
        return null;
    },
    /**
     * 给当前名称空间添加指定名称的名称空间对象
     *
     * @param name 待添加的名称空间的名称
     * @returns {null}
     * @throws {Error} 当子名称空间名称中含有`.`字符的时候抛出
     */
    setChild(name, ns)
    {
        if (-1 !== name.indexOf(".")) {
            throw new Error("child namespace name cannot contains '.'");
        }
        if (null !== ns && ns instanceof Namespace) {
            if (this.children.has(name)) {
                return;
            }
            this.children.set(name, ns);
        }
    }
});

module.exports = Namespace;