module.exports = {
	// 2XX
	success: {
		ok: {
			code: 200
		}
	},
	// 3XX
	redirection: {

	},
	// 4XX
	clientError: {
		badRequest: {
			code: 400
		},
		unAuthorized: {
			code: 401
		},
		forbidden: {
			code: 403
		},
		notFound: {
			code: 404
		},
		methodNotAllowed: {
			code: 405
		},
		conflict: {
			code: 409
		}
	},
	serverError: {
		internalServerError: {
			code: 500
		},
		notImplemented: {
			code: 501
		},
		badGateway: {
			code: 502,
			msg: 'Bad Gateway'
		},
		serviceUnavailable: {
			code: 503
		}
	}
};