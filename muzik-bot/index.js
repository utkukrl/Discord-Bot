 const Discord =require('discord.js')

const client= new Discord.Client();

const ytdl=require('ytdl-core')

const servers={

}
let server=undefined;

const play=async(connection,message)=>{
    const server=servers[message.guild.id];
    const stream=ytdl(server.queue[0],{
        filter:"audioonly",
        quality:"highestaudio"
    })
    server.dispatcher = connection.play(stream);
    let song=await (await ytdl.getInfo(server.queue[0])).videoDetails.title;
    server.dispatcher.on("finish",()=>{
        server.queue.shift();
        if(server.queue[0]){
            message.channel.send("Şarkı geçildi: "+song)
            play(connection,message)
        }
        else connection.disconnect();
    })
}

client.on("message",message=>{
    console.log("gelen mesaj: "+message.content)

    const parsedMessage=message.content.split(" ") //!oynat URL

    switch (parsedMessage[0]) {
        case "!oynat":
            if(!parsedMessage[1]){
            message.channel.send("Link girmelisiniz!")
            return;
            }

            if(!message.member.voice.channel){
            message.channel.send("Şarkıyı oynatabilmek için ses kanalında olmalısınız!")
                return;
            }

            if(!servers[message.guild.id])
            servers[message.guild.id]={
                queue:[]
            }

            server=servers[message.guild.id]
            server.queue.push(parsedMessage[1])

            if(server.queue.length<=1)
            try{
                message.member.voice.channel.join().then(connection=>{
                    play(connection,message)
                })
            }catch(e){
                console.log("hata oluştu"+e)
            }
            break;
        case "!gec":
            if(server.dispatcher)server.dispatcher.end();
            break;
        case "!dur":
            if(message.guild.voice.channel){
                server.dispatcher.end()
                console.log("kuyruk durduruldu")
            }
            if(message.guild.connection)
            message.guild.voice.connection.disconnect();
            break;
        default:
            break;
    }
})







client.login("Key")