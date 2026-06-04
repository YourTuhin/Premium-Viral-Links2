const { Telegraf } = require('telegraf');
const express = require('express');

// পরিবেশ ভেরিয়েবল (Environment Variables) থেকে টোকেন এবং ইউআরএল নেওয়া হচ্ছে
const BOT_TOKEN = process.env.BOT_TOKEN; 
const MINI_APP_URL = process.env.MINI_APP_URL; 

if (!BOT_TOKEN || !MINI_APP_URL) {
    console.error("❌ ভুল: BOT_TOKEN অথবা MINI_APP_URL সেট করা হয়নি!");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// /start কমান্ড হ্যান্ডলার (রেফারেল ট্র্যাকিং লজিক)
bot.start((ctx) => {
    const startPayload = ctx.startPayload || ''; 
    
    let welcomeMessage = `👋 আমাদের মিনি অ্যাপে আপনাকে স্বাগত!\n\nনিচের বাটনে ক্লিক করে সরাসরি অ্যাপটি ওপেন করুন এবং কাজ শুরু করুন।`;
    let webAppUrlWithParam = MINI_APP_URL;
    
    // যদি কেউ রেফারেল লিংক দিয়ে আসে (যেমন: ?start=ref_usr_123)
    if (startPayload && startPayload.startsWith('ref_')) {
        webAppUrlWithParam = `${MINI_APP_URL}?tgWebAppStartParam=${startPayload}`;
        welcomeMessage = `🎁 আপনি একটি রেফারেল লিংকের মাধ্যমে যুক্ত হয়েছেন!\n\nনিচের বাটনে ক্লিক করে অ্যাপটি ওপেন করলেই রেফারেলটি সফলভাবে কাউন্ট হয়ে যাবে।`;
    }

    // ইউজারকে ইনলাইন ওয়েবঅ্যাপ বাটনসহ মেসেজ পাঠানো
    ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: "🚀 Open Mini App", 
                        web_app: { url: webAppUrlWithParam } 
                    }
                ]
            ]
        }
    });
});

// বট চালু করা
bot.launch()
    .then(() => console.log('🚀 টেলিগ্রাম মিনি অ্যাপ বট সফলভাবে চালু হয়েছে!'))
    .catch((err) => console.error('বট চালু করতে সমস্যা হয়েছে:', err));

// Render বা হোস্টিং সার্ভার সচল রাখার জন্য একটি ডামি পোর্ট ওপেন রাখা
app.get('/', (req, res) => {
    res.send('টেলিগ্রাম বট ব্যাকএন্ড সফলভাবে চলছে!');
});

app.listen(PORT, () => {
    console.log(`ওয়েব সার্ভার পোর্ট ${PORT}-এ চালু আছে`);
});

// স্মুথ স্টপ নিশ্চিত করা
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
