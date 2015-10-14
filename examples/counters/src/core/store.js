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

    return Rx.Observable.create((observer) => {
      source.on('update', () => observer.onNext(source.get()));
    });
  };

  const set = (...path) => (data) => {
    return Rx.Observable.just(data)
      .do(() => cursor.set(path, data));
  };

  const merge = (...path) => (data) => {
    return Rx.Observable.just(data)
      .do(() => cursor.merge(path, data));
  };

  const update = (path, fn) => (data) => {
    return Rx.Observable.just(data)
      .do(() => cursor.set(path, fn(cursor.get(path), data)));
  };

  const get = (...path) => () => {
    return Rx.Observable.just(cursor.get(path));
  };

  const fork = (...path) => {
    return createStore(cursor.select(...path));
  };

  return { observe, set, get, merge, update, fork };
}
