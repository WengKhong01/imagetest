import './App.css';
import ReactS3 from 'react-s3';

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
        <h2 id="titlelink"></h2>
        <a id="bit"></a>
      </div>
    </div>
    
  );
}


function upload(e){
  console.log(e.target.files[0]);
  var shower = document.getElementById('show');
  shower.src = URL.createObjectURL(e.target.files[0]);
  var x = document.getElementById("titlelink")
  var y = document.getElementById("bit")
  y.innerHTML = "";
  x.innerHTML = "loading";
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

  const response = await fetchRetry(request);

  response.json().then(data=>{
    console.log(data)
    var y = document.getElementById("bit")
    var x = document.getElementById("titlelink")
    x.innerHTML = "Your bitly link :";
    y.href = data['link']
    y.innerHTML = data['link']
  });
  

  
}

function fetchRetry(url,options, retries = 3){

  return fetch(url,options).then(response => {
    if (response.ok){
      return response
    } 
    
    if (retries > 0){
      return fetchRetry(url,options,retries-1)
    } else {
      throw new Error(response)
    }
    
  }).catch(console.error)

}

export default App;
