import create from "zustand"

const useStore = (set) => ({
    permission: {},
    setPermission: (params) => {
        set(state => ({
            permission: params
        }))
    }

})

export const useCounterStore = create(useStore)