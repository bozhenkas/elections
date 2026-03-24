// ─── Mock data for prototype ─────────────────────────────────────────────────
// TODO backend: заменить на реальные API-вызовы (см. src/api/elections.ts)

export interface MockCandidate {
  id: string
  name: string
  faculty: string
  course: string
  age?: number
  group?: string
  photoUrl?: string
  bio: string
  program: string
  contacts: {
    vk?: string
    telegram?: string
  }
}

export interface MockElection {
  id: string
  title: string
  subtitle: string
  date: string
  time: string
  year: string
  status: 'upcoming' | 'active' | 'completed'
  type: 'chairman' | 'councils'
  candidates: MockCandidate[]
  daysLeft?: number
}

export const mockCandidates: MockCandidate[] = [
  {
    id: '201',
    name: 'Иванов Иван Иванович',
    faculty: 'ИКСС',
    course: '3 курс',
    age: 21,
    group: 'ИКСС-13',
    bio: 'Активный участник студенческого самоуправления с первого курса. Организатор более 15 мероприятий, включая День первокурсника и Студенческую весну. Член профкома с 2024 года.',
    program: '1. Создание единой цифровой платформы для студенческих инициатив.\n2. Расширение стипендиальных программ за активную деятельность.\n3. Организация ежемесячных встреч с администрацией университета.\n4. Запуск менторской программы для первокурсников.\n5. Развитие межвузовского сотрудничества.',
    contacts: { vk: 'https://vk.com/ivanov', telegram: 'https://t.me/ivanov' },
  },
  {
    id: '202',
    name: 'Петрова Анна Сергеевна',
    faculty: 'ИСиТ',
    course: '2 курс',
    age: 20,
    group: 'ИСиТ-22',
    bio: 'Председатель студенческого совета ИСиТ. Победитель конкурса студенческих проектов 2024. Волонтёр образовательных программ.',
    program: '1. Модернизация системы обратной связи студент–администрация.\n2. Создание студенческого медиацентра.\n3. Программа поддержки студенческих стартапов.\n4. Развитие спортивной инфраструктуры.',
    contacts: { vk: 'https://vk.com/petrova', telegram: 'https://t.me/petrova' },
  },
  {
    id: '203',
    name: 'Сидоров Дмитрий Алексеевич',
    faculty: 'РТС',
    course: '4 курс',
    age: 22,
    group: 'РТС-41',
    bio: 'Председатель студенческого научного общества. Участник всероссийских олимпиад по программированию. Стажировался в Яндексе.',
    program: '1. Интеграция AI-инструментов в учебный процесс.\n2. Создание коворкинг-пространства для проектной работы.\n3. Партнёрская программа с IT-компаниями для стажировок.\n4. Цифровизация документооборота студсовета.',
    contacts: { telegram: 'https://t.me/sidorov' },
  },
]

export const mockElections: MockElection[] = [
  {
    id: '124',
    title: 'ПРЕДСЕДАТЕЛЯ',
    subtitle: 'СТУДЕНЧЕСКОГО СОВЕТА',
    date: '18 декабря',
    time: '10:00 – 18:00',
    year: '2025',
    status: 'active',
    type: 'chairman',
    candidates: mockCandidates,
    daysLeft: 12,
  },
]

export function getElectionById(id: string): MockElection | undefined {
  return mockElections.find(e => e.id === id)
}

export function getCandidateById(candidateId: string): MockCandidate | undefined {
  return mockCandidates.find(c => c.id === candidateId)
}

export function getActiveElection(): MockElection | undefined {
  return mockElections.find(e => e.status === 'active' || e.status === 'upcoming')
}
