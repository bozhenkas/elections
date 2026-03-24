import './ResultChart.css'

type CandidateResult = {
  name: string
  votes: number
  photoUrl?: string
  isWinner?: boolean
}

type ResultChartProps = {
  candidates: CandidateResult[]
  totalVoters: number
  totalEligible: number
  date: string
}

export default function ResultChart({ candidates, totalVoters, totalEligible, date }: ResultChartProps) {
  const maxVotes = Math.max(...candidates.map(c => c.votes))
  const turnout = Math.round((totalVoters / totalEligible) * 100)

  return (
    <div className="result-chart">
      <p className="result-chart__date">{date}</p>
      <div className="result-chart__bars">
        {candidates.map((c) => {
          const pct = Math.round((c.votes / candidates.reduce((s, x) => s + x.votes, 0)) * 100)
          const barWidth = (c.votes / maxVotes) * 100

          return (
            <div key={c.name} className={`result-chart__row ${c.isWinner ? 'result-chart__row--winner' : ''}`}>
              <div className="result-chart__candidate">
                <div className="result-chart__photo">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} />
                  ) : (
                    <svg viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#243434"/>
                      <circle cx="16" cy="12" r="5" fill="#CDDCDC" opacity="0.4"/>
                      <path d="M6 30C6 24 10 20 16 20C22 20 26 24 26 30" fill="#CDDCDC" opacity="0.4"/>
                    </svg>
                  )}
                </div>
                <span className="result-chart__name">{c.name}</span>
              </div>
              <div className="result-chart__bar-wrap">
                <div
                  className="result-chart__bar"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="result-chart__stats">
                <span className="result-chart__pct">{pct}%</span>
                <span className="result-chart__votes">{c.votes}</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="result-chart__turnout">
        Явка: {turnout}% ({totalVoters} из {totalEligible})
      </p>
    </div>
  )
}
