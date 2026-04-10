import { NextResponse } from 'next/server'

export async function GET() {
  // Note: ANTHROPIC_API_KEY is reserved by Claude Code in the system environment
  // We use DAYLI_ANTHROPIC_KEY instead to avoid the conflict
  const apiKey = process.env.DAYLI_ANTHROPIC_KEY

  if (!apiKey) {
    return NextResponse.json({
      status: 'error',
      message: 'DAYLI_ANTHROPIC_KEY not found in .env.local',
    }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Reply with exactly: Dayli AI Claude connection successful.' }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ status: 'api_error', error: data }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Claude API connected',
      response: data.content?.[0]?.text
    })
  } catch (err: unknown) {
    return NextResponse.json({
      status: 'fetch_error',
      error: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}
