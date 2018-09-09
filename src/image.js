export class Image{
    static cropSourceToMatchTarget(
        sourceWidth,
        sourceHeight,
        destinationWidth,
        destinationHeitght){
        var sourceRatio = sourceWidth / sourceHeight;
        var destinationRatio = destinationWidth / destinationHeitght;

        if(math.larger(sourceRatio, destinationRatio)){
            var croppedWidth = Math.floor(sourceHeight * destinationRatio);
            return {width:croppedWidth, height:sourceHeight};
        }
        else if(math.smaller(sourceRatio, destinationRatio)){
            var croppedHeight = Math.floor(sourceWidth / destinationRatio);
            return {width: sourceWidth, height:croppedHeight};
        }
        else{
            return {width:sourceWidth, height:sourceHeight};
        }

    }
}