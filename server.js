const PORT = 9000
const express = require('express')
const cors = require('cors')
const app = express()
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your client's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));
// app.use(cors())
app.use(express.json())
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (refear KEY.MD)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/gemini', async(req,res) => {

    console.log(req.body.history)
    console.log(req.body.message)
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const chat = model.startChat({
        history: req.body.history
    })
    const msg = req.body.message

    const result = await chat.sendMessage(msg)
    const response = await result.response
    // const text = response.text()
    let text = response.text(); // Assuming the response is a JSON object with a "text" property
      
    // Basic formatting (optional):
    text = text.replace(/^\*|\*$/g, '') // Remove leading and trailing asterisks
            .replace(/\.(?=[^ ])/g, '. ') // Add a space after periods not followed by a space
            .replace(/(?<!\w)\.\.\.(?!\w)/g, ''); // Remove isolated ellipses

    res.send(text)
    console.log(text.replace(/\*{2}/g, '').replace(/\*/g, '').trim());

})

app.listen(PORT, () => console.log(`Listening to the port  ${PORT}`))
