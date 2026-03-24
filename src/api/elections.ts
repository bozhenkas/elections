import type {
  Election,
  ElectionsListResponse,
  ElectionDetailResponse,
  CreateElectionPayload,
  AddCandidatePayload,
  PublishResultsPayload,
} from './types'

// TODO: бэкенд-разработчик — заменить заглушки на реальные API-вызовы
const API_BASE = '/api/v1'

// ─── Public API ───────────────────────────────────────────────────────────────

/** Список всех выборов (для архива и главной) */
export async function getElections(): Promise<ElectionsListResponse> {
  // TODO: fetch(`${API_BASE}/elections`)
  // Stub — archive data now lives inside ArchiveSection with i18n, this endpoint will be replaced by a real API
  return { elections: [], total: 0 }
}

/** Детали одних выборов */
export async function getElection(id: string): Promise<ElectionDetailResponse> {
  // TODO: fetch(`${API_BASE}/elections/${id}`)
  const { elections } = await getElections()
  const election = elections.find(e => e.id === id)
  if (!election) throw new Error(`Election ${id} not found`)
  return { election }
}

/** Текущие активные/предстоящие выборы */
export async function getActiveElection(): Promise<ElectionDetailResponse | null> {
  // TODO: fetch(`${API_BASE}/elections/active`)
  return null
}

// ─── Admin API ────────────────────────────────────────────────────────────────

/** Создать новые выборы */
export async function createElection(_payload: CreateElectionPayload): Promise<Election> {
  // TODO: fetch(`${API_BASE}/admin/elections`, { method: 'POST', body: JSON.stringify(payload) })
  throw new Error('Not implemented — requires backend')
}

/** Добавить кандидата */
export async function addCandidate(_payload: AddCandidatePayload): Promise<void> {
  // TODO: fetch(`${API_BASE}/admin/elections/${payload.electionId}/candidates`, { method: 'POST' })
  throw new Error('Not implemented — requires backend')
}

/** Загрузить фото кандидата */
export async function uploadCandidatePhoto(_candidateId: string, _file: File): Promise<string> {
  // TODO: fetch(`${API_BASE}/admin/candidates/${candidateId}/photo`, { method: 'POST', body: formData })
  throw new Error('Not implemented — requires backend')
}

/** Опубликовать результаты */
export async function publishResults(_payload: PublishResultsPayload): Promise<void> {
  // TODO: fetch(`${API_BASE}/admin/elections/${payload.electionId}/results`, { method: 'POST' })
  throw new Error('Not implemented — requires backend')
}

/** Изменить статус выборов */
export async function updateElectionStatus(_id: string, _status: 'upcoming' | 'active' | 'completed'): Promise<void> {
  // TODO: fetch(`${API_BASE}/admin/elections/${id}/status`, { method: 'PATCH' })
  throw new Error('Not implemented — requires backend')
}
