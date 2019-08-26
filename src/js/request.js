import axios from 'axios';
import app from './zh-app';

var req = {
    ajaxResCheck (obj, settings, callback) {
    	var callback = callback,
            that = this;

    	if (arguments.length == 2) {
    		callback = settings;
    	};

    	var switchObj = {
    		'v': function () {
    			!!callback && callback(obj.tdata, obj);
    		},
    		'pglist': function () {
    			!!callback && callback(obj);
    		},
    		'valerror': function () {
    			if (!IsNullOrEmpty(obj.msg)) {
    				that.ShowMsgBox(obj.msg, "error");
    			};
    		},
    		'login-index': function () {
    			that.ShowMsgBox(obj.msg, 'error', function () {
    				var company = app.getSession('company'),
    					user = app.getSession('user');
    				sessionStorage.clear();
    				if (!company) {
    					if (user.userid == '1') {
    						window.top.location.href = (htmlUrl + "/platlogin.html");
    						return;
    					}
    					window.top.location.href = (htmlUrl + "/login.html");
    				} else {
    					window.top.location.href = ('/' + company + "/login");
    				}
    			});
    		},
    		'jump-url': function () {
    			that.ShowMsgBox(obj.msg, 'info', function () {
    				window.top.location.href = (htmlUrl + obj.url);
    			});
    		}
    	}

    	return !!switchObj[obj.code] ? switchObj[obj.code]() : (/^(throw-)/.test(obj.code) ? (function(){
    		obj.code = obj.code.split('throw-')[1];
    		callback && callback(obj);
    	}()) : that.ShowMsgBox(obj.msg, 'error', function () {
    		throw new Error(JSON.stringify(settings));
    	}));

    },

    $get (a, b, c, d) {
        var url, data, callback, fztype;

        url = a;
        data = '';
        callback = callback || function () {};
        fztype = false;

        if (arguments.length == 2 && typeof (b) == 'function') {
            callback = b;
        } else if (arguments.length == 2 && typeof (b) != 'function') {
            data = b;
        } else if (arguments.length == 3) {
            if (typeof (arguments[arguments.length - 1]) == 'boolean') {
                data = b;
                fztype = c;
            } else {
                data = b;
                callback = c;
            }
        } else if (arguments.length == 4) {
            data = b;
            callback = c;
            fztype = d;
        };

        axios.get(url, {
            params: data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                pageuser: app.getSession('user') ? app.getSession('user').userid : ''
            },
        }).then(response => {
            req.ajaxResCheck.call(this, response, {
                url: url,
                data: data,
                type: 'get',
                callback: function (data, res) {
                    callback.call(this, data, res)
                }.bind(this),
                fztype: fztype
            }, callback);
        });
    },

    $post (a, b, c, d) {
        var url, data, callback, fztype;

        url = a;
        data = '';
        callback = callback || function () {};
        fztype = false;

        if (arguments.length == 2 && typeof (b) == 'function') {
            callback = b;
        } else if (arguments.length == 2 && typeof (b) != 'function') {
            data = b;
        } else if (arguments.length == 3) {
            if (typeof (arguments[arguments.length - 1]) == 'boolean') {
                data = b;
                fztype = c;
            } else {
                data = b;
                callback = c;
            }
        } else if (arguments.length == 4) {
            data = b;
            callback = c;
            fztype = d;
        };

        axios.post(url, data, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-type': !!fztype ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded;charset=UTF-8',
                pageuser: app.getSession('user') ? app.getSession('user').userid : ''
            },
        }).then(response => {
            req.ajaxResCheck.call(this, response, {
                url: url,
                data: data,
                type: 'get',
                callback: function (data, res) {
                    callback.call(this, data, res)
                }.bind(this),
                fztype: fztype
            }, callback);
        });
    }
}

export default req;
