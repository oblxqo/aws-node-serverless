export default {
	type: 'object',
	properties: {
		queryStringParameters: {
			name: { type: 'string' },
			type: 'object'
		}
	},
	required: ['queryStringParameters']
} as const;
