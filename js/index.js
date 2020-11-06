const list = document.querySelector("#list")
const showPanel = document.querySelector('#show-panel')
const URL = 'http://localhost:3000/books'
const bookArray = []
const currentUser = {id: 1, username: 'pouros'}

function main(){
    fetchBooks()
}
main()

function fetchBooks(){
    fetch(URL)
    .then(resp => resp.json())
    .then(json => renderBooks(json))
}

function renderBooks(json){
    json.forEach(book => {
        bookArray.push(book)
        render(book)
    })
}

function render(b){
    const li = document.createElement("li")
    li.innerText = b.title
    li.id = b.id

    li.addEventListener("click", event => {
        showPanel.innerHTML = ''
        showBook(li.id)
    })

    list.appendChild(li)
}

function showBook(b){
    const theBook = bookArray.find(book => book.id == b)

    const img = document.createElement('img')
    img.src = theBook.img_url

    const title = document.createElement('h3')
    title.innerText = theBook.title

    const subtitle = document.createElement('h4')
    subtitle.innerText = theBook.subtitle

    const author = document.createElement('h5')
    author.innerText = theBook.author

    const desc = document.createElement('p')
    desc.innerText = theBook.description

    const ul = document.createElement('ul')
    ul.id = 'user-list'

    theBook.users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        ul.append(li)
    })


    const button = document.createElement('button')
    button.innerText = 'Like'
    button.addEventListener("click", event => {
        if (!theBook.users.find(user => user.username == currentUser.username)){
            addUser(theBook)
        } else if (theBook.users.find(user => user.username == currentUser.username)){
            deleteUser(theBook)
        }
    })

    showPanel.append(img, title, subtitle, author, desc, ul, button)
}

function addUser(b){
    const configBook = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            users: [...b.users, currentUser]
        })
    }

    fetch(URL + '/' + b.id, configBook)
    .then(resp => resp.json())
    .then(json => {
        const changeBook = bookArray.find(book => book.id == json.id)
        changeBook.users = json.users
        showPanel.innerHTML = ''
        showBook(json.id)
    })
}

function deleteUser(b){
    let sendArray = b.users.filter(user => user.username !== currentUser.username)

    const configBook = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            users: sendArray
        })
    }

    fetch(URL + '/' + b.id, configBook)
    .then(resp => resp.json())
    .then(json => {
        const changeBook = bookArray.find(book => book.id == json.id)
        changeBook.users = json.users
        document.querySelector('#user-list').innerHTML = ''
        json.users.forEach(user => {
            const li = document.createElement('li')
            li.innerText = user.username
            document.querySelector('#user-list').append(li)
        })
    })
}



// img_url
// title
// subtitle
// author
// description