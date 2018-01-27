const EMPTY_STATE = 'emptyState';

module.exports = {
  install(Vue, options) {
    Vue.mixin({
      data() {
        return {
          done: [],
          undone: [],
          newMutation: true,
          ignoreActions: options.ignoreActions || []
        };
      },
      created() {
        this.$store.subscribe(mutation => {
          if (mutation.type !== EMPTY_STATE && this.ignoreActions.indexOf(mutation.type) === -1) {
            this.done.push(mutation);
          }
          if (this.newMutation) {
            this.undone = [];
          }
        });
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
          this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
          this.newMutation = true;
        },
        undo() {
          this.undone.push(this.done.pop());
          this.newMutation = false;
          this.$store.commit(EMPTY_STATE);
          this.done.forEach(mutation => {
            this.$store.commit(`${mutation.type}`, Object.assign({}, mutation.payload));
            this.done.pop();
          });
          this.newMutation = true;
        }
      }
    });
  },
}
