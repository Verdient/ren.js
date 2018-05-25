const AuthenticationError = require('../error/AuthenticationError');
const Signature = require('components/signature');
const objectHelper = require('helpers/object');
const Filter = require('../Filter');

class SignatureFilter extends Filter {
	constructor(options){
		super(options.routers, options.message, options.code);
		this.headerName = options.headerName || 'Signature',
		this.key = options.key || '';
		this.message = options.message || 'Your request was made with invalid credentials.';
	}

	filter(ctx, callback){
		let request = ctx.request;
		let signature = new Signature({key: this.key});
		let requestSignature = request.getHeader(this.headerName);
		if(!requestSignature){
			return callback(new AuthenticationError(this.message, this.code));
		}
		var signatureString = signature.signature(request.body, request.getHeader('Signature-Method'));
		if(signatureString != requestSignature){
			return callback(new AuthenticationError(this.message, this.code));
		}
		callback();
	}
}

module.exports = SignatureFilter