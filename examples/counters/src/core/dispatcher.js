import Rx from 'rx';


export default class Dispatcher {
  constructor() {
    this.subject = new Rx.Subject();
  }

  observe() {
    return this.subject.asObservable();
  }

  dispatch(type) {
    return (payload) => {
      this.subject.onNext({ type, payload });
    };
  }
}


export const forward = (dispatch, forwardType) => {
  return (type) => (payload) => {
    return dispatch(forwardType)({ type, payload });
  };
};