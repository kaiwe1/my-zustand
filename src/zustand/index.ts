// from https://www.bilibili.com/video/BV1gg4y1V76S
import { useSyncExternalStore } from "react"
import { createStore } from "./vanilla"

export function create <T> (createState: any) {
    return createImpl(createState)
}

const createImpl = (createState: any) => {
    const api = createStore(createState)

    const useBoundStore = () => useStore(api)

    return useBoundStore
}

export const useStore = (api: any) =>{
    const slice = useSyncExternalStore(api.subscribe, api.getState)

    return slice
}

