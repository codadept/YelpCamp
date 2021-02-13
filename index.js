const   express         = require('express'),
        app             = express(),
        methodOverride  = require('method-override'),
        path            = require('path'),
        mongoose        = require('mongoose')


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))

const PORT = 3000;
app.listen(PORT,()=>{
    console.log('THE SERVER RUNNING ON PORT ', PORT)
})