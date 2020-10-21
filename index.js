const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

//middleware uvik prije rute
app.use(express.json())
const zahtjevInfo = (req, res, next) => {
    console.log('Metoda:', req.method)
    console.log('Putanja:', req.path)
    console.log('Tijelo:', req.body)
    console.log('---')
    next()
  }
  
  app.use(zahtjevInfo)

let poruke = [
  {
    id: 1,
    sadrzaj: 'HTML je jednostavan',
    vazno: true
  },
  {
    id: 2,
    sadrzaj: 'React koristi JSX sintaksu',
    vazno: false
  },
  {
    id: 3,
    sadrzaj: 'GET i POST su najvaznije metode HTTP protokola',
    vazno: true
  }
]
//rute
app.get('/', (req, res) => {
    res.send("<h1>Pozdrav od Express servera i nodemona </h1>")
})
app.get('/api/poruke', (req, res) => {
    res.json(poruke)
})

app.get('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    const poruka = poruke.find(p => p.id === id)

    //ako je poruka undefined vraca false
    if(poruka){
        res.json(poruka)
    } else {
        res.status(404).end();
    }
})
app.delete('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    poruke = poruke.filter(p => p.id !== id)

    res.status(204).end()
})
app.post('/api/poruke', (req, res) => {
    const maxId = poruke.length > 0 
    ? Math.max(...poruke.map(p => p.id))
    : 0

    const podatak = req.body
    if(!podatak.sadrzaj){
        return res.status(400).json({
            error: "Nedostaje sadržaj poruke"
        })
    }
    const poruka = {
        sadrzaj: podatak.sadrzaj,
        vazno: podatak.vazno || false,
        datum: new Date(),
        id: maxId + 1
    }
    poruke = poruke.concat(poruka)
    res.json(poruka)
})
app.put('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    const podatak = req.body
    poruke = poruke.map(p => p.id !== id ? p : podatak)
    res.json(podatak)

})

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta' })
  }
  
  app.use(nepoznataRuta)

const PORT = 3001
app.listen(PORT, () => {
console.log(`Posluzitelj je pokrenut na portu ${PORT}`);
})
