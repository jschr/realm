import Baobab from 'baobab';
import Rx from 'rx';

export default function createStore(tree) {
  if (!tree) {
    tree = new Baobab();
    window.tree = tree;
  }

  const observe = (...path) => {
    const source = tree.select(path);
    // console.log(path);
    // const watcher = tree.watch(path);

    return Rx.Observable.create((observer) => {
      source.on('update', () => observer.onNext(source.get()));
      // tree.on('update', () => observer.onNext(watcher.get()));
    });
  };

  const set = (...path) => {
    const setter = (data) => {
      // TODO: can tree.set cause an error? If so handle it.
      tree.set(path, data);

      return Rx.Observable.just(data);
    };

    setter.to = (data) => () => setter(data);

    return setter;
  };

  const merge = (...path) => (data) => {
    // TODO: can tree.merge cause an error? If so handle it.
    tree.merge(path, data);

    return Rx.Observable.just(data);
  };

  const get = (...path) => () => {
    return Rx.Observable.just(tree.get(path));
  };

  const fork = (...path) => {
    return createStore(tree.select(...path));
  };

  return { observe, set, get, merge, fork };
}
