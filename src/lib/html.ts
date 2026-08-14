/**
 * Demote h1/h2 headings in raw HTML content (from admin blog editor)
 * so embedded content never collides with the page's real heading hierarchy.
 * The page's own <h1> remains the only H1.
 */
export function demoteHeadings(html: string): string {
  return html
    .replace(/<h1\b/gi, '<h2')
    .replace(/<\/h1>/gi, '</h2>')
    .replace(/<h2\b/gi, '<h3')
    .replace(/<\/h2>/gi, '</h3>');
}
