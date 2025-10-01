const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = async (event) => {
  try {
    
    const body = JSON.parse(event.body);
    const imageBase64 = body.image; 

    
    const buffer = Buffer.from(imageBase64.split(",")[1], "base64");
    const formData = new FormData();
    formData.append("source_image_file", buffer, {
      filename: "upload.png",
      contentType: "image/png",
    });

   
    const resp = await fetch(
      "https://api.slazzer.com/v2.0/remove_image_background",
      {
        method: "POST",
        headers: { "API-KEY": process.env.SLAZZER_KEY },
        body: formData,
      }
    );

    const blob = await resp.arrayBuffer();
    const base64Image = Buffer.from(blob).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({ image: `data:image/png;base64,${base64Image}` }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
