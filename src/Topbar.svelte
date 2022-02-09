<script>
    import PlayIcon from "./svg/play.svg?raw";
    import PauseIcon from "./svg/pause.svg?raw";
    import { arrayStore } from "./Array/store";
    import { LinearSearch } from "./algorithms/LinearSearch";
    import { BinarySearch } from "./algorithms/BinarySearch";
    import { setContext } from "svelte";
    import { target } from "./Topbar/store";

    let algorithm = null;
    let algoStep = null;
    let algorithmSelected = "linearsearch";
    let playing = false;
    let animationStarted = false;
    let interval;

    $: {
        if (playing == false) {
            clearInterval(interval);
        } else {
            algoStep = algorithm.step();
            interval = setInterval(() => {
                if (!!algoStep.next().value) {
                    clearInterval(interval);
                    playing = false;
                    animationStarted = false;
                }
            }, 1000);
        }
    }

    $: {
        algorithmSelected = algorithmSelected;
        playing = playing;
        setContext("playing", playing);
        setContext("animationStarted", animationStarted);
    }

    target.subscribe((value) => {
        arrayStore.setTarget(value);
    });

    const algorithmChange = () => {
        playing = false;
        animationStarted = false;
        arrayStore.reset();
        arrayStore.sortById();
    };

    function play() {
        if (!animationStarted) {
            algorithmChange();
            switch (algorithmSelected) {
                case "linearsearch":
                    algorithm = new LinearSearch($target);
                    break;
                case "binarysearch":
                    algorithm = new BinarySearch($target);
                    break;
            }
        }

        playing = !playing;
        animationStarted = true;
    }
</script>

<div>
    <select bind:value={algorithmSelected} on:change={algorithmChange}>
        <option value="linearsearch">LinearSearch</option>
        <option value="binarysearch">BinarySearch</option>
    </select>
    <button on:click={play}>
        {@html playing ? PauseIcon : PlayIcon}
    </button>
    <div id="targetDropArea">
        <p>Przenieś tutaj aby oznaczyć szukaną wartość</p>
    </div>
</div>

<style>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    button {
        display: flex;
        align-items: center;
        justify-content: center;

        border: 1px solid #757575aa;
        border-radius: 50%;
        background-color: transparent;
        margin: 0 1rem;
        box-shadow: 0 0 1px 2px #22222240;
        padding: 0.4em;
    }
    select {
        width: 10em;
        height: 2em;
        background-color: inherit;
        border-radius: 0.4em;
        border: 1px solid #757575aa;
        transition: box-shadow 100ms ease;
    }
    select:hover {
        box-shadow: 0 0 3px 1px #757575aa;
    }
    #targetDropArea {
        width: 15em;
        height: 30px;
        border: 3px dotted black;
        font-family: sans-serif;
        font-size: 0.6em;
        padding: 3px;
    }
</style>
