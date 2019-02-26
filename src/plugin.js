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

module.exports = {
  install(Vue, options = {}) {
    if (!options.$store) {
      throw new Error("A valid store must be passed as a plugin option");
    }

    // Registering local module 
    options.$store.registerModule('undoRedo', VuexUndoRedoModule);

    Vue.mixin({
      data() {
        return {
          $undoRedo: {
            done: [],
            undone: [],
            newMutation: true,
            ignoreMutations: options.ignoreMutations || []
          }
        };
      },
      created() {
        if (this.$store) {
          this.$store.subscribe(mutation => {
            if (mutation.type !== EMPTY_STATE && this.$data.$undoRedo.ignoreMutations.indexOf(mutation.type) === -1) {
              this.$data.$undoRedo.done.push(mutation);
            }
            if (this.$data.$undoRedo.newMutation) {
              this.$data.$undoRedo.undone = [];
            }
          });
        }
      },
      computed: {
        $canRedo() {
          return this.$data.$undoRedo.undone.length;
        },
        $canUndo() {
          return this.$data.$undoRedo.done.length;
        }
      },
      methods: {
        $redo() {
          let commit = this.$data.$undoRedo.undone.pop();
          this.$data.$undoRedo.newMutation = false;
          switch (typeof commit.payload) {
            case 'object':
              this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
              break;
            default:
              this.$store.commit(`${commit.type}`, commit.payload);
          }
          this.$data.$undoRedo.newMutation = true;
        },
        $undo(tagName) {
          if (tagName && typeof tagName === 'string') {
            let candidatesMutations = this.$data.$undoRedo.done.filter(mutation => mutation.type === TAG_UNDO_MUTATION && mutation.payload === tagName);
            let lastMutation = candidatesMutations.length ? candidatesMutations.pop() : null;
            if (lastMutation !== null) {
              let mutationIdx = this.$data.$undoRedo.done.indexOf(lastMutation);
              let len = this.$data.$undoRedo.done.length;
              for (let i = len - 1; i > mutationIdx + 1; i--) {
                this.$data.$undoRedo.undone.push(this.$data.$undoRedo.done.pop());
              }
              this.$data.$undoRedo.done.pop(); // Poppin' the TAGGED mutation 
            }
          } else {
            this.$data.$undoRedo.undone.push(this.$data.$undoRedo.done.pop());
          }

          // Replaying mutations
          this.$data.$undoRedo.newMutation = false;
          this.$store.commit(EMPTY_STATE);
          this.$data.$undoRedo.done.forEach(mutation => {
            switch (typeof mutation.payload) {
              case 'object':
                this.$store.commit(`${mutation.type}`, Object.assign({}, mutation.payload));
                break;
              default:
                this.$store.commit(`${mutation.type}`, mutation.payload);
            }
            this.$data.$undoRedo.done.pop();
          });
          this.$data.$undoRedo.newMutation = true;
        }
      }
    });
  },
  TAG_UNDO_MUTATION: TAG_UNDO_MUTATION
}