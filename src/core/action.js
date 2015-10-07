import Rx from 'rx';

export function createHandlerAction() {
  const subject = new Rx.Subject();

  const action = (data) => {
    subject.onNext(data);
  };

  action.observe = () => {
    return subject;
  };

  return action;
}
