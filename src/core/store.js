import Baobab from 'baobab';
import Rx from 'rx';

export default function createStore() {
  const tree = new Baobab();

  window.store = tree;

  const observe = (...path) => {
    const source = tree.select(path);

    return Rx.Observable.create((observer) => {
      source.on('update', () => observer.onNext(source.get()));
    });
  };

  const set = (...path) => (data) => {
    // TODO: can tree.set cause an error? If so handle it.
    tree.set(path, data);

    return Rx.Observable.just(data);
  };

  const get = (...path) => () => {
    return Rx.Observable.just(tree.get(path));
  };

  return { observe, set, get };
}
