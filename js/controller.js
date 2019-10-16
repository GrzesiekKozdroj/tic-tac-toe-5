module.exports = (app) => {

    app.get('/', (req,res)=>{
        res.render('xox');
        //res.sendFile(path.join(__dirname+'/index.html'))
    });

    app.post('/', (req,res)=>{

    });

    app.delete('/', (req,res)=>{

    })
}