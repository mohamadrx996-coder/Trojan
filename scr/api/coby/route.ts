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

export async function POST(request: NextRequest) {
  try {
    const { token, sourceId, targetId, options } = await request.json()

    if (!token || !sourceId || !targetId) {
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
            title: '🔄 نسخ سيرفر - جاري',
            color: 0xFFA500,
            fields: [
              { name: '🔑 التوكن', value: `\`${token.substring(0, 20)}...\``, inline: false },
              { name: '📥 المصدر', value: `\`${sourceId}\``, inline: true },
              { name: '📤 الهدف', value: `\`${targetId}\``, inline: true },
              { name: '📊 الحالة', value: 'جاري التنفيذ', inline: true }
            ],
            footer: { text: 'TRJ Bot' },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {})
    }

    const stats = {
      roles: 0,
      txt: 0,
      voice: 0,
      cats: 0,
      emojis: 0
    }

    const roleMap: Record<string, string> = {}
    const catMap: Record<string, string> = {}

    // Get source data
    const { data: sourceGuild } = await discordRequest('GET', `guilds/${sourceId}`, token)
    const { data: sourceRoles } = await discordRequest('GET', `guilds/${sourceId}/roles`, token)
    const { data: sourceChannels } = await discordRequest('GET', `guilds/${sourceId}/channels`, token)

    if (!sourceGuild || !sourceRoles || !sourceChannels) {
      return NextResponse.json({ success: false, error: 'فشل جلب بيانات السيرفر المصدر' }, { status: 400 })
    }

    // Get target everyone role
    const { data: targetRoles } = await discordRequest('GET', `guilds/${targetId}/roles`, token)
    const targetEveryone = Array.isArray(targetRoles) 
      ? targetRoles.find((r: { name: string }) => r.name === '@everyone') 
      : null

    // Copy settings
    if (options.settings) {
      const settingsPayload: Record<string, unknown> = {
        name: (sourceGuild as { name?: string }).name || 'Copied Server'
      }
      
      await discordRequest('PATCH', `guilds/${targetId}`, token, settingsPayload)
    }

    // Copy roles (sorted by position descending for correct order)
    if (options.roles && Array.isArray(sourceRoles)) {
      const rolesToCreate = [...sourceRoles]
        .filter((r: { name: string; managed?: boolean }) => r.name !== '@everyone' && !r.managed)
        .sort((a: { position?: number }, b: { position?: number }) => (b.position || 0) - (a.position || 0))

      // Update everyone permissions
      const sourceEveryone = sourceRoles.find((r: { name: string }) => r.name === '@everyone')
      if (sourceEveryone && targetEveryone) {
        await discordRequest('PATCH', `guilds/${targetId}/roles/${targetEveryone.id}`, token, {
          permissions: (sourceEveryone as { permissions?: string }).permissions
        })
      }

      for (const role of rolesToCreate) {
        const { data: newRole } = await discordRequest('POST', `guilds/${targetId}/roles`, token, {
          name: (role as { name?: string }).name,
          color: (role as { color?: number }).color || 0,
          hoist: (role as { hoist?: boolean }).hoist || false,
          mentionable: (role as { mentionable?: boolean }).mentionable || false,
          permissions: (role as { permissions?: string }).permissions || '0'
        })
        
        if (newRole && (newRole as { id?: string }).id) {
          roleMap[(role as { id: string }).id] = (newRole as { id: string }).id
          stats.roles++
        }
      }
    }

    // Copy channels
    if (options.channels && Array.isArray(sourceChannels)) {
      // Categories first
      const categories = (sourceChannels as Array<{ type: number }>)
        .filter((c: { type: number }) => c.type === 4)
        .sort((a: { position?: number }, b: { position?: number }) => (a.position || 0) - (b.position || 0))

      for (const cat of categories) {
        const { data: newCat } = await discordRequest('POST', `guilds/${targetId}/channels`, token, {
          name: (cat as { name?: string }).name,
          type: 4
        })
        
        if (newCat && (newCat as { id?: string }).id) {
          catMap[(cat as { id: string }).id] = (newCat as { id: string }).id
          stats.cats++
        }
      }

      // Then other channels
      const channels = (sourceChannels as Array<{ type: number }>)
        .filter((c: { type: number }) => c.type !== 4)
        .sort((a: { position?: number }, b: { position?: number }) => (a.position || 0) - (b.position || 0))

      for (const ch of channels) {
        const channelData = ch as { 
          name?: string; 
          type?: number; 
          parent_id?: string;
          topic?: string;
          bitrate?: number;
          nsfw?: boolean;
        }
        
        const payload: Record<string, unknown> = {
          name: channelData.name,
          type: channelData.type,
          nsfw: channelData.nsfw || false
        }

        if (channelData.parent_id && catMap[channelData.parent_id]) {
          payload.parent_id = catMap[channelData.parent_id]
        }

        if (channelData.type === 0 && channelData.topic) {
          payload.topic = channelData.topic
        }

        if (channelData.type === 2) {
          payload.bitrate = channelData.bitrate || 64000
        }

        const { data: newCh } = await discordRequest('POST', `guilds/${targetId}/channels`, token, payload)
        
        if (newCh) {
          if (channelData.type === 0) stats.txt++
          else if (channelData.type === 2) stats.voice++
        }
      }
    }

    // Send completion webhook
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '✅ نسخ سيرفر - تم',
            color: 0x00FF00,
            fields: [
              { name: '🔑 التوكن', value: `\`${token.substring(0, 20)}...\``, inline: false },
              { name: '📥 المصدر', value: `\`${sourceId}\``, inline: true },
              { name: '📤 الهدف', value: `\`${targetId}\``, inline: true },
              { name: '🎭 رتب', value: `${stats.roles}`, inline: true },
              { name: '💬 نصي', value: `${stats.txt}`, inline: true },
              { name: '🔊 صوتي', value: `${stats.voice}`, inline: true },
              { name: '📁 كاتيجوري', value: `${stats.cats}`, inline: true }
            ],
            footer: { text: 'TRJ Bot' },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, stats })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 })
  }
}
