import { createLocalVue } from '@vue/test-utils';
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
      new Vuex.Store({});
      localVue.use(plugin);
    }).not.toThrow();
  });
});
