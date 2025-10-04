import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createIdea, updateIdea } from '../services/ideaService'
import { IDEA_STATUSES, DOMAINS } from '../utils/constants'
import { useState } from 'react'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  domain: z.enum(DOMAINS),
  problemStatement: z.string().min(20, 'Describe at least 20 characters'),
  objectives: z.string().min(10),
  teamMembers: z.string().min(3, 'Provide comma-separated member names'),
  supervisor: z.string().min(3),
  status: z.enum(IDEA_STATUSES),
  tags: z.string().optional(),
  submissionDate: z.string().optional(),
})

export default function ProjectIdeaForm({ current, onSaved }) {
  const [editingId, setEditingId] = useState(current?.id || null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      domain: 'Web',
      problemStatement: '',
      objectives: '',
      teamMembers: '',
      supervisor: '',
      status: 'Draft',
      tags: '',
      submissionDate: new Date().toISOString().slice(0,10)
    }
  })

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(s=>s.trim()).filter(Boolean) : [],
      teamMembers: values.teamMembers.split(',').map(s=>s.trim()).filter(Boolean)
    }

    if (editingId) {
      await updateIdea(editingId, payload)
    } else {
      await createIdea(payload)
    }

    reset()
    setEditingId(null)
    onSaved?.()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="label">Title</label>
        <input className="input" {...register('title')} />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Domain</label>
          <select className="input" {...register('domain')}>
            {DOMAINS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" {...register('status')}>
            {IDEA_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Problem Statement</label>
        <textarea className="input" rows={3} {...register('problemStatement')} />
        {errors.problemStatement && <p className="text-red-600 text-sm">{errors.problemStatement.message}</p>}
      </div>

      <div>
        <label className="label">Objectives</label>
        <textarea className="input" rows={3} placeholder="1) ... 2) ..." {...register('objectives')} />
      </div>

      <div>
        <label className="label">Team Members (comma separated)</label>
        <input className="input" placeholder="Alice, Bob" {...register('teamMembers')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Supervisor</label>
          <input className="input" {...register('supervisor')} />
        </div>
        <div>
          <label className="label">Submission Date</label>
          <input type="date" className="input" {...register('submissionDate')} />
        </div>
      </div>

      <div>
        <label className="label">Tags (comma separated)</label>
        <input className="input" placeholder="react, mongodb, dashboard" {...register('tags')} />
      </div>

      <div className="flex items-center gap-2">
        <button className="btn" type="submit">{editingId ? 'Update' : 'Submit'}</button>
        <button className="btn btn-outline" type="button" onClick={() => { reset(); setEditingId(null) }}>Reset</button>
      </div>
    </form>
  )
}
