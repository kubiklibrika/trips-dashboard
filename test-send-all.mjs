import axios from 'axios';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

// Get all users from getUpdates to find registered users
const apiUrl = `https://api.telegram.org/bot${token}`;

async function getAllUsers() {
  try {
    const response = await axios.get(`${apiUrl}/getUpdates`);
    const updates = response.data.result || [];
    
    const users = new Set();
    for (const update of updates) {
      if (update.message?.chat?.id) {
        users.add(update.message.chat.id.toString());
      }
      if (update.my_chat_member?.chat?.id) {
        users.add(update.my_chat_member.chat.id.toString());
      }
    }
    
    return Array.from(users);
  } catch (error) {
    console.error('Error getting users:', error.message);
    return [];
  }
}

async function sendTestMessage(chatId) {
  try {
    const response = await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text: '🧪 <b>Тестовое сообщение</b>\n\nЭто тестовое сообщение от дашборда выездов. Система работает корректно!',
      parse_mode: 'HTML',
    });
    
    console.log(`✅ Message sent to ${chatId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send to ${chatId}:`, error.response?.data?.description || error.message);
    return false;
  }
}

async function main() {
  console.log('Getting all users...');
  const users = await getAllUsers();
  
  if (users.length === 0) {
    console.log('No users found');
    return;
  }
  
  console.log(`Found ${users.length} user(s). Sending test message...`);
  
  let successCount = 0;
  for (const chatId of users) {
    const success = await sendTestMessage(chatId);
    if (success) successCount++;
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ Successfully sent to ${successCount}/${users.length} users`);
}

main().catch(console.error);
