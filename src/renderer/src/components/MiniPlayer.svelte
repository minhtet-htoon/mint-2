<script lang="ts">
  import { current, queue, regen, shuffled } from '../utils/queue'
  import { back, commonButton, end, formatTime, getPlaying, Playing, Progress, sound } from "../utils/player";
  import {
    IconArrowsRight,
    IconArrowsShuffle2,
    IconPlayerPause,
    IconPlayerPlay,
    IconPlayerSkipBack,
    IconPlayerSkipForward
  } from '@tabler/icons-svelte'
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

<div class="h-24 p-5 rounded-2xl space-x-5 w-full flex flex-row">
  <div class="flex mask mask-squircle h-full">
    <img
      src={URL.createObjectURL(
        new Blob([$current.data.common.picture[0].data], { type: 'image/jpeg' } /* (1) */)
      )}
      alt="Album Cover"
    />
  </div>
  <div class="flex flex-row">
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
      on:click={() => {
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
  <div class="flex flex-1 h-full flex-col justify-center">
    <div class="flex flex-row w-full">
      <p class="w-1/2 text-right font-bold pr-3 border-r-2">{$current.data.common.title}</p>
      <p class="w-1/2 text-left pl-3">{$current.data.common.artist}</p>
    </div>
    <div class="flex space-x-5 flex-row">
      <div class="">{formatTime($Progress)}</div>
      <div class="grow">
        <progress class="progress" value={$Progress} max={$current.data.format.duration} />
      </div>
      <div class="right-5">{formatTime($current.data.format.duration)}</div>
    </div>
  </div>
</div>
