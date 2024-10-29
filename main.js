/* exported app */
let app = {
  data() {
    return {
      rid: 0,
      file: null,
      ready: false,
      playing: false,
      ended: false,
      audio: null,
      startedDate: null,
      color: null,
      remaining: null,
    };
  },
  watch: {
  },
  computed: {
    canPlay() {
      return this.ready && !this.playing;
    },
    canStop() {
      return this.ready && this.playing;
    },
  },
  methods: {
    showApp() {
      document.getElementById("app").setAttribute("style", "");
    },
    changeFile(event) {
      this.ready = false;
      this.file = URL.createObjectURL(event.target.files[0]);
      this.audio = new Audio(this.file);
      this.audio.addEventListener('ended', () => {
        this.ended = true;
        this.onStop();
      });
      this.audio.addEventListener('loadeddata', () => {
        this.ready = true;
      });
    },
    onPlay() {
      this.ended = false;
      this.playing = true;
      this.startedDate = new Date();
      setTimeout(() => this.audio.play(), 5000);
    },
    onStop() {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.playing = false;
    },
    getColor() {
      if ((this.playing && ((new Date() - this.startedDate) / 1000) <= 5)) {
        return '#f00';
      } else if (this.playing) {
        return '#0f0';
      } else if (this.ended) {
        return '#f50'
      }
    },
    getRemaining() {
      if (this.ended) {
        return '00:00';
      }
      if (!this.ready || !this.playing) {
        return '00:05';
      }
      const d1 = Math.floor((new Date() - this.startedDate) / 1000);
      if (d1 < 5) {
        return `00:${String(Math.floor(5 - d1)).padStart(2, "0")}`;
      }
      const d2 = this.audio.duration - d1 + 5;
      return `${String(Math.floor(d2 / 60)).padStart(2, "0")}:${String(Math.floor(d2) % 60).padStart(2, "0")}`;
    },
  },
  mounted: function () {
    console.log("app mounted");
    setTimeout(this.showApp);
    setInterval(() => {
      this.rid = Math.random();
      this.color = this.getColor();
      this.remaining = this.getRemaining();
      document.body.setAttribute("style", this.color ? "background: " + this.color : '');
    }, 200);
  },
};

window.onload = () => {
  app = Vue.createApp(app);
  app.mount("#app");
};
