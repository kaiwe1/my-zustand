export interface StoreAPI <T> {
    setState: ( partial: T | Partial<T> | {_(state: T): T | Partial<T>}["_"], replace?: boolean) => void 
    getState: () => T
    subscribe: (listener: (state: T, prevState: T) => void) => () => void
    destroy: () => void
}

export const createStore = (createState: any) => {
    type TState = ReturnType<typeof createState>
    type Listener = (state: TState, prevState: TState) => void
    
    let state: TState
    const listeners: Set<Listener> = new Set()

    const setState: StoreAPI<TState>["setState"] = (partial, replace) => {
        const nextState = typeof partial === 'function' ? partial(state) : partial

        if (!Object.is(nextState, state)) {
            const previousState = state
            state = replace ?? typeof nextState !== 'object' ? nextState : Object.assign({}, state, nextState) // 如果replace为undefined, 那么检查一下是否是对象, 如果是对象则使用Object.assign合并
            listeners.forEach(listener => listener(state, previousState))
        }
    }
    const getState: StoreAPI<TState>["getState"] = () => state
    const subscribe: StoreAPI<TState>["subscribe"] = (listener: Listener) => {
        listeners.add(listener)

        return () => listeners.delete(listener)
    }
    const destroy: StoreAPI<TState>["destroy"] = () => {
        listeners.clear()
    }

    const api = {
        getState, setState, destroy, subscribe
    }
    state = createState(setState, getState, api)
    return api
}