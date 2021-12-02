
const getGQL = url =>
    async (query, variables) => {
        try {
            let obj = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: localStorage.authToken ? 'Bearer ' + localStorage.authToken : null,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query, variables })
            })
            let a = await obj.json()
            for (const key in a) {
                for (const deepKey in a[key]) {
                    return a[key][deepKey]
                }
            }
        }
        catch (error) {
            console.log('Что-то не так, Бро ' + error);
        }
    }

const gql = getGQL('http://shop-roles.asmer.fs.a-level.com.ua/graphql');

function logIn() {
    const loginBox = document.createElement('div')
    loginBox.setAttribute('id', 'loginBox')
    const inputNick = document.createElement('input')
    const h2 = document.createElement('h2')
    h2.innerText = 'Log In'
    const inputPassword = document.createElement('input')
    const btnLogIn = document.createElement('button')
    const btnRegister = document.createElement('button')
    const btnX = document.createElement('button')
    btnX.innerText = 'X'
    btnX.classList.add('close')
    btnLogIn.innerText = 'Log In'
    btnRegister.innerText = 'Register'
    overlay.style.display = 'block'
    btnLogIn.onclick = async () => {
        let jwt = await gql(`
    query NameForMe1($login:String, $password:String){
        login(login:$login, password:$password)
    }
`, {
            login: inputNick.value, password: inputPassword.value
        })
        console.log(jwt);
        if (jwt) {
            localStorage.setItem('authToken', jwt)
            overlay.style.display = 'none'
            loginBox.remove()
            const h1 = document.createElement('h2')
            h1.innerText = `Welcome ${inputNick.value}`
            title.append(h1)
        }
    }
    btnRegister.onclick = () => {
        loginBox.remove()
        registerF()
    }
    btnX.onclick = () => {
        loginBox.remove()
        overlay.style.display = 'none'
    }
    inputNick.type = 'text'
    inputPassword.type = 'password'
    loginBox.append(h2)
    loginBox.append(inputNick)
    loginBox.append(btnX)
    loginBox.append(inputPassword)
    loginBox.append(btnLogIn)
    loginBox.append(btnRegister)
    body.append(loginBox)
}

function registerF() {
    const loginBox = document.createElement('div')
    loginBox.setAttribute('id', 'loginBox')
    const inputNick = document.createElement('input')
    const h2 = document.createElement('h2')
    h2.innerText = 'Register'
    const inputPassword = document.createElement('input')
    const btnLogIn = document.createElement('button')
    const btnRegister = document.createElement('button')
    const btnX = document.createElement('button')
    btnX.innerText = 'X'
    btnX.classList.add('close')
    btnLogIn.innerText = 'Enter login'
    btnRegister.innerText = 'Register'
    overlay.style.display = 'block'
    btnRegister.onclick = async () => {
        let jwt = await gql(`
            mutation reg($login:String, $password:String){
            UserUpsert(user:{
                login:$login,
      			password:$password,
      			nick:$login}){
            _id login
            }
        }
        `, {
            login: inputNick.value, password: JinputPassword.value
        })
        console.log(jwt);
    }
    btnLogIn.onclick = () => {
        loginBox.remove()
        logIn()
    }
    btnX.onclick = () => {
        loginBox.remove()
        overlay.style.display = 'none'
    }
    inputNick.type = 'text'
    inputPassword.type = 'password'
    loginBox.append(h2)
    loginBox.append(inputNick)
    loginBox.append(inputPassword)
    loginBox.append(btnRegister)
    loginBox.append(btnLogIn)
    loginBox.append(btnX)
    body.append(loginBox)
}
userLogin.onclick = () => {
    overlay.style.display = 'block'
    logIn()
}
userRegister.onclick = () => {
    overlay.style.display = 'block'
    registerF()
}
overlay.onclick = () => {
    overlay.style.display = 'none'
    loginBox.remove()
}

menuBtn.onclick = async () => {
    let cat = await gql(`
        query Categoria {
        CategoryFind(query:"[{}]"){
        name _id goods{
            name images {
                    url
                }
            }
        }
    }
`, { login: 'Kabina', password: '12345' })
    cat.map(c => {
        if (c) {
            let li = document.createElement('li')
            let btnLink = document.createElement('button')
            btnLink.classList.add('menuBtn')
            btnLink.setAttribute('id', c._id)
            btnLink.innerText = `${c.name}  к-во:${c.goods ? c.goods.length : '0'}`
            btnLink.onclick = () => {
                itemBox.firstChild ? itemBox.firstChild.remove() : null
                let items = document.createElement('items')
                if (c.goods !== null) {
                    c.goods.map(i => {
                        let item = document.createElement('item')
                        let h3 = document.createElement('h3')
                        h3.innerText = i.name
                        item.append(h3)
                        items.append(item)
                    })
                    itemBox.append(items)
                }
            }
            li.append(btnLink)
            menu.append(li)
        }
    })
}
