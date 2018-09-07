import * as math from 'mathjs'

export class Colour {
    static getRGB(h, s, l){
        var c = (1 - math.abs((l * 2) - 1)) * s;
        var hPrime = h / 60.0;
        var x = c * (1 - math.abs((hPrime % 2) - 1));
        var m = l - (0.5 * c);
    
        var result = {r: 0, g: 0, b: 0};
        if(math.smallerEq(hPrime,1))
        {
          result = {r:c, g:x, b: 0};
        }
        else if(math.smallerEq(hPrime,2))
        {
          result = {r:x, g:c, b:0};
        }
        else if(math.smallerEq(hPrime,3))
        {
          result = {r:0, g:c, b:x};
        }
        else if(math.smallerEq(hPrime,4))
        {
          result = {r:0, g:x, b:c};
        }
        else if(math.smallerEq(hPrime,5))
        {
          result = {r:x, g:0, b:c};
        }
        else if(math.smallerEq(hPrime,6))
        {
          result = {r:c, g:0, b:x};
        }
    
        result.r = (result.r + m) * 255;
        result.g = (result.g + m) * 255;
        result.b = (result.b + m) * 255;
    
        return result;
    }

    static getHue(r, g, b){
        var max = math.max(r, g, b);
        var min = math.min(r, g, b);
        var c = max - min;
        var hPrime = 0;
        if(math.equal(c,0))
        {
          hPrime = 0;
        }
        else if(math.equal(max,r))
        {
          hPrime = ((g - b) / c) % 6;
        }
        else if(math.equal(max,g))
        {
          hPrime = ((b - r) / c) + 2;
        }
        else if(math.equal(max,b))
        {
          hPrime = ((r -g) / c) + 4;
        }
    
        return hPrime * 60;
    }
}
