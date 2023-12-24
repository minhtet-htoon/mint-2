<script lang="ts">
  import {
    IconArrowsRight,
    IconArrowsShuffle2,
    IconPlayerPause,
    IconPlayerPlay,
    IconPlayerSkipBack,
    IconPlayerSkipForward
  } from '@tabler/icons-svelte'
  import { back, sound, end, Playing, commonButton, formatTime, getPlaying, Progress } from '../utils/player'
  import { current, queue, shuffled, regen } from '../utils/queue'
  import { onMount } from 'svelte'

  onMount(() => {
    try {
      Progress.set(sound.seek())
    } catch (e) {
      e.type
    }
  })

  setInterval(() => {
    try {
      Progress.set(sound.seek())
    } catch (e) {
      e.type
    }
  }, 1000)
</script>

<div class="flex space-x-5 pb-5">
  <div class="w-[20%] flex-none h-full mask mask-squircle">
    <img
      src={URL.createObjectURL(
        new Blob([$current.data.common.picture[0].data], { type: 'image/jpeg' } /* (1) */)
      )}
      alt="Album Cover"
    />
  </div>
  <div class="flex flex-col grow justify-end space-y-5">
    <div class="flex flex-col grow space-y-5">
      <h1 class="text-4xl font-bold pt-5">{$current.data.common.title}</h1>
      <h2 class="text-2xl">{$current.data.common.artist}</h2>
    </div>
    <div class="flex-row h-[10%]">
      <button class="btn h-full btn-ghost btn-xs" on:click={back}>
        <IconPlayerSkipBack class="h-full" />
      </button>
      <button class="btn h-full btn-ghost btn-xs" on:click={commonButton}>
        {#if $Playing}
          <IconPlayerPause class="h-full"></IconPlayerPause>
        {:else}
          <IconPlayerPlay class="h-full" />
        {/if}
      </button>
      <button class="btn h-full btn-ghost btn-xs" on:click={end}>
        <IconPlayerSkipForward class="h-full" />
      </button>
      <button
        class="btn btn-ghost h-full btn-xs"
        on:click={
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        () => {
          queue.set(regen($queue, !$shuffled, getPlaying()))
        }}
      >
        {#if !$shuffled}
          <IconArrowsRight class="h-full" />
        {:else}
          <IconArrowsShuffle2 class="h-full" />
        {/if}
      </button>
    </div>
    <div class="flex flex-row space-x-3 pb-5">
      <div class="">{formatTime($Progress)}</div>
      <div class="grow">
        <progress class="progress" value={$Progress} max={$current.data.format.duration} />
      </div>
      <div class="right-5">{formatTime($current.data.format.duration)}</div>
    </div>
  </div>
</div>
