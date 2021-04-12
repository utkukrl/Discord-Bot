const Discord=require("discord.js");

const client=new Discord.Client();

const userData={}

client.on("message",message=>{
    console.log("Gelen mesaj"+message.content)

    if(message.content==="/")
    message.channel.send("/")

    if(message.content==="/")
    message.reply("/")


    if(message.content==="/")
    message.channel.send("/")

    
    if(message.content==="/")
    message.reply("/ ")

   
    if(message.content==="/")
    message.channel.send("/")

    

    
})
    
    
      


   





























client.login("Key")

