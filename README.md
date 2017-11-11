# vuex-undo-redo

A Vue.js plugin that allows you to undo or redo a mutation.

> The building of this plugin is documented in the article *[Create A Vuex Undo/Redo For VueJS](https://vuejsdevelopers.com/2017/11/13/vue-js-vuex-undo-redo/)*

## Live demos

[![Edit Vuex Undo/Redo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vjo3xlpyny)

There's also a demo in [this Codepen](https://codepen.io/anthonygore/pen/NwGmqJ). The source code for the demo is [here](https://github.com/anthonygore/vuex-undo-redo-example).

## Installation

```js
npm i --save-dev vuex-undo-redo
```

### Browser

```html
<script type="text/javascript" src="node_modules/vuex-undo-redo/dist/vuex-undo-redo.min.js"></script>
```

### Module

```js
import VuexUndoRedo from 'vuex-undo-redo';
```

## Usage

Since it's a plugin, use it like:

```js
Vue.use(VuexUndoRedo);
```

You must, of course, have a Vuex store installed. This Vuex store must implement a mutation `emptyState` which should revert the store back to the initial state e.g.:

```js
new Vuex.Store({
  state: {
    myVal: null
  },
  mutations: {
    emptyState() {
      this.replaceState({ myval: null });       
    }
  }
});
```

## API

### Computed properties

`canUndo` a boolean which tells you if the state is undo-able

`canRedo` a boolean which tells you if the state is redo-able

### Methods

`undo` undoes the last mutation

`redo` redoes the last mutation
