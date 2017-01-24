/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

export function mount(TopJs)
{
    let noArgs;
    let baseStaticMember;
    let baseStaticMembers = [];

    function get_config(name, peek)
    {
        let ret;
        let cfg;
        let getterName;
        if (name) {
            cfg = TopJs.Config.map[name];
            //<debug>
            if (!cfg) {
                TopJs.Logger.error("Invalid property name for getter: '" + name + "' for '" + me.$_className_$ + "'.");
            }
            //</debug>
            getterName = cfg.names.get;
            if (peek && this.hasOwnProperty(getterName)) {
                ret = this.config[name];
            } else {
                ret = this[getterName]();
            }
        } else {
            retr = this.getCurrentConfig();
        }
        return ret;
    }

    //<debug>
    function make_deprecated_method(oldName, newName, msg)
    {
        let message = `"${oldName}" 已经被弃用。`;
        if (msg) {
            message += " " + msg;
        } else if (newName) {
            message += `请使用${newName}代替。`;
        }
        return function ()
        {
            TopJs.raise(message);
        }
    }

    function add_deprecated_property(object, oldName, newName, message)
    {
        if (!message) {
            message = `${oldName}已经被弃用。`;
        }
        if (newName) {
            message += `请使用${newName}代替。`;
        }
        if (message) {
            Object.defineProperty(object, oldName, {
                get: function ()
                {
                    TopJs.raise(message);
                },
                set: function (value)
                {
                    TopJs.raise(message);
                },
                configurable: true
            });
        }
    }

    //</debug>
    function make_alias(name)
    {
        return function (...args)
        {
            return this[name](...args);
        }
    }

    let Version = TopJs.Version;
    let leadingDigitRe = /^\d/;
    let oneMember = {};
    let aliasOneMember = {};
    let Base;
    /**
     * @class TopJs.Base
     */
    TopJs.Base = Base = function ()
    {
    };

    let BasePrototype = Base.prototype;
    let Reaper;
    TopJs.Reater = Reaper = {
        delay: 100,
        queue: [],
        timer: null,

        add(obj)
        {
            if (!Reaper.timer) {
                Reaper.timer = TopJs.defer(Reaper.tick, Reaper.delay);
            }
            Reaper.queue.push(obj);
        },

        flush()
        {
            if (Reaper.timer) {
                clearTimeout(Reaper.timer);
                Reaper.timer = null;
            }
            let queue = Reaper.queue;
            let n = queue.length;
            let obj;
            Reaper.queue = [];
            for (let i = 0; i < n; i++) {
                obj = queue[i];
                if (obj && obj.$_reap_$) {
                    obj.$_reap_$();
                }
            }
        },

        tick()
        {
            Reaper.timer = null;
            Reaper.flush();
        }
    };
    
    // 这些静态属性将会复制到用{@link TopJs.define}定义的所有的类中
    TopJs.apply(Base, /** @lends TopJs.Base */{
        $_class_name_$: "TopJs.Base",
        $_is_class: true,

        /**
         * 创建当前类的一个实例
         * ```javascript
         *  TopJs.define('My.cool.Class', {
         *     ...
         *  });
         *
         *  My.cool.Class.create({
         *     someConfig: true
         *  });
         * ```
         * 所有的参数都传递给类的构造函数
         * @return {Object} 新创建的实例
         */
        create(...args)
        {
            args.unshift(this);
            return TopJs.create(...args);
        },
        
        addDeprecations(deprecations)
        {
            let all = [];
        }
    });
}