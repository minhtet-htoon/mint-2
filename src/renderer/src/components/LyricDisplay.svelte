<script lang="ts">
  import { linesAfter, linesBefore, lyrFromTime, nextLine } from "../utils/lrc";
  import { Progress } from '../utils/player'
  import type { ILyric } from '../../../types'

  export let lrc: ILyric[]
</script>

{#each linesBefore($Progress, lrc) as l}
  <p class="h-5 text-center">{l.line}</p>
{/each}
<p class="h-5 font-bold text-center">{lyrFromTime($Progress, lrc)}</p>
{#each linesAfter($Progress, lrc) as l}
  <p class="h-5 text-center">{l.line}</p>
{/each}
