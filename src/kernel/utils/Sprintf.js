"use strict";
/*
 * TopJs Framework (http://www.topjs.org/)
 *
 * @link      http://github.com/qcoreteam/topjs for the canonical source repository
 * @copyright Copyright (c) 2016-2017 QCoreTeam (http://www.qcoreteam.org)
 * @license   http://www.topjs.org/license/new-bsd New BSD License
 * @author https://github.com/alexei/sprintf.js
 */

let regex = {
    not_string: /[^s]/,
    not_bool: /[^t]/,
    not_type: /[^T]/,
    not_primitive: /[^v]/,
    number: /[diefg]/,
    numeric_arg: /[bcdiefguxX]/,
    json: /[j]/,
    not_json: /[^j]/,
    text: /^[^\x25]+/,
    modulo: /^\x25{2}/,
    placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
    key: /^([a-z_][a-z_\d]*)/i,
    key_access: /^\.([a-z_][a-z_\d]*)/i,
    index_access: /^\[(\d+)\]/,
    sign: /^[\+\-]/
};

let cache = new Map();
let performattedPadding = {

    '0': ['', '0', '00', '000', '0000', '00000', '000000', '0000000'],
    ' ': ['', ' ', '  ', '   ', '    ', '     ', '      ', '       '],
    '_': ['', '_', '__', '___', '____', '_____', '______', '_______'],
};

function sprintf (key, ...args)
{
    if (!cache.has(key)) {
        cache.set(key, parse(key));
    }
    return format(cache.get(key), args);
}

function format (parseTree, args)
{
    let cursor = 0;
    let treeLength = parseTree.length;
    let nodeType = '';
    let arg;
    let output = [];
    let isPositive = true;
    let sign = '';
    for (let i = 0; i < treeLength; i++) {
        nodeType = get_type(parseTree[i]);
        if (nodeType === 'string') {
            output[output.length] = parseTree[i];
        } else if (nodeType === 'array') {
            let match = parseTree[i];
            if (match[2]) {
                //keyword argument
                arg = args[cursor];
                for (let k = 0; k < match[2].length; k++) {
                    if (!arg.hasOwnProperty(match[2][k])) {
                        TopJs.raise(`[sprintf] property "${match[2][k]}" does not exist`);
                    }
                    arg = arg[match[2][k]]
                }
            } else if (match[1]) {
                // positional argument (explicit)
                arg = args[parseInt(match[1]) - 1];
            } else {
                // positional argument (implicit)
                arg = args[cursor++];
            }
            if (regex.not_type.test(match[8]) && regex.not_primitive.test(match[8]) && get_type(arg) == 'function') {
                arg = arg();
            }
            if (regex.numeric_arg.test(match[8]) && (get_type(arg) != 'number' && isNaN(arg))) {
                throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
            }

            if (regex.number.test(match[8])) {
                isPositive = arg >= 0
            }
            switch (match[8]) {
                case 'b':
                    arg = parseInt(arg, 10).toString(2);
                    break;
                case 'c':
                    arg = String.fromCharCode(parseInt(arg, 10));
                    break;
                case 'd':
                case 'i':
                    arg = parseInt(arg, 10);
                    break;
                case 'j':
                    arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0);
                    break;
                case 'e':
                    arg = match[7] ? parseFloat(arg).toExponential(match[7]) : parseFloat(arg).toExponential();
                    break;
                case 'f':
                    arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                    break;
                case 'g':
                    arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg);
                    break;
                case 'o':
                    arg = arg.toString(8);
                    break;
                case 's':
                    arg = String(arg);
                    arg = (match[7] ? arg.substring(0, match[7]) : arg);
                    break;
                case 't':
                    arg = String(!!arg);
                    arg = (match[7] ? arg.substring(0, match[7]) : arg);
                    break;
                case 'T':
                    arg = get_type(arg);
                    arg = (match[7] ? arg.substring(0, match[7]) : arg);
                    break;
                case 'u':
                    arg = parseInt(arg, 10) >>> 0;
                    break;
                case 'v':
                    arg = arg.valueOf();
                    arg = (match[7] ? arg.substring(0, match[7]) : arg);
                    break;
                case 'x':
                    arg = parseInt(arg, 10).toString(16);
                    break;
                case 'X':
                    arg = parseInt(arg, 10).toString(16).toUpperCase();
                    break;
            }

            if (regex.json.test(match[8])) {
                output[output.length] = arg
            }
            else {
                if (regex.number.test(match[8]) && (!isPositive || match[3])) {
                    sign = isPositive ? '+' : '-';
                    arg = arg.toString().replace(regex.sign, '')
                }
                else {
                    sign = ''
                }
                let padCharacter = match[4] ? match[4] === '0' ? '0' : match[4].charAt(1) : ' ';
                let padLength = match[6] - (sign + arg).length;
                let pad = match[6] ? (padLength > 0 ? str_repeat(padCharacter, padLength) : '') : '';
                output[output.length] = match[5] ? 
                    sign + arg + pad : 
                    (padCharacter === '0' ? sign + pad + arg : pad + sign + arg)
            }
        }
    }
    return output.join('');
}

function parse (fmt)
{
    let match = [];
    let parseTree = [];
    let argNames = 0;
    while (fmt) {
        if ((match = regex.text.exec(fmt)) !== null) {
            parseTree[parseTree.length] = match[0];
        } else if ((match = regex.modulo.exec(fmt)) !== null) {
            parseTree[parseTree.length] = '%';
        } else if ((match = regex.placeholder.exec(fmt)) !== null) {
            if (match[2]) {
                argNames |= 1;
                let fieldList = [];
                let replacementField = match[2];
                let fieldMatch = [];
                if ((fieldMatch = regex.key.exec(replacementField)) !== null) {
                    fieldList[fieldList.length] = fieldMatch[1];
                    while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
                        if ((fieldMatch = regex.key_access.exec(replacementField)) !== null) {
                            fieldList[fieldList.length] = fieldMatch[1];
                        } else if ((fieldMatch = regex.index_access.exec(replacementField)) !== null) {
                            fieldList[fieldList.length] = fieldMatch[1];
                        } else {
                            throw new SyntaxError("[sprintf] failed to parse named argument key");
                        }
                    }
                    
                } else {
                    throw new SyntaxError("[sprintf] failed to parse named argument key");
                }
                match[2] = fieldList;
            } else {
                argNames |= 2;
            }
            if (argNames === 3) {
                TopJs.raise("[sprintf] mixing positional and named placeholders is not (yet) supported")
            }
            parseTree[parseTree.length] = match;
        } else {
            throw new SyntaxError("[sprintf] unexpected placeholder")
        }
        fmt = fmt.substring(match[0].length);
    }
    return parseTree;
}

function get_type (variable)
{
    if (typeof variable === 'number') {
        return 'number';
    } else if (typeof variable === 'string') {
        return 'string';
    } else {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
}

function str_repeat (input, multiplier)
{
    if (multiplier >= 0 && multiplier <= 7 && performattedPadding[input]) {
        return performattedPadding[input][multiplier];
    } 
    return new Array(multiplier + 1).join(input);
}

TopJs.apply(TopJs, /** @lends TopJs */{
    sprintf:  sprintf
});