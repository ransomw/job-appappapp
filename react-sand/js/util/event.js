define([
], function () {

		var _listeners = {};

		return {
				emit: function(ev_name) {
						for(var callback in _listeners[ev_name]) {
								callback();
						}
				},

				register: function(ev_name, callback) {
						if (_listeners.ev_name === undefined) {
								_listeners.ev_name = [];
						}
						_listeners.ev_name.append(callback);
				}
		};

});