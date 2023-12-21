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
export const getOauthGooleToken = async (code) => {
    const hostDirect = `${process.env.HOST}:${process.env.PORT}${process.env.GOOGLE_AUTHORIZED_REDIRECT_URI}`
    const body = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: hostDirect,
        grant_type: 'authorization_code'
    }
    const { data } = await axios.post(
        'https://oauth2.googleapis.com/token',
        body,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
    return data
}

export const getGoogleUser = async ({ id_token, access_token }) => {
    const { data } = await axios.get(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
            params: {
                access_token,
                alt: 'json'
            },
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        }
    )
    // console.log(access_token)
    console.log(access_token)
    return data
}
export const getGoogleUserInfo = async (access_token, personFields) => {
    console.log({access_token, personFields})
    const { data } = await axios.get(
        'https://people.googleapis.com/v1/people/me',
        {
            params: {
                personFields,
            },
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
    )
    // console.log(access_token)
    console.log(access_token)
    return data
}
