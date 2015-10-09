import Baobab from 'baobab';
import Rx from 'rx';

export default function createStore(cursor) {
  if (!cursor) {
    const tree = new Baobab();
    cursor = tree.select();
    window.cursor = cursor;
  }

  const observe = (...path) => {
    const source = cursor.select(path);
    // console.log(path);
    // const watcher = cursor.watch(path);

    return Rx.Observable.create((observer) => {
      source.on('update', () => observer.onNext(source.get()));
      // cursor.on('update', () => observer.onNext(watcher.get()));
    });
  };

  const set = (...path) => {
    const setter = (data) => {
      // TODO: can cursor.set cause an error? If so handle it.
      cursor.set(path, data);

      return Rx.Observable.just(data);
    };

    setter.to = (data) => () => setter(data);

    return setter;
  };

  const merge = (...path) => (data) => {
    // TODO: can cursor.merge cause an error? If so handle it.
    cursor.merge(path, data);

    return Rx.Observable.just(data);
  };

  const get = (...path) => () => {
    return Rx.Observable.just(cursor.get(path));
  };

  const fork = (...path) => {
    return createStore(cursor.select(...path));
  };

  return { observe, set, get, merge, fork };
}
