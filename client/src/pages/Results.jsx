import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Results() {
  const navigate = useNavigate()

  const [audit, setAudit] = useState(null)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('audit_result')

    if (!saved) {
      navigate('/')
      return
    }

    setAudit(JSON.parse(saved))
  }, [])

  if (!audit) return null

  const {
    results,
    totalMonthlySavings,
    totalAnnualSavings,
    summary,
    classification,
    hasCredexOpportunity
  } = audit

  async function handleEmailSubmit() {
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setEmailError('')
    setEmailLoading(true)

    try {
      const response = await fetch('https://credex-project-nq0n.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          auditId: audit.auditId,
          auditData: audit
        })
      })

      const data = await response.json()

      if (data.success) {
        setEmailSubmitted(true)
      } else {
        setEmailError('Something went wrong. Please try again.')
      }

    } catch (err) {
      console.error('Email submit failed:', err)
      setEmailSubmitted(true)

    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
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

          <button
            onClick={() => navigate('/')}
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            ← New audit
          </button>

        </nav>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className={`rounded-xl border p-8 mb-8 text-center ${
          totalMonthlySavings > 0
            ? 'bg-[#111111] border-[#232323]'
            : 'bg-[#111111] border-[#232323]'
        }`}>

          {totalMonthlySavings > 0 ? (
            <>

              <p className="text-sm text-neutral-400 mb-3">
                Savings opportunity found
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-white mb-2">
                ${totalMonthlySavings.toLocaleString()}/mo
              </h1>

              <p className="text-neutral-500">
                ${totalAnnualSavings.toLocaleString()}/year in potential savings
              </p>

            </>
          ) : (
            <>

              <h1 className="text-3xl font-semibold text-white mb-2">
                Your AI spend looks healthy
              </h1>

              <p className="text-neutral-500">
                No major optimization opportunities detected.
              </p>

            </>
          )}

        </div>

        {/* AI Summary */}
        {summary && (

          <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">

            <div className="flex items-center gap-2 mb-4">

              <div className="text-xs border border-[#2a2a2a] bg-[#1a1a1a] text-neutral-400 px-2 py-1 rounded-full">
                AI Analysis
              </div>

              {!audit.aiGenerated && (
                <span className="text-xs text-neutral-600">
                  templated fallback
                </span>
              )}

            </div>

            <p className="text-neutral-300 leading-8 text-[15px]">
              {summary}
            </p>

          </div>
        )}

        {/* Tool Breakdown */}
        <div className="mb-8">

          <h2 className="text-lg font-medium text-white mb-4">
            Tool breakdown
          </h2>

          <div className="space-y-4">

            {results.map((result, i) => (

              <div
                key={i}
                className="bg-[#111111] border border-[#232323] rounded-xl p-5"
              >

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">

                  <div>

                    <div className="flex items-center gap-2 flex-wrap">

                      <h3 className="font-medium text-white">
                        {result.toolName}
                      </h3>

                      <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-neutral-500 px-2 py-0.5 rounded-full capitalize">
                        {result.currentPlan}
                      </span>

                      <span className="text-xs text-neutral-600">
                        {result.seats} seat{result.seats > 1 ? 's' : ''}
                      </span>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-neutral-400">
                      ${result.currentSpend}/mo
                    </p>

                    {result.savings > 0 && (
                      <p className="text-sm text-white mt-1">
                        save ${result.savings}/mo
                      </p>
                    )}

                  </div>

                </div>

                {/* Recommendations */}
                {result.status === 'optimal' ? (

                  <div className="text-sm text-neutral-500 border border-[#232323] bg-[#0f0f0f] rounded-lg px-4 py-3">
                    Spending looks reasonable for your use case.
                  </div>

                ) : (

                  <div className="space-y-2">

                    {result.recommendations.map((rec, j) => (

                      <div
                        key={j}
                        className="text-sm text-neutral-300 border border-[#232323] bg-[#0f0f0f] rounded-lg px-4 py-3 leading-6"
                      >
                        {rec.message}
                      </div>

                    ))}

                  </div>

                )}

              </div>
            ))}

          </div>

        </div>

        {/* Credex CTA */}
        {hasCredexOpportunity && (

          <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">

            <h3 className="font-medium text-white mb-2">
              Reduce spend further with Credex
            </h3>

            <p className="text-sm text-neutral-500 leading-6 mb-5">
              Teams with high AI usage often reduce infrastructure costs
              further through discounted AI credits and contract optimization.
            </p>

            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white hover:bg-neutral-200 text-black text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Book consultation →
            </a>

          </div>
        )}

        {/* Classification */}
        {classification && (

          <div className="bg-[#111111] border border-[#232323] rounded-xl p-5 mb-8">

            <div className="grid md:grid-cols-3 gap-6">

              <div>

                <p className="text-xs text-neutral-600 mb-1">
                  Use case
                </p>

                <p className="text-sm text-white capitalize">
                  {classification.useCase}
                </p>

              </div>

              <div>

                <p className="text-xs text-neutral-600 mb-1">
                  Capability level
                </p>

                <p className="text-sm text-white">
                  {classification.requiredLevel} / 4
                </p>

              </div>

              <div>

                <p className="text-xs text-neutral-600 mb-1">
                  Reasoning
                </p>

                <p className="text-sm text-neutral-400 leading-6">
                  {classification.reasoning}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* Email Capture */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">

          {!emailSubmitted ? (
            <>

              <h3 className="font-medium text-white mb-2">
                Send this audit to your inbox
              </h3>

              <p className="text-sm text-neutral-500 mb-5">
                Get the full report and future optimization updates.
              </p>

              <div className="flex flex-col md:flex-row gap-3">

                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e =>
                    e.key === 'Enter' && handleEmailSubmit()
                  }
                  placeholder="you@company.com"
                  className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                />

                <button
                  onClick={handleEmailSubmit}
                  disabled={emailLoading}
                  className="bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-medium px-5 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  {emailLoading ? 'Sending...' : 'Send report'}
                </button>

              </div>

              {emailError && (
                <p className="text-red-400 text-xs mt-3">
                  {emailError}
                </p>
              )}

            </>
          ) : (

            <div className="text-center py-2">

              <p className="text-white font-medium text-lg">
                Report sent
              </p>

              <p className="text-neutral-500 text-sm mt-1">
                Check your inbox for the full audit.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}