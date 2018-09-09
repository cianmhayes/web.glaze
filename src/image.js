export class Image{
    static cropSourceToMatchTarget(
        sourceWidth,
        sourceHeight,
        destinationWidth,
        destinationHeitght){
        var sourceRatio = sourceWidth / sourceHeight;
        var destinationRatio = destinationWidth / destinationHeitght;

        if(sourceRatio > destinationRatio){
            var croppedWidth = Math.floor(sourceHeight * destinationRatio);
            return {width:croppedWidth, height:sourceHeight};
        }
        else if(sourceRatio < destinationRatio){
            var croppedHeight = Math.floor(sourceWidth / destinationRatio);
            return {width: sourceWidth, height:croppedHeight};
        }
        else{
            return {width:sourceWidth, height:sourceHeight};
        }
    }

    static divideCanvases(sourceWidth, sourceHeight, destinationWidth, destinationHeight, sourceCellSize){
        var cropping = this.cropSourceToMatchTarget(sourceWidth, sourceHeight, destinationWidth, destinationHeight);
        var horizontalDivisions = Math.ceil(cropping.width / sourceCellSize);
        var verticalDivisions = Math.ceil(cropping.height / sourceCellSize);

        var destinationCellSize = Math.round((destinationWidth / sourceWidth) * sourceCellSize);

        var sourceTop = Math.round((sourceHeight - cropping.height) / 2);
        var sourceLeft = Math.round((sourceWidth - cropping.width) / 2);

        var result = {
            horizontalDivisions: horizontalDivisions,
            verticalDivisions: verticalDivisions,
            sourceX: [],
            sourceY: [],
            sourceCellWidth: [],
            sourceCellHeight:[],
            destinationX: [],
            destinationY: [],
            destinationCellWidth: [],
            destinationCellHeight:[]};
        for(var i = 0; i < horizontalDivisions; i++)
        {
            result.sourceX[i] = sourceLeft + (i * sourceCellSize);
            result.destinationX[i] = (i * destinationCellSize);
            result.sourceCellWidth[i] = Math.min(sourceCellSize, (sourceLeft + sourceWidth) - result.sourceX[i]);
            result.destinationCellWidth[i] = Math.min(destinationCellSize, destinationWidth - result.destinationX[i]);
        }

        for(var j = 0; j < verticalDivisions; j++)
        {
            result.sourceY[j] = sourceTop + (j * sourceCellSize);
            result.destinationY[j] = (j * destinationCellSize);
            result.sourceCellHeight[j] = Math.min(sourceCellSize, (sourceTop + sourceHeight) - result.sourceY[j]);
            result.destinationCellHeight[j] = Math.min(destinationCellSize, destinationHeight - result.destinationY[j]);
        }

        return result;
    }
}