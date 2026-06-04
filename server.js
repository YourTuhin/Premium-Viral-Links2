const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Render-এর Environment Variables থেকে টোকেন ও লিংক রিড করা হচ্ছে
const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

// 🌟 এখানে আপনার ব্যানারের বা ফটোর ডাইরেক্ট লিংকটি বসাবেন (লিংকের শেষে যেন .jpg বা .png থাকে)
const BOT_WELCOME_IMAGE = "https://i.postimg.cc/MG0G8JsG/file-00000000b0587209893e8bdeacdded49.png"; 

// এক্সপ্রেস সার্ভার সেটআপ (Render-এ অ্যাপ সচল রাখার জন্য বাধ্যতামূলক)
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Premium Viral Links Bot is Online and Running!');
});
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// টোকেন না থাকলে সার্ভার যেন ক্র্যাশ না করে তার সিকিউরিটি চেক
if (!token) {
    console.error("ERROR: BOT_TOKEN is missing in Render Environment Variables!");
    process.exit(1);
}

// বট অবজেক্ট তৈরি
const bot = new TelegramBot(token, { polling: true });

console.log("Telegram Bot listener started successfully...");

// স্টার্ট কমান্ড হ্যান্ডলার
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    // স্টার্টের পরের অংশ ফিল্টার করা (যেমন: ref_xxx বা file_xxx)
    const startPayload = match[1] ? match[1].trim() : '';

    console.log(`Received /start command from ChatID: ${chatId} with payload: "${startPayload}"`);

    // ১. কোনো প্যারামিটার ছাড়া সাধারণ /start দিলে
    if (!startPayload) {
        return bot.sendPhoto(chatId, BOT_WELCOME_IMAGE, {
            caption: "👋 **Arohi Mim এর নতুন💋 আসল ভিডিও পুরা আগুন ভাই!**\n\n১৮+ প্রিমিয়াম ভিডিওগুলো দেখতে এবং আনলক করতে নিচের **Open App** বাটনে ক্লিক করুন। 🍿",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "এখনই দেখুন 🚀", web_app: { url: webAppUrl } }]
                ]
            }
        }).catch(err => console.error("Error sending photo:", err));
    }

    // ২. যদি ইউজার কোনো রেফারেল লিংকে ক্লিক করে আসে (ref_xxx)
    if (startPayload.startsWith('ref_')) {
        return bot.sendPhoto(chatId, BOT_WELCOME_IMAGE, {
            caption: "🎉 **আপনি একজন ইউজারের রেফারেল লিংকে জয়েন করেছেন!**\n\nএখন অ্যাপটি ওপেন করে ভিডিও দেখা শুরু করুন: 👇",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Open App 🚀", web_app: { url: webAppUrl } }]
                ]
            }
        }).catch(err => console.error("Error sending photo:", err));
    }

    // ৩. যদি ইউজার কোনো স্পেসিফিক ফাইল লিংকে ক্লিক করে আসে (file_xxx)
    if (startPayload.startsWith('file_')) {
        // ফাইল আইডিটি আলাদা করে মিনি অ্যাপে পাঠানো হচ্ছে যেন অ্যাপে সরাসরি ওই ফাইলটি ওপেন হয়
        const finalUrl = `${webAppUrl}?tgWebAppStartParam=${startPayload}`;
        return bot.sendPhoto(chatId, BOT_WELCOME_IMAGE, {
            caption: "🎬 **আপনার কাঙ্ক্ষিত ভিডিওটি রেডি আছে!**\n\nনিচের বাটনে ক্লিক করে সরাসরি ভিডিওটি আনলক করে উপভোগ করুন: 👇",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "ভিডিওটি দেখুন 🍿", web_app: { url: finalUrl } }]
                ]
            }
        }).catch(err => console.error("Error sending photo:", err));
    }
});

// কোনো আনহ্যান্ডেলড এরর আসলে বট যেন অফলাইন না হয়ে যায় তার সেফটি গার্ড
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception Details:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});