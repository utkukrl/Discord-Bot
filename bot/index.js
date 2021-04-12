const Discord = require("discord.js")

const client = new Discord.Client();

const ytdl = require("ytdl-core")

const youtubeSearch = require("youtube-search")

const opts = (youtubeSearch.YoutubeSearchOptions) = {
    maxResults: 5,
    key: "Key"
}

const servers = {}
const songList = []
let serverList = undefined;

const play = async(connection, message) => {
    const server = servers[message.guild.id]
    const stream = ytdl(server.queue[0], {
        filter: "audioonly",
        quality: "highestaudio"
    })

    server.dispatcher = connection.play(stream)

    server.dispatcher.on("finish", ()=> {
        server.queue.shift();
        if(server.queue[0]){
            play(connection, message)
        }
        else connection.disconnect();
    })

}

client.on("message", (message) => {
    // !ara
    const chatMessage = message.content;
    const splitted = chatMessage.split(" ");
    const [command, ...messageContent] = splitted;
    const messageStr = messageContent.join(" ")

    switch (command) {
        case "!ara":
            youtubeSearch(messageStr, opts, (err, results)=>{
                if (err) return console.log(err)
               console.log(JSON.stringify(results))
                return results
                .filter(item=>item.kind==="youtube#video")
                .map((item,index) => {
                    songList.push(item.link)
                    message.channel.send("No: "+(index +1)+", "+item.title +"\n"+ item.link)
                })
                
            })
            break;
        case "!secim":
            if(!message.member.voice.channel){
                message.channel.send("Ses kanalına üye değilsiniz")
                return
            }

            if(!servers[message.guild.id]){
                servers[message.guild.id] = {
                    queue: []
                }
            }

            serverList = servers[message.guild.id];
            serverList.queue.push(songList[parseInt(messageStr.split(" ")[0])-1])

            console.log(JSON.stringify(serverList.queue))
            if(serverList.queue.length<=1){
                try {
                message.member.voice.channel.join().then((connection)=> {play(connection,message)})
                }
                catch(e) {
                    console.log("hata: "+e)
                }
            }


            break;
    }

})



client.login ("Discord Key")