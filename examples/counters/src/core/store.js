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

  const get = (...path) => () => (
    Rx.Observable.just(cursor.get(path))
  );

  const set = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.set(path, data))
  );

  const push = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.push(path, data))
  );

  const unshift = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.unshift(path, data))
  );

  const splice = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.splice(path, data))
  );

  const concat = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.concat(path, data))
  );

  const merge = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.merge(path, data))
  );

  const deepMerge = (...path) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.deepMerge(path, data))
  );

  const update = (path, fn) => (data) => (
    Rx.Observable.just(data)
      .do(() => cursor.set(path, fn(cursor.get(path), data)))
  );

  const fork = (...path) => (
    createStore(cursor.select(...path))
  );

  return { observe, get, set, push, unshift, splice, concat, merge, deepMerge, update, fork };
}
