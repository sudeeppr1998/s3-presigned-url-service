var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config()

const port = 3005;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/listenAudio', async (req, res) => {
  try {

    const filename = req.query.filename;

    const s3Client = new S3Client(
      {
        region: process.env.AWS_S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      });

    const getObjectParams = {
      "Bucket": process.env.AWS_s3_BUCKET_NAME,
      "Key": filename
    };

    const command = new GetObjectCommand(getObjectParams);

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    res.setHeader('Cache-Control', 'no-cache');

    res.send(
    `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <audio src="${url}" controls controlsList="nodownload"></audio>`
    );

  } catch (err) {
    res.send('Err :', err);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
