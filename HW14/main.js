async function jsonPost(url, data) {
  let resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return await resp.json()
  // return new Promise((resolve, reject) => {
  //   var x = new XMLHttpRequest();
  //   x.onerror = () => reject(new Error('jsonPost failed'))
  //   //x.setRequestHeader('Content-Type', 'application/json');
  //   x.open("POST", url, true);
  //   x.send(JSON.stringify(data))

  //   x.onreadystatechange = () => {
  //     if (x.readyState == XMLHttpRequest.DONE && x.status == 200) {
  //       resolve(JSON.parse(x.responseText))
  //     }
  //     else if (x.status != 200) {
  //       reject(new Error('status is not 200'))
  //     }
  //   }
  // })
}

let messageIdSave = 0;

async function getMessages(nextMessageId) {
  let youtubeRegExp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
  let imageRegExp = (/\.(gif|jpg|jpeg|tiff|png)$/i)
  let arrObj = await jsonPost("http://students.a-level.com.ua:10012", { func: 'getMessages', messageId: nextMessageId })
  arrObj.data.map(t => {
    let box = document.createElement('div')
    box.classList.add('box')
    let nick = document.createElement('span')
    nick.classList.add('nick')
    let message = document.createElement('p')
    message.classList.add('message')
    nick.innerText = t.nick + ':'
    let keyRegYoutube = t.message ? t.message.match(youtubeRegExp) : null
    if (keyRegYoutube) {
      message.innerHTML = `<iframe width="500vw" height="300px" src="https://www.youtube.com/embed/${keyRegYoutube[1]}" title="YouTube video player"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`
    } else if (imageRegExp.test(t.message)) {
      message.innerHTML = `<img src="${t.message}" alt="" width="250px">`
    }
    else {
      message.innerText = t.message
    }
    box.append(nick)
    box.append(message)
    historyChat.prepend(box)
  })
  messageIdSave = arrObj.nextMessageId
}

async function sendMessage(nickName, message) {
  await jsonPost("http://students.a-level.com.ua:10012", { func: 'addMessage', nick: nickName, message: message })
}

async function sendAndCheck(nickName, message, nextMessageId) {
  await sendMessage(nickName, message)
  await getMessages(nextMessageId)
}

btn.onclick = () => {
  nick.value === '' ? nick.classList.add('error') : message.value === '' ? message.classList.add('error') : sendAndCheck(nick.value, message.value, messageIdSave)
  message.value = ''
}


nick.oninput = () => nick.classList.remove('error')
message.oninput = () => message.classList.remove('error')

async function checkLoop() {
  const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))
  while (true) {
    await delay(3000)
    getMessages(messageIdSave)
  }
}

checkLoop()

