const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors')
require('dotenv').config();


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors())

const api_key = process.env.OPENAI_API_KEY;
const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.input;
  console.log(userMessage)

  try {
    const response = await axios.post(
      openaiEndpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user",   content: `If the user's message is not related to common inquiries about our Ridease app, such as booking a ride, searching for a ride, publishing a ride, or seeking SOS assistance, please respond with 'No information available.' The user's message is: ${userMessage}`
        }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api_key}`
        }
      }
    );

    const botResponse = response.data.choices[0].message['content'];
    console.log(botResponse)
    res.json({ message: botResponse });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
