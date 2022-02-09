import { writable } from 'svelte/store';

function createStore() {
    const initial = [];
    let idCount = 0;
    const { subscribe, set, update } = writable(initial);

    const swap = (a, b) => update((oldStore) => {
        let newStore = Object.assign([], oldStore);
        let tmp = newStore[a];
        newStore[a] = newStore[b];
        newStore[b] = tmp;
        return newStore
    });

    const remove = (i) => update((oldStore) => {
        return oldStore.filter((_, si) => { return si != i; });
    });

    const push = (v) => update((oldStore) => {
        return [...oldStore, {
            id: idCount++,
            value: v,
            discarded: false,
            active: false,
            target: false,
            found: false
        }];
    });

    const randomize = () => update((oldStore) => {
        let newStore = Object.assign([], oldStore);
        const swap = (arr, a, b) => {
            let tmp = arr[a];
            arr[a] = arr[b];
            arr[b] = tmp;
        };

        for (let i in newStore) {
            swap(newStore, Math.floor(Math.random() * newStore.length), Math.floor(Math.random() * newStore.length));
        }

        return newStore;
    });
    const sortById = () => update((oldStore) => {
        let newStore = Object.assign([], oldStore);
        newStore.sort((a, b) => (a.id - b.id));

        return newStore;
    });
    const sort = () => update((oldStore) => {
        let newStore = Object.assign([], oldStore);
        newStore.sort((a, b) => (a.value - b.value));

        return newStore;
    });
    const setTarget = (v) => update((oldstore) => {
        let newStore = Object.assign([], oldstore);
        for (let i in newStore) {
            newStore[i].target = false;
        }

        for (let i in newStore) {
            if (newStore[i].value == v) {
                newStore[i].target = true;
            }
        }

        return newStore;
    });
    const unsetActive = (i) => update((oldStore) => {
        let newStore = Object.assign([], oldStore);
        if (i < 0 || i > newStore.length) {
            throw new RangeError("Invalid index");
        }

        newStore[i].active = false;
        return newStore;
    });

    const unsetActiveAll = () => update((oldStore) => {
        let newStore = Object.assign([], oldStore);

        for (let i in newStore) {
            newStore[i].active = false;
        }

        return newStore;
    });

    const setActive = (i) => update((oldStore) => {
        let newStore = Object.assign([], oldStore);

        if (i < 0 || i > newStore.length) {
            throw new RangeError("Invalid index");
        }
        newStore[i].active = true;

        return newStore;
    });
    const discard = (i) => update((oldStore) => {
        let newStore = Object.assign([], oldStore);

        if (i < 0 || i > newStore.length) {
            throw new RangeError("Invalid index");
        }
        newStore[i].discarded = true;

        return newStore;
    });

    const unmarkFound = () => update((oldStore) => {
        let newStore = Object.assign([], oldStore);

        for (let i in newStore) {
            newStore[i].found = false;
        }

        return newStore;
    });

    const markAsFound = (i) => update((oldStore) => {
        let newStore = Object.assign([], oldStore);

        if (i < 0 || i > newStore.length) {
            throw new RangeError("Invalid index");
        }
        newStore[i].found = true;

        return newStore;
    });

    const reset = () => update((oldStore) => {
        let newStore = Object.assign([], oldStore);
        for (let i in newStore) {
            newStore[i].discarded = false;
            newStore[i].active = false;
            newStore[i].found = false;
        }
        return newStore;
    });


    for (let i = 0; i < 10; i++) {
        push(Math.round(Math.random() * 10));
    }

    randomize();
    sortById();
    return {
        subscribe,
        set,
        update,
        swap,
        remove,
        push,
        sortById,
        sort,
        setTarget,
        setActive,
        unsetActive,
        unsetActiveAll,
        discard,
        reset,
        markAsFound,
        unmarkFound
    };
}

export const arrayStore = createStore();