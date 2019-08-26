import vueSupply from './vue-supply';
import request from './request';

function getLocation (type, key) {
    try {
        var path = window.location[type].slice(1);
    } catch (e) {
        return false
    };
    if(!path) {
        path = [];
    } else {
        path = path.split("&");
    };

    var pathObj = {};
    path.forEach(function (item) {
        var value = item.split("=")[1];
            value = /%u/.test(value) ? unescape(value) : /%E/.test(value) ? decodeURI(value) : value;
        var key = item.split("=")[0];
        if(/\[\]/.test(key)) {
            var arrName = key.replace('[]', '');
            pathObj[arrName] = pathObj[arrName] ? pathObj[arrName] : [];
            pathObj[arrName].push(value);
        } else {
            pathObj[item.split("=")[0]] = value;
        }
    });

    if (!!key)
        return pathObj[key];
    else
        return pathObj;
};

/**
 * 设置storage基方法
 * @param  {string} type sessionStorage或localStorage
 * @param  {string} key  要取的key
 * @return {string|Object}      对应存储的数据
 */
function getStorage(type, key) {
    var res = !!key ?
        window[type][key] ?
        ((/{|}|%7B|%7D|\[|\]|%5B|%5D/.test(window[type][key]) ?
            JSON.parse(unescape(window[type][key])) :
            unescape(window[type][key]))) : undefined :
        window[type];
    return res || false;
}
/**
 * 获取storage基方法
 * @param {string} type  sessionStorage或localStorage
 * @param {string|object} key   要设置的key或整个对象
 * @param {Object} value 已设置的结果
 */
function setStorage(type, key, value) {
    if (typeof key === 'string') {
        window[type][key] = (typeof value === 'object') ? escape(JSON.stringify(value)) : escape(value);
    } else if (typeof key === 'object') {
        Object.keys(key).forEach(function (item) {
            window[type][item] = (typeof value === 'object') ? escape(JSON.stringify(key[item])) : escape(key[item]);
        });
    };
    return window[type];
}

var app = {
    /********
	接收地址栏参数
	key:参数名称
	**********/
	getSearch (key) {
		return getLocation('search', key);
	},

	/**
	 * 将对象转化成search字符串
	 * @param  {Object} obj  对象或数组
	 * @param  {boolean} flag 是否携带'?'
	 * @return {string}      返回的格式化后字符串
	 */
	toSearch (obj, flag) {
		var res = '?'
		if (typeof obj == 'object' && Array.isArray(obj)) {
			obj.forEach(function (item, index) {
				res += ('[' + index + ']=' + toSearch(item, true) + '&');
			});
		} else if (typeof obj == 'object') {
			Object.keys(obj).forEach(function (key) {
				if (typeof obj[key] == 'object' && Array.isArray(obj[key])) {
					obj[key].forEach(function (item, index) {
						res += (key + '[]=' + toSearch(item, true) + '&')
					});
				} else if (typeof obj[key] == 'object' && obj[key] != null) {
					res += (toSearch(obj[key], true) + '&');
				} else {
					var item = /[\u3220-\uFA29]/.test(obj[key]) ? escape(obj[key]) : obj[key];
					res += (key + '=' + (item || '') + '&');
				}

			});
		} else {
			return obj;
		}
		return !!flag ? res.slice(1, -1) : res.slice(0, -1);
	},

	/**
	 * 生成hash值并放置如window.location.href
	 * @param  {string}   key      键
	 * @param  {string}   value    值
	 * @param  {Function} callback 回调函数
	 * @return {null}            返回值
	 */
	setHash (key, value, callback) {

		var hashObj = getHash();

		if (typeof key === 'string') {
			callback = callback || function () {};

			hashObj[key] = value;

		} else if (typeof key === 'object') {
			callback = value || function () {};
			Object.keys(key).forEach(function (item) {
				hashObj[item] = key[item]
			})
		}

		var hashStr = '#';
		for (tkey in hashObj) {
			hashStr += (tkey + '=' + hashObj[tkey] + '&');
		};
		if (!!window.location.hash) {
			window.location.replace(window.location.href.replace(window.location.hash, hashStr.slice(0, -1)));
		} else {
			window.location.replace(window.location.href + hashStr.slice(0, -1))
		}

		callback();
	},

	/**
	 * 获取window.location.hash中特定值
	 * @param  {string} key 待获取的key
	 * @return {string}     获取到的值
	 */
	getHash (key) {
		return getLocation('hash', key);
	},

    /**
     * 获取localStorage里的数据
     * @param  {string} key 待获取的key
     * @return {string|Object} 取回的值
     */
    getLocal (key) {
    	return getStorage('localStorage', key);
    },

    /**
     * 将值存入localStorage
     * @param  {string|Object} key   待存值的key或json对象
     * @param  {string|object} value 待存值的value
     * @return {object}       存入后localStorage对象
     */
    setLocal (key, value) {
    	return setStorage('localStorage', key, value);
    },

    /**
     * 获取sessionStorage里的数据
     * @param  {string} key 待获取的key
     * @return {string|Object} 取回的值
     */
    getSession (key) {
    	return getStorage('sessionStorage', key);
    },

    /**
     * 将值存入sessionStorage
     * @param  {string|Object} key   待存值的key或json对象
     * @param  {string|object} value 待存值的value
     * @return {object}       存入后sessionStorage对象
     */
    setSession (key, value) {
    	return setStorage('sessionStorage', key, value);
    },

    /**
     * 遍历型对象混入，将obj混入target
     * @param  {Object} obj    待混入的对象
     * @param  {Object} target 混入目标对象
     * @param  {Boolean} state  是否覆盖混入
     * @return {object}        混入后的对象
     */
    mixin (obj, target, state) {
    	Object.keys(obj).forEach(function (key) {
    		if (state) {
    			target[key] = obj[key];
    		} else {
    			if (!target[key])
    				target[key] = obj[key];
    		}
    	});
    	return target;
    }
}

app.mixin(vueSupply, app);
app.mixin(request, app);

export default app;
