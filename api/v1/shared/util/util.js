let MSG = require('../messages/messages');

exports.validateRequestBody = (res, target, rules) => {
	// TODO send response message with error of rule validation fails and return false;
	let errorObject = {};
	Object.keys(rules).forEach(field => {
		if (rules[field]) {
			Object.keys(rules[field]).forEach(validation => {

				switch(validation) {
					case 'required':
						if (rules[field][validation]) {
							validateRequired(field);
						}
						break;
					case 'minLength':
						validateMinLength(field, rules[field][validation]);
						break;
					case 'maxLength':
						validateMaxLength(field, rules[field][validation]);
						break;
					case 'pattern':
						validatePattern(field, rules[field][validation]);
						break;
					case 'date':
						if (rules[field][validation]) {
							validateDate(field);
						}
						break;
					case 'number':
						if (rules[field][validation]) {
							validateNumber(field);
						}
						break;
				}
			})
		}

	});

	function validateRequired(field) {
		if (!target[field]) {
			if (!errorObject[field]) {
				errorObject[field] = {};
			}

			errorObject[field]['required'] = `${field} is required.`;
		}
	}

	function validateMinLength(field, value) {
		if (!field || !value) {
			return;
		}

		if (target[field]) {
			if (target[field].length < value) {
				if (!errorObject[field]) {
					errorObject[field] = {};
				}

				errorObject[field]['minLength'] = `Min Length of ${field} must be ${value}.`;
			}
		}
	}

	function validateMaxLength(field, value) {
		if (!field || !value) {
			return;
		}

		if (target[field]) {
			if (target[field].length > value) {
				if (!errorObject[field]) {
					errorObject[field] = {};
				}

				errorObject[field]['maxLength'] = `Max Length of ${field} must be ${value}.`;
			}
		}
	}

	function validatePattern(field, value) {
		if (!target[field]) {
			return;
		}
		let regExp = new RegExp(value);
		if (!regExp.test(target[field])) {
			if (!errorObject[field]) {
				errorObject[field] = {};
			}

			errorObject[field]['pattern'] = `${field} must match to Pattern: \'${value}\'.`;
		}
	}

	function validateDate(field) {
		if (!field) {
			return;
		}

		if (target[field]) {
			let datePattern = '^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\\.([0-9]{3})Z$'
			let regExp = new RegExp(datePattern);
			if (!regExp.test(target[field])) {
					if (!errorObject[field]) {
						errorObject[field] = {};
					}

					errorObject[field]['date'] = `${field} must be in Date format.`;
			}
		}
	}

	function validateNumber(field) {
		if (!field) {
			return;
		}

		if (target[field]) {
			if ( isNaN( Number(target[field]) ) ) {
				if (!errorObject[field]) {
					errorObject[field] = {};
				}

				errorObject[field]['number'] = `${field} must be in Number.`;
			}
		}
	}

	if (Object.keys(errorObject).length > 0) {
		this.sendHttpResponseMessage(res, MSG.clientError.badRequest, {validation: errorObject}, 'Validation Error');
		return false;
	}

	// Return true if everything is ok
	return true;
};

exports.sendHttpResponseMessage = (res, message, error, msg) => {
	const msgToSend = Object.assign({}, message);
	if (error) {
		msgToSend.error = error;
	}
	if (msg) {
		msgToSend.msg = msg;
	}

	return res.status(msgToSend.code).json(msgToSend);
};



