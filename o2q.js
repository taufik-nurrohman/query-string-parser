/*! <https://github.com/tovic/query-string-parser> */
(function(win, NS) {

    function object_serialize(x, separator, deep, include_false) {

        function encode(x) {
            return encodeURIComponent(x);
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

        function str(x) {
            if (x === true) return 'true';
            if (x === false) return 'false';
            if (x === null) return 'null';
            if (is_object(x)) return JSON.stringify(x);
            return x + "";
        }

        function extend(a, b) {
            b = b || {};
            for (var i in a) {
                if (!is_set(b[i])) {
                    b[i] = a[i];
                } else if (is_object(a[i]) && is_object(b[i])) {
                    b[i] = extend(a[i], b[i]);
                }
            }
            return b;
        }

        function q(arr, key, depth, deep) {
            depth = depth || 0;
            var out = [],
                s = key ? '%5D' : "", i, k, v;
            for (i in arr) {
                k = encode(i);
                v = arr[i];
                if (is_object(v) && depth < deep) {
                    out = extend(out, q(v, key + k + s + '%5B', depth + 1, deep));
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
            if (v === false && !include_false) continue; // `{"a":"false","b":false}` → `a=false`
            v = v !== true ? '=' + encode(str(v)) : ""; // `{"a":"true","b":true}` → `a=true&b`
            out.push(k + v); // `{"a":"null","b":null}` → `a=null&b=null`
        }

        return out.length ? '?' + out.join(separator || '&') : "";

    }

    win[NS] = object_serialize;

})(window, 'o2q');