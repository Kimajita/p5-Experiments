let myShader;
let mic, fft, env;

window.addEventListener('resize', resize);

function resize() {
    resizeCanvas(windowWidth, windowHeight);
}

async function setup() {
    myShader = await loadShader('./shader.vert', './shader.frag');
    createCanvas(windowWidth, windowHeight, WEBGL);

    let context = getAudioContext();

    mic = new p5.AudioIn();
    mic.start(); mic.disconnect();

    fft = new p5.FFT();
    mic.connect(fft);
}

function draw() {
    background(42);
    shader(myShader);

    myShader.setUniform('u_resolution', [width, height]);
    myShader.setUniform('u_time', millis() / 1000);

    noStroke();
    rect(0, 0, windowWidth, windowHeight);

    //AUDIO
    let spectrum = fft.analyze();
    let wave = fft.waveform();

    let meanVol = 0;
    for (let i = 0; i < spectrum.length; i++) { meanVol += spectrum[i]; }

    myShader.setUniform('u_spectrum', spectrum);
    myShader.setUniform('u_wave', wave);
    myShader.setUniform('u_vol', meanVol);

    //console.log(wave);
}
