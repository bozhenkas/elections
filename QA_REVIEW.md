# QA Review — Elections СС СПбГУТ

## Критические (CRIT)

| # | Проблема | Файл | Статус |
|---|----------|------|--------|
| CRIT-01 | TODO/wireframe заметки видны пользователям | ElectionPage, App.tsx | Нужен дизайн |
| CRIT-02 | UserDropdown иконка `/src/assets/` — не работает в prod | UserDropdown | **ИСПРАВЛЕНО** |
| CRIT-03 | Favicon пути в index.html через `/src/assets/` | index.html | Нужно исправить |
| CRIT-04 | Нет опции «Против всех» в бюллетене | WireframeBallot | Нужна доработка |
| CRIT-05 | WireframeBallot не передаёт выбранного кандидата в обработчик голоса | WireframeBallot | Нужна доработка |
| CRIT-06 | `cursor: none !important` скрывает курсор на тач-устройствах | global.css | Нужно исправить |
| CRIT-07 | Mock-данные содержат «Подставной челик» как имя кандидата | mock/index.ts | Нужно убрать |

## Высокий приоритет (HIGH)

| # | Проблема | Файл |
|---|----------|------|
| HIGH-01 | Нет keyboard accessibility на интерактивных div'ах | ElectionCard, FAQ, Archive, Ballot |
| HIGH-02 | Фейковые radio-кнопки в бюллетене (div вместо input) | WireframeBallot |
| HIGH-03 | Захардкоженные русские строки обходят i18n | ErrorBoundary, Modal, FAQ |
| HIGH-04 | `<html lang="ru">` не обновляется при переключении на EN | index.html / App |
| HIGH-05 | Нет `:focus-visible` стилей | Все компоненты |
| HIGH-06 | CursorGlow вызывает ререндер на каждый mousemove (~60/сек) | CursorGlow |
| HIGH-07 | Нет skip-to-content ссылки | App |
| HIGH-08 | Нарушена иерархия заголовков (нет `<h1>`) | Hero / App |

## Нарушения дизайн-системы

| # | Проблема | Файл |
|---|----------|------|
| DS-01 | `box-shadow` на hover (дизайн-система: без теней) | Множество компонентов |
| DS-02 | Розовый `#FFCECE` используется больше чем 2-3 раза на экран | Archive, ElectionPage |
| DS-03 | Смешанные border-width (1px вместо 0.5px) | wf-block, ballot |
| DS-04 | Захардкоженные цвета (#636363) вместо CSS-переменных | Header, Archive, UserDropdown |
| DS-05 | Модалка использует 20px border-radius (спека: 12-16px) | Modal.css |

## Архитектурные замечания

| # | Проблема |
|---|----------|
| ARCH-01 | Два расходящихся типа данных (`api/types.ts` vs `mock/index.ts`) |
| ARCH-02 | API-слой никогда не используется (импорт напрямую из mock) |
| ARCH-03 | Нет тестов, линтинга, конфига форматирования |
| ARCH-04 | React 19 в package.json, но CLAUDE.md говорит React 18 |

## Приоритизированный список задач

### Критические (блокируют деплой)
1. Исправить favicon в index.html (prod-пути)
2. Добавить media query для touch — убрать `cursor: none` на мобилках
3. Заменить «Подставной челик» в mock-данных
4. WireframeBallot: передавать ID кандидата при голосовании

### Высокий (юзабилити и a11y)
5. Добавить `role="button"` и `tabIndex={0}` + `onKeyDown` на интерактивные div'ы
6. Заменить div-радиокнопки на `<input type="radio">` в бюллетене
7. Обновить `lang` атрибут при переключении языка
8. Добавить `:focus-visible` стили
9. Оптимизировать CursorGlow (throttle mousemove)

### Средний (дизайн-система)
10. Убрать все `box-shadow` на hover
11. Заменить #636363 на CSS-переменную
12. Модалка: border-radius 16px вместо 20px
13. wf-block: border 0.5px вместо 1px

### Низкий (tech debt)
14. Объединить типы api/types.ts и mock/index.ts
15. Добавить ESLint + Prettier
16. Написать базовые тесты
