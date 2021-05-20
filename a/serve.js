/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const app = express();

app.use(
  '/',
  expressStaticGzip(__dirname + '/dist', {
    enableBrotli: true,
  }),
);
app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
