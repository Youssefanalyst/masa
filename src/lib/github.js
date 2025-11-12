import { restaurantName, tagline, currency } from '../data/menu'

const OWNER = 'Youssefanalyst'
const REPO = 'masa'
const BRANCH = 'gh-pages'
const PATH = 'data/menu.json'

function toBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

export async function publishMenuToGithub(categories, token) {
  if (!token) throw new Error('Missing GitHub token')

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`

  // Build file content
  const payload = {
    restaurantName,
    tagline,
    currency,
    lastUpdated: new Date().toISOString(),
    categories,
  }
  const content = toBase64Unicode(JSON.stringify(payload, null, 2))

  // Get current file sha (if exists)
  let sha
  {
    const res = await fetch(`${apiUrl}?ref=${encodeURIComponent(BRANCH)}`, {
      headers: { 'Accept': 'application/vnd.github+json' },
    })
    if (res.ok) {
      const json = await res.json()
      sha = json.sha
    } else if (res.status !== 404) {
      const err = await res.text()
      throw new Error(`Read current file failed: ${res.status} ${err}`)
    }
  }

  // Upsert file
  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'chore(data): publish menu via admin',
      content,
      branch: BRANCH,
      sha,
    }),
  })

  if (!putRes.ok) {
    const err = await putRes.text()
    throw new Error(`Publish failed: ${putRes.status} ${err}`)
  }

  return true
}
