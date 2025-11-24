const axios = require("axios");

async function getInstagramPosts() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type&limit=9&access_token=${token}`;

  try {
    const response = await axios.get(url);
    return response.data.data.map(post => ({
      id: post.id,
      image: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
      caption: post.caption,
      link: post.permalink
    }));
  } catch (error) {
    console.error("Erro ao buscar posts do Instagram:", error.response?.data || error);
    return [];
  }
}

module.exports = {
  getInstagramPosts,
};
