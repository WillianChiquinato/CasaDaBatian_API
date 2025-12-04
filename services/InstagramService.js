const axios = require("axios");

//comentários aqui.
async function getInstagramPosts() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  const url = `https://graph.facebook.com/v19.0/${userId}/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type,like_count,comments_count,timestamp&limit=10&access_token=${token}`;

  try {
    const response = await axios.get(url);
    return response.data.data.map((p) => ({
      id: p.id,
      image: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
      link: p.permalink,
      likes: p.like_count ?? 0,
      comments: p.comments_count ?? (p.comments?.data?.length ?? 0),
      description: p.caption || "Instagram post",
    }));
  } catch (error) {
    console.error(
      "Erro ao buscar posts do Instagram:",
      error.response?.data || error
    );
    return [];
  }
}

module.exports = {
  getInstagramPosts,
};
