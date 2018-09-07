import { Colour } from '../src/colour.js'
import { should } from 'chai';

should();

describe('Colour', () =>{
    describe('getHue', () => {
        it('red', () =>{
            Colour.getHue(255, 0, 0).should.equal(0);
        });
    });
});