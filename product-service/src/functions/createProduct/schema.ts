import * as Yup from "yup";

export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'string' },
    count: { type: 'string' },
  },
  required: ['count', 'description', 'price', 'title']
} as const;

export const ProductSchema = Yup.object({
  id: Yup.string(),
  title: Yup.string().required().default(""),
  description: Yup.string().default(""),
  price: Yup.number().positive().required().defined().default(0),
  count: Yup.number().integer().min(0).required().defined().default(0),
});