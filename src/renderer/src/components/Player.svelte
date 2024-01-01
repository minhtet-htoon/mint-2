<script lang="ts">
  import {
    back,
    sound,
    end,
    Playing,
    commonButton,
    formatTime,
    getPlaying,
    Progress
  } from '../utils/player'
  import { current, queue, shuffled, regen, albumImage } from '../utils/queue'
  import { onMount } from 'svelte'
  import {
    IconArrowsRight, IconArrowsShuffle,
    IconPlayerPause,
    IconPlayerPlay,
    IconPlayerSkipBack,
    IconPlayerSkipForward
  } from '@tabler/icons-svelte'

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

<div class="flex h-[30vh] space-x-5 pb-5">
  <div class="h-full aspect-square flex-none mask mask-squircle">
    <img
      class="aspect-square h-full object-scale-down"
      src={albumImage($current)}
      alt="Album Cover"
    />
  </div>
  <div class="flex flex-col grow justify-end space-y-5">
    <div class="flex flex-col space-y-5">
      <h1 class="text-4xl font-bold pt-5">{$current.data.common.title}</h1>
      <h2 class="text-2xl">{$current.data.common.artist}</h2>
    </div>
    <div class="flex-row h-[10%]">
      <button class="btn h-full btn-ghost btn-xs" on:click={back}>
        <IconPlayerSkipBack class="stroke-primary"/>
      </button>
      <button class="btn h-full btn-ghost btn-xs" on:click={commonButton}>
        {#if $Playing}
          <IconPlayerPause class="stroke-primary"/>
        {:else}
          <IconPlayerPlay class="stroke-primary"/>
        {/if}
      </button>
      <button class="btn h-full btn-ghost btn-xs" on:click={end}>
        <IconPlayerSkipForward class="stroke-primary"/>
      </button>
      <button
        class="btn btn-ghost h-full btn-xs"
        on:click={
        () => {
          queue.set(regen($queue, !$shuffled, getPlaying()))
        }}
      >
        {#if !$shuffled}
          <IconArrowsRight class="stroke-primary"/>
        {:else}
          <IconArrowsShuffle class="stroke-primary"/>
        {/if}
      </button>
    </div>
    <div class="flex flex-row space-x-3 pb-5">
      <div class="">{formatTime($Progress)}</div>
      <div class="grow">
        <!--svelte-ignore a11y-no-noninteractive-element-interactions -->
        <progress
          on:mousemove={handleMove}
          on:mousedown={()=>{sound.volume(0)}}
          on:mouseup={()=>{sound.volume(1)}}
          class="progress progress-primary"
          value={$Progress}
          max={$current.data.format.duration}
        />
      </div>
      <div class="right-5">{formatTime($current.data.format.duration)}</div>
    </div>
  </div>
</div>
