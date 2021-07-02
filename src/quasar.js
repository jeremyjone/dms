import Vue from "vue";

import "./styles/quasar.styl";
import "quasar/dist/quasar.ie.polyfills";
import lang from "quasar/lang/zh-hans.js";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import { Quasar } from "quasar";
import {
  Notify,
  Loading,
  Dialog,
  Ripple,
  LocalStorage,
  QSpinnerDots
} from "quasar";

Vue.use(Quasar, {
  config: {
    loading: {
      spinner: QSpinnerDots
    }
  },
  directives: {
    Ripple
  },
  plugins: {
    Notify,
    Loading,
    Dialog,
    LocalStorage
  },
  lang: lang
});
