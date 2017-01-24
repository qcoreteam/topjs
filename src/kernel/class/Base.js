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

    }

    function add_deprecated_property(object, oldName, newName, message)
    {

    }
    //</debug>
    function make_alias(name)
    {

    }
    /**
     * @constructor
     * @class TopJs.Base
     */
    TopJs.Base = Base;
}