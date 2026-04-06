'use client'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('copy')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<string>('')

  // Copy Server State
  const [copyToken, setCopyToken] = useState('')
  const [copySourceId, setCopySourceId] = useState('')
  const [copyTargetId, setCopyTargetId] = useState('')
  const [copyOptions, setCopyOptions] = useState({
    settings: true,
    roles: true,
    channels: true,
    emojis: false,
    stickers: false
  })

  // Macro State
  const [macroToken, setMacroToken] = useState('')
  const [macroChannelId, setMacroChannelId] = useState('')
  const [macroMessages, setMacroMessages] = useState('')
  const [macroDuration, setMacroDuration] = useState('60')
  const [macroSpeed, setMacroSpeed] = useState('0.5')

  // Nuker State
  const [nukerToken, setNukerToken] = useState('')
  const [nukerGuildId, setNukerGuildId] = useState('')
  const [nukerAction, setNukerAction] = useState<string | null>(null)

  const handleCopy = async () => {
    if (!copyToken || !copySourceId || !copyTargetId) {
      setStatus('error')
      setResult('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setIsLoading(true)
    setStatus('loading')

    try {
      const response = await fetch('/api/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: copyToken,
          sourceId: copySourceId,
          targetId: copyTargetId,
          options: copyOptions
        })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setResult(JSON.stringify(data.stats, null, 2))
      } else {
        setStatus('error')
        setResult(data.error || 'حدث خطأ')
      }
    } catch (error) {
      setStatus('error')
      setResult('فشل الاتصال بالخادم')
    }

    setIsLoading(false)
  }

  const handleMacro = async () => {
    if (!macroToken || !macroChannelId || !macroMessages) {
      setStatus('error')
      setResult('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setIsLoading(true)
    setStatus('loading')

    try {
      const response = await fetch('/api/macro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: macroToken,
          channelId: macroChannelId,
          messages: macroMessages.split('\n').filter(m => m.trim()),
          duration: parseFloat(macroDuration),
          speed: parseFloat(macroSpeed)
        })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setResult(`Sent: ${data.sent} | Failed: ${data.failed}`)
      } else {
        setStatus('error')
        setResult(data.error || 'حدث خطأ')
      }
    } catch (error) {
      setStatus('error')
      setResult('فشل الاتصال بالخادم')
    }

    setIsLoading(false)
  }

  const handleNuker = async () => {
    if (!nukerToken || !nukerGuildId || !nukerAction) {
      setStatus('error')
      setResult('يرجى ملء جميع الحقول واختيار الإجراء')
      return
    }

    setIsLoading(true)
    setStatus('loading')

    try {
      const response = await fetch('/api/nuker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: nukerToken,
          guildId: nukerGuildId,
          action: nukerAction
        })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setResult(JSON.stringify(data.stats, null, 2))
      } else {
        setStatus('error')
        setResult(data.error || 'حدث خطأ')
      }
    } catch (error) {
      setStatus('error')
      setResult('فشل الاتصال بالخادم')
    }

    setIsLoading(false)
  }

  const nukerActions = [
    { id: 'nuke', label: 'نيكر كامل', desc: 'أدمن + تغيير اسم + حذف + إنشاء + سبام' },
    { id: 'banall', label: 'حظر الكل', desc: 'حظر جميع أعضاء السيرفر' },
    { id: 'delete_channels', label: 'حذف الرومات', desc: 'حذف جميع قنوات السيرفر' },
    { id: 'spam', label: 'سبام', desc: 'سبام في جميع القنوات النصية' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  TRJ BOT
                </h1>
                <p className="text-sm text-slate-400">أدوات ديسكورد متقدمة • نسخ + نيوكر + ماكرو</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                متصل
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              أدوات ديسكورد احترافية
            </span>
          </h2>
          <p className="text-slate-400 text-lg">نسخ سيرفرات، نيوكر، ماكرو والمزيد</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl">
          {[
            { id: 'copy', label: '🖥️ نسخ سيرفر' },
            { id: 'nuker', label: '💀 نيوكر' },
            { id: 'macro', label: '⚡ ماكرو' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setStatus('idle'); setResult(''); }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Copy Tab */}
        {activeTab === 'copy' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              📋 نسخ سيرفر كامل
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">توكن حسابك</label>
                <input
                  type="password"
                  placeholder="الصق التوكن هنا..."
                  value={copyToken}
                  onChange={(e) => setCopyToken(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">أيدي السيرفر المصدر</label>
                  <input
                    placeholder="123456789..."
                    value={copySourceId}
                    onChange={(e) => setCopySourceId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">أيدي السيرفر الهدف</label>
                  <input
                    placeholder="987654321..."
                    value={copyTargetId}
                    onChange={(e) => setCopyTargetId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">اختر ماذا تنسخ:</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.entries(copyOptions).map(([key, value]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        value
                          ? 'bg-red-500/10 border-red-500/50 text-red-400'
                          : 'bg-slate-900/50 border-slate-600 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setCopyOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{key === 'settings' ? 'الإعدادات' : key === 'roles' ? 'الرتب' : key === 'channels' ? 'الرومات' : key === 'emojis' ? 'الإيموجي' : 'الملصقات'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCopy}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? '⏳ جاري النسخ...' : '⚡ بدء النسخ'}
              </button>

              {result && (
                <div className={`p-4 rounded-lg ${
                  status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                  status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                  'bg-slate-700/50'
                }`}>
                  <p className={`font-semibold mb-2 ${
                    status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white'
                  }`}>
                    {status === 'success' ? '✅ تم بنجاح!' : status === 'error' ? '❌ حدث خطأ' : 'النتيجة'}
                  </p>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nuker Tab */}
        {activeTab === 'nuker' && (
          <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              💀 أدوات النيوكر
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400">خطر</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">توكن حسابك</label>
                <input
                  type="password"
                  placeholder="الصق التوكن هنا..."
                  value={nukerToken}
                  onChange={(e) => setNukerToken(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">أيدي السيرفر</label>
                <input
                  placeholder="123456789..."
                  value={nukerGuildId}
                  onChange={(e) => setNukerGuildId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">اختر الإجراء:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nukerActions.map((action) => (
                    <div
                      key={action.id}
                      onClick={() => setNukerAction(action.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        nukerAction === action.id
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 border-transparent text-white'
                          : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-semibold">{action.label}</div>
                      <div className={`text-sm ${nukerAction === action.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {action.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNuker}
                disabled={isLoading || !nukerAction}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? '⏳ جاري التنفيذ...' : '🔥 تنفيذ الإجراء'}
              </button>

              {result && status !== 'idle' && activeTab === 'nuker' && (
                <div className={`p-4 rounded-lg ${
                  status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                  status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                  'bg-slate-700/50'
                }`}>
                  <p className={`font-semibold mb-2 ${
                    status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white'
                  }`}>
                    {status === 'success' ? '✅ تم بنجاح!' : status === 'error' ? '❌ حدث خطأ' : 'النتيجة'}
                  </p>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Macro Tab */}
        {activeTab === 'macro' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              ⚡ ماكرو إرسال رسائل
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">توكن حسابك</label>
                <input
                  type="password"
                  placeholder="الصق التوكن هنا..."
                  value={macroToken}
                  onChange={(e) => setMacroToken(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">أيدي الروم</label>
                <input
                  placeholder="123456789..."
                  value={macroChannelId}
                  onChange={(e) => setMacroChannelId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">الرسائل (كل سطر رسالة)</label>
                <textarea
                  placeholder="رسالة 1&#10;رسالة 2&#10;رسالة 3"
                  value={macroMessages}
                  onChange={(e) => setMacroMessages(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">المدة (ثواني)</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={macroDuration}
                    onChange={(e) => setMacroDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">السرعة (ثانية/رسالة)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.5"
                    value={macroSpeed}
                    onChange={(e) => setMacroSpeed(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleMacro}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? '⏳ جاري الإرسال...' : '🚀 بدء الماكرو'}
              </button>

              {result && status !== 'idle' && activeTab === 'macro' && (
                <div className={`p-4 rounded-lg ${
                  status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                  status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                  'bg-slate-700/50'
                }`}>
                  <p className={`font-semibold mb-2 ${
                    status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white'
                  }`}>
                    {status === 'success' ? '✅ تم بنجاح!' : status === 'error' ? '❌ حدث خطأ' : 'النتيجة'}
                  </p>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-slate-500">Dev By: <span className="text-red-400">Trj.py</span> | TRJ Bot © 2024</p>
        </div>
      </footer>
    </div>
  )
}
