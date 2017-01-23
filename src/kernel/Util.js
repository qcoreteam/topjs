/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

/**
 * 定义一些挂载在TopJs名称空间上的帮助函数
 *
 * @private
 */
export function mount(TopJs)
{
    let nonWhitespaceRe = /\S/;
    let toString = Object.prototype.toString;
    let typeofTypes = {
        number: 1,
        string: 1,
        'boolean': 1,
        'undefined': 1
    };
    let toStringTypes = {
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object RegExp]': 'regexp'
    };
    TopJs.apply(TopJs, /** @lends TopJs */ {
        /**
         * 在指定的作用域上面执行传入的回调函数，当传入的是一个纯函数的时候，让该函数在指定的作用域下
         * 执行，如果传入的函数是字符串，那么我们在传入的作用域对象下寻找是否有这个方法，有就执行。
         * 如果什么都不传，那么我们忽略这个调用。
         *
         * ```javascript
         * //下面几个调用时等价的
         *
         * let fn = this.fn;
         *
         * TopJs.callback(fn, this, [arg1, arg2]);
         * TopJs.callback("fn", this, [arg1, arg2]);
         *
         * ```
         *
         * @memberOf TopJs
         * @param {Function|String} callback 一个函数引用或者一个作用域下的方法名称
         * @param {Object} scope 第一个参数指定的`callback`的执行作用域，如果第一个参数为字符串，那么必须在这个作用域下
         * 存在名字为`callback`所指字符串的方法,如果`scope`为`null`那么`callback`将在`defaultScope`指定的作用域下执行
         * @param {Array} args 传给`callback`的参数
         * @param {Number} defer `callback`延迟调用的毫秒数
         * @param {Object} caller 如果没有显示的提供`scope`，那么`callback`调用时将用`caller`参数进行解析方法
         * @param {Object} defaultScope 默认的作用域，最后的容错对象
         * @return {Mixed|undefined} 返回`callback`的返回值，如果指定`defer`或者`callback`不是一个函数则返回`undefined`
         */
        callback(callback, scope, args, defer, caller, defaultScope)
        {
        },

        typeof()
        {

        },

        iterate()
        {

        },

        /**
         * 向控制台输出一条信息
         *
         * @method
         * @param {Object} [options] 需要输出的信息的选项
         * @param {String} options.msg 输出的字符串信息(必要字段)
         * @param {String} [options.level=log] 错误级别 `error`, `warn`, `info` or `log` (默认是 `log`).
         * @param {Boolean} [options.dump=false] 是否将整个对象`dump`到错误信息里面
         * @param {Boolean} [options.stack=false] 是否输出函数调用栈
         * @param {Boolean} [options.indent=true] 是否对错误信息进行缩进
         * @param {Boolean} [options.outdent=true] 是否对当前的语句和后面的语句减少一个缩进
         * @param {...String} [message] 需要输出的字符串数据
         */
        log:
        //<debug>
        (function(){
            
            function log(message)
            {
                let options;
                let dump;
                let level = 'log';
                let indent = log.indent || 0;
                let prefix;
                let stack;
                let fn;
                log.indent = indent;
                if (typeof message !== 'string') {
                    options = message;
                    message = options.msg || '';
                    level = options.level || level;
                    dump = options.dump;
                    stack = options.stack;
                    prefix = options.prefix;
                    fn = options.fn;
                    if (options.indent) {
                        ++log.indent;
                    } else if (options.outdent) {
                        log.indent = indent = Math.max(indent - 1, 0);
                    }
                }
                
                if (arguments.length > 1) {
                    message += Array.prototype.slice.call(arguments, 1).join('');
                }
                if (prefix) {
                    message = prefix + ' - ' + message;
                }
                message = indent ? TopJs.String.repeat(' ', log.indentSize * indent) + message : message;
                if (level !== 'log') {
                    message = '[' + level.charAt(0).toUpperCase() + '] ' + message;
                }

                if (fn) {
                    message += '\nCaller: ' + fn.toString();
                }
                if (console[level]) {
                    console[level](message);
                } else {
                    console.log(message);
                }

                if (dump) {
                    console.dir(dump);
                }

                if (stack && console.trace) {
                    console.trace();
                }
                ++log.count;
                ++log.counters[level];
            }

            function logx (level, args) {
                if (typeof args[0] === 'string') {
                    args.unshift({});
                }
                args[0].level = level;
                log.apply(this, args);
            }

            log.error = function () {
                logx('error', Array.prototype.slice.call(arguments));
            };
            log.info = function () {
                logx('info', Array.prototype.slice.call(arguments));
            };
            log.warn = function () {
                logx('warn', Array.prototype.slice.call(arguments));
            };
            log.count = 0;
            log.counters = { error: 0, warn: 0, info: 0, log: 0 };
            log.indentSize = 2;
            return log;
        })() ||
        //</debug>
        (function () {
            let nullLog = function () {};
            nullLog.info = nullLog.warn = nullLog.error = TopJs.emptyFn;
            return nullLog;
        }())
    });
}