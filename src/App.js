import React, { Component } from 'react';
import {Colour} from './colour.js';
import './App.css';


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
    this.timerId = setInterval( this.tick.bind(this), 40);
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
        var newColour = Colour.getRGB(this.getAverageHue(pixels.data), 0.75, 0.6);

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

  getAverageHue(rgbaPixels){
    var sumSin = 0;
    var sumCos = 0;
    var pixelCount = rgbaPixels.length;
    for(var p = 0; p < pixelCount; p += 4)
    {
      var hue = Colour.getHue(rgbaPixels[p] / 255.0, rgbaPixels[p+1] / 255.0, rgbaPixels[p+2] / 255.0);
      var radians = Colour.toRadians(hue);
      sumSin += Math.sin(radians);
      sumCos += Math.cos(radians);
    }

    var averageHue = Colour.toDegrees(Math.atan2(sumSin, sumCos));

    return averageHue;
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
