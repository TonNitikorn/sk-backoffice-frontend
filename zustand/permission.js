import create from "zustand"

const useStore = (set) => ({
    permission: {},
    addPermission: (params) => {
        set(state => ({
            permission: params
        }))
    }

})

export const useCounterStore = create(useStore)