const express= require('express'),
methodOverride= require('method-override'),
app =express(),
bodyParser= require('body-parser'),
mongoose =require('mongoose'),
expressSanitizer =require('express-sanitizer');


///////////////// App config ////////////////////

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{ type:Date, default:Date.now}

});

const Blog = mongoose.model('blog',blogSchema);

// Blog.create({
//     title:"husky",
//     image:"https://cdn.pixabay.com/photo/2019/10/21/11/29/siberian-husky-4565849__340.jpg",
//     body:"Image of Husky"
// })

///////////////  Restful routes ////////////////////

app.get("/",(req,res)=>{
    res.redirect('/blogs');
});

// Index route
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err)
            console.log(err);
        else
        res.render('index',{blogs:blogs});;
    });
    
});

// New route

app.get("/blogs/new",(req,res)=>{
    res.render('new');
});

// Create route

app.post("/blogs",(req,res)=>{
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newblog)=>{
        if(err)
            res.render('new');
        else
            res.redirect('/blogs')
    })
});


// Show route

app.get('/blogs/:id',(req,res)=>{
    
    Blog.findById(req.params.id, (err,foundblog)=>{
        if(err)
            res.redirect('/blogs');
        else
            res.render('show',{blog:foundblog});
    });
});

// Edit route

app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,foundblog)=>{
        if(err)
            res.redirect('/blogs');
        else
            res.render('edit',{blog:foundblog});
    })
    
})

// Update route

app.put('/blogs/:id',(req,res)=>{
    req.body.blog.body= req.sanitize(req.body.blog.body);
                           //(id, new data, callback)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else
            res.redirect('/blogs/'+req.params.id);
    })
})

// Delete route

app.delete('/blogs/:id',(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
            console.log(err);
        else
            res.redirect('/blogs');
    })
})

app.listen(3000,()=>{
    console.log("server started");
});