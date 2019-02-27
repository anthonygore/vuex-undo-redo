# vuex-undo-redo

A Vue.js plugin that allows you to undo or redo a mutation.

> The building of this plugin is documented in the article _[Create A Vuex Undo/Redo For VueJS](https://vuejsdevelopers.com/2017/11/13/vue-js-vuex-undo-redo/)_

## Live demos

[![Edit Vuex Undo/Redo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vjo3xlpyny)

There's also a demo in [this Codepen](https://codepen.io/anthonygore/pen/NwGmqJ). The source code for the demo is [here](https://github.com/anthonygore/vuex-undo-redo-example).

## Installation

```js
npm i --save-dev vuex-undo-redo
```

### Browser

```html
<script
    type="text/javascript"
    src="node_modules/vuex-undo-redo/dist/vuex-undo-redo.min.js"
></script>
```

### Module

```js
import VuexUndoRedo from 'vuex-undo-redo';
```

## Usage

You must, of course, have the Vuex plugin installed, and it must be installed before this plugin.

The store needs then to be passed as an options to the plugin when installing:

```js
let store = new Vuex.Store({
    state: {
        myVal: null
    },
    mutations: {
        // ...
    }
});
Vue.use(VuexUndoRedo, { $store: store });
```

### Empty State handling

The plugin works by re-initializing the Store state to an "empty state". In order to do so, you need to provide the empty state for your data (and modules, if any).
This can be done in 3 different ways:

1. You can pass the empty state as a plain JS object, through the plugin option:

```js
Vue.use(VuexUndoRedo, {
    $store: store,
    emptyState: {
        myval: null
    }
});
```

2. If you want to add more logic to the state emptying, you can pass a function through the plugin option:

```js
Vue.use(VuexUndoRedo, {
    $store: store,
    emptyState: (undoRedoState, store) => {
        store.replaceState(
            Object.assign({}, undoRedoState, {
                myVal: 0
            })
        );
    }
});
```

The function can take 2 arguments:

-   the `undoRedoState` object, containing all state created by the plugin (so that you can merge it with your state) ;
-   the `store` instance.

3. You can implement yourself the `emptyState` mutation, which should revert the store back to the initial state e.g.:

```js
let store = new Vuex.Store({
    state: {
        myVal: null
    },
    mutations: {
        emptyState(state) {
            this.replaceState({
                myval: null,
                undoRedo: { lastUndoRedoTag: null }
            });
        }
    }
});
Vue.use(VuexUndoRedo, { $store: store });
```

_Note:_ when using this method, you **must** reset the `state.undoRedo` module yourself. Otherwise, the Tag feature will not work.

### Ignoring mutations

Occasionally, you may want to perform mutations without including them in the undo history (say you are working on an image editor and the user toggles grid visibility - you probably do not want this in undo history). The plugin has an `ignoredMutations` setting to leave these mutations out of the history:

```js
Vue.use(VuexUndoRedo, { $store: store, ignoreMutations: ['toggleGrid'] });
```

It's worth noting that this only means the mutations will not be recorded in the undo history. You must still manually manage your state object in the `emptyState` option:

```js
emptyState(state) {
  this.replaceState({ myval: null, showGrid: state.showGrid });
}
```

### Tagging a commit

From version `2.0.0`, you can now undo a set of changes using tags.  
You first need to tag a version of the store state through the special `VuexUndoRedo.TAG_UNDO_MUTATION` mutation with a given string. Then, you can later call `$undo('MyTag')` to undo the mutations between the `myTag` commit and now.  
This is useful for instance if you want to implement a view / edit mode switch: you can tag your state when you enter edit mode, and undo everything from the tag if user hits "Cancel" instead of "Save".

The tagging is done using a simple commit to the store:

```js
import { TAG_UNDO_MUTATION } from 'vuex-undo-redo';

this.$store.commit(TAG_UNDO_MUTATION, 'MyTag');
```

And if you want to undo everything done between this commit and the present state, you might just call:

```js
this.$undo('MyTag');
```

If the same _string_ is used multiple times (say `n`), the plugin will first undo mutations between the last instance (`n`) of this tag and now. The next `undo` called with the same tag _string_ will then cancel then mutations between `n-1` and now, etc.

## API

### Options

`$store` (**mandatory**) The newly created store  
`emptyState` (**mandatory** if you plan on using the Tag feature, _optional_ otherwise) A method or object to handle the empty state.
`ignoredMutations` (_optional_) An array of mutations that the plugin will ignore

### Computed properties

`$canUndo` a boolean which tells you if the state is undo-able

`$canRedo` a boolean which tells you if the state is redo-able

### Methods

`$undo` undoes the last mutation

`$undo(tagName)` undoes the mutations from the given `tagName`

`$redo` redoes the last mutation
