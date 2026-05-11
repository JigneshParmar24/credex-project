import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TOOLS, USE_CASES } from '../constants/tools'

const EMPTY_TOOL = { toolId: '', planId: '', seats: 1, monthlySpend: '' }
const STORAGE_KEY = 'credex_audit_form'

export default function Home() {
  const navigate = useNavigate()
  const [tools, setTools] = useState([{ ...EMPTY_TOOL }])
  const [description, setDescription] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.tools) setTools(parsed.tools)
      if (parsed.description) setDescription(parsed.description)
      if (parsed.teamSize) setTeamSize(parsed.teamSize)
    }
  }, [])

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, description, teamSize }))
  }, [tools, description, teamSize])

  function addTool() {
    setTools([...tools, { ...EMPTY_TOOL }])
  }

  function removeTool(index) {
    setTools(tools.filter((_, i) => i !== index))
  }

  function updateTool(index, field, value) {
    const updated = [...tools]
    updated[index] = { ...updated[index], [field]: value }
    // Reset plan when tool changes
    if (field === 'toolId') updated[index].planId = ''
    setTools(updated)
  }

  function getPlans(toolId) {
    return TOOLS.find(t => t.id === toolId)?.plans || []
  }

  async function handleSubmit() {
    setError('')

    // Basic validation
    const validTools = tools.filter(t => t.toolId && t.planId && t.monthlySpend)
    if (validTools.length === 0) {
      setError('Please add at least one tool with all fields filled.')
      return
    }
    if (!description.trim()) {
      setError('Please describe how your team uses these tools.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: validTools.map(t => ({
            toolId: t.toolId,
            planId: t.planId,
            seats: Number(t.seats),
            monthlySpend: Number(t.monthlySpend)
          })),
          description,
          teamSize: Number(teamSize)
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Audit failed')

      // Save results and navigate
      sessionStorage.setItem('audit_result', JSON.stringify(data.data))
      navigate('/results')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">C</div>
          <span className="font-semibold text-white">SpendAudit</span>
          <span className="text-xs text-gray-500 ml-1">by Credex</span>
        </div>
        <a href="https://credex.rocks" target="_blank" rel="noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors">
          Get AI Credits →
        </a>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-block bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-6">
          Free AI Spend Audit
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          You're probably overpaying<br />for AI tools
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          Most startups overspend on AI subscriptions by 30–60%. 
          Find out where your money's going in 60 seconds.
        </p>
        <p className="text-gray-500 text-sm">
          No login required. Free forever.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 pb-20">

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe how your team uses AI tools
            <span className="text-red-400 ml-1">*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. We're a team of 4 engineers. We use Cursor daily for coding, Claude for writing docs and PRs, and ChatGPT occasionally for research..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors resize-none"
          />
        </div>

        {/* Team size */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Total team size
          </label>
          <input
            type="number"
            value={teamSize}
            onChange={e => setTeamSize(e.target.value)}
            placeholder="e.g. 5"
            min="1"
            className="w-40 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Tool rows */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Your AI tools
            <span className="text-red-400 ml-1">*</span>
          </label>

          <div className="space-y-3">
            {tools.map((tool, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {/* Tool selector */}
                  <select
                    value={tool.toolId}
                    onChange={e => updateTool(index, 'toolId', e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select tool</option>
                    {TOOLS.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>

                  {/* Plan selector */}
                  <select
                    value={tool.planId}
                    onChange={e => updateTool(index, 'planId', e.target.value)}
                    disabled={!tool.toolId}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500 disabled:opacity-40"
                  >
                    <option value="">Select plan</option>
                    {getPlans(tool.toolId).map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>

                  {/* Seats */}
                  <input
                    type="number"
                    value={tool.seats}
                    onChange={e => updateTool(index, 'seats', e.target.value)}
                    placeholder="Seats"
                    min="1"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500"
                  />

                  {/* Monthly spend */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={tool.monthlySpend}
                      onChange={e => updateTool(index, 'monthlySpend', e.target.value)}
                      placeholder="$/month"
                      min="0"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500"
                    />
                    {tools.length > 1 && (
                      <button
                        onClick={() => removeTool(index)}
                        className="text-gray-600 hover:text-red-400 transition-colors px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addTool}
            className="mt-3 text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
          >
            + Add another tool
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl transition-colors text-lg"
        >
          {loading ? 'Analyzing your spend...' : 'Get my free audit →'}
        </button>

        <p className="text-center text-gray-600 text-xs mt-3">
          Takes about 10 seconds. No signup required.
        </p>
      </div>
    </div>
  )
}