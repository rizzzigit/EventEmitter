export interface EventInterface {
    [key: string]: Array<any>;
}
export declare type EventMap<T extends EventInterface> = {
    [K in keyof T]: Array<{
        once: boolean;
        listener: (...args: T[K]) => Promise<void> | void;
    }>;
};
export declare class EventEmitter<T extends EventInterface> {
    constructor();
    readonly listeners: EventMap<T>;
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => Promise<void> | void, once?: boolean): void;
    once<K extends keyof T>(event: K, listener: (...args: T[K]) => Promise<void> | void): void;
    emit<K extends keyof T>(event: K, ...args: T[K]): Promise<void>;
}
