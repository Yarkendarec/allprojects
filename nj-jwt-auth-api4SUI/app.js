const express = require('express'),
  app = express(),
  // app1 = express(),
  jwt = require('jsonwebtoken') // , users = require('./users')
const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

const host = '127.0.0.1' // localhost
const port = 7000 // for queries from the clients
// const port1 = 7001
const tokenKey = 'ba21-dc43-fe65-hg87' // some secret salt
var users = []
// var users = [
//     {
//         "id": 1,
//         "username": "User1",
//         "password": "Password1!",
//         "email": "Advev@mail.ru",
//         "secretResponse": "123",
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEwNjc4NTE5fQ.ujULbXN5ijurNWwGYa7GfBqhBcOK546DVYE5DqNIe54"
//     },
//     {
//         "id": 2,
//         "username": "User2",
//         "password": "Password1!",
//         "email": "advev@mail.ru",
//         'secretResponse': '123',
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzEwNjc4NzA4fQ.hs0DbOyDGNcwFrMojhK7-n1DUESWJWIp-SFirslIoSE"
//     }
// ]

////////////////////////////
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateUsers(cnt) {
  let user

  for (let i = 0; i < cnt; i++) {
    user = {
      "id": i,
      "username": "User" + i.toString(),
      "password": "Password1!",
      "email": "Advev@mail.ru",
      "secretResponse": "123",
      "token": jwt.sign({id: i}, tokenKey)
    }
    users.push(user)
  }
}



app.use(express.json())
// app1.use(express.json())

///////////////////////////////////////////////////////////////////////////
//                                                                       //
// Функция промежуточной обработки, монтируемая в путь /api/auth         //  
// Эта функция выполняется для всех типов запросов HTTP в пути /api/auth //
//                                                                       //
///////////////////////////////////////////////////////////////////////////
app.use('/api/auth/', (req, res, next) => {
  if (users.length === 0) generateUsers(5) // add several users into database

  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      tokenKey,
      (err, payload) => {
        if (err) next()
        else if (payload) {
          for (let user of users) {
            if (user.id === payload.id) {
              const theUser = {
                'id': user.id,
                'username': user.username,
                'password': user.password,
                'email': user.email,
                'secretResponse': user.secretResponse,
                'token': user.token
              }
              req.user = theUser // user
              next()
            }
          }
          if (!req.user) next()
        }
      }
    )
  }
  next()
})


/////////////////////////////////////////////////////////////
app.get('/api/auth/check', (req, res) => { // Проверка токена
  console.log("check authentication token")
  let mes = ""
  // Проверка наличия токена авторизации в хедере
  if (req.headers.authorization) { // если есть, то выделить его в "Bearer eyJhbGciOiJI1NiIs..."
    const token = req.headers.authorization.split(' ')[1]
    // и проверить его
    jwt.verify(token, tokenKey,
      (err, payload) => {
      // console.log(payload)
      if (err) {
          mes = "Authentication token is not valid."
          console.log(mes)
          return res.status(401).json({id: -1, token: mes})
        } else {
          mes = "Authentication token is valid."
          console.log(mes)
          return res.status(200).json({id: payload.id, token: mes})
        }
      }
    )    
  } else {
    mes = "Missing authentication token."
    console.log(mes)
    return res.status(403).json({id: -1, token: mes})
  }
})


////////////////////////////////////////////////////////////////////////
app.post('/api/auth/signin', (req, res) => { // Авторизация пользователя
  let mes = ""
  const bodyUser = req.body
  console.log("signin:")

  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes}) // or 204 No content
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '' ||
      bodyUser.email === '' ||
      bodyUser.secretResponse === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes}) // or 204 No content
  }

  for (let user of users) {
    if (req.body.username === user.username &&
        req.body.password === user.password) {
      console.log(user.id)
      console.log(user.token)
      return res.status(200).json({id: user.id, token: user.token})
    }
  }
  
  mes = "A user with these name and password could not be found."
  console.log(mes)
  return res.status(401).json({id: -1, token: mes}) // 401 Unauthorized
})

////////////////////////////////////////////////////////////////////////
app.post('/api/auth/signup', (req, res) => { // Регистрация пользователя
  let mes = ""
  const bodyUser = req.body
  console.log("signup:")

  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content"
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined' ||
      typeof bodyUser.email === 'undefined' ||
      typeof bodyUser.secretResponse === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes}) // 412 Precondition Failed
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '' ||
      bodyUser.email === '' ||
      bodyUser.secretResponse === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // 204 No content
  }

  for (let user of users) {
    if (bodyUser.username === user.username) {
      mes = "The user is already exist."
      console.log(mes)
      return res.status(409).json({id: -1, token: mes}) // 409 Conflict
    }
  }

  const newId = getRandomInt(999999)
  let newUser = {
      id: newId,
      username: bodyUser.username,
      password: bodyUser.password,
      email: bodyUser.email,
      secretResponse: bodyUser.secretResponse,
      token: jwt.sign({ id: newId }, tokenKey)
  }
  users.push(newUser)

  // return res.status(200).json(newUser)
  mes = "The user is registered successfully."
  console.log(newUser.token)
  console.log(mes)  
  return res.status(200).json({id: newUser.id, token: newUser.token})
})
  

/////////////////////////////////////////////////////////////////////
app.delete('/api/auth/drop', (req, res) => { // Удаление пользователя
  let mes = ""
  const bodyUser = req.body
  console.log("delete:")
  
  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content"
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // 204 No content
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined') {
      mes = "Precondition Failed."
      console.log(mes)
      return res.status(412).json({id: -1, token: mes}) // 412 Precondition Failed
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // 204 No content
  }

  let i = -1
  for (let user of users) {
    i += 1
    if (req.body.username === user.username &&
        req.body.password === user.password) {
      mes = "The user " + user.username + " is deleted successfully." 
      console.log(mes)
      // console.log(user.token)
      users.splice(i, 1); // удалить из массива элемент с записью пользователя
      return res.status(200).json({id: 0, token: mes})
    }
  }

  mes = "A user with this name and password could not be found."
  console.log(mes)
  return res.status(404).json({id: -1, token: mes}) // 401 Unauthorized
})


//////////////////////////////////////////////////////////
app.get('/api/auth/user', (req, res) => { // Get user data
  let mes = ""
  console.log("user:")

  if (req.user) {
    mes = req.user.username
    console.log(mes)
    return res.status(200).json(req.user) // 200 Ok
  } else {
    mes = "Not authorized."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
  }
})


//////////////////////////////////////////////////////////
app.get('/api/auth/data', (req, res) => { // Get some data
  let mes = ""
  console.log("data:")

  if (req.user) {
    mes = "Some data."
    console.log(mes)
    return res.status(200).json({id: 0, token: mes}) // 200 Ok
  } else {
    mes = "Not authorized."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
  }
})


////////////////////////////////////////////////////////////////////////
app.post('/api/auth/reset', (req, res) => { // Сброс пароля пользователя
  let mes = ""
  console.log("reset:")
  const bodyUser = req.body

  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined' ||
      typeof bodyUser.email === 'undefined' ||
      typeof bodyUser.secretResponse === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '' ||
      bodyUser.email === '' ||
      bodyUser.secretResponse === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // No content
  }

  let i = -1
  for (let user of users) {
    i++
    if (bodyUser.username === user.username &&
        bodyUser.email.toLowerCase() === user.email.toLowerCase() &&
        bodyUser.secretResponse === user.secretResponse &&
        bodyUser.password.length > 0) {
      users[i].password = bodyUser.password
      console.log("new password: " + users[i].password)
      let mes = "The user password has changed successfully."
      console.log(mes)
      return res.status(200).json({id: 0, token: mes}) // 200 Ok
    }
  }

  mes = "A user with these name, email and secret response could not be found."
  console.log(mes)
  return res.status(401).json({id: -1, token: mes}) // 401 Unauthorized
})


//////////////////////////////////////////////////////////
app.get('/api/auth/users', (req, res) => { // Get all users
  let mes = ""
  console.log("users:")

  if (req.user) {
    mes = req.user.username
    console.log(mes)
    return res.status(200).json(users) // 200 Ok
  } else {
    mes = "Not authorized."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
  }
})


app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)


// app1.get('/', (req, res) => {
//   // console.log(req)
//   return res.status(401).json(
//     {
//       id: 0,
//       token: "app1"
//     })
// })


// app1.listen(port1, host, () =>
//   console.log(`Server1 listens http://${host}:${port}`)
// )
