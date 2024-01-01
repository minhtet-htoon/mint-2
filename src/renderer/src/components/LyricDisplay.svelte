<script lang="ts">
  import { linesAfter, linesBefore, lyrFromTime } from '../utils/lrc'
  import { Progress } from '../utils/player'
  import type { ILyric } from '../../../types'

  export let lrc: ILyric[]
</script>

<div class="h-full">
  {#each linesBefore($Progress, lrc) as l}
    <p class="h-5 text-center">{l.line}</p>
  {/each}
  <p class="h-5 font-bold text-center text-accent">{lyrFromTime($Progress, lrc)}</p>
  {#each linesAfter($Progress, lrc) as l}
    <p class="h-5 text-center">{l.line}</p>
  {/each}
</div>
