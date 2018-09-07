import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

function floatEquals(lhs, rhs){
  return Math.abs(lhs - rhs) < 0.00000001;
}

class WebCam extends Component {
  constructor(props){
    super();
    this.state = {videoSrc: null, width: parseInt(props.width), height: parseInt(props.height), cellSize: parseInt(props.cellSize)}
  }

  componentDidMount(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, width: this.state.width, height: this.state.height}, this.initializeVideo.bind(this), this.videoError);
    }
  }

  initializeVideo(stream){
    this.setState({videoSrc: window.URL.createObjectURL(stream)});
    this.timerId = setInterval( () => this.tick(), 40);
  }

  videoError(){
  }

  tick(){
    var video = document.querySelector("#video");
    var canvas = document.querySelector("#tempCanvas");
    var outputCanvas = document.querySelector("#outputCanvas");
    var context = canvas.getContext('2d');
    var outputContext = outputCanvas.getContext('2d');
    context.drawImage(video, 0, 0, this.state.width, this.state.height);

    for(var x = 0; x < (this.state.width); x += this.state.cellSize)
    {
      for(var y = 0; y < (this.state.height); y += this.state.cellSize)
      {
        var pixels = context.getImageData(x, y, this.state.cellSize, this.state.cellSize);
        var newColour = this.getRGB(this.getAverageHue(pixels, this.state.cellSize), 0.75, 0.6);

        var byteCount = this.state.cellSize * this.state.cellSize * 4;
        var newPixels = outputContext.createImageData(this.state.cellSize, this.state.cellSize);
        for(var i = 0; i < byteCount; i += 4)
        {
          newPixels.data[i] = newColour.r;
          newPixels.data[i + 1] = newColour.g;
          newPixels.data[i + 2] = newColour.b;
          newPixels.data[i + 3] = 255;
        }

        outputContext.putImageData(newPixels, x, y, 0, 0, this.state.cellSize, this.state.cellSize);
      }
    }
  }

  getRGB(h, s, l)
  {
    var c = (1 - Math.abs((l * 2) - 1)) * s;
    var hPrime = h / 60.0;
    var x = c * (1 - Math.abs((hPrime % 2) - 1));
    var m = l - (0.5 * c);

    var result = {r: 0, g: 0, b: 0};
    if(hPrime <= 1)
    {
      result = {r:c, g:x, b: 0};
    }
    else if(hPrime <= 2)
    {
      result = {r:x, g:c, b:0};
    }
    else if(hPrime <= 3)
    {
      result = {r:0, g:c, b:x};
    }
    else if(hPrime <= 4)
    {
      result = {r:0, g:x, b:c};
    }
    else if(hPrime <= 5)
    {
      result = {r:x, g:0, b:c};
    }
    else if(hPrime <= 6)
    {
      result = {r:c, g:0, b:x};
    }

    result.r = (result.r + m) * 255;
    result.g = (result.g + m) * 255;
    result.b = (result.b + m) * 255;

    return result;
  }

  getAverageHue(pixels, cellSize){
    var totalHue = 0;
    var pixelCount = (pixels.height * pixels.width * 4);
    var sumSin = 0;
    var sumCos = 0;
    for(var p = 0; p < pixelCount; p += 4)
    {
      var hue = this.getHue(pixels.data[p] / 255.0, pixels.data[p+1] / 255.0, pixels.data[p+2] / 255.0);
      var radians = hue * (Math.PI / 180.0);
      sumSin += Math.sin(radians);
      sumCos += Math.cos(radians);
    }

    var averageHue = ((Math.atan2(sumSin, sumCos) * (180.0 / Math.PI)) + 360 ) % 360;

    return averageHue;
  }

  getHue(r, g, b)
  {
    
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var c = max - min;
    var hPrime = 0;
    if(floatEquals(c,0))
    {
      hPrime = 0;
    }
    else if(floatEquals(max,r))
    {
      hPrime = ((g - b) / c) % 6;
    }
    else if(floatEquals(max,g))
    {
      hPrime = ((b - r) / c) + 2;
    }
    else if(floatEquals(max,b))
    {
      hPrime = ((r -g) / c) + 4;
    }

    return hPrime * 60;
  }

  render() {
    return (
      <div id="webcam">
        <canvas id="tempCanvas" width={this.state.width} height={this.state.height} style={{display: 'none'}}></canvas>
        <video id="video" src={this.state.videoSrc} autoPlay="true" hidden="true" width={this.state.width} height={this.state.height}></video>
        <canvas id="outputCanvas" width={this.state.width} height={this.state.height} visible="true"></canvas>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <WebCam width='640' height='480' cellSize='20'/>
      </div>
    );
  }
}

export default App;
