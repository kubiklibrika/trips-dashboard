import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

console.log('Token:', token ? '✓ Configured' : '✗ Missing');
console.log('Chat ID:', chatId ? '✓ Configured' : '✗ Missing');

if (!token || !chatId) {
  console.error('Missing credentials');
  process.exit(1);
}

try {
  const response = await axios.post(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      chat_id: chatId,
      text: '🧪 Тестовое сообщение из дашборда выездов',
      parse_mode: 'HTML',
    },
    { timeout: 10000 }
  );

  console.log('✅ Message sent successfully!');
  console.log('Response:', response.data);
} catch (error) {
  console.error('❌ Error sending message:');
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else {
    console.error('Error:', error.message);
  }
  process.exit(1);
}
