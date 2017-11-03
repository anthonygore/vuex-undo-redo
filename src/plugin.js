export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          done: [],
          undone: []
        };
      },
      created() {
        this.$store.subscribe(mutation => this.done.push(mutation));
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
          this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
        },
        undo() {
          this.undone.push(this.done.pop());
          this.$store.replaceState('emptyState');
          this.done.forEach(m => {
            this.$store.commit(`${m.type}`, Object.assign({}, m.payload));
            this.done.pop();
          });
        }
      }
    });
  },
}
