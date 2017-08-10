/**
 * @EventMemory 自定义事件监听、事件派发。
 * 允许使用者指定特定对象监听自定义事件并指定处理函数, 也可以解绑监听
 * 基于ReqireJS。
 * 
 * @author Zero 
 * @version 0.1
 */
define(function(){
 	var __EventMemoryData__ = {};

	/**
	 * 对目标对象监听给定类型的事件，并且绑定处理函数
	 * @name _on
	 * @function
	 * @grammar EventMemory.on(target, eventType, handler)
	 * @param {Object} target 监听目标对象
	 * @param {String} eventType 事件类型名
	 * @param {Object Function} handler 处理函数
	 * @return {Object | Boolean} 记录绑定信息的对象(成功的情况) | 布尔值flase, 标志失败(失败的情况)
	 */
	var _on = function(target, eventType, handler) {
		if (!(Object.prototype.toString.call(handler) === "[object Function]")) {
			// console.log("Your binding eventhandler is a shit, you mother fucking asshole!");
			return false;
		}
		eventType = String(eventType);
		if (!__EventMemoryData__.hasOwnProperty(eventType)) {
			__EventMemoryData__[eventType] = [];
		}
		var _eventMemoryObj = {
			target: target,
			handler: handler,
			eventType: eventType,
			dispose: __dispose
		};
		__EventMemoryData__[eventType].push(_eventMemoryObj);
		return _eventMemoryObj;
	};

	/**
	 * 派发给定类型的事件, 会触发到此操作执行时所绑定的该类型事件的所有处理函数, 
	 * 并且提供一个可选参数作为附加数据, 可以传递至处理函数的回调参数event.data中(什么? 一个附加参数嫌少? MDZZ还有一个参数解决不来的东西么?)
	 * @name _emit
	 * @function
	 * @grammar EventMemory.emit(eventType[, additionalData])
	 * @param {String} eventType 事件类型名
	 * @param {Object} additionalData 可选参数 附加的数据对象
	 */
	var _emit = function(eventType, additionalData) {
		if (__EventMemoryData__.hasOwnProperty(eventType)) {
			additionalData = additionalData ? additionalData : {};
			var _event = {
				type: eventType,
				data: additionalData
			};
			for (var i in __EventMemoryData__[eventType]) {
				// call改变函数运行时的上下文
				__EventMemoryData__[eventType][i].handler.call(__EventMemoryData__[eventType][i].target, _event);
			}
		}
	};

	/**
	 * 绑定监听的数据对象私有方法, 可以注销该数据对应的监听操作(对应那一个对象, 对应的那一个事件, 对应的那一个处理函数)
	 * @name __dispose
	 * @function
	 * @grammar {eventMemoryObj}.dispose()
	 */
	var __dispose = function() {
		var eventMemoryObj = this;
		var _index = __EventMemoryData__[eventMemoryObj.eventType].indexOf(eventMemoryObj);
		if (_index != -1) {
			__EventMemoryData__[eventMemoryObj.eventType].splice(_index, 1);
		}
	};

	return {
		on: _on,
		emit: _emit
	};
});