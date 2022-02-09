import { get } from "svelte/store";
import { arrayStore } from "../Array/store";

export class LinearSearch {
    i = 0;
    target;
    array = [];
    arrayUnsubscribe;

    constructor(target) {
        this.target = target;
        this.arrayUnsubscribe = arrayStore.subscribe((v) => {
            this.array = v;
        });
    }
    *step() {
        for (this.i = 0; this.i < this.array.length; this.i++) {
            arrayStore.setActive(this.i);
            yield;
            if (this.array[this.i].value == this.target) {
                arrayStore.markAsFound(this.i);
                return true;
            }

            if (this.array[this.i].value != this.target) {
                arrayStore.discard(this.i);
                yield;
            }
            arrayStore.unsetActive(this.i);
            yield;
        }

        this.arrayUnsubscribe();
    }
}