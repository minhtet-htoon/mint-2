<script lang="ts">
  import arrows from '../assets/arrows-right.svg'
  import shuffle from '../assets/arrows-shuffle.svg'
  import pause from '../assets/player-pause.svg'
  import play from '../assets/player-play.svg'
  import skip from '../assets/player-skip-forward.svg'
  import iconBack from '../assets/player-skip-back.svg'
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
  import { current, queue, shuffled, regen } from '../utils/queue'
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte'

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

<div class="flex space-x-5 pb-5">
  <div class="h-[30vh] aspect-square flex-none mask mask-squircle">
    <img
      class="aspect-square h-full object-scale-down"
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
        <Icon path={iconBack} class="h-full w-6" />
      </button>
      <button class="btn h-full btn-ghost btn-xs" on:click={commonButton}>
        {#if $Playing}
          <Icon path={pause} class="h-full w-6" />
        {:else}
          <Icon path={play} class="h-full w-6" />
        {/if}
      </button>
      <button class="btn h-full btn-ghost btn-xs" on:click={end}>
        <Icon path={skip} class="h-full w-6" />
      </button>
      <button
        class="btn btn-ghost h-full btn-xs"
        on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        () => {
          queue.set(regen($queue, !$shuffled, getPlaying()))
        }}
      >
        {#if !$shuffled}
          <Icon path={arrows} class="h-full w-6" />
        {:else}
          <Icon path={shuffle} class="h-full w-6" />
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
          class="progress"
          value={$Progress}
          max={$current.data.format.duration}
        />
      </div>
      <div class="right-5">{formatTime($current.data.format.duration)}</div>
    </div>
  </div>
</div>
