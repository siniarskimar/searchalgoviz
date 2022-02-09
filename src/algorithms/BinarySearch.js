import { arrayStore } from "../Array/store";

export class BinarySearch {
    sorted = false;
    start = 0;
    end = 0;
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
        this.end = this.array.length - 1;
        arrayStore.sort();
        yield;

        while (this.start < this.end) {
            arrayStore.unmarkFound();
            arrayStore.unsetActiveAll();
            arrayStore.setActive(this.start);
            arrayStore.setActive(this.end);
            yield;

            let pivot = Math.floor(this.start / 2) + Math.floor(this.end / 2);
            arrayStore.markAsFound(pivot);
            yield;

            let pivotV = this.array[pivot].value;

            if (pivotV == this.target) {
                arrayStore.markAsFound(pivot);
                this.arrayUnsubscribe();
                return true;
            } else if (pivotV > this.target) {

                for (let i = pivot; i < this.end + 1; i++) {
                    arrayStore.discard(i);
                }

                this.end = pivot - 1;

            } else { // pivotV < this.target
                for (let i = this.start; i < pivot + 1; i++) {
                    arrayStore.discard(i);
                }
                this.start = pivot + 1;
            }
            yield;
        }

        if (this.array[this.start].value == this.target) {
            arrayStore.markAsFound(this.start);
            this.arrayUnsubscribe();
            return true;
        }

        this.arrayUnsubscribe();
    }
}