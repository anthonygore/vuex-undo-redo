import {
  createLocalVue,
  shallowMount
} from '@vue/test-utils';
import Vuex from "vuex";
import plugin from '../plugin';

describe('plugin', () => {
  it('should throw error if installed before new Vuex.Store is called', () => {
    const localVue = createLocalVue();
    expect(() => {
      localVue.use(plugin);
    }).toThrow();
  });

  it('should not throw error if installed after new Vuex.Store is called', () => {
    const localVue = createLocalVue();
    expect(() => {
      localVue.use(Vuex);
      let store = new Vuex.Store({});
      localVue.use(plugin, {
        $store: store
      });
    }).not.toThrow();
  });

  it('should undo/redo data property', done => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const storeConfig = {
      state: {
        myVal: 0
      },
      mutations: {
        inc(state) {
          state.myVal++;
        },
        emptyState() {
          this.replaceState({
            myVal: 0
          });
        }
      }
    };
    let store = new Vuex.Store(storeConfig);
    localVue.use(plugin, {
      $store: store
    });
    let component = {
      template: "<div></div>",
      methods: {
        inc() {
          this.$store.commit("inc");
        }
      },
      created() {
        expect(this.$store.state.myVal).toBe(0);
        this.inc();
        expect(this.$store.state.myVal).toBe(1);
        this.$undo();
        expect(this.$store.state.myVal).toBe(0);
        this.$redo();
        expect(this.$store.state.myVal).toBe(1);
        done();
      }
    };
    shallowMount(component, {
      localVue,
      store
    });
  });

  it('should undo to tagged value', done => {

    const localVue = createLocalVue();
    localVue.use(Vuex);
    const storeConfig = {
      state: {
        myVal: 0
      },
      mutations: {
        inc(state) {
          state.myVal++;
        },
        emptyState() {
          this.replaceState({
            myVal: 0,
            undoRedo: {
              lastUndoRedoTag: null
            },
          });
        }
      }
    };
    let store = new Vuex.Store(storeConfig);
    localVue.use(plugin, {
      $store: store
    });
    let component = {
      template: "<div></div>",
      methods: {
        inc() {
          this.$store.commit("inc");
        }
      },
      created() {
        expect(this.$store.state.myVal).toBe(0);
        this.inc();
        this.inc();
        expect(this.$store.state.myVal).toBe(2);
        this.$store.commit(plugin.TAG_UNDO_MUTATION, 'MyTag');
        this.inc();
        this.inc();
        expect(this.$store.state.myVal).toBe(4);
        this.$undo('MyTag');
        expect(this.$store.state.myVal).toBe(2);
        done();
      }
    };
    shallowMount(component, {
      localVue,
      store
    });
  });

  it('should undo to same tagged value multiple times', done => {

    const localVue = createLocalVue();
    localVue.use(Vuex);
    const storeConfig = {
      state: {
        myVal: 0
      },
      mutations: {
        inc(state) {
          state.myVal++;
        },
        emptyState() {
          this.replaceState({
            myVal: 0,
            undoRedo: {
              lastUndoRedoTag: null
            },
          });
        }
      }
    };
    let store = new Vuex.Store(storeConfig);
    localVue.use(plugin, {
      $store: store
    });
    let component = {
      template: "<div></div>",
      methods: {
        inc() {
          this.$store.commit("inc");
        }
      },
      created() {
        expect(this.$store.state.myVal).toBe(0);
        this.$store.commit(plugin.TAG_UNDO_MUTATION, 'MyTag');
        this.inc();
        this.inc();
        expect(this.$store.state.myVal).toBe(2);
        this.$store.commit(plugin.TAG_UNDO_MUTATION, 'MyTag');
        this.inc();
        this.inc();
        expect(this.$store.state.myVal).toBe(4);
        this.$store.commit(plugin.TAG_UNDO_MUTATION, 'MyTag');
        this.inc();
        expect(this.$store.state.myVal).toBe(5);
        this.$undo('MyTag');
        expect(this.$store.state.myVal).toBe(4);
        this.$undo('MyTag');
        expect(this.$store.state.myVal).toBe(2);
        this.$undo('MyTag');
        expect(this.$store.state.myVal).toBe(0);
        done();
      }
    };
    shallowMount(component, {
      localVue,
      store
    });
  });

  it('should ignore undo if tag not found', done => {

    const localVue = createLocalVue();
    localVue.use(Vuex);
    const storeConfig = {
      state: {
        myVal: 0
      },
      mutations: {
        inc(state) {
          state.myVal++;
        },
        emptyState() {
          this.replaceState({
            myVal: 0,
            undoRedo: {
              lastUndoRedoTag: null
            },
          });
        }
      }
    };
    let store = new Vuex.Store(storeConfig);
    localVue.use(plugin, {
      $store: store
    });
    let component = {
      template: "<div></div>",
      methods: {
        inc() {
          this.$store.commit("inc");
        }
      },
      created() {
        expect(this.$store.state.myVal).toBe(0);
        this.inc();
        this.inc();
        expect(this.$store.state.myVal).toBe(2);
        this.$undo('MyTag');
        expect(this.$store.state.myVal).toBe(2);
        done();
      }
    };
    shallowMount(component, {
      localVue,
      store
    });
  });
});