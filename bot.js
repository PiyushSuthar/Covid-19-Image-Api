const puppeteer = require('puppeteer')
var twit = require('twit')
var fs = require('fs')

var T = new twit({
    consumer_key:         'KrIAnHrkAfbV1cvzJ3fQ19kdG',//consumer_key
    consumer_secret:      'aYRKjP54fuudUgtjvSbnZbwKQtnrzIozM5s3m7fBWOlucyORLa',//consumer_secret
    access_token:         '842727113438326784-AIXtd60WI1Dcb68rLDKcNeuMCUvPEXE',//access_token
    access_token_secret:  'dnjubTEPMEcU5r6aWTbBYlG03dIXX2SBKMBbz1oIICAJd',//access_token secret
})

T.get('account/verify_credentials', {
    include_entities: false,
    skip_status: true,
    include_email: false
}, onAuthenticated)


 function onAuthenticated(err){
    if (err) {
        console.log(err)
    } else {
    console.log('Authentication successful.')

    var stream =  T.stream('statuses/filter', { track: ['@PiyushSthr'] });
    stream.on('tweet', (eventmsg)=> {
        //getting name and username of the user
        var name = eventmsg.name;
        var screenName = eventmsg.screen_name;
        var imageUrl = eventmsg.profile_image_url;
        var nameID  = eventmsg.id_str;
        var text = "Thanks for Mention!"
        //since twitter blocks tweets of same type so we'll associate a
        //unique number using Math.random() or anything you like
        const htmlString = `<!DOCTYPE html> 
        <html lang="">
           <body>
              <style> body { margin: 0; Height:350px;width:600px; background: white; color: #323232; font-family: Helvetica neue, roboto; }.outer{ height: 335px; width: 600px; background:linear-gradient(0deg, rgba(0, 0, 0, 0.575), rgba(65, 65, 65, 0.37)), url("https://source.unsplash.com/600x335/?happy.google,coding"); background-color: rgb(23, 23, 36); display: flex; flex-direction: column; align-items: center; justify-content: center; columns: white; } .profile img{ width: 100px; border-radius: 50%; border: 6px solid white ; } .profile{ color: white; } .thanks{ font-family: cursive; color: white; font-size: 30px; } </style>
              <div class="outer">
                 <div class="thanks">
                    <h4>${text}</h4>
                 </div>
                 <div class="profile">
                    <img src="${imageUrl}" alt="">
                    <h3>@${screenName}</h3>
                 </div>
              </div>
           </body>
        </html>`;

        async function getIt(){
            console.log("Getting")
            const browser = await puppeteer.launch({
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              })
            const page = await browser.newPage()
            await page.setViewport({
                width: 600,
                height: 350
            });
            await page.setContent(htmlString)
            await page.screenshot({path: 'image.png'})
            await browser.close()
          }
          getIt().then(tweet(screenName,nameID))
          
    });
}}

function tweet(username,nameID){
    console.log("Tweeting")
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
                var random = Math.floor(Math.random * 10);
                var Status= `Thanks @${username} for following! Your lucky no. is ${random}`;//Your Status
                var params = { status: Status, media_ids: [mediaIdStr], in_reply_to_status_id: nameID }

                //Now It will post the tweet with the image.
                T.post('statuses/update', params, function (err, data, response) {
                    console.log("Tweeted")// Console Logging if tweeted.
                })
            }
        })
    })
  }

