import React, { Component } from 'react';
import { Colour } from './colour.js';
import { Image } from './image.js';
import './App.css';

class WebCam extends Component {
  constructor(props){
    super();
    this.state = {
      videoSrc: null,
      defaultOutputWidth: parseInt(props.defaultOutputWidth),
      defaultOutputHeight: parseInt(props.defaultOutputHeight),
      inputWidth: parseInt(props.inputWidth),
      inputHeight: parseInt(props.inputHeight),
      inputCellSize: parseInt(props.inputCellSize)};
    this.imageStyle = "ArrowLeft";
  }

  handleFullScreenChange(){
    var canvas = document.querySelector("#outputCanvas");
    if(document.webkitIsFullScreen || document.mozIsFullScreen)
    {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.canvasDivisions = Image.divideCanvases(this.state.inputWidth, this.state.inputHeight, window.innerWidth, window.innerHeight, this.state.inputCellSize / 2);
    }
    else
    {
      canvas.width = this.state.defaultOutputWidth;
      canvas.height = this.state.defaultOutputHeight;
      this.canvasDivisions = Image.divideCanvases(this.state.inputWidth, this.state.inputHeight, this.state.defaultOutputWidth, this.state.defaultOutputHeight, this.state.inputCellSize);
    }
  }

  componentDidMount(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, width: this.state.inputWidth, height: this.state.inputHeight}, this.initializeVideo.bind(this), this.videoError);
    }

    document.onkeyup = this.toggleImageStyle.bind(this);
    document.onwebkitfullscreenchange = this.handleFullScreenChange.bind(this);
    document.onmozfullscreenchange = this.handleFullScreenChange.bind(this);
    document.onfullscreenchange = this.handleFullScreenChange.bind(this);
  }

  initializeVideo(stream){
    this.setState({videoSrc: window.URL.createObjectURL(stream)});
    this.timerId = setInterval( this.tick.bind(this), 40);
    this.video = document.querySelector("#video");
    this.canvas = document.querySelector("#tempCanvas");
    this.outputCanvas = document.querySelector("#outputCanvas");
    this.context = this.canvas.getContext('2d');
    this.outputContext = this.outputCanvas.getContext('2d');

    this.canvasDivisions = Image.divideCanvases(this.state.inputWidth, this.state.inputHeight, this.state.defaultOutputWidth, this.state.defaultOutputHeight, this.state.inputCellSize);
  }

  videoError(){
  }

  tick(){
    this.context.drawImage(this.video, 0, 0, this.state.inputWidth, this.state.inputHeight);

    for(var i = 0; i < this.canvasDivisions.horizontalDivisions; i++)
    {
      for(var j = 0; j < this.canvasDivisions.verticalDivisions; j++)
      {
        var pixels = this.context.getImageData(
          this.canvasDivisions.sourceX[i],
          this.canvasDivisions.sourceY[j],
          this.canvasDivisions.sourceCellWidth[i],
          this.canvasDivisions.sourceCellHeight[j]);
        var newPixels = this.outputContext.createImageData(this.canvasDivisions.destinationCellWidth[i], this.canvasDivisions.destinationCellHeight[j]);

        var newColour = {r: 0, g: 0, b:0};
        switch(this.imageStyle){
          case "ArrowRight":
            newColour = Colour.getRGB(this.getAverageHue(pixels.data), 0.75, 0.6);
            break;
          case "ArrowLeft":
            var luma = Colour.getAverageLuma(pixels.data);
            newColour = {r: luma, g: luma, b: luma};
            break;
        }
        
        for(var p = 0; p < newPixels.data.length; p += 4)
        {
          newPixels.data[p] = newColour.r;
          newPixels.data[p + 1] = newColour.g;
          newPixels.data[p + 2] = newColour.b;
          newPixels.data[p + 3] = 255;
        }

        this.outputContext.putImageData(
          newPixels,
          this.canvasDivisions.destinationX[i],
          this.canvasDivisions.destinationY[j],
          0,
          0,
          this.canvasDivisions.destinationCellWidth[i],
          this.canvasDivisions.destinationCellHeight[j]);
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

  goFullScreen(e) {
    e.preventDefault();

    var canvas = document.querySelector("#outputCanvas");
    if(canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    }
    else {
      canvas.mozRequestFullScreen();
    }
  }

  toggleImageStyle(e){
    e.preventDefault();
    switch(e.key){
      case "ArrowLeft":
      case "ArrowRight":
        this.imageStyle = e.key;
    }
  }

  render() {
    return (
      <div id="webcam">
        <div>
          <canvas id="tempCanvas" width={this.state.inputWidth} height={this.state.inputHeight} style={{display: 'none'}}></canvas>
          <video id="video" src={this.state.videoSrc} autoPlay="true" hidden="true" width={this.state.width} height={this.state.height}></video>
          <canvas id="outputCanvas" width={this.state.defaultOutputWidth} height={this.state.defaultOutputHeight} visible="true"></canvas>
        </div>
        <div>
          <a href="#" onClick={this.goFullScreen.bind(this)}>Full-screen</a>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <WebCam
          defaultOutputWidth='640'
          defaultOutputHeight='480'
          inputWidth='640'
          inputHeight='480'
          inputCellSize='20'/>
      </div>
    );
  }
}

export default App;
