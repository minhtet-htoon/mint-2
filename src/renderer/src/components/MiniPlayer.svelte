<script lang="ts">
  import { albumImage, current, queue, regen, shuffled } from "../utils/queue";
  import { back, commonButton, end, formatTime, getPlaying, Playing, Progress, sound } from "../utils/player";
  import {
    IconArrowsRight,
    IconArrowsShuffle,
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

  function handleMove(e): void {
    if (!sound) return // video not loaded yet
    if (e.type !== 'touchmove' && !(e.buttons && 1)) return // mouse not down

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const { left, right } = this.getBoundingClientRect()
    sound.seek(($current.data.format.duration * (clientX - left)) / (right - left))

    setTimeout(() => {
      sound.volume(1)
    }, 1500)
  }
</script>

<div class="h-24 p-5 rounded-2xl space-x-5 w-full flex flex-row">
  <div class="flex mask mask-squircle h-full">
    <img
      src={albumImage($current)}
      alt="Album Cover"
    />
  </div>
  <div class="flex flex-row">
    <button class="btn h-full btn-ghost btn-xs" on:click={back}>
      <IconPlayerSkipBack class="h-full stroke-primary" />
    </button>
    <button class="btn h-full btn-ghost btn-xs" on:click={commonButton}>
      {#if $Playing}
        <IconPlayerPause class="h-full stroke-primary"></IconPlayerPause>
      {:else}
        <IconPlayerPlay class="h-full stroke-primary" />
      {/if}
    </button>
    <button class="btn h-full btn-ghost btn-xs" on:click={end}>
      <IconPlayerSkipForward class="h-full stroke-primary" />
    </button>
    <button
      class="btn btn-ghost h-full btn-xs"
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        queue.set(regen($queue, !$shuffled, getPlaying()))
      }}
    >
      {#if !$shuffled}
        <IconArrowsRight class="h-full stroke-primary" />
      {:else}
        <IconArrowsShuffle class="h-full stroke-primary" />
      {/if}
    </button>
  </div>
  <div class="flex flex-1 h-full flex-col justify-center">
    <div class="flex flex-row w-full">
      <p class="w-1/2 text-right font-bold pr-3 border-r-2">{$current.data.common.title ? $current.data.common.title : $current.path}</p>
      <p class="w-1/2 text-left pl-3">{$current.data.common.artist ? $current.data.common.artist : ''}</p>
    </div>
    <div class="flex space-x-5 flex-row">
      <div class="">{formatTime($Progress)}</div>
      <div class="grow">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
        <progress
          class="progress progress-primary"
          on:mousemove={handleMove}
          on:mousedown={() => {
            sound.volume(0)
          }}
          on:mouseup={() => {
            sound.volume(1)
          }}
          value={$Progress}
          max={$current.data.format.duration}
        />
      </div>
      <div class="right-5">{formatTime($current.data.format.duration)}</div>
    </div>
  </div>
</div>
