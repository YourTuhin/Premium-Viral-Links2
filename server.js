const { Telegraf } = require('telegraf');
const express = require('express');
const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN');
const webAppUrl = "YOUR_WEBAPP_URL"; // আপনার মিনি অ্যাপের লিংক (index2.html যেখানে হোস্ট করা)

bot.start(async (ctx) => {
    const startPayload = ctx.startPayload; // স্টার্ট বাটনের পিছনের অংশ (যেমন: ref_xxx বা file_xxx)
    const chatId = ctx.chat.id;

    // ১. কোনো প্যারামিটার ছাড়া সাধারণ /start দিলে
    if (!startPayload) {
        return ctx.reply("👋 প্রিমিয়াম ভাইরাল লিংকে স্বাগতম!\n\nঅ্যাপটি ওপেন করতে নিচের বাটনে ক্লিক করুন:", {
            reply_markup: { inline_keyboard: [[{ text: "Open App 🚀", web_app: { url: webAppUrl } }]] }
        });
    }

    // ২. যদি ইউজার কোনো রেফার লিংকে ক্লিক করে আসে
    if (startPayload.startsWith('ref_')) {
        return ctx.reply("🎉 আপনি রেফারেল লিংকে জয়েন করেছেন! অ্যাপ ওপেন করুন:", {
            reply_markup: { inline_keyboard: [[{ text: "Open App 🚀", web_app: { url: webAppUrl } }]] }
        });
    } 
    
    // ৩. 🌟 এটি নতুন যোগ করুন (সিঙ্গেল ফাইল বা ভিডিও শেয়ারের জন্য)
    if (startPayload.startsWith('file_')) {
        return ctx.reply("🎬 আপনার কাঙ্ক্ষিত ভিডিওটি রেডি আছে!\n\nনিচের বাটনে ক্লিক করে সরাসরি ভিডিওটি দেখুন:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "ভিডিওটি দেখুন 🍿", web_app: { url: `${webAppUrl}?tgWebAppStartParam=${startPayload}` } }]
                ]
            }
        });
    }
});

bot.launch();

// Render-এ সচল রাখার জন্য এক্সপ্রেস পোর্ট লিসেনার
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
