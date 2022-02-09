<script>
    import { arrayStore } from "./store";
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { getContext } from "svelte";
    import { spring } from "svelte/motion";
    import { target as targetStore } from "../Topbar/store";

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
            };
        },
    });

    $: console.log($arrayStore);

    function targetDrag(node) {
        let x = 0;
        let y = 0;
        let cords = spring({ x: 0, y: 0 });

        cords.subscribe(({ x, y }) => {
            node.style.top = `${y}px`;
            node.style.left = `${x}px`;
        });

        const mouseMove = (e) => {
            let dx = e.x - x;
            let dy = e.y - y;
            cords.set({ x: dx, y: dy });
        };
        const mouseUp = (e) => {
            x = 0;
            y = 0;
            cords.set({ x, y });
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("mousemove", mouseMove);

            let targetArea = document.querySelector("#targetDropArea");
            let rect1 = targetArea.getBoundingClientRect();
            let rect2 = node.getBoundingClientRect();
            const overlap = !(
                rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom
            );

            if (overlap) {
                let value = parseInt(node.querySelector("p").innerHTML);
                targetStore.set(value);
            }
        };
        const mouseDown = (e) => {
            x = e.x;
            y = e.y;
            window.addEventListener("mouseup", mouseUp);
            window.addEventListener("mousemove", mouseMove);
        };

        node.addEventListener("mousedown", mouseDown);
    }
</script>

<div>
    {#each $arrayStore as e, i (e.id)}
        <div
            class="ArrayElement"
            class:discarded={!!e.discarded}
            class:target={!!e.found}
            class:dragable={!getContext("animationStarted") || null}
            style:--index={`"${i}"`}
            in:receive={{ key: e.id }}
            out:send={{ key: e.id }}
            animate:flip
            use:targetDrag
        >
            <p>{e.value}</p>
            <div class="indicators">
                {#if !!e.active}
                    <div class="indicator active" />
                {/if}
                {#if !!e.target}
                    <div class="indicator target" />
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    div {
        padding: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media screen and (max-width: 1460px) {
        div {
            font-size: 0.7rem;
        }
    }
    @media screen and (max-width: 1100px) {
        div {
            font-size: 0.5rem;
        }
    }

    div.ArrayElement {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;

        width: 3em;
        height: 3em;

        font-size: 3em;
        font-family: sans-serif;
        border-radius: 5px;
        border: 1px solid #aaa;
        margin: 0 0.1em;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        transition: opacity 200ms ease-out, background-color 200ms ease-out;
    }

    div.ArrayElement::before {
        position: absolute;
        top: 0.2em;
        left: 0.4em;
        content: var(--index);
        font-size: 0.5em;
        color: rgb(73, 73, 73);
    }

    .ArrayElement p {
        text-align: center;
        padding: 0.1em;
    }
    .ArrayElement .indicators {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 12%;
        display: flex;
        flex-direction: row;
        padding: 0;
    }
    .ArrayElement .indicators .indicator {
        height: 100%;
        flex: 1;
        padding: 0;
    }
    .ArrayElement .indicators .indicator:nth-child(1) {
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
    }
    .ArrayElement .indicators .indicator:last-child {
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
    }
    .ArrayElement .indicator.active {
        background-color: rgb(255, 245, 102);
    }
    .ArrayElement .indicator.target {
        background-color: rgb(17, 123, 209);
    }
    .ArrayElement.dragable {
        cursor: grab;
    }
    .ArrayElement.discarded {
        opacity: 0.7;
        background-color: #aaa;
    }
    .ArrayElement.target {
        top: -2em !important;
    }
</style>
