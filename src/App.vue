<template>
  <div id="app">
    <Welcome v-if="!token" :handleAuth="authIn" />
    <Results v-if="token && data" :data="data" :songInfo="songInfo" :annots="annots" />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import Welcome from "./components/welcome";
import Results from "./components/results";
import URL from "./constants/auth";
import {
  getUserInfo,
  getSongStats,
  getCurrentlyPlaying
} from "./api/spotify-api";
import getAnnots from "./api/genius-api";
import { convertMillisToMinsSecs, sleep } from "./constants/utils.js";

export default {
  name: "app",
  components: {
    Welcome,
    Results
  },
  data() {
    return {
      token: null,
      error: null,
      data: null,
      songInfo: null,
      annots: null
    };
  },
  created() {
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (token) {
      this.token = token;
      this.getInfo({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return;
    }

    const error = /[#&]error=/.exec(window.location.hash);

    if (error) {
      this.error = "Error signing in. Please try again later.";
    }

    const match = /[#&]access_token=([^&]*)/.exec(window.location.hash);
    if (match) {
      const accessToken = decodeURIComponent(match[1].replace(/\+g/, " "));
      this.token = accessToken;
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
      this.getInfo(options);
      localStorage.setItem("ACCESS_TOKEN", accessToken);
      window.location.hash = "";
    }
  },
  methods: {
    authIn() {
      window.location = URL;
    },
    async getInfo(options) {
      try {
        const data = await getUserInfo(options);
        if (data.isPlaying) {
          this.getStats(data.id, options);
        }
        this.pollSong(options);
        this.data = data;
      } catch (e) {
        if (e.message === "401") {
          this.token = null;
          localStorage.removeItem("ACCESS_TOKEN");
        } else {
          this.error = "Error fetching data. Please try again later.";
        }
      }
    },
    async getStats(id, options) {
      try {
        const stats = await getSongStats(id, options);
        this.songInfo = stats;
        this.getAnnotations();
      } catch (e) {
        this.error = "Error fetching song stats. Please try again later.";
      }
    },
    async getAnnotations() {
      try {
        const { song, artist } = this.data;
        const annots = await getAnnots({ song, artist });
        this.annots = annots;
      } catch (e) {
        this.error = "Error fetching annotations. Please try again later.";
      }
    },
    async pollSong(options) {
      while (true) {
        try {
          const result = await getCurrentlyPlaying(options);
          if (result.item) {
            const res = {
              id: result.is_playing ? result.item.id : "",
              song: result.item.name,
              isPlaying: result.is_playing,
              artist: result.item.artists[0].name,
              duration: convertMillisToMinsSecs(result.item.duration_ms),
              name: this.data.name
            };

            if (this.data.id !== result.item.id && result.is_playing) {
              this.data = res;
              this.songInfo = null;
              this.annots = null;
              this.getStats(result.item.id, options);
              this.getAnnotations();
            } else if (!result.is_playing) {
              this.data = res;
              this.songInfo = null;
              this.annots = null;
            }
          }
        } catch (e) {
          this.error = "Error polling song. Please try again later.";
        }
        await sleep(5000);
      }
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 60vh;
}

.error {
  color: #c91b26;
}

a {
  color: #476dc5;
  text-decoration: none;
  transition: opacity 0.25s;
}

a:hover {
  opacity: 0.7;
}

iframe,
img {
  max-width: 100%;
}
</style>
