import 'mocha'
import { should } from 'chai'
import {Image} from '../src/image.js'

should()

describe('Image', () => {
    describe('cropSourceToMatchTarget', () => {
        it('equal dimensions', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 640, 480);
            result.width.should.equal(640);
            result.height.should.equal(480);
        });
        it('equal ratio, different dimensions', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 320, 240);
            result.width.should.equal(640);
            result.height.should.equal(480);
        });
        it('narrower destination, equal height', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 320, 480);
            result.width.should.equal(320);
            result.height.should.equal(480);
        });
        it('narrower destination, shorter height', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 320, 400);
            result.width.should.equal(384);
            result.height.should.equal(480);
        });
        it('narrower destination, taller height', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 320, 500);
            result.width.should.equal(307);
            result.height.should.equal(480);
        });
        it('wider destination, equal height', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 720, 480);
            result.width.should.equal(640);
            result.height.should.equal(426);
        });
        it('wider destination, shorter height', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 720, 200);
            result.width.should.equal(640);
            result.height.should.equal(177);
        });
        it('wider destination, taller height', () => {
            let result = Image.cropSourceToMatchTarget(640, 480, 1024, 640);
            result.width.should.equal(640);
            result.height.should.equal(400);
        });
    })
})