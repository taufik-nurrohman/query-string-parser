/*! <https://github.com/taufik-nurrohman/query-string-parser> */
(function(win, NS) {

    function doSerializeObject(x, separator, deep, includeFalseAndNullValue) {

        function encode(x) {
            return encodeURIComponent(x);
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

        function toString(x) {
            if (true === x) return 'true';
            if (false === x) return 'false';
            if (null === x) return 'null';
            if (isObject(x)) return JSON.stringify(x);
            return x + "";
        }

        function q(arr, key, depth, deep) {
            depth = depth || 0;
            var out = [],
                s = key ? '%5D' : "", i, k, v;
            for (i in arr) {
                k = encode(i);
                v = arr[i];
                if (isObject(v) && depth < deep) {
                    out = Object.assign(out, q(v, key + k + s + '%5B', depth + 1, deep));
                } else {
                    out[key + k + s] = v;
                }
            }
            return out;
        }

        deep = deep || 1;

        var out = [],
            arr = q(x, "", 0, deep),
            k, v;

        for (k in arr) {
            v = arr[k];
            if ((
                false === v ||
                null === v
            ) && !includeFalseAndNullValue) {
                continue; // `{"a":"false","b":false,"c":"null","d":null}` → `a=false&c=null`
            }
            v = true !== v ? '=' + encode(toString(v)) : ""; // `{"a":"true","b":true}` → `a=true&b`
            out.push(k + v);
        }

        return out.length ? '?' + out.join(separator || '&') : "";

    }

    win[NS] = doSerializeObject;

})(window, 'o2q');
