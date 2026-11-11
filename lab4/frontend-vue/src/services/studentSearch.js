import { Observable, Subject, timer } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { getStudents } from './api'

export function createStudentSearch(onLoading, onResult, onError) {
    const changes$ = new Subject()

    const subscription = changes$.pipe(
        switchMap(change => timer(change.live ? 400 : 0).pipe(
            switchMap(() => new Observable(subscriber => {
                const controller = new AbortController()
                onLoading()

                getStudents(change.params, controller.signal)
                    .then(students => {
                        subscriber.next({ students })
                        subscriber.complete()
                    })
                    .catch(error => {
                        if (!controller.signal.aborted) {
                            subscriber.next({ error })
                            subscriber.complete()
                        }
                    })

                return () => controller.abort()
            }))
        ))
    ).subscribe(result => {
        if (result.error) onError(result.error)
        else onResult(result.students)
    })

    return {
        search(params, live = false) {
            changes$.next({ params, live })
        },
        stop() {
            subscription.unsubscribe()
            changes$.complete()
        }
    }
}
