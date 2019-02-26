const EMPTY_STATE = 'emptyState';

module.exports = {
  install(Vue, options = {}) {
    if (!Vue._installedPlugins.find(plugin => plugin.Store)) {
      throw new Error("VuexUndoRedo plugin must be installed after the Vuex plugin.")
    }
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
            this.$data.$undoRedo.undone.push(this.$data.$undoRedo.done.pop());
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
}
