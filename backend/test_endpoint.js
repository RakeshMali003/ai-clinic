const http = require('http');

const data = JSON.stringify({
    documentText: 'Patient shows signs of High Blood Sugar and mild dehydration. Glucose level is 180 mg/dL.',
    fileType: 'medical document',
    language: 'en'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/ai/analyze-document',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (d) => {
        body += d;
    });
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
