<script>
  import { v4 as uuidv4 } from 'uuid'
  import FileUpload, { State } from './components/FileUpload.svelte'
  import parseChat from './lib/parse-chat'
  import findUrl from './lib/find-url'

  let progress = 0
  let status = 0
  let messageFile = ''

  $: messages = parseChat(messageFile)
    .map(msg => ({ ...msg, id: uuidv4() }))
    .map(msg => ({ ...msg, links: findUrl(msg.message) }))
  $: links = messages
    .filter(msg => msg.links.length > 0)
    .reduce((all, { links, id }) => {
      return links.reduce((mapped, link) => {
        mapped[link] = mapped[link] ? [...mapped[link], id] : [id]
        return mapped
      }, all)
    }, {})

  function countSort (a, b) {
    return b[1].length - a[1].length
  }

  function toggleContext (ev) {
    const linkDataEl = ev.target.closest('li > .link-data')
    const contextEl = linkDataEl.nextElementSibling

    if (contextEl.style.display === 'block') {
      ev.target.innerHTML = 'Show context'
      contextEl.style.display = 'none'
    } else {
      ev.target.innerHTML = 'Hide context'
      contextEl.style.display = 'block'
    }
  }
</script>

<main>
  <div id="header" class="flexy">
    <section id="description">
      <h1>Zoom Chat Links</h1>
      <p>Parses out links that were posted in your chat</p>
    </section>

    <section id="file-upload">
      <FileUpload 
        bind:progress={progress}  
        bind:status={status} 
        bind:fileContent={messageFile} />
    </section>
  </div>

  {#if messages.length > 0}

  <div id="content" class="flexy">
      <section id="links">
        <h2>Links</h2>
        <ul>
          {#each Object.entries(links).sort(countSort) as [link, ids]}
            <li>
              <div class="link-data flexy">
                <p class="flex-2"><a href="{link}" target="_blank">{link}</a> was posted {ids.length} times</p>
                <p><a href="#" on:click|preventDefault={toggleContext}>Show context</a></p>
              </div>

              <ul class="context">
                {#each messages.filter(m => ids.includes(m.id)) as msg}
                  <li>
                    <p><em>{msg.user}</em></p>
                    <p>{msg.message}</p>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </section>

      <section id="chat">
        <h2>Chat</h2>
        <ul>
          {#each messages as message}
            <li>
              <p><em>{message.user}</em></p>
              <p>{message.message}</p>
            </li>
          {/each}
        </ul>
      </section>
  </div>

  {/if}
</main>

<style>
	main {
		padding: 1em;
	}

  em {
    font-style: normal;
    font-weight: bold;
  }

  .flexy {
    display: flex;
    flex-direction: column;
  }

  #description {
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: block;
    padding: 0.3em 1.5em;
    margin: 1em;
    border: 1px solid #dde2ff;
    background: #ffeef1;
    box-shadow: 0px 10px 0px -5px #dde2ff;
  }

  .context {
    display: none;
    background:#f0f0f0;
    border:2px dashed #dde2ff;
    margin-bottom: 1em;
    font-size: 0.9em;
  }

  .context > li {
    background: inherit;
    border: 0;
    box-shadow: none;
    border-bottom: 2px dashed #dedede;
  }

  .context > li:last-child {
    border: 0;
  }

	h1 {
		color: #f65d77;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 300;
    margin: 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: 80ch;
      margin: 0 auto;
		}

    #header {
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
    }

    #description {
      text-align: left;
    }

    #header > section {
      flex-basis: 47%;
    }

    .link-data {
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: row;
    }

	}
</style>
