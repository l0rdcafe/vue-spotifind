import { convertMillisToMinsSecs } from "../constants/utils";

const getUser = async options => {
  const URL = "https://api.spotify.com/v1/me";
  let user;
  try {
    user = await fetch(URL, options);
    user = await user.json();
    return user;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getCurrentlyPlaying = async options => {
  const URL = "https://api.spotify.com/v1/me/player/currently-playing";
  let played;

  try {
    played = await fetch(URL, options);
    played = await played.json();
    return played;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getUserInfo = async options => {
  const result = await Promise.all([
    getUser(options),
    getCurrentlyPlaying(options)
  ]);

  function parseResponse(resp) {
    if (!resp[0]) {
      return { missing: true };
    } else if (resp[0].error || resp[1].error) {
      if (resp[0].error.status === 401 || resp[1].error.status === 401) {
        throw new Error(401);
      }
    }
    const name = resp[0].display_name;
    const { id } = resp[1].item;
    const isPlaying = resp[1].is_playing;
    const artist = resp[1].item.artists[0].name;
    const song = resp[1].item.name;
    const duration = convertMillisToMinsSecs(resp[1].item.duration_ms);

    return { name, id: isPlaying ? id : "", isPlaying, song, artist, duration };
  }
  return parseResponse(result);
};

const getSongStats = async (id, options) => {
  const URL = `https://api.spotify.com/v1/audio-features/${id}`;
  function parseStats(data) {
    const keyDict = {
      0: "C",
      1: "C# / Db",
      2: "D",
      3: "D# / Eb",
      4: "E",
      5: "F",
      6: "F# / Gb",
      7: "G",
      8: "G# / Ab",
      9: "A",
      10: "A# / Bb",
      11: "B"
    };

    const parseDance = function(danceIndex) {
      let danceability;
      const index = danceIndex.toFixed(2);

      if (index <= 0.25) {
        danceability = "#476dc5";
      } else if (index <= 0.5) {
        danceability = "#118f19";
      } else if (index <= 0.75) {
        danceability = "#e65f09";
      } else if (index <= 1) {
        danceability = "#c91b26";
      }
      return danceability;
    };

    const key = keyDict[data.key];
    const tempo = Math.floor(data.tempo);
    const danceability = parseDance(data.danceability);
    return [tempo, key, danceability];
  }

  let stats;

  try {
    stats = await fetch(URL, options);
    stats = await stats.json();
    return parseStats(stats);
  } catch (e) {
    throw new Error(e.message);
  }
};

export { getUserInfo, getSongStats, getCurrentlyPlaying };
