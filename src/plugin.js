const EMPTY_STATE = 'emptyState';

module.exports = {
  install(Vue, options) {
    Vue.mixin({
      data() {
        return {
          done: [],
          undone: [],
          newMutation: true,
          groupActions: options.groupActions || []
        };
      },
      created() {
        this.$store.subscribe(mutation => {
          if (mutation.type !== EMPTY_STATE) {
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
        _isGroupedAction(action) {
          return this.groupActions.indexOf(action.type) !== -1
        },
        _redoGrouped(type) {
          while (this.undone.length > 0 && this.undone[this.undone.length - 1].type === type) {
            let commit = this.undone.pop();
            this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
          }
        },
        redo() {
          this.newMutation = false;
          let commit = this.undone.pop();
          this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));

          // If the action is a grouped action, redo the rest
          if (this._isGroupedAction(commit)) {
            this._redoGrouped(commit.type)
          }

          this.newMutation = true;
        },
        undo() {
          const commit = this.done.pop()
          this.undone.push(commit);

          if (this._isGroupedAction(commit)) {
            while (this.done[this.done.length - 1].type === commit.type) {
              this.undone.push(this.done.pop())
            }
          }

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
