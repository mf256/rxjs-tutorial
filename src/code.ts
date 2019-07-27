import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { merge } from 'rxjs/observable/merge';

import { Subject } from 'rxjs/Subject';
const subject = new Subject();

// recevie previous value
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// const subject = new BehaviorSubject('Hello');

// receive specified number of values
// import { ReplaySubject } from 'rxjs/ReplaySubject';
// const subject = new ReplaySubject(1);

// receive value after complete
// import { AsyncSubject } from 'rxjs/AsyncSubject';
// const subject = new AsyncSubject();

setTimeout(() => {
  // Observables & Subscriptions
  const observable = Observable.create((observer: any) => {
    try {
      observer.next('Hey guys!');
      observer.next('How are you?');
      setInterval(() => {
        observer.next('Good');
      }, 2000);
      // observer.complete();
      // observer.next('This will not send.');
    } catch (err) {
      observer.error(err);
    }
  });
  // }).share(); // hot observable (you lost values emited before creating subcription)

  const observer = observable.subscribe(
    (x: string) => addItem(x),
    (error: string) => addItem(error),
    (complete: string) => addItem('Completed')
  );

  const observer2 = observable.subscribe(
    (x: string) => addItem('[2] ' + x),
    (error: string) => addItem(error),
    (complete: string) => addItem('Completed')
  );

  observer.add(observer2); // add child subscriptions
  let observer3: any;
  setTimeout(() => {
    observer3 = observable.subscribe((x: any) => addItem('[3] ' + x));
  }, 2001);

  setTimeout(() => {
    observer.unsubscribe();
    observer3.unsubscribe();
  }, 6001);
}, 100);

setTimeout(() => {
  // Operators
  clean();
  const opObservable = Observable.create((observer: any) => {
    observer.next('Hey guys!');
  });

  const opObservable2 = Observable.create((observer: any) => {
    observer.next('How is it going?');
  });

  const newObs = merge(opObservable, opObservable2).map((value: string) =>
    value.toUpperCase()
  );
  newObs.subscribe(
    (x: string) => addItem(x),
    (error: string) => addItem(error),
    () => addItem('Completed')
  );
}, 9000);

// Subject acts both as an observer and as an Observable
setTimeout(() => {
  clean();
  subject.subscribe(
    (x: string) => addItem('[1] ' + x),
    (error: string) => addItem(error),
    () => addItem('Completed')
  );

  subject.next('The first thing has been sent');
  subject.next('...Observer 2 is about to subscribe...');

  const subjectObserver2 = subject.subscribe(
    (x: string) => addItem('[2] ' + x),
    (error: string) => addItem(error),
    () => addItem('Completed')
  );

  subject.next('The second thing has been sent');
  subject.next('A third thing has been sent');

  subject.complete();

  subjectObserver2.unsubscribe();
  subject.next('A final thing has been sent');
}, 11000);

function addItem(val: string) {
  const node = document.createElement('li');
  const textnode = document.createTextNode(val);
  node.className = 'alert alert-dismissible alert-secondary';
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node);
}

function clean() {
  document.getElementById('output').innerHTML = '';
}
