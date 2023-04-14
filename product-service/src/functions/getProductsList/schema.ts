export default {
  type: 'array',
  items: {
    type: 'string',
    id: 'string',
    count: 'number',
    description: 'string',
    price: 'number',
    title: 'string',
  },
} as const;