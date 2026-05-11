import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Results() {
  const navigate = useNavigate()
  const [audit, setAudit] = useState(null)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('audit_result')
    if (!saved) {
      navigate('/')
      return
    }
    setAudit(JSON.parse(saved))
  }, [])

  if (!audit) return null

  const { results, totalMonthlySavings, totalAnnualSavings, 
          summary, classification, hasCredexOpportunity } = audit

  function handleEmailSubmit() {
    if (!email) return
    // We'll wire this to backend later
    setEmailSubmitted(true)
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
        <button onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-white transition-colors">
          ← New audit
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Savings hero */}
        <div className={`rounded-2xl p-8 mb-8 text-center ${
          totalMonthlySavings > 0 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-gray-900 border border-gray-800'
        }`}>
          {totalMonthlySavings > 0 ? (
            <>
              <p className="text-green-400 text-sm font-medium mb-2">
                💰 Savings opportunity found
              </p>
              <p className="text-5xl font-bold text-white mb-1">
                ${totalMonthlySavings.toLocaleString()}/mo
              </p>
              <p className="text-gray-400">
                That's <span className="text-green-400 font-semibold">
                  ${totalAnnualSavings.toLocaleString()}/year
                </span> you could save
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-white mb-2">
                ✓ You're spending well
              </p>
              <p className="text-gray-400">
                Your current AI tool spend looks optimized.
              </p>
            </>
          )}
        </div>

        {/* AI Summary */}
        {summary && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full">
                AI Analysis
              </span>
              {!audit.aiGenerated && (
                <span className="text-xs text-gray-600">(templated)</span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Per tool breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Tool breakdown
          </h2>
          <div className="space-y-3">
            {results.map((result, i) => (
              <div key={i} className={`rounded-xl p-5 border ${
                result.status === 'optimal'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-gray-900 border-yellow-500/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{result.toolName}</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {result.currentPlan}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">
                      ${result.currentSpend}/mo
                    </span>
                    {result.savings > 0 && (
                      <span className="ml-2 text-sm text-green-400 font-medium">
                        save ${result.savings}/mo
                      </span>
                    )}
                  </div>
                </div>

                {result.status === 'optimal' ? (
                  <p className="text-sm text-gray-500">✓ Spending well</p>
                ) : (
                  <div className="space-y-2">
                    {result.recommendations.map((rec, j) => (
                      <div key={j} className="text-sm text-yellow-300/80 bg-yellow-500/5 rounded-lg px-3 py-2">
                        {rec.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credex CTA for high savings */}
        {hasCredexOpportunity && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-2">
              💡 Get even more savings with Credex
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Credex sells discounted AI credits — same tools, lower price. 
              Teams saving ${totalMonthlySavings}+/mo typically save an 
              additional 20–40% through credits.
            </p>
            <a href="https://credex.rocks" target="_blank" rel="noreferrer"
              className="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Book a Credex consultation →
            </a>
          </div>
        )}

        {/* Email capture */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {!emailSubmitted ? (
            <>
              <h3 className="font-semibold text-white mb-1">
                Get this report in your inbox
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                We'll also notify you when new savings opportunities 
                apply to your stack.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  onClick={handleEmailSubmit}
                  className="bg-white hover:bg-gray-100 text-black font-medium px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  Send report
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-green-400 font-medium">✓ Report sent!</p>
              <p className="text-gray-500 text-sm mt-1">
                Check your inbox for the full audit.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}