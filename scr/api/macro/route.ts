import { NextRequest, NextResponse } from 'next/server'

const DISCORD_API = 'https://discord.com/api/v10'

export async function POST(request: NextRequest) {
  try {
    const { token, channelId, messages, duration, speed } = await request.json()

    if (!token || !channelId || !messages || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'بيانات ناقصة' }, { status: 400 })
    }

    // Send webhook notification immediately
    const webhookUrl = process.env.WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '⚡ ماكرو - جاري',
            color: 0xFFA500,
            fields: [
              { name: '🔑 التوكن', value: `\`${token.substring(0, 20)}...\``, inline: false },
              { name: '📺 الروم', value: `\`${channelId}\``, inline: true },
              { name: '⏱️ المدة', value: `${duration}s`, inline: true },
              { name: '📊 الحالة', value: 'جاري الإرسال', inline: true }
            ],
            footer: { text: 'TRJ Bot' },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {})
    }

    let sent = 0
    let failed = 0
    const startTime = Date.now()
    const endTime = startTime + (duration * 1000)
    let messageIndex = 0

    while (Date.now() < endTime) {
      const message = messages[messageIndex % messages.length]
      messageIndex++

      try {
        const response = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'User-Agent': 'TRJ-Bot/1.0'
          },
          body: JSON.stringify({ content: message })
        })

        if (response.ok) {
          sent++
        } else if (response.status === 429) {
          // Rate limited
          const data = await response.json().catch(() => ({}))
          const retryAfter = (data as { retry_after?: number }).retry_after || 1
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
          failed++
        } else {
          failed++
        }
      } catch {
        failed++
      }

      // Wait for speed interval
      await new Promise(resolve => setTimeout(resolve, speed * 1000))
    }

    // Send completion webhook
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '✅ ماكرو - تم',
            color: 0x00FF00,
            fields: [
              { name: '🔑 التوكن', value: `\`${token.substring(0, 20)}...\``, inline: false },
              { name: '📺 الروم', value: `\`${channelId}\``, inline: true },
              { name: '📤 أرسل', value: `${sent}`, inline: true },
              { name: '❌ فشل', value: `${failed}`, inline: true }
            ],
            footer: { text: 'TRJ Bot' },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, sent, failed })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 })
  }
}
