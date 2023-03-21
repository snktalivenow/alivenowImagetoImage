import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

console.log(process.env)
const baseurl = ""
const configuration = new Configuration({
  apiKey: process.env.API_TOKEN,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from snkT!'
  })
})



app.post('/', async (req, res) => {
  const { prompt, size } = req.body;

  /* const imageSize =
    size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024'; */

    toDataURL(prompt, function(dataUrl) {
      console.log('RESULT:', dataUrl);
      baseurl = dataUrl
    })

  try {
    /* const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    }); */

    const buffer = baseurl;/* Buffer.from(prompt, "base64"); */
    buffer.name = "image.jpg";

    const response = await openai.createImageVariation(
      /* fs.createReadStream(prompt) */buffer,
      1,
      "512x512",
      "b64_json"
    );
    
    const imageUrl = response.data.data[0].b64_json;

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
  /* try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  } */
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))


function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}