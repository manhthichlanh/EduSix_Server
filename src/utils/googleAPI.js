import axios from "axios";
export const fetchYoutube = async (youtubeVideoId = '') => {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.search = new URLSearchParams({
        key: process.env.YOUTUBE_API_KEY,
        part: "contentDetails",
        id: youtubeVideoId,
    }).toString();
    const res = await axios.get(url);
    const data = res.data;
    const videos = data?.items || [];
    return videos.map((video) => {
        const { id, contentDetails: { duration } } = video;
        const newDuration = duration
            .replace("PT", "")
            .replace("H", "*3600:")
            .replace("M", "*60:")
            .replace("S", "")
            .split(":")
            .reduce((total, currentVal) => {
                return total + eval(currentVal)
            }, 0)
        return { id, duration: newDuration }
    })[0];
}
