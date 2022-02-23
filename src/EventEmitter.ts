export interface EventInterface {
  [key: string]: Array<any>
}

export type EventMap<T extends EventInterface> = {
  [K in keyof T]: Array<{
    once: boolean
    listener: (...args: T[K]) => Promise<void> | void
  }>
}

export class EventEmitter<T extends EventInterface> {
  public constructor () {
    this.listeners = <EventMap<T>> {}
  }

  public readonly listeners: EventMap<T>

  public on <K extends keyof T> (event: K, listener: (...args: T[K]) => Promise<void> | void, once: boolean = false) {
    (this.listeners[event] || (this.listeners[event] = [])).push({ once, listener })
  }

  public once <K extends keyof T> (event: K, listener: (...args: T[K]) => Promise<void> | void) {
    return this.on(event, listener, true)
  }

  public async emit <K extends keyof T> (event: K, ...args: T[K]) {
    const listeners = this.listeners[event]

    if (listeners) {
      await Promise.all(listeners.map(async (entry) => {
        if (entry.once) {
          listeners.splice(listeners.indexOf(entry), 1)
        }

        await entry.listener(...args)
      }))
    }
  }

  public bind () {
    return {
      on: this.on.bind(this),
      once: this.once.bind(this),
      emit: this.emit.bind(this)
    }
  }
}
