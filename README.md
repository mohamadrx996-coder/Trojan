# TRJ Bot - Website

موقع ويب متكامل لأدوات ديسكورد المتقدمة

## المميزات

- 🖥️ **نسخ سيرفرات** - نسخ كامل للإعدادات والرتب والرومات
- 💀 **نيوكر** - أدوات قوية للتحكم في السيرفرات
- ⚡ **ماكرو** - إرسال رسائل متكررة
- 🎨 **واجهة جميلة** - تصميم عصري ومتجاوب

## النشر على Vercel

### الطريقة الأولى: رفع من GitHub

1. ارفع المجلد إلى GitHub repository
2. اذهب إلى [vercel.com](https://vercel.com)
3. اضغط "New Project"
4. اختر الـ repository
5. اضغط "Deploy"

### الطريقة الثانية: رفع مباشر

1. ثبّت Vercel CLI:
```bash
npm install -g vercel
```

2. سجل دخول:
```bash
vercel login
```

3. انشر المشروع:
```bash
vercel --prod
```

## متغيرات البيئة (اختياري)

أنشئ ملف `.env` وأضف:

```
WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
```

## التثبيت المحلي

```bash
# تثبيت الحزم
npm install

# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build
npm start
```

## الملفات الرئيسية

- `src/app/page.tsx` - الصفحة الرئيسية
- `src/app/api/copy/route.ts` - API نسخ السيرفرات
- `src/app/api/macro/route.ts` - API الماكرو
- `src/app/api/nuker/route.ts` - API النيوكر

## المطور

**Trj.py** - TRJ Bot © 2024
