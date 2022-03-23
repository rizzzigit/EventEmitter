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
    off<K extends keyof T>(event: K, listener: (...args: T[K]) => Promise<void> | void): void;
    emit<K extends keyof T>(event: K, ...args: T[K]): Promise<boolean>;
    bind(): {
        on: <K extends keyof T>(event: K, listener: (...args: T[K]) => void | Promise<void>, once?: boolean) => void;
        once: <K_1 extends keyof T>(event: K_1, listener: (...args: T[K_1]) => void | Promise<void>) => void;
    };
}
