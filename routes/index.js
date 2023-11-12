var express = require("express");
var router = express.Router();
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const pathToFfmpeg = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/fetch-video/:id", async function (req, res, next) {
  const id = req.params.id;
  const url = `https://www.youtube.com/watch?v=${id}`;

  const audio = ytdl(url, {
    filter: "audioonly",
    quality: "highestaudio",
  });
  res.setHeader("Content-type", "audio/mpeg");
  const randomString = [...Array(12)]
    .map(() =>
      String.fromCharCode(
        Math.floor(Math.random() * 26) + (Math.random() < 0.5 ? 65 : 97)
      )
    )
    .join("");

  const outputFilePath = path.join(__dirname, `${randomString}.mp3`);
  const outputStream = fs.createWriteStream(outputFilePath);

  ffmpeg(audio)
    .audioCodec("libmp3lame")
    .audioBitrate(128)
    .format("mp3")
    .on("error", (err) => console.error(err))
    .on("end", () => {
      console.log("Finished!");
      res.sendFile(outputFilePath, {}, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error sending file");
        } 
	// else {
 //          // Delete the file after it has been sent
 //          fs.unlink(outputFilePath, (unlinkErr) => {
 //            if (unlinkErr) {
 //              console.error(unlinkErr);
 //            } else {
 //              console.log("File deleted");
 //            }
 //          });
 //        }
      });
    })
    .pipe(outputStream, {
      end: true,
    });
});

module.exports = router;
