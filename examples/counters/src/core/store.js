import Baobab from 'baobab';
import Rx from 'rx';

export default function createStore(cursor) {
  if (!cursor) {
    const tree = new Baobab();
    cursor = tree.select();
    // TODO: remove
    window.cursor = cursor;
  }

  const observe = (...path) => (
    Rx.Observable.create((observer) => {
      const source = cursor.select(path);
      source.on('update', () =>
        observer.onNext(source.get())
      );
    })
  );

  const set = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.set(path, data))
  );

  const merge = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.merge(path, data))
  );

  const update = (path, fn) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.set(path, fn(cursor.get(path), data)))
  );

  const get = (...path) => () => (
    Rx.Observable.just(cursor.get(path))
  );

  const fork = (...path) => (
    createStore(cursor.select(...path))
  );

  return { observe, set, get, merge, update, fork };
}
