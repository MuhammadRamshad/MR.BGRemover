import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    const buffer = Buffer.from(image.split(",")[1], "base64");

    const formData = new FormData();
    formData.append("source_image_file", buffer, {
      filename: "upload.png",
      contentType: "image/png",
    });

    const resp = await fetch(
      "https://api.slazzer.com/v2.0/remove_image_background",
      {
        method: "POST",
        headers: {
          "API-KEY": process.env.SLAZZER_KEY,
        },
        body: formData,
      }
    );

    const arrayBuffer = await resp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({ image: `data:image/png;base64,${base64Image}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
