import axios from 'axios';

const token = process.env.TELEGRAM_BOT_TOKEN;
const webhookUrl = 'https://tripsdash-y478acgk.manus.space/api/telegram/webhook';

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

async function setWebhook() {
  try {
    const apiUrl = `https://api.telegram.org/bot${token}`;
    
    console.log(`📡 Setting webhook to: ${webhookUrl}`);
    
    const response = await axios.post(`${apiUrl}/setWebhook`, {
      url: webhookUrl,
    });
    
    if (response.data.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } else {
      console.error('❌ Failed to set webhook:', response.data);
    }
  } catch (error) {
    console.error('❌ Error setting webhook:', error.message);
    if (error.response?.data) {
      console.error('Details:', error.response.data);
    }
  }
}

setWebhook();
