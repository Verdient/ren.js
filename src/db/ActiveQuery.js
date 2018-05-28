'use strict'

const mysql = require('mysql2');
const BaseClass = require('../base/BaseClass');
const objectHelper = require('../helpers/object');

class ActiveQuery extends BaseClass {

	constructor(options){
		super();
		this._model = options.model;
		this._tableName = options.tableName;
		this._attributes = ['*'];
		this._where = {};
		this._limit = false;
		this._offset = false;
		this._groupBy = false;
		this._orderBy = false;
	}

	get db(){
		return this._model.db;
	}

	get rawSql(){
		return this.buildSql();
	}

	async one(){
		let db = this.db;
		let sql = this.rawSql;
		this.limit(1);
		if(!db){
			throw new Error('model db must be set');
		}
		return new Promise((resolve, revoke) => {
			db.query(sql, (error, result) => {
				if(error){
					return revoke(error);
				}
				resolve(result[0] || null);
			});
		});
	}

	select(attributes){
		if(Array.isArray(attributes)){
			attributes.forEach(attribute => {
				if(attribute == '*'){
					return this._attributes = ['*'];
				}
			});
		}
		this._attributes = attributes;
	}

	where(condition){
		if(typeof this._where['AND'] == 'undefined'){
			this._where['AND'] = {};
		}
		for(let attribute in condition){
			this._where['AND'][attribute] = condition[attribute];
		}
	}

	orderBy(orderBy){
		this._orderBy = orderBy;
	}

	groupBy(groupBy){
		this._groupBy = groupBy;
	}

	limit(limit){
		this._limit = limit;
	}

	offset(offset){
		this._offset = offset;
	}

	filterWhere(condition){
		if(typeof this._where['AND'] == 'undefined'){
			this._where['AND'] = {};
		}
		for(let attribute in condition){
			if(typeof condition[attribute] != 'undefined' && condition[attribute] !== null){
				this._where['AND'][attribute] = condition[attribute];
			}
		}
	}

	buildSql(){
		let where = this.buildWhere(this._where);
		if(where.length > 0){
			where = ' WHERE ' + where;
		}
		return this.buildSelect() + ' FROM `' + this._tableName + '`' + where + this.buildGroupBy() + this.buildOrderBy() + this.buildLimit() + this.buildOffset() + ';';
	}

	buildSelect(){
		let attributes = this._attributes;
		attributes.forEach((attribute, index) => {
			if(attribute.indexOf('`') == -1){
				attributes[index] = '`' + attribute + '`';
			}
		});
		return 'SELECT ' + attributes.join(', ');
	}

	buildWhere(where, relation){
		relation = relation || '';
		let result = '';
		let params = [];
		let n = 0;
		let i;
		for(i in where){
			let type = objectHelper.type(where[i]);
			if(type == 'object'){
				let num = Object.keys(where[i]).length;
				result += (relation ? ' ' + relation + ' ' : '') + (num > 1 ? '(' : '') + this.buildWhere(where[i], i) + (num > 1 ? ')' : '');
			}else{
				let attribute = i;
				let operator = '=';
				let value = where[i];
				if(type == 'array'){
					operator = value[0];

					if(objectHelper.inArray(operator, ['=', '>', '<', '>=', '<='])){
						value = value[1];
					}
				}
				if(attribute.indexOf('`') == -1){
					attribute = '`' + attribute + '`';
				}
				result += (n > 0 ? ' ' + relation + ' ' : '') + attribute + operator + '?';
				params.push(value);
			}
			n++;
		}
		return mysql.format(result, params);
	}

	buildGroupBy(){
		let groupBy = this._groupBy;
		if(groupBy){
			return mysql.format(' GROUP BY ?', groupBy);
		}
		return '';
	}

	buildOrderBy(){
		let orderBy = this._orderBy;
		let result = '';
		let temp = [];
		if(orderBy && Array.isArray(orderBy) && orderBy.length > 0){
			result = ' ORDER BY ';
			orderBy.forEach(value => {
				if(Array.isArray(value)){
					if(value[0].indexOf('`') == -1){
						value[0] = '`' + value[0] + '`';
					}
					if(value[1]){
						value[1] = value[1].toUpperCase();
					}
				}else if(typeof value == 'string'){
					if(value.indexOf('`') == -1){
						value = '`' + value + '`';
					}
				}
				temp.push(Array.isArray(value) ? value.join(' ') : value);
			});
			result += temp.join(', ');
		}
		return result;
	}

	buildLimit(){
		let limit = this._limit;
		if(limit){
			return mysql.format(' LIMIT ?', limit);
		}
		return '';
	}

	buildOffset(){
		let limit = this._limit;
		let offset = this._offset;
		if(limit && offset){
			return mysql.format(' OFFSET ?', offset);
		}
		return '';
	}
}

module.exports = ActiveQuery;