const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {body, validationResult, check} = require('express-validator')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')


require('./utils/db');
const Note = require('./model/List');

const app = express()
const port = 3000

app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(expressLayouts)

app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.listen(port, () => {
    console.log(`Mongo Note App | Listening at http://localhost:${port}`)
})

app.get('/', async (req, res) => {
    const lists = await List.find();

    res.render('list' , {
      layout: 'layouts/main',
      title: 'Beranda | NoteApp',
      lists,
      msg: req.flash('msg')
    });
  })

  app.get('/note/add', (req, res) => {
    res.render('add-note' , {
      layout: 'layouts/main',
      title: 'Tambah Catatan',
    });
  })

  app.post('/note', [
    body('judul').custom(async(value) => {
      const duplikat = await List.findOne({judul: value})
      if(duplikat){
        throw new Error('Terdapat judul yang sama seperti catatan sebelumnya.')
      }
      return true
    })
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      res.render('list', {
        title: 'Beranda | NoteApp',
        layout: 'layouts/main',
        errors: errors.array()
      })
    } else {
      List.insertMany(req.body, (error, result) => {
        req.flash('msg', 'Catatan berhasil ditambahkan')
        res.redirect('/')
      })
    }
  }
  
  )
