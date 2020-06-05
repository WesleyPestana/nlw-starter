const express = require('express')
const server = express()

const db = require('./database/db')

server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

// Nunjucks config
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
  express: server,
  noCache: true
})

server.get('/', (req, res) => {
  return res.render('index.html')
})

server.get('/create-point', (req, res) => {
  return res.render('create-point.html')
})

server.post('/create-point', (req, res) => {
  const query = `
    INSERT INTO places (image, name, address, address2, state, city, items) 
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ]

  db.run(query, values, function(err) {
      if (err) {
        return console.log(err)
      }
      console.log('Cadastrado com sucesso')
      console.log(this)

      return res.render('create-point.html', { saved: true })
    })

})

server.get('/search-results', (req, res) => {
  const search = req.query.search
  
  if (search == '') {
    return res.render('search-results.html', { total: 0 })
  }
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if (err) {
      return console.log(err)
    }
    return res.render('search-results.html', { places: rows, total: rows.length })
  })
})


server.listen(3000)