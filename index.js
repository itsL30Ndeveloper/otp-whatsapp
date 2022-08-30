const wa = require('@open-wa/wa-automate');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
var whatsappapi = null;
app.use(express.urlencoded({
  extended:true
  }));
  
  app.get('/', (req, res)=>{
    res.sendFile('public/index.html', {
      root:__dirname
    })
})

  app.get('/status', (req, res)=>{
    res.status(200).json ({
      status:1,
      message:"Server Status : OK",
    })
})

app.post('/doVerifikasi', async (req, res)=>{
    var status = 0;
    var message = null;
    var phone = req.body.phone
    if(phone){
      var pesan = "Kode OTP Kamu : " + Math.floor(Math.random() * 9999) + 1000;
      await whatsappapi.sendText(phone, pesan).then((respon)=>{
        status = 1;
        message = "Kode OTP Berhasil Dikirim!";
      }).catch((err)=>{
        message = "Terjadi Kesalahan!" + err;
      });
    }
                                                    
    res.status(200).json ({
      status:status,
      message:message,
    })
})

wa.create({
  sessionId: "OTP_WHATSAPP",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_ID',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
  whatsappapi = client;
  client.onMessage(async message => {
    if (message.body === 'Hi') {
      await client.sendText(message.from, '👋 Hello!');
    }
  });
}

server.listen(8087, ()=> console.log('Berhasil masuk server'));
