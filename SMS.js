const axios = require('axios');

const sendSms = async () => {
    const apiKey = '9Ij0Ys4qDyLnVpF67v28gmotHwO5uXfrUlbRAGP13TKcSaZEWMSXqNzl08ZiLcvV17oduIKAfm9OJ3wp'; 
    const message = 'Hello, this is a test message!';
    const numbers = ['8766036899']; 

    const options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            'authorization': apiKey,
            'Content-Type': 'application/json',
        },
        data: {
            message: message,
            numbers: numbers.join(','),
            route: 'v3', // or 'v4' depending on your plan
            sender_id: 'TXTIND', // Ensure this is enabled in your Fast2SMS account
        },
    };

    try {
        const response = await axios(options);
        console.log('SMS sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    }
};

sendSms();
