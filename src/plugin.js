import Clock from './Clock.vue';

module.exports = {
  install: function (Vue, options) {
    Vue.component('vue-clock', Clock);
  }
};
