# vuex-undo-redo

A Vue.js plugin that allows you to undo or redo a mutation.

Check out this Codepen for an example implementation

<p data-height="265" data-theme-id="0" data-slug-hash="NwGmqJ" data-default-tab="result" data-user="anthonygore" data-embed-version="2" data-pen-title="Vuex Undo/Redo" class="codepen">See the Pen <a href="https://codepen.io/anthonygore/pen/NwGmqJ/">Vuex Undo/Redo</a> by Anthony (<a href="https://codepen.io/anthonygore">@anthonygore</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Installation

```js
npm i --save-dev vuex-undo-redo
```

### Browser

Include the script file, then install the component with `Vue.use(VueClock);` e.g.:

```html
<script type="text/javascript" src="node_modules/vuejs/dist/vue.min.js"></script>
<script type="text/javascript" src="node_modules/vuex-undo-redo/dist/vuex-undo-redo.min.js"></script>
<script type="text/javascript">
  Vue.use(VuexUndoRedo);
</script>
```

### Module

```js
import VueClock from 'vue-clock';
```

## Usage

You must, of course, have a Vuex store installed. This Vuex store must implement a mutation `emptyState` which should revert the store back to the initial state e.g.:

```js
new Vuex.Store({
  state: {
    myVal: null
  },
  mutations: {
    emptyState(state) {
      state = {
        myVal: null
      }
    }
  }
});
```

### API

Computed properties:

`canUndo` a boolean which tells you if the state is undo-able

`canRedo` a boolean which tells you if the state is redo-able

Methods:

`undo` undoes the last mutation

`redo` redoes the last mutation
