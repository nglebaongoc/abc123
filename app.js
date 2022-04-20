const express = require('express')
const async = require('hbs/lib/async')
const { default: mongoose } = require('mongoose')
const Product = require('./models/Product')
const app = express()
app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

app.post('/edit', async (req, res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.txtPic
    //await Product.updateOne({'_id':id}, {$set: {'name':name, 'price':price, 'picURL':picURL}})

    var prod = await Product.findById(id)
    prod.name = name
    prod.price = price
    prod.picURL = picURL
    prod.save((err)=>{
        if(err)
        console.log("Ok")
        res.redirect("/viewAll")
    })
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const prod = await Product.findById(id)

    res.render('edit',{'product':prod})
})

app.get('/', (req,res)=>{
    res.render('home')
})
app.get('/new', (req,res)=>{
    res.render('newProduct')
})

app.post('/search', async (req, res)=>{
    const searchText = req.body.txtSearch
    const query = await Product.find({'name' :searchText})
    res.render('allProduct', {'products':query})
})

app.get('/delete', async (req, res)=>{
    const id = req.query.id
    await Product.deleteOne({'_id': id})
    res.redirect('/viewAll')
})

app.get('/viewAll', async(req,res)=>{
    const query = await Product.find()
    res.render('allProduct', {'products':query})
   // const query =  Product.find({}, (err,result)=>{
    //    if(err)
      //      console.log(err)
        //else
           // result.forEach(element => {
           // console.log(element.name)
           // });
        //res.render('allProduct', {products:result})
    })

app.post('/nameProduct', async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.txtPic

var mongoDB ='mongodb+srv://ngungu:ngungu@cluster0.mihzw.mongodb.net/test '
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
    var db = mongoose.connection;
    const productEntity = new Product({'name':name,'price':price,'picURL':picURL})
    await productEntity.save()
    res.redirect('/')

})

const PORT = process.env.PORT || 5000

app.listen(PORT)
console.log("Server is running!")
