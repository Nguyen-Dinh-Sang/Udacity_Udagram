import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import https from 'https';
import { nextTick } from 'process';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Endpoint to filter an image from a public url.
  app.get("/filteredimage/", async (request: Request, response: Response) => {
    let imageUrl = request.query.image_url;

    // 1. Validate the image_url query.
    if (!imageUrl) {
      return response.status(400).send('Image Url is required.');
    }

    https.get(imageUrl, function (responseURL) {
      if (responseURL.statusCode != 200) {
        return response.status(400).send('Image Url is invalid.')
      }
    });

    // 2. Call filterImageFromURL(image_url) to filter the image.
    let imageLocalUrl = await filterImageFromURL(imageUrl);

    if (!imageLocalUrl) {
      return response.status(400).send('Can not filter image.')
    }

    // 3. Send the resulting file in the response.
    response.status(200).sendFile(imageLocalUrl);


    // 4. Deletes any files on the server on finish of the response.
    setTimeout(() => {
      deleteLocalFiles([imageLocalUrl]);
    }, 10000);
  })

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();