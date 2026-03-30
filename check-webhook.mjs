import axios from 'axios';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

async function checkWebhook() {
  try {
    const apiUrl = `https://api.telegram.org/bot${token}`;
    
    console.log('📡 Checking webhook info...\n');
    
    const response = await axios.get(`${apiUrl}/getWebhookInfo`);
    
    if (response.data.ok) {
      const info = response.data.result;
      console.log('Webhook Status:');
      console.log('  URL:', info.url);
      console.log('  Has Custom Certificate:', info.has_custom_certificate);
      console.log('  Pending Update Count:', info.pending_update_count);
      console.log('  Last Error Date:', info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : 'None');
      console.log('  Last Error Message:', info.last_error_message || 'None');
      console.log('  Last Synchronization Error Date:', info.last_synchronization_error_date ? new Date(info.last_synchronization_error_date * 1000).toISOString() : 'None');
      
      if (info.pending_update_count > 0) {
        console.log('\n⚠️  There are pending updates! The webhook might not be working.');
      }
      
      if (info.last_error_message) {
        console.log('\n❌ Last Error:', info.last_error_message);
      }
    } else {
      console.error('❌ Failed to get webhook info:', response.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWebhook();
