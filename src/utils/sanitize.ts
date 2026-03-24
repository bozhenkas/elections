// разрешает только <a href target rel> — всё остальное вырезается
// используется для FAQ-ответов из i18n, где нужны гиперссылки
export function sanitizeLinks(html: string): string {
  return html
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, (_match, href, text) => {
      if (!/^https?:\/\//.test(href)) return text
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
    })
    .replace(/<(?!\/?a[\s>])[^>]*>/g, '')
}
