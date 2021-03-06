'use strict'

const Validator = require('../base/Validator');

/**
 * ExistValidator
 * 存在校验器
 * --------------
 * @author Verdient。
 */
class ExistValidator extends Validator
{
	/**
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.targetModel = null;
		this.targetAttribute = null;
		this.filter = false;
		this.operator = '=';
		this.skipOnError = true;
		this.message = '{attribute} Mismatch';
		return this;
	}

	async validateValue(value){
		let query = this.targetModel.find();
		let where = {};
		where[this.targetAttribute] = [this.operator, value];
		query.where(where);
		query.filterWhere(this.filter);
		let result = await query.one();
		if(result){
			if(this.export){
				this.exports = result;
			}
		}else{
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = ExistValidator;