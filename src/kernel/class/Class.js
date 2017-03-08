/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 */

let Base = TopJs.Base;
let baseStaticMembers = Base.$_static_members_$;
/**
 * @class TopJs.Class
 */
let TopJsClass = TopJs.Class = function (Class, data, onCreated)
{
    if (typeof Class != "function") {
        onCreated = data;
        data = Class;
        Class = null;
    }
    if (!data) {
        data = {};
    }
    Class = TopJsClass.create(Class, data);
    TopJsClass.process(Class, data, onCreated);
    return Class;
};

function make_constructor(className)
{
    function constructor()
    {
    }

    //<debug>
    if (className) {
        constructor.className = className;
    }
    //</debug>
    return constructor;
}

TopJs.apply(TopJsClass, /** @lends TopJs.Class */{
    /**
     * @private
     */
    defaultPreprocessors: [],

    /**
     * @private
     */
    makeCtor: make_constructor,
    /**
     * @private
     */
    onBeforeCreated (Class, data, hooks)
    {
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(Class, '>> TopJs.Class#onBeforeCreated', arguments);
        //</debug>
        Class.addMembers(data);
        hooks.onCreated.call(Class, Class);
        //<debug>
        TopJs.classSystemMonitor && TopJs.classSystemMonitor(Class, '<< Ext.Class#onBeforeCreated', arguments);
        //</debug>
    },
    /**
     * @private
     */
    create: function (Class, data)
    {
        let i = baseStaticMembers.length;
        let name;
        if (!Class) {
            Class = makeCtor(
                //<debug>
                data.$_class_name
                //</debug>
            );
        }
        while (i--) {
            name = baseStaticMembers[i];
            Class[name] = Base[name];
        }
        return Class;
    },

    /**
     * @private
     */
    process(Class, data, onCreated)
    {
        let preprocessorStack = data.preprocessors || TopJsClass.defaultPreprocessors;
        let registeredPreprocessors = this.preprocessors;
        let hooks = {
            onBeforeCreated: this.onBeforeCreated
        };
        let preprocessors = [];
        let preprocessor;
        let preprocessorsProperties;
        let preprocessorProperty;
        delete data.preprocessors;
        Class._classHooks = hooks;
        for (let i = 0, len = preprocessorStack.length; i < len; i++) {
            preprocessor = preprocessorStack[i];
            if (typeof preprocessor == "string") {
                preprocessor = registeredPreprocessors[preprocessor];
                preprocessorsProperties = preprocessor.properties;
                if (preprocessorsProperties === true) {
                    preprocessors.push(preprocessor.func);
                } else if (preprocessorsProperties) {
                    for (let j = 0, subLn = preprocessorsProperties.length; j < subLn; j++) {
                        preprocessorProperty = preprocessorsProperties[j];
                        if (data.hasOwnProperty(preprocessorProperty)) {
                            preprocessors.push(preprocessor.func);
                            break;
                        }
                    }
                }
            } else {
                preprocessors.push(preprocessor);
            }
        }
        hooks.onCreated = onCreated ? onCreated : TopJs.emptyFn;
        hooks.preprocessors = preprocessors;
        this.doProcess(Class, data, hooks);
    },

    doProcess(Class, data, hooks)
    {
        let preprocessors = hooks.preprocessors;
        let preprocessor = preprocessors.shift();
        let doProcess = this.doProcess;
        while (preprocessor) {
            if (preprocessor.call(this, Class, data, hooks, doProcess) === false) {
                return;
            }
            preprocessor = preprocessors.shift();
        }
        hooks.onBeforeCreated.apply(this, arguments);
    }
});