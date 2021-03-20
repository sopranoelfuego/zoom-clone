const express=require("express")

const http=require('http')
const {v4:uuidv4} =require('uuid')
const port=process.env.PORT || 5000
const {ExpressPeerServer}=require('peer')

const app=express()

const server=http.createServer(app)
const io=require('socket.io')(server)
const peerServe=ExpressPeerServer(server,{
 debug:true   
})
app.use('/peerjs',peerServe)
app.set("view engine",'ejs')
server.listen(port,()=>console.log("app running on port",port))
 
app.use(express.static('public'))
//THIS MIDDLWARE MEANS THAT WHEN WE GO ON LOCALHOST:5000 WE ARE AUTOMATICALLY 
//REDIRECT TO LOCALHOST:5000/SPECIFIC ROOMID

io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
           socket.join(roomId)
           socket.to(roomId).emit("user-connected",userId)
           socket.on('message',message =>{
                     io.to(roomId).emit('createdMessage', message)
           })
           
    })

})
app.get('/',(req,res)=>{
      res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
       res.render('room',{roomId:req.params.room})
})
