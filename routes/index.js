var express = require("express");
var router = express.Router();
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const pathToFfmpeg = require("ffmpeg-static");

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
  var proc = new ffmpeg({ source: audio });
  proc.setFfmpegPath(pathToFfmpeg);
  proc.withAudioCodec("libmp3lame").toFormat("mp3").output(res).run();
  proc.on("error", function (e) {
    console.log("ooopsie!", e);
  });
  proc.on("end", function () {
    console.log("finished");
  });
});

module.exports = router;