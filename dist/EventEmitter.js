"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    constructor(options, returnObj = undefined) {
        this.options = {
            requireErrorHandling: false,
            ...options
        };
        this.listeners = {};
        this.returnObj = returnObj;
    }
    options;
    listeners;
    returnObj;
    on(event, listener, once = false) {
        (this.listeners[event] || (this.listeners[event] = [])).push({ once, listener });
        return this.returnObj;
    }
    once(event, listener) {
        return this.on(event, listener, true);
    }
    off(event, listener) {
        const listeners = this.listeners[event] || (this.listeners[event] = []);
        const listenerIndex = listeners.findIndex((entry) => entry.listener === listener);
        if (listenerIndex > -1) {
            listeners.splice(listenerIndex, 1);
        }
        return this.returnObj;
    }
    async emit(event, ...args) {
        const listeners = this.listeners[event];
        if (listeners?.length) {
            await Promise.all(listeners.map(async (entry) => {
                if (entry.once) {
                    listeners.splice(listeners.indexOf(entry), 1);
                }
                await entry.listener(...args);
            }));
            return true;
        }
        if (event === 'error') {
            throw args[0];
        }
        return false;
    }
    bind() {
        return {
            on: this.on.bind(this),
            once: this.once.bind(this),
            off: this.off.bind(this)
        };
    }
}
exports.EventEmitter = EventEmitter;
