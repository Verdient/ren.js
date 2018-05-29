'use strict'

class BaseClass {

	className(){
		return this.constructor.name;
	}
}

module.exports = BaseClass;