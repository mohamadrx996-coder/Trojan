'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Copy, 
  Send, 
  Server, 
  MessageSquare, 
  Settings, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Skull,
  Ban,
  Trash2,
  Flame,
  Crown,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('copy')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
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
    setProgress(0)

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
        setProgress(100)
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
    setProgress(0)

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
        setProgress(100)
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
    setProgress(0)

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
        setProgress(100)
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
    { id: 'nuke', label: 'نيكر كامل', desc: 'أدمن + تغيير اسم + حذف + إنشاء + سبام', icon: Skull, color: 'from-red-600 to-orange-600' },
    { id: 'banall', label: 'حظر الكل', desc: 'حظر جميع أعضاء السيرفر', icon: Ban, color: 'from-purple-600 to-pink-600' },
    { id: 'delete_channels', label: 'حذف الرومات', desc: 'حذف جميع قنوات السيرفر', icon: Trash2, color: 'from-yellow-600 to-red-600' },
    { id: 'spam', label: 'سبام', desc: 'سبام في جميع القنوات النصية', icon: Flame, color: 'from-orange-600 to-red-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  TRJ BOT
                </h1>
                <p className="text-sm text-slate-400">أدوات ديسكورد متقدمة • نسخ + نيوكر + ماكرو</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                متصل
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                v2.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              أدوات ديسكورد احترافية
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            منصة متكاملة لإدارة وتحكم في سيرفرات ديسكورد • نسخ سيرفرات، نيوكر، ماكرو والمزيد
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50 h-14 p-1">
            <TabsTrigger 
              value="copy" 
              className="h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25 transition-all"
            >
              <Server className="w-5 h-5 ml-2" />
              <span className="font-semibold">نسخ سيرفر</span>
            </TabsTrigger>
            <TabsTrigger 
              value="nuker" 
              className="h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25 transition-all"
            >
              <Skull className="w-5 h-5 ml-2" />
              <span className="font-semibold">نيوكر</span>
            </TabsTrigger>
            <TabsTrigger 
              value="macro" 
              className="h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 transition-all"
            >
              <MessageSquare className="w-5 h-5 ml-2" />
              <span className="font-semibold">ماكرو</span>
            </TabsTrigger>
          </TabsList>

          {/* Copy Server Tab */}
          <TabsContent value="copy" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Copy className="w-5 h-5 text-white" />
                  </div>
                  نسخ سيرفر كامل
                </CardTitle>
                <CardDescription className="text-slate-400">
                  انسخ جميع الإعدادات والرتب والرومات من سيرفر لآخر بضغطة زر واحدة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Token Input */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">توكن حسابك</Label>
                  <Input
                    type="password"
                    placeholder="الصق التوكن هنا..."
                    value={copyToken}
                    onChange={(e) => setCopyToken(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 h-12"
                  />
                </div>

                {/* Server IDs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">أيدي السيرفر المصدر</Label>
                    <Input
                      placeholder="123456789..."
                      value={copySourceId}
                      onChange={(e) => setCopySourceId(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">أيدي السيرفر الهدف</Label>
                    <Input
                      placeholder="987654321..."
                      value={copyTargetId}
                      onChange={(e) => setCopyTargetId(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 h-12"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700/50" />

                {/* Copy Options */}
                <div className="space-y-3">
                  <Label className="text-slate-300 text-sm font-medium">اختر ماذا تنسخ:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { id: 'settings', label: 'الإعدادات', icon: Settings },
                      { id: 'roles', label: 'الرتب', icon: Shield },
                      { id: 'channels', label: 'الرومات', icon: Server },
                      { id: 'emojis', label: 'الإيموجي', icon: MessageSquare },
                      { id: 'stickers', label: 'الملصقات', icon: MessageSquare },
                    ].map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          copyOptions[option.id as keyof typeof copyOptions]
                            ? 'bg-red-500/10 border-red-500/50 text-red-400'
                            : 'bg-slate-900/50 border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}
                        onClick={() => setCopyOptions(prev => ({ ...prev, [option.id]: !prev[option.id as keyof typeof prev] }))}
                      >
                        <Checkbox
                          checked={copyOptions[option.id as keyof typeof copyOptions]}
                          className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                        />
                        <span className="text-sm">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleCopy}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-7 text-lg shadow-lg shadow-red-500/25 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                      جاري النسخ...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 ml-2" />
                      بدء النسخ
                    </>
                  )}
                </Button>

                {/* Progress */}
                {status === 'loading' && (
                  <Progress value={progress} className="h-2 bg-slate-700" />
                )}

                {/* Result */}
                {result && status !== 'idle' && (
                  <div className={`p-4 rounded-lg ${
                    status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                    'bg-slate-700/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                      <span className={`font-semibold ${
                        status === 'success' ? 'text-green-400' :
                        status === 'error' ? 'text-red-400' :
                        'text-white'
                      }`}>
                        {status === 'success' ? 'تم بنجاح!' : status === 'error' ? 'حدث خطأ' : 'النتيجة'}
                      </span>
                    </div>
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nuker Tab */}
          <TabsContent value="nuker" className="space-y-6">
            <Card className="bg-slate-800/50 border-red-500/20 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                    <Skull className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    أدوات النيوكر
                    <Badge variant="outline" className="mr-2 bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                      خطر
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  أدوات قوية للتحكم في السيرفرات • استخدمها بحذر
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Token Input */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">توكن حسابك</Label>
                  <Input
                    type="password"
                    placeholder="الصق التوكن هنا..."
                    value={nukerToken}
                    onChange={(e) => setNukerToken(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 h-12"
                  />
                </div>

                {/* Guild ID */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">أيدي السيرفر</Label>
                  <Input
                    placeholder="123456789..."
                    value={nukerGuildId}
                    onChange={(e) => setNukerGuildId(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 h-12"
                  />
                </div>

                <Separator className="bg-slate-700/50" />

                {/* Action Selection */}
                <div className="space-y-3">
                  <Label className="text-slate-300 text-sm font-medium">اختر الإجراء:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {nukerActions.map((action) => (
                      <div
                        key={action.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          nukerAction === action.id
                            ? `bg-gradient-to-r ${action.color} border-transparent text-white shadow-lg`
                            : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={() => setNukerAction(action.id)}
                      >
                        <div className="flex items-center gap-3">
                          <action.icon className="w-6 h-6" />
                          <div>
                            <div className="font-semibold">{action.label}</div>
                            <div className={`text-xs ${nukerAction === action.id ? 'text-white/80' : 'text-slate-500'}`}>
                              {action.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleNuker}
                  disabled={isLoading || !nukerAction}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-7 text-lg shadow-lg shadow-red-500/25 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                      جاري التنفيذ...
                    </>
                  ) : (
                    <>
                      <Flame className="w-6 h-6 ml-2" />
                      تنفيذ الإجراء
                    </>
                  )}
                </Button>

                {/* Result */}
                {result && status !== 'idle' && activeTab === 'nuker' && (
                  <div className={`p-4 rounded-lg ${
                    status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                    'bg-slate-700/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                      <span className={`font-semibold ${
                        status === 'success' ? 'text-green-400' :
                        status === 'error' ? 'text-red-400' :
                        'text-white'
                      }`}>
                        {status === 'success' ? 'تم بنجاح!' : status === 'error' ? 'حدث خطأ' : 'النتيجة'}
                      </span>
                    </div>
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Macro Tab */}
          <TabsContent value="macro" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  ماكرو إرسال رسائل
                </CardTitle>
                <CardDescription className="text-slate-400">
                  إرسال رسائل متعددة بشكل متكرر لقناة معينة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Token Input */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">توكن حسابك</Label>
                  <Input
                    type="password"
                    placeholder="الصق التوكن هنا..."
                    value={macroToken}
                    onChange={(e) => setMacroToken(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                  />
                </div>

                {/* Channel ID */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">أيدي الروم</Label>
                  <Input
                    placeholder="123456789..."
                    value={macroChannelId}
                    onChange={(e) => setMacroChannelId(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                  />
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">الرسائل (كل سطر رسالة)</Label>
                  <Textarea
                    placeholder="رسالة 1&#10;رسالة 2&#10;رسالة 3"
                    value={macroMessages}
                    onChange={(e) => setMacroMessages(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 min-h-[120px]"
                  />
                </div>

                {/* Duration and Speed */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">المدة (ثواني)</Label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={macroDuration}
                      onChange={(e) => setMacroDuration(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium">السرعة (ثانية/رسالة)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      value={macroSpeed}
                      onChange={(e) => setMacroSpeed(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleMacro}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-7 text-lg shadow-lg shadow-purple-500/25 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6 ml-2" />
                      بدء الماكرو
                    </>
                  )}
                </Button>

                {/* Result */}
                {result && status !== 'idle' && activeTab === 'macro' && (
                  <div className={`p-4 rounded-lg ${
                    status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                    'bg-slate-700/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                      <span className={`font-semibold ${
                        status === 'success' ? 'text-green-400' :
                        status === 'error' ? 'text-red-400' :
                        'text-white'
                      }`}>
                        {status === 'success' ? 'تم بنجاح!' : status === 'error' ? 'حدث خطأ' : 'النتيجة'}
                      </span>
                    </div>
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="grid md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: Zap, title: 'سريع جداً', desc: 'عمليات متوازية', color: 'from-yellow-500 to-orange-500' },
            { icon: Shield, title: 'آمن', desc: 'بياناتك محمية', color: 'from-green-500 to-teal-500' },
            { icon: Server, title: 'متكامل', desc: 'نسخ كل شيء', color: 'from-purple-500 to-pink-500' },
            { icon: Crown, title: 'احترافي', desc: 'واجهة متقدمة', color: 'from-red-500 to-orange-500' },
          ].map((feature, i) => (
            <Card key={i} className="bg-slate-800/30 border-slate-700/50 backdrop-blur hover:border-slate-600 hover:bg-slate-800/50 transition-all">
              <CardContent className="p-5 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">TRJ Bot © 2024</span>
            </div>
            <p className="text-slate-500 text-sm">
              Dev By: <span className="text-red-400 font-semibold">Trj.py</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
