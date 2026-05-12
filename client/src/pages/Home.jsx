import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TOOLS } from '../constants/tools'

const EMPTY_TOOL = {
  toolId: '',
  planId: '',
  seats: 1,
  monthlySpend: ''
}

const STORAGE_KEY = 'burnrate_audit_form'

export default function Home() {
  const navigate = useNavigate()

  const [tools, setTools] = useState([{ ...EMPTY_TOOL }])
  const [description, setDescription] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed = JSON.parse(saved)

      if (parsed.tools) setTools(parsed.tools)
      if (parsed.description) setDescription(parsed.description)
      if (parsed.teamSize) setTeamSize(parsed.teamSize)
    }
  }, [])

  // Persist state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tools,
        description,
        teamSize
      })
    )
  }, [tools, description, teamSize])

  function addTool() {
    setTools([...tools, { ...EMPTY_TOOL }])
  }

  function removeTool(index) {
    setTools(tools.filter((_, i) => i !== index))
  }

  function updateTool(index, field, value) {
    const updated = [...tools]

    updated[index] = {
      ...updated[index],
      [field]: value
    }

    // Reset plan if tool changes
    if (field === 'toolId') {
      updated[index].planId = ''
    }

    setTools(updated)
  }

  function getPlans(toolId) {
    return TOOLS.find(t => t.id === toolId)?.plans || []
  }

  async function handleSubmit() {
    setError('')

    const validTools = tools.filter(
      t => t.toolId && t.planId && t.monthlySpend
    )

    if (validTools.length === 0) {
      setError('Please add at least one tool with all fields completed.')
      return
    }

    if (!description.trim()) {
      setError('Please describe how your team uses AI tools.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://credex-project-nq0n.onrender.com/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

      if (!data.success) {
        throw new Error(data.error || 'Audit failed')
      }

      sessionStorage.setItem(
        'audit_result',
        JSON.stringify(data.data)
      )

      navigate('/results')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <nav className="border-b border-[#1f1f1f] px-6 py-5 flex items-center justify-between">

        <div>

          <p className="text-xl font-semibold tracking-tight text-white">
            BurnRate
          </p>

          <p className="text-sm text-neutral-500 mt-1">
            AI spend intelligence
          </p>

        </div>

        <a
          href="https://credex.rocks"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-neutral-500 hover:text-white transition-colors"
        >
          Credex
        </a>

      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">

        <div className="inline-flex items-center gap-2 border border-[#232323] bg-[#111111] text-neutral-400 text-xs px-3 py-1 rounded-full mb-6">
          Free AI Spend Audit
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05] mb-6">
          Find wasted AI spend
        </h1>

        <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Analyze your AI subscriptions, API usage, and team plans
          to uncover unnecessary spend and cheaper alternatives.
        </p>

      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 pb-24">

        {/* Description */}
        <div className="mb-8">

          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Describe how your team uses AI tools
            <span className="text-red-400 ml-1">*</span>
          </label>

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. We're a 6-person engineering team using Cursor daily for coding, Claude for docs and reviews, and ChatGPT for research..."
            className="w-full bg-[#111111] border border-[#232323] rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
          />

        </div>

        {/* Team Size */}
        <div className="mb-8">

          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Total team size
          </label>

          <input
            type="number"
            value={teamSize}
            onChange={e => setTeamSize(e.target.value)}
            placeholder="e.g. 8"
            min="1"
            className="w-40 bg-[#111111] border border-[#232323] rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
          />

        </div>

        {/* Tool Rows */}
        <div className="mb-5">

          <label className="block text-sm font-medium text-neutral-300 mb-4">
            Your AI tools
            <span className="text-red-400 ml-1">*</span>
          </label>

          <div className="space-y-4">

            {tools.map((tool, index) => (

              <div
                key={index}
                className="bg-[#111111] border border-[#232323] rounded-xl p-4"
              >

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {/* Tool */}
                  <select
                    value={tool.toolId}
                    onChange={e =>
                      updateTool(index, 'toolId', e.target.value)
                    }
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500"
                  >
                    <option value="">Select tool</option>

                    {TOOLS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  {/* Plan */}
                  <select
                    value={tool.planId}
                    onChange={e =>
                      updateTool(index, 'planId', e.target.value)
                    }
                    disabled={!tool.toolId}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 disabled:opacity-40"
                  >
                    <option value="">Select plan</option>

                    {getPlans(tool.toolId).map(plan => (
                      <option key={plan} value={plan}>
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* Seats */}
                  <input
                    type="number"
                    value={tool.seats}
                    onChange={e =>
                      updateTool(index, 'seats', e.target.value)
                    }
                    min="1"
                    placeholder="Seats"
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                  />

                  {/* Spend */}
                  <div className="flex gap-2">

                    <input
                      type="number"
                      value={tool.monthlySpend}
                      onChange={e =>
                        updateTool(index, 'monthlySpend', e.target.value)
                      }
                      min="0"
                      placeholder="$/month"
                      className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                    />

                    {tools.length > 1 && (
                      <button
                        onClick={() => removeTool(index)}
                        className="text-neutral-600 hover:text-red-400 transition-colors px-2"
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
            className="mt-4 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            + Add another tool
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-4 rounded-xl transition-all text-base border border-neutral-200"
        >
          {loading
            ? 'Analyzing your AI spend...'
            : 'Audit my AI spend →'}
        </button>

        <p className="text-center text-neutral-600 text-xs mt-4">
          Takes about 10 seconds. No login required.
        </p>

      </div>

    </div>
  )
}