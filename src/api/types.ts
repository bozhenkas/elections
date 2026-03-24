// ─── Election Data Model ──────────────────────────────────────────────────────
// Typically 2 elections per year:
//   1. Общий председатель СС (type: 'chairman')
//   2. Председатели на местах — по институтам (type: 'councils')

export type ElectionType = 'chairman' | 'councils'
export type ElectionStatus = 'upcoming' | 'active' | 'completed'

export interface Candidate {
  id: string
  name: string
  age?: number
  faculty?: string
  course?: number
  group?: string
  photoUrl?: string
  bio?: string
  program?: string
  contacts?: {
    vk?: string
    telegram?: string
  }
}

export interface CandidateResult {
  candidateId: string
  candidateName: string
  votes: number
  percent: number
  isWinner: boolean
}

export interface CouncilResult {
  councilName: string        // e.g. "ИТПП", "ИСиТ", "РТС"
  candidates: CandidateResult[]
}

export interface Election {
  id: string
  type: ElectionType
  status: ElectionStatus
  title: string              // e.g. "ПРЕДСЕДАТЕЛЯ СТУДЕНЧЕСКОГО СОВЕТА"
  year: number
  date: string               // e.g. "18 декабря"
  timeStart: string          // "10:00"
  timeEnd: string            // "18:00"
  // Candidates (for upcoming/active)
  candidates?: Candidate[]
  // Results (for completed)
  results?: CandidateResult[]        // type === 'chairman'
  councilResults?: CouncilResult[]   // type === 'councils'
  // Turnout
  totalVoters?: number
  totalEligible?: number
  turnoutPercent?: number
}

// ─── API Response types ───────────────────────────────────────────────────────

export interface ElectionsListResponse {
  elections: Election[]
  total: number
}

export interface ElectionDetailResponse {
  election: Election
}

// ─── Admin types ──────────────────────────────────────────────────────────────

export interface CreateElectionPayload {
  type: ElectionType
  title: string
  year: number
  date: string
  timeStart: string
  timeEnd: string
}

export interface AddCandidatePayload {
  electionId: string
  name: string
  age?: number
  faculty?: string
  course?: number
  group?: string
  bio?: string
  program?: string
  contacts?: {
    vk?: string
    telegram?: string
  }
  // Photo uploaded separately
}

export interface PublishResultsPayload {
  electionId: string
  results?: CandidateResult[]
  councilResults?: CouncilResult[]
  totalVoters: number
  totalEligible: number
}
