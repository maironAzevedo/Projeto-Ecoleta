const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
   express: server,
   noCache: true
})


// configurar caminhos da aplicação
// pagina inicial

server.get("/", (req, res) => {  // req: requisição || res: resposta
   return res.render("index.html")
})




server.get("/create-point", (req, res) => {  // req: requisição || res: resposta
   return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
   // req.body: reflete um dicionario do corpo do nosso formulário
   // inserir dados no banco de dados e tals
   const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
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

   function afterInsertData(err) { //função callback
      if (err) {
         return console.log(err)
         return res.send("Erro no cadastro")
      }

      console.log("Cadastrado com sucesso")

      return res.render("create-point.html", { saved: true })
   }

   db.run(query, values, afterInsertData)
})




server.get("/search", (req, res) => {  // req: requisição || res: resposta

   //pegar os dados do banco de dados
   db.all(`SELECT * FROM places`, function (err, rows) {
      if (err) {
         return console.log(err)
      }

      const total = rows.length

      //mostrar a pagina html com os dados do banco de dados
      return res.render("search-results.html", { places: rows, total })
   })


})


// ligar o servidor
server.listen(3000)