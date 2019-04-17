const EMPTY_STATE = 'emptyState';
const TAG_UNDO_MUTATION = 'tagUndoMutation';

const VuexUndoRedoModule = {
  state: {
    lastUndoRedoTag: null
  },
  mutations: {
    [TAG_UNDO_MUTATION]: (state, tagName) => {
      state.lastUndoRedoTag = tagName;
    }
  }
}

const getEmptyStateMutationMethod = (options) => {
  if (options.emptyState) {
    switch (typeof options.emptyState) {
      case 'function':
        return () => options.emptyState({
          undoRedo: VuexUndoRedoModule.state
        }, options.$store);
      case 'object':
        {
          return function () {
            options.$store.replaceState(Object.assign({}, options.emptyState, {
              undoRedo: VuexUndoRedoModule.state
            }));
          }
        }
    }
  }
  return null;
}


module.exports = {
  install(Vue, options = {}) {
    if (!options.$store) {
      throw new Error("A valid store must be passed as a plugin option");
    }

    let emptyStateMethod = getEmptyStateMutationMethod(options);
    if (emptyStateMethod !== null) {
      VuexUndoRedoModule.mutations[EMPTY_STATE] = emptyStateMethod;
    }

    // Registering local module 
    options.$store.registerModule('undoRedo', VuexUndoRedoModule);

    // Adding a specific namespace to the $store object (accessible
    // from any Component through this.$store)
    options.$store.$undoRedo = {
      done: [],
      undone: [],
      newMutation: true,
      ignoreMutations: options.ignoreMutations || []
    };

    // Subscribing to every mutation in the store
    options.$store.subscribe(mutation => {
      if (mutation.type !== EMPTY_STATE && options.$store.$undoRedo.ignoreMutations.indexOf(mutation.type) === -1) {
        options.$store.$undoRedo.done.push(mutation);
      }
      if (options.$store.$undoRedo.newMutation) {
        options.$store.$undoRedo.undone = [];
      }
    });

    // Adding computed & methods to any Vue Component
    Vue.mixin({
      computed: {
        canRedo() {
          return this.$store.$undoRedo.undone.length;
        },
        canUndo() {
          return this.$store.$undoRedo.done.length;
        }
      },
      methods: {
        redo() {
          let commit = this.$store.$undoRedo.undone.pop();
          this.$store.$undoRedo.newMutation = false;
          switch (typeof commit.payload) {
            case 'object':
              this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
              break;
            default:
              this.$store.commit(`${commit.type}`, commit.payload);
          }
          this.$store.$undoRedo.newMutation = true;
        },
        undo(tagName) {
          if (tagName && typeof tagName === 'string') {
            let candidatesMutations = this.$store.$undoRedo.done.filter(mutation => mutation.type === TAG_UNDO_MUTATION && mutation.payload === tagName);
            let lastMutation = candidatesMutations.length ? candidatesMutations.pop() : null;
            if (lastMutation !== null) {
              let mutationIdx = this.$store.$undoRedo.done.indexOf(lastMutation);
              let len = this.$store.$undoRedo.done.length;
              for (let i = len - 1; i > mutationIdx; i--) {
                this.$store.$undoRedo.undone.push(this.$store.$undoRedo.done.pop());
              }
              this.$store.$undoRedo.done.pop(); // Poppin' the TAGGED mutation 
            } else if (process.env.NODE_ENV !== 'production') {
              console.warn(`TAG '${tagName}' not found in undo: ignoring...`);
              return;
            }
          } else {
            this.$store.$undoRedo.undone.push(this.$store.$undoRedo.done.pop());
          }

          // Replaying mutations
          this.$store.$undoRedo.newMutation = false;
          this.$store.commit(EMPTY_STATE);
          this.$store.$undoRedo.done.forEach(mutation => {
            switch (typeof mutation.payload) {
              case 'object':
                this.$store.commit(`${mutation.type}`, Object.assign({}, mutation.payload));
                break;
              default:
                this.$store.commit(`${mutation.type}`, mutation.payload);
            }
            this.$store.$undoRedo.done.pop();
          });
          this.$store.$undoRedo.newMutation = true;
        }
      }
    });
  },
  TAG_UNDO_MUTATION: TAG_UNDO_MUTATION
}