# vuex-undo-redo

A Vue.js plugin that allows you to undo or redo a mutation.

Check out [this Codepen](https://codepen.io/anthonygore/pen/NwGmqJ) for an example implementation.

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
