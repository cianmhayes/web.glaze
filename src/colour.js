
const epsilon = 0.000001;

export class Colour {

  static toRadians(degrees){
    return degrees  * (Math.PI / 180.0);
  }

  static toDegrees(radians){
    return ((radians  * (180.0 / Math.PI)) + 360 ) % 360;
  }

    static getRGB(h, s, l){
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

    static areEqual(lhs, rhs)
    {
      return Math.abs(lhs - rhs) <= epsilon;
    }

    static getHue(r, g, b){
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var c = max - min;
        var hPrime = 0;
        if(Colour.areEqual(c,0))
        {
          hPrime = 0;
        }
        else if(Colour.areEqual(max,r))
        {
          hPrime = ((g - b) / c) % 6;
        }
        else if(Colour.areEqual(max,g))
        {
          hPrime = ((b - r) / c) + 2;
        }
        else if(Colour.areEqual(max,b))
        {
          hPrime = ((r -g) / c) + 4;
        }
    
        return hPrime * 60;
    }
}
