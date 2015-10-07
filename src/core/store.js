import Baobab from 'baobab';
import Rx from 'rx';

export default function createStore() {
  const tree = new Baobab();

  const select = (cursor) => (...path) => {
    cursor = cursor.select(path);

    const self = {
      select: select(cursor),

      observe() {
        return Rx.Observable.create((observer) => {
          cursor.on('update', () => observer.onNext(cursor.get()));
        });
      },

      set(key) {
        return (data) => {
          if (key) {
            cursor.set(key, data);
          } else {
            cursor.set(data);
          }

          return self;
        };
      }
    };

    return self;
  };

  return select(tree)();
}
