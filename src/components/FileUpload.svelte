<script context="module">
  export const State = {
    name: state => Object.keys(State).filter(k => k !== 'name')[state || 0] || '',
    IDLE: 0,
    START: 1,
    LOADED: 2,
    COMPLETE: 3,
    ABORTED: 4
  }
</script>

<script>
  export let progress
  export let status
  export let fileContent

  let uploadField

  function processFile (ev) {
    const rdr = new FileReader()
    rdr.addEventListener('loadstart', () => { status = State.START })
    rdr.addEventListener('load', () => { status = State.LOADED })
    rdr.addEventListener('loadend', () => { fileContent = rdr.result })
    rdr.addEventListener('progress', (ev) => { progress = 100 * (ev.loaded / ev.total) })
    rdr.addEventListener('error', () => { status = State.ABORTED })
    rdr.addEventListener('abort', () => { status = State.ABORTED })

    const file = uploadField.files[0]
    rdr.readAsText(file)
  }
</script>

<input 
  bind:this={uploadField}
  type="file" 
  id="upload" 
  accept="text/plain" 
  on:change={processFile} />

<style>
  #upload {
    border: 1px solid #ffdff1;
    background: #ffeef1;
    box-shadow: 0px 7px 0px -3px #ffdff1;
    width: 100%;
    padding: 1em;
    border-radius: 0;
  }
</style>
