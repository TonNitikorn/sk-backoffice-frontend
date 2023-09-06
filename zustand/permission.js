import create from "zustand"

const useStore = (set) => ({
    role: {},
    addPermission: (params) => {
        set(state => ({
            role: params
        }))
    }

})

export const useCounterStore = create(useStore)