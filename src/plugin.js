const EMPTY_STATE = 'emptyState';

module.exports = {
  install(Vue, options = {}) {
    if (!Vue._installedPlugins.find(plugin => plugin.Store)) {
      throw new Error("VuexUndoRedo plugin must be installed after the Vuex plugin.")
    }
    Vue.mixin({
      data() {
        return {
          done: [],
          undone: [],
          newMutation: true,
          ignoreMutations: options.ignoreMutations|| []
        };
      },
      created() {
        if (this.$store) {
          this.$store.subscribe(mutation => {
            if (mutation.type !== EMPTY_STATE && this.ignoreMutations.indexOf(mutation.type) === -1) {
              this.done.push(mutation);
            }
            if (this.newMutation) {
              this.undone = [];
            }
          });
        }
      },
      computed: {
        canRedo() {
          return this.undone.length;
        },
        canUndo() {
          return this.done.length;
        }
      },
      methods: {
        redo() {
          let commit = this.undone.pop();
          this.newMutation = false;
          switch (typeof commit.payload) {
            case 'object':
              let baseObj = {};
              if (mutation.payload instanceof Array) { baseObj = [] }
              this.$store.commit(`${commit.type}`, Object.assign(baseObj, commit.payload));
              break;
            default:
              this.$store.commit(`${commit.type}`, commit.payload);
          }
          this.newMutation = true;
        },
        undo() {
          this.undone.push(this.done.pop());
          this.newMutation = false;
          this.$store.commit(EMPTY_STATE);
          this.done.forEach(mutation => {
            switch (typeof mutation.payload) {
              case 'object':
                let baseObj = {};
                if (mutation.payload instanceof Array) { baseObj = [] }
                this.$store.commit(`${mutation.type}`, Object.assign(baseObj, mutation.payload));
                break;
              default:
                this.$store.commit(`${mutation.type}`, mutation.payload);
            }
            this.done.pop();
          });
          this.newMutation = true;
        }
      }
    });
  },
}
