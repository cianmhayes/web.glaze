import 'mocha'
import { should } from 'chai'
import { Colour } from '../src/colour.js'

should()

describe('Colour', () => {
    describe('getHue', () => {
        it('red', () => {
            Colour.getHue(255, 0, 0).should.equal(0)
        });
        it('mustard', () => {
            Math.round(Colour.getHue(255, 185, 0)).should.equal(44)
        });
        it('dark mustard', () => {
            Math.round(Colour.getHue(89, 71, 21)).should.equal(44)
        })
    })
})
