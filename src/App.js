import './App.css';
import ReactS3 from '.././node_modules/react-s3';

const accessKeyId = process.env.REACT_APP_aws_access_key;
const secretAccessKey = process.env.REACT_APP_aws_secret_key;
const bearerToken = process.env.REACT_APP_bearer_token;

const config = {
  bucketName: 'task5-images',
  region: 'us-east-1',
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
}

function App() {
  return (
    <div className="App">
      <div>
        <h1>
          AWS S3 Upload
        </h1>
        <input id= "img" type = "file" onChange = {upload}/>
        <div><img id= "show" alt="your uploaded image" style={{'max-height':'20vw'}}></img></div>
        <h2 id="titlelink" style={{display:'none'}}>Your bitly link : </h2>
        <a id="bit" href=""></a>
      </div>
    </div>
    
  );
}


function upload(e){
  console.log(e.target.files[0]);
  var shower = document.getElementById('show');
  shower.src = URL.createObjectURL(e.target.files[0]);
  ReactS3.uploadFile(e.target.files[0], config).then((data)=>{
    console.log(data.location);
    shortenLink(data.location)
  }).catch((err)=>{
    alert(err);
  })
}



async function shortenLink(url){

  let hold = {
    "long_url": url,
    "domain": "bit.ly"
  }

  const options = {
    method:'POST',
    headers:{'Authorization' : 'Bearer '+bearerToken,'Content-Type': 'application/json'},
    body: JSON.stringify(hold)
  }

  const request = new Request('https://api-ssl.bitly.com/v4/shorten',options)

  const response = await fetch(request);

  response.json().then(data=>{
    var y = document.getElementById("bit")
    var x = document.getElementById("titlelink")
    x.style.display = "";
    y.href = data['link']
    y.innerHTML = data['link']
  });
}

export default App;
