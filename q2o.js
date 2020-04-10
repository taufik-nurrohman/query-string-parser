/*! <https://github.com/taufik-nurrohman/query-string-parser> */
(function(win, NS) {

    function doQueryEval(x, evaluate, separator) {

        function decode(x) {
            return decodeURIComponent(x);
        }

        function isSet(x) {
            return 'undefined' !== typeof x;
        }

        function isString(x) {
            return 'string' === typeof x;
        }

        function isObject(x) {
            return null !== x && 'object' === typeof x;
        }

        function mayBeJSON(x) {
            if (!isString(x) || "" === x.trim()) {
                return false;
            }
            return (
                // Maybe an empty string, array or object
                '""' === x ||
                '[]' === x ||
                '{}' === x ||
                // Maybe an encoded JSON string
                '"' === x[0] && '"' === x.slice(-1) ||
                // Maybe a numeric array
                '[' === x[0] && ']' === x.slice(-1) ||
                // Maybe an associative array
                '{' === x[0] && '}' === x.slice(-1)
            );
        }

        function toValue(x) {
            if (isString(x)) {
                if (x === 'true') {
                    return true;
                } else if (x === 'false') {
                    return false;
                } else if (x === 'null') {
                    return null;
                } else if (x.slice(0, 1) === "'" && x.slice(-1) === "'") {
                    return x.slice(1, -1);
                } else if (/^-?(\d*\.)?\d+$/.test(x)) {
                    return +x;
                } else if (mayBeJSON(x)) {
                    try {
                        return JSON.parse(x);
                    } catch (e) {}
                }
            }
            return x;
        }

        function query(o, props, value) {
            var path = props.split('['), k;
            for (var i = 0, j = path.length; i < j - 1; ++i) {
                k = path[i].replace(/\]$/, "");
                o = o[k] || (o[k] = {});
            }
            o[path[i].replace(/\]$/, "")] = value;
        }

        var out = {},
            part = x.replace(/^.*?\?/, "");

        if ("" === part) {
            return out;
        }

        part.split(new RegExp('[' + (separator || '&') + ']')).forEach(function(v) {
            var a = v.split('='),
                key = decode(a[0]),
                value = isSet(a[1]) ? decode(a[1]) : true;
            value = !isSet(evaluate) || evaluate ? toValue(value) : value;
            // `a[b]=c`
            if (']' === key.slice(-1)) {
                query(out, key, value);
            // `a=b`
            } else {
                out[key] = value;
            }
        });

        return out;

    }

    win[NS] = doQueryEval;

})(window, 'q2o');
