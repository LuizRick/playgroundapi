const express = require('express')
const router = express.Router();
const ytdlcore = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

router.get("/get-yt-video-info", (req, res) => {
    const youtubeUrl = req.query.yt_url;
    const videoId = youtubeUrl.split("?")[1].match(/v=([^&]+)/)[1];
    const VIDEO_URL = "https://www.youtube.com/get_video_info?video_id=" + videoId;
    const video_metadata = {};
    axios.get(VIDEO_URL).then(response => {
        const get_video_info = qsToJson(response.data);

        let tmp = get_video_info["url_encoded_fmt_stream_map"];
        if (tmp) {
            tmp = tmp.split(",")
            for (let i in tmp) {
                tmp[i] = qsToJson(tmp[i])
                tmp[i].ext = tmp[i].type
                    .match(/^video\/\w+(?=;)/g)[0]
                    .replace(/^video\//, "");
            }

            video_metadata["videos"] = tmp;
        }
        video_metadata["audio"] = qsToJson(get_video_info["adaptive_fmts"]);
        video_metadata["title"] = JSON.parse(get_video_info["player_response"]).videoDetails.title.replace(/\+/g, " ");
        video_metadata["video_details"] = JSON.parse(get_video_info["player_response"]).videoDetails;
        res.send(video_metadata);
    }).catch(err => {
        res.send('erro')
    })
})


router.get("/yt-info", (req, res) => {
    const youtubeUrl = req.query.yt_url;
    const videoId = youtubeUrl.split("?")[1].match(/v=([^&]+)/)[1];
    ytdlcore.getInfo(videoId, (err, info) => {
        if (err) res.status(204).end()
        else res.send(info)
    })
})


router.get('/yt-download', (req, res) => {
    const youtubeUrl = req.query.yt_url;
    const quality = req.query.quality;
    const name = req.query.name || "video-youtube";
    const videoId = youtubeUrl.split("?")[1].match(/v=([^&]+)/)[1];
    
    ytdlcore.getInfo(videoId, (err, info) => {
        if (err) res.status(204).end()
    })

    const stream = ytdlcore(youtubeUrl, {
        format: 'mp4',
        quality
    });


    if (quality.indexOf("audio") != -1) {
        res.header('Content-Disposition', `attachment; filename="${name}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');
        const proc = new ffmpeg({ source: stream });
        proc.withAudioCodec('libmp3lame')
            .on(`error`, (err) =>  console.log(err))
            .toFormat('mp3')
            .output(res)
            .run();
    } else {
        res.header('Content-Disposition', `attachment; filename="${name}.mp4"`);
        stream.pipe(res);
    }
})


function qsToJson(queryString) {
    let res = {};
    let params = queryString.split("&");
    let keyValuePair, key, value;
    for (let i in params) {
        keyValuePair = params[i].split("=");
        key = keyValuePair[0];
        value = keyValuePair[1];
        res[key] = decodeURIComponent(value);
    }
    return res;
}

module.exports = router;