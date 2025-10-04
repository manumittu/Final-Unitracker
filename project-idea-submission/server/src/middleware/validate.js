export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const data = source === 'query' ? req.query : req.body
    const parsed = schema.parse(data)
    if (source === 'query') req.query = parsed
    else req.body = parsed
    next()
  } catch (err) {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors })
  }
}
