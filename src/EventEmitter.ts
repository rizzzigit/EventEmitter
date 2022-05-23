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

export class EventEmitter<T extends EventInterface> {
  public constructor (options?: Partial<EventEmitterOptions>) {
    this.options = {
      requireErrorHandling: false,
      ...options
    }
    this.listeners = <EventMap<T>> {}
  }

  public readonly options: EventEmitterOptions
  public readonly listeners: EventMap<T>

  public on <K extends keyof T> (event: K, listener: (...args: T[K]) => Promise<void> | void, once: boolean = false) {
    (this.listeners[event] || (this.listeners[event] = [])).push({ once, listener })
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
  }

  public async emit <K extends keyof T> (event: K, ...args: T[K]) {
    const listeners = this.listeners[event]

    if (listeners?.length) {
      await Promise.all(listeners.map(async (entry) => {
        if (entry.once) {
          listeners.splice(listeners.indexOf(entry), 1)
        }

        await entry.listener(...args)
      }))

      return true
    }

    if (event === 'error') { throw args[0] }
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
