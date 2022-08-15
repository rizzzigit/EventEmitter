export interface EventInterface {
  [key: string]: Array<any>
}

export type EventMap<T extends EventInterface> = {
  [K in keyof T]: Array<{
    once: boolean
    listener: (...args: T[K]) => Promise<void> | void
  }>
}

export interface EventEmitterOptions {
  requireErrorHandling: boolean
}

export class EventEmitter<T extends EventInterface, ReturnObj extends any = undefined> {
  public constructor (options?: Partial<EventEmitterOptions>, returnObj: ReturnObj = <any> undefined) {
    this.options = {
      requireErrorHandling: false,
      ...options
    }
    this.listeners = <EventMap<T>> {}
    this.returnObj = returnObj
  }

  public readonly options: EventEmitterOptions
  public readonly listeners: EventMap<T>
  public readonly returnObj: ReturnObj

  public on <K extends keyof T> (event: K, listener: (...args: T[K]) => Promise<void> | void, once: boolean = false) {
    (this.listeners[event] || (this.listeners[event] = [])).push({ once, listener })

    return this.returnObj
  }

  public once <K extends keyof T> (event: K, listener: (...args: T[K]) => Promise<void> | void) {
    return this.on(event, listener, true)
  }

  public off <K extends keyof T> (event: K, listener: (...args: T[K]) => Promise<void> | void) {
    const listeners = this.listeners[event] || (this.listeners[event] = [])
    const listenerIndex = listeners.findIndex((entry) => entry.listener === listener)

    if (listenerIndex > -1) {
      listeners.splice(listenerIndex, 1)
    }

    return this.returnObj
  }

  public async emit <K extends keyof T> (event: K, ...args: T[K]) {
    const listeners = this.listeners[event]

    if (listeners?.length) {
      const promises: Array<Promise<void>> = []

      for (let i = 0; listeners.length > i; i++) {
        const { [i]: { once, listener } } = listeners
        if (once) {
          listeners.splice(i, 1)
        }

        const output = listener(...args)
        if (output instanceof Promise) {
          promises.push(output)
        }
      }

      await Promise.all(promises)
      return true
    }

    if (this.options.requireErrorHandling && (event === 'error')) { throw args[0] }
    return false
  }

  public bind () {
    return {
      on: this.on.bind(this),
      once: this.once.bind(this),
      off: this.off.bind(this)
    }
  }
}
