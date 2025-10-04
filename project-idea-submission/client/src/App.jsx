import { useEffect, useState } from 'react'
import ProjectIdeaForm from './components/ProjectIdeaForm.jsx'
import IdeasTable from './components/IdeasTable.jsx'
import Dashboard from './components/Dashboard.jsx'
import { getIdeas } from './services/ideaService.js'
import "./App.css";

export default function App() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState({ page: 1, limit: 10, search: '', status: '' })
  const [total, setTotal] = useState(0)

  const fetchIdeas = async () => {
    const res = await getIdeas(query)
    setItems(res.items)
    setTotal(res.total)
  }

  useEffect(() => { fetchIdeas() }, [query])

  return (
    <div className="container space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Idea Submission</h1>
        <div className="flex gap-2">
          <input className="input" placeholder="Search title/tags/domain" value={query.search} onChange={e=>setQuery(q=>({...q, search:e.target.value, page:1}))} />
          <select className="input" value={query.status} onChange={e=>setQuery(q=>({...q, status:e.target.value, page:1}))}>
            <option value="">All Statuses</option>
            <option>Draft</option>
            <option>Submitted</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">New / Edit Idea</h2>
          <ProjectIdeaForm onSaved={() => setQuery(q=>({...q}))} />
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
          <Dashboard />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Submissions</h2>
        <IdeasTable items={items} total={total} query={query} setQuery={setQuery} onChanged={() => setQuery(q=>({...q}))} />
      </div>
    </div>
  )
}
