import Rx from 'rx';


export default class Dispatcher {
  constructor() {
    this.subject = new Rx.Subject();
  }

  observe(type) {
    let stream = this.subject.asObservable();

    if (type) {
      stream = stream
        .filter((action) => action.type === type)
        .map((action) => action.payload);
    }

    return stream;
  }

  dispatch(type) {
    return (payload) => {
      this.subject.onNext({ type, payload });
    };
  }
}


export const forward = (dispatch, forwardType, forwardData) => {
  return (type) => (payload) => {
    return dispatch(forwardType)({ forward: { type, payload }, ...forwardData });
  };
};
