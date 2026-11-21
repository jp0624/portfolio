import { checkBotId } from 'botid/server';

const site = 'https://portfolio-johnparker.vercel.app';
const validText = (value, limit) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= limit;

export default async function contact(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  if (req.headers.origin !== site) return res.status(403).end();
  if (!req.headers['content-type']?.startsWith('application/json')) return res.status(415).end();
  try {
    const body = req.body;
    if (!body || !['phone', 'message'].includes(body.action)) return res.status(400).end();
    const verification = await checkBotId({ developmentOptions: { isDevelopment: false }, advancedOptions: { checkLevel: 'basic' } });
    if (!verification.isHuman || verification.isVerifiedBot || verification.isBot || verification.bypassed) {
      return res.status(403).end();
    }
    if (body.action === 'phone') {
      if (!process.env.CONTACT_PHONE) return res.status(503).end();
      return res.json({ phone: process.env.CONTACT_PHONE });
    }
    const { name, email, message } = body;
    if (!validText(name, 100) || !validText(email, 254) || !validText(message, 4000)
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).end();
    const destination = process.env.CONTACT_RECIPIENT;
    if (!destination) return res.status(503).end();
    const delivery = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(destination), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: site + '/', Origin: site },
      body: JSON.stringify({ name: name.trim(), email, message: message.trim(), _subject: 'Portfolio contact', _url: site + '/' }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await delivery.json();
    if (/activat|confirm/i.test(result.message ?? '')) {
      return res.status(503).json({ reason: 'awaiting_activation' });
    }
    if (!delivery.ok || ![true, 'true'].includes(result.success)) {
      console.warn('Contact delivery was declined', delivery.status);
      return res.status(503).end();
    }
    return res.status(202).json({ accepted: true });
  } catch {
    return res.status(503).end();
  }
}
