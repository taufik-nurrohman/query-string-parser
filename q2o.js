/*! <https://github.com/tovic/query-string-parser> */
(function(win, NS) {

    function query_eval(x, eval) {

        function decode(x) {
            return decodeURIComponent(x);
        }

        function is_set(x) {
            return typeof x !== "undefined";
        }

        function is_string(x) {
            return typeof x === "string";
        }

        function is_object(x) {
            return x !== null && typeof x === "object";
        }

        function maybe_json(x) {
            if (!is_string(x) || x.trim() === "") {
                return false;
            }
            return (
                // Maybe an empty string, array or object
                x === '""' ||
                x === '[]' ||
                x === '{}' ||
                // Maybe an encoded JSON string
                x[0] === '"' && x.slice(-1) === '"' ||
                // Maybe a numeric array
                x[0] === '[' && x.slice(-1) === ']' ||
                // Maybe an associative array
                x[0] === '{' && x.slice(-1) === '}'
            );
        }

        function str_eval(x) {
            if (is_string(x)) {
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
                } else if (maybe_json(x)) {
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

        if (part === "") {
            return out;
        }

        part.split(/&(?:amp;)?/).forEach(function(v) {
            var a = v.split('='),
                key = decode(a[0]),
                value = is_set(a[1]) ? decode(a[1]) : true;
            value = !is_set(eval) || eval ? str_eval(value) : value;
            // `a[b]=c`
            if (key.slice(-1) === ']') {
                query(out, key, value);
            // `a=b`
            } else {
                out[key] = value;
            }
        });

        return out;

    }

    win[NS] = query_eval;

})(window, 'q2o');