import {
  GENIUS_ENDPOINT,
  CLIENT_ID,
  CLIENT_SECRET,
  ACCESS_TOKEN
} from "../constants/genius";

const getAnnotations = async ({ song, artist }) => {
  const query = decodeURIComponent(`${artist} ${song}`);
  const url = `${GENIUS_ENDPOINT}/search?q=${query}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&access_token=${ACCESS_TOKEN}`;
  let data;

  function isValidAnnotation(resp) {
    return resp.response.song.description.html !== "<p>?</p>";
  }

  function isValidEmbed(resp) {
    return resp.response.song.embed_content !== "";
  }

  try {
    data = await fetch(url);
    data = await data.json();
    const { response } = data;

    if (response.hits.length > 0) {
      const isSameArtist =
        artist.toLowerCase() ===
        response.hits[0].result.primary_artist.name.toLowerCase();
      const isSameSong =
        song.toLowerCase() === response.hits[0].result.title.toLowerCase();

      if (isSameArtist && isSameSong) {
        const { id } = response.hits[0].result;
        const URL = `${GENIUS_ENDPOINT}/songs/${id}?access_token=${ACCESS_TOKEN}&text_format=html`;

        let result = await fetch(URL);
        result = await result.json();

        if (isValidAnnotation(result) && isValidEmbed(result)) {
          return {
            annot: result.response.song.description.html,
            embed: result.response.song.embed_content
          };
        } else if (isValidEmbed(result)) {
          return {
            embed: result.response.song.embed_content,
            annot: "No annotations found."
          };
        }
        return { annot: "No annotations available." };
      }
    }
    return { annot: "No annotations available." };
  } catch (e) {
    throw new Error(e.message);
  }
};

export default getAnnotations;
