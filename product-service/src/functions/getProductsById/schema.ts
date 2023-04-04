export default {
	type: 'object',
	properties: {
		pathParameters: {
			productId: {type: 'string'},
			type: 'object'
		}
	},
	required: ['pathParameters']
} as const;
