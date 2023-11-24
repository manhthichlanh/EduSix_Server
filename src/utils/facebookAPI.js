import axios from "axios";
export const getOauthFacebookToken = async (code) => {
    const hostDirect = `${process.env.HOST}:${process.env.PORT}${process.env.FACEBOOK_AUTHORIZED_REDIRECT_URI}`

    const { data } = await axios({
        url: 'https://graph.facebook.com/v13.0/oauth/access_token',
        method: 'get',
        params: {
            client_id: process.env.FACEBOOK_CLIENT_ID,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            redirect_uri: hostDirect,
            code,
        },
    });
    return data;
};
export const getFacebookUser = async (access_token) => {
    const { data } = await axios({
        url: 'https://graph.facebook.com/v13.0/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'first_name', 'last_name', 'name', 'short_name', 'picture'].join(','),
            access_token: access_token,
        },
    });
    return data;
}