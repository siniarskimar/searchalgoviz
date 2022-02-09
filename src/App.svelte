<script>
  import Topbar from "./Topbar.svelte";
  import Array from "./Array/Array.svelte";
  import { setContext } from "svelte";

  setContext("playing", false);
  setContext("animationStarted", false);
</script>

<div>
  <Topbar />
  <Array />
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 50px 1fr;
  }
</style>
