import { useState, useEffect } from 'react'

// TypeScript interfaces
interface AiSignalResponseDto {
  id: number
  symbolCode: string
  timeframe: string
  direction: 'LONG' | 'SHORT' | 'NEUTRAL'
  entryPrice: number | null
  stopLoss: number | null
  takeProfit1: number | null
  takeProfit2: number | null
  takeProfit3: number | null
  riskReward1: number | null
  riskReward2: number | null
  riskReward3: number | null
  reasoning: string | null
  createdAt: string
}

interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

interface AiSuggestRequestDto {
  symbolCode: string
  timeframe: string
  mode: string
  maxRiskPerTrade?: number
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function App() {
  // Form state
  const [symbolCode, setSymbolCode] = useState('XAUUSD')
  const [timeframe, setTimeframe] = useState('M5')
  const [mode, setMode] = useState('SCALPING')
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState<number | ''>('')

  // UI state
  const [latestSignal, setLatestSignal] = useState<AiSignalResponseDto | null>(null)
  const [history, setHistory] = useState<SpringPage<AiSignalResponseDto> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load history
  const loadHistory = async () => {
    try {
      const params = new URLSearchParams({
        symbolCode,
        timeframe,
        page: '0',
        size: '20',
      })
      const response = await fetch(`${API_BASE}/api/signals?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to load history: ${response.statusText}`)
      }
      const data: SpringPage<AiSignalResponseDto> = await response.json()
      setHistory(data)
    } catch (err) {
      console.error('Error loading history:', err)
    }
  }

  // Load history on mount and when symbolCode/timeframe change
  useEffect(() => {
    loadHistory()
  }, [symbolCode, timeframe])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const requestBody: AiSuggestRequestDto = {
        symbolCode,
        timeframe,
        mode,
        ...(maxRiskPerTrade !== '' && { maxRiskPerTrade }),
      }

      const response = await fetch(`${API_BASE}/api/signals/ai-suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Request failed: ${response.statusText}`)
      }

      const data: AiSignalResponseDto = await response.json()
      setLatestSignal(data)
      await loadHistory()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Direction badge component
  const DirectionBadge = ({ direction }: { direction: 'LONG' | 'SHORT' | 'NEUTRAL' }) => {
    const styles = {
      LONG: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
      SHORT: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
      NEUTRAL: 'bg-slate-500/15 text-slate-300 border border-slate-500/40',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[direction]}`}>
        {direction}
      </span>
    )
  }

  // Format number helper
  const formatNum = (val: number | null) => (val !== null ? val.toFixed(2) : '—')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Volman AI Trade Assistant</h1>
              <p className="text-sm text-slate-400 mt-1">
                Bob Volman-style price action, powered by AI.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/40">
                Spring Boot 3 · Online
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/40">
                {mode}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Card: Request AI Trade Signal */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Request AI Trade Signal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Symbol Code
                </label>
                <input
                  type="text"
                  value={symbolCode}
                  onChange={(e) => setSymbolCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="XAUUSD"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M5">M5</option>
                  <option value="M15">M15</option>
                  <option value="M30">M30</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SCALPING">SCALPING</option>
                  <option value="INTRADAY">INTRADAY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Max Risk Per Trade (optional)
                </label>
                <input
                  type="number"
                  value={maxRiskPerTrade}
                  onChange={(e) =>
                    setMaxRiskPerTrade(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100"
                  step="0.01"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
              >
                {loading ? 'Generating...' : 'Generate AI Signal'}
              </button>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-md text-rose-300 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Right Card: Latest AI Signal */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Latest AI Signal</h2>
            {latestSignal ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <DirectionBadge direction={latestSignal.direction} />
                  <span className="text-sm text-slate-400">
                    {latestSignal.symbolCode} · {latestSignal.timeframe}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  {new Date(latestSignal.createdAt).toLocaleString()}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">Entry</div>
                    <div className="text-sm font-semibold text-slate-100">
                      {formatNum(latestSignal.entryPrice)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">Stop Loss</div>
                    <div className="text-sm font-semibold text-slate-100">
                      {formatNum(latestSignal.stopLoss)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">TP1</div>
                    <div className="text-sm font-semibold text-emerald-400">
                      {formatNum(latestSignal.takeProfit1)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">TP2</div>
                    <div className="text-sm font-semibold text-emerald-400">
                      {formatNum(latestSignal.takeProfit2)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">TP3</div>
                    <div className="text-sm font-semibold text-emerald-400">
                      {formatNum(latestSignal.takeProfit3)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">RR1 / RR2</div>
                    <div className="text-sm font-semibold text-slate-100">
                      {formatNum(latestSignal.riskReward1)} / {formatNum(latestSignal.riskReward2)}
                    </div>
                  </div>
                </div>

                {latestSignal.reasoning && (
                  <div className="bg-slate-800/30 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">AI Reasoning</div>
                    <div className="text-sm text-slate-300">{latestSignal.reasoning}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                No AI signal yet. Request one from the form.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Card: Signal History */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Signal History</h2>
            <button
              onClick={loadHistory}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-sm transition-colors"
            >
              Refresh
            </button>
          </div>

          {history && history.content.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-800">
                  <tr className="text-left text-slate-400">
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">Symbol</th>
                    <th className="pb-2 font-medium">TF</th>
                    <th className="pb-2 font-medium">Direction</th>
                    <th className="pb-2 font-medium">Entry</th>
                    <th className="pb-2 font-medium">SL</th>
                    <th className="pb-2 font-medium">TP1</th>
                  </tr>
                </thead>
                <tbody>
                  {history.content.map((signal) => (
                    <tr key={signal.id} className="border-b border-slate-800/50">
                      <td className="py-3 text-slate-400 text-xs">
                        {new Date(signal.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 text-slate-200">{signal.symbolCode}</td>
                      <td className="py-3 text-slate-300">{signal.timeframe}</td>
                      <td className="py-3">
                        <DirectionBadge direction={signal.direction} />
                      </td>
                      <td className="py-3 text-slate-200">{formatNum(signal.entryPrice)}</td>
                      <td className="py-3 text-slate-200">{formatNum(signal.stopLoss)}</td>
                      <td className="py-3 text-emerald-400">{formatNum(signal.takeProfit1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">No signals yet.</div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
