export interface FetchProps {
  action: 'get'
  id: string
}

export default async function Fetch(commands: FetchProps) {
  if (!commands.action) return null

  const response = await fetch(`${window.location.origin}/api/database`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    body: JSON.stringify(commands),
  })
  const values = await response.json()
  if (values.error) {
    return null
  }
  return values
}
