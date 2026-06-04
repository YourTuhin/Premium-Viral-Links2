const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const token = process.env.BOT_TOKEN; 
const miniAppUrl = process.env.WEBAPP_URL; 

// 🌟 এখানে আপনার ব্যানারের বা ফটোর ডাইরেক্ট লিংকটি বসাবেন
const BOT_WELCOME_IMAGE = "https://yourdomain.com/your-banner-image.jpg"; 

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Telegram Mini App Backend is Running!'));
app.listen(PORT, () => console.log(`Server connected to port ${PORT}`));

if (!token) {
    console.error("ERROR: BOT_TOKEN Environment Variable এ দেওয়া হয়নি!");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const startPayload = match[1] ? match[1].trim() : '';

    // সাধারণ /start দিলে (কোনো রেফারেল বা ফাইল লিংক ছাড়া)
    if (!startPayload) {
        return bot.sendPhoto(chatId, BOT_WELCOME_IMAGE, {
            caption: "👋 **Arohi Mim এর নতুন💋 আসল ভিডিও পুরা আগুন ভাই!**\n\nপ্রিমিয়াম ভিডিওগুলো দেখতে এবং আনলক করতে নিচের **Open App** বাটনে ক্লিক করুন। 🍿",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Watch Now 🚀", web_app: { url: miniAppUrl } }]
                ]
            }
        }).catch(err => console.error("Error:", err));
    }

    // রেফারেল লিংকে ক্লিক করে আসলে (ref_xxx)
    if (startPayload.startsWith('ref_')) {
        return bot.sendPhoto(chatId, BOT_WELCOME_IMAGE, {
            caption: "🎉 **আপনি একটি রেফারেল লিংকে জয়েন করেছেন!**\n\nনিচের বাটনে ক্লিক করে মিনি অ্যাপটি ওপেন করুন: 👇",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Watch Now 🚀", web_app: { url: miniAppUrl } }]
                ]
            }
        }).catch(err => console.error("Error:", err));
    }

    // নির্দিষ্ট ফাইল/ভিডিও লিংকে ক্লিক করে আসলে (file_xxx)
    if (startPayload.startsWith('file_')) {
        const finalMiniAppUrl = `${miniAppUrl}?tgWebAppStartParam=${startPayload}`;
        
        return bot.sendPhoto(chatId, BOT_WELCOME_IMAGE, {
            caption: "🎬 **আপনার কাঙ্ক্ষিত ভিডিওটি রেডি আছে!**\n\nনিচের বাটনে ক্লিক করে সরাসরি মিনি অ্যাপ থেকে ভিডিওটি আনলক করে উপভোগ করুন: 👇",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "ভিডিওটি দেখুন 🍿", web_app: { url: finalMiniAppUrl } }]
                ]
            }
        }).catch(err => console.error("Error:", err));
    }
});

process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
