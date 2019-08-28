const express = require('express')
const router = express.Router();


router.get("/get-yt-video-info", (req, res) => {
    const youtubeUrl = req.query.yt_url;
    const videoId = youtubeUrl.split("?")[1].match(/v=([^&]+)/)[1];
    const VIDEO_URL = "https://www.youtube.com/get_video_info?video_id=" + videoId;
    const video_metadata = {};
    axios.get(VIDEO_URL).then( response => {
        const get_video_info =  qsToJson(response.data);

        let tmp = get_video_info["url_encoded_fmt_stream_map"];
        if(tmp){
            tmp = tmp.split(",")
            for(let i in tmp){
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


router.get("/yt-info", (req,res) => {
    const youtubeUrl = req.query.yt_url;
    const videoId = youtubeUrl.split("?")[1].match(/v=([^&]+)/)[1];
    ytdlcore.getInfo(videoId, (err, info) => {
        if(err) res.send(err)
        else res.send(info)
    })
})


router.get('/yt-download', (req, res) => {
    const youtubeUrl = req.query.yt_url;
    const quality = req.query.quality;
    const name = req.query.name || "video-youtube";
    
    res.header('Content-Disposition', `attachment; filename="${name}.mp4"`);
    ytdlcore(youtubeUrl,{
        format: 'mp4',
        quality
    }).pipe(res);
})

module.exports = router;