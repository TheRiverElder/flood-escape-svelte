import type { Handler } from "./interfaces";

export class SimpleEventDispatcher<E> {

    readonly handlers: Set<Handler<E>> = new Set();

    add(handler: Handler<E>) {
        return this.handlers.add(handler);
    }

    remove(handler: Handler<E>): boolean {
        return this.handlers.delete(handler);
    }

    clear() {
        return this.handlers.clear();
    }

    emit(event: E) {
        this.handlers.forEach(handle => handle(event));
    }
}