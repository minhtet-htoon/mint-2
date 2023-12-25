<script lang="ts">
  import { lyrFromTime, nextLine } from '../utils/lrc'
  import { Progress } from '../utils/player'
  import type { ILyric } from '../../../types'

  export let lrc: ILyric[]
</script>

<div class="overflow-x-auto h-[50vh] overflow-y-auto">
  <table class="table table-zebra table-pin-rows">
    <thead>
      <tr>
        <th>Time</th>
        <th>Line</th>
      </tr>
    </thead>
    <tbody>
      {#each lrc as lr}
        <tr>
          <td>{lr.time}</td>
          <td>{lr.line}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<p class="h-5 font-bold">{lyrFromTime($Progress, lrc)}</p>
<p class="h-5">{nextLine($Progress, lrc, 1)}</p>
<p class="h-5">{nextLine($Progress, lrc, 2)}</p>
<p class="h-5">{nextLine($Progress, lrc, 3)}</p>
