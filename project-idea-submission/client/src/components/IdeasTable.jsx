import { deleteIdea } from '../services/ideaService'

export default function IdeasTable({ items, total, query, setQuery, onChanged }) {
  const pages = Math.max(1, Math.ceil(total / (query.limit || 10)))

  const remove = async (id) => {
    if (!confirm('Delete this idea?')) return
    await deleteIdea(id)
    onChanged?.()
  }

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Domain</th>
            <th>Status</th>
            <th>Supervisor</th>
            <th>Team</th>
            <th>Tags</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it._id}>
              <td className="font-medium">{it.title}</td>
              <td><span className="badge">{it.domain}</span></td>
              <td><span className="badge">{it.status}</span></td>
              <td>{it.supervisor}</td>
              <td>{it.teamMembers?.join(', ')}</td>
              <td>{it.tags?.join(', ')}</td>
              <td>{new Date(it.createdAt).toLocaleDateString()}</td>
              <td className="text-right">
                <button className="btn btn-outline" onClick={() => remove(it._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">Total: {total}</div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => setQuery(q=>({...q, page: Math.max(1, q.page-1)}))} disabled={query.page <= 1}>Prev</button>
          <span className="text-sm self-center">Page {query.page} / {pages}</span>
          <button className="btn btn-outline" onClick={() => setQuery(q=>({...q, page: Math.min(pages, q.page+1)}))} disabled={query.page >= pages}>Next</button>
        </div>
      </div>
    </div>
  )
}
