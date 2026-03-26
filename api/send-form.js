export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, status, lang } = req.body;

    // Credentials from environment variables (set in Vercel dashboard)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Get current timestamp in UTC+5 (Tashkent time)
    const now = new Date();
    const tashkentOffset = 5 * 60; // minutes
    const localTime = new Date(now.getTime() + tashkentOffset * 60 * 1000);
    const dateStr = localTime.toISOString().replace('T', ' ').substring(0, 19) + ' (UTC+5)';

    // Format Telegram message
    const message = `
📋 *Новая заявка с сайта Researchers Academy*

👤 Имя: ${name || '—'}
📧 Email: ${email || '—'}
📱 Телефон: ${phone || '—'}
🎓 Статус: ${status || '—'}
🌍 Язык: ${lang || '—'}

🕐 Время: ${dateStr}
    `.trim();

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', result);
      return res.status(500).json({ ok: false, error: result.description });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
