const nodeHtmlToImage = require('node-html-to-image')
var twit = require('twit')
var fs = require('fs')

var T = new twit({
    consumer_key:         'KrIAnHrkAfbV1cvzJ3fQ19kdG',//consumer_key
    consumer_secret:      'aYRKjP54fuudUgtjvSbnZbwKQtnrzIozM5s3m7fBWOlucyORLa',//consumer_secret
    access_token:         '842727113438326784-AIXtd60WI1Dcb68rLDKcNeuMCUvPEXE',//access_token
    access_token_secret:  'dnjubTEPMEcU5r6aWTbBYlG03dIXX2SBKMBbz1oIICAJd',//access_token secret
})

var stream = T.stream('user');

//listens to the event when someone follows and calls 
//callback function followed 
stream.on('follow', (eventmsg)=> {
	//getting name and username of the user
    var name = eventmsg.source.name;
    var screenName = eventmsg.source.screen_name;
    //var imageUrl = eventmsg.source.profile_image_url;
    //since twitter blocks tweets of same type so we'll associate a
    //unique number using Math.random() or anything you like
    nodeHtmlToImage({
        output: './image.png',
        html: '<!DOCTYPE html> <html lang=""><body> <style> body { margin: 0; background: white; color: #323232; font-family: Helvetica neue, roboto; }.outer{ height: 335px; width: 600px; background:linear-gradient(0deg, rgba(0, 0, 0, 0.575), rgba(65, 65, 65, 0.37)), url("https://source.unsplash.com/600x335/?happy.google,coding"); background-color: rgb(23, 23, 36); display: flex; flex-direction: column; align-items: center; justify-content: center; columns: white; } .profile img{ width: 100px; border-radius: 50%; border: 6px solid white ; } .profile{ color: white; } .thanks{ font-family: cursive; color: white; font-size: 30px; } </style> <div class="outer"> <div class="thanks"> <h4>Thanks For Following</h4> </div> <div class="profile"> <img src="{{profileUrl}}" alt=""><h3>@{{name}}</h3> </div> </div> </body> </html>',
        content: { name: screenName , profileUrl: "https://pbs.twimg.com/profile_images/1241769826726621190/sgoRAS9A_400x400.jpg"}
      })
        .then(() => {console.log('The image was created successfully!'),tweet(screenName)})
      
}
);

function tweet(username){
    //Converting image to base64 to easily upload image on twitter servers
    var b64content = fs.readFileSync('image.png', { encoding: 'base64' })

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string //After uploading we get an id of the image
        var AltText = `Thanks @${username} for following!`; // Your Alt Text
        var meta_params = { media_id: mediaIdStr, alt_text:{ text: AltText} }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)

                var Status= `Thanks @${username} for following!`;//Your Status
                var params = { status: Status, media_ids: [mediaIdStr] }

                //Now It will post the tweet with the image.
                T.post('statuses/update', params, function (err, data, response) {
                    console.log("Tweeted")// Console Logging if tweeted.
                })
            }
        })
    })
  }

