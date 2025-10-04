import Idea from '../models/Idea.js'

export const createIdea = async (req, res) => {
  const body = req.body
  if (req.file) body.attachmentPath = `/uploads/${req.file.filename}`
  const doc = await Idea.create(body)
  res.status(201).json(doc)
}

export const listIdeas = async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '' } = req.query
  const filter = {}
  if (status) filter.status = status
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [ new RegExp(search, 'i') ] } },
      { domain: { $regex: search, $options: 'i' } }
    ]
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Idea.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Idea.countDocuments(filter)
  ])
  res.json({ items, total })
}

export const updateIdea = async (req, res) => {
  const { id } = req.params
  const updated = await Idea.findByIdAndUpdate(id, req.body, { new: true })
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
}

export const deleteIdea = async (req, res) => {
  const { id } = req.params
  const out = await Idea.findByIdAndDelete(id)
  if (!out) return res.status(404).json({ message: 'Not found' })
  res.json({ message: 'Deleted' })
}

export const stats = async (req, res) => {
  const byStatus = await Idea.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
    { $sort: { status: 1 } }
  ])
  const byDomain = await Idea.aggregate([
    { $group: { _id: '$domain', count: { $sum: 1 } } },
    { $project: { _id: 0, domain: '$_id', count: 1 } },
    { $sort: { count: -1 } }
  ])
  res.json({ byStatus, byDomain })
}
