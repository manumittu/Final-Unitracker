import mongoose from 'mongoose'

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  domain: { type: String, enum: ['Web','Mobile','AI/ML','IoT','Security','Cloud'], required: true },
  problemStatement: { type: String, required: true },
  objectives: { type: String, required: true },
  teamMembers: { type: [String], default: [] },
  supervisor: { type: String, required: true },
  status: { type: String, enum: ['Draft','Submitted','Approved','Rejected'], default: 'Draft' },
  tags: { type: [String], default: [] },
  submissionDate: { type: Date },
  attachmentPath: { type: String },
}, { timestamps: true })

IdeaSchema.index({ title: 'text', tags: 'text', domain: 'text' })

export default mongoose.model('Idea', IdeaSchema)
