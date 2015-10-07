import Baobab from 'baobab';
import Rx from 'rx';

export default function createStore() {
  const tree = new Baobab();

  const select = (cursor) => (...path) => {
    cursor = cursor.select(path);

    return {
      select: select(cursor),

      observe() {
        const subject = new Rx.Subject();

        cursor.on('update', () => subject.onNext(cursor.get()));

        return subject;
      },

      set(key) {
        return (data) => {
          cursor.set(key, data);
        };
      }
    };
  };

  return select(tree)();
}
