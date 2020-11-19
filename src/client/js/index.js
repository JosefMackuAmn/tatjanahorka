// ORGANIZATIONS

const organizationContainer = document.querySelector('.organizations__container');
const organizationElements = [...organizationContainer.children];

organizationElements.forEach((organization, id) => {
    const waterLily = organization.querySelector('.organizations__svg--waterlily');
    
    waterLily.addEventListener('mouseenter', () => {
       createWaveAnimation(id);
    })
})  
   


const animations = document.createElement('style');
document.documentElement.appendChild(animations);

const angleCorrection = -1;

let animationCounter = 0;
let keyframesList = [];

// Setting max amount of waves that can appear
const maxWaves = 5;
const waveRange = 10;

const animateWave = (wave, organizationIndex) => {
    const randomAngle = Math.random()*2*Math.PI;

    const moveX = Math.cos(randomAngle)*waveRange;
    const moveY = Math.sin(randomAngle)*waveRange;

    const animationId = animationCounter;
    const animationName = `waveAnimation--${organizationIndex}--${animationId}`
    animationCounter++;

    console.log(moveX);
    console.log(moveY);

    const keyframes = `@keyframes ${animationName} {
        0% {
            transform: scale(0.1) translateX(0) translateY(0) rotate(${randomAngle + angleCorrection}rad);
        }
        100% {
            transform: scale(2) translateX(${moveX}rem) translateY(${moveY}rem) rotate(${randomAngle + angleCorrection}rad);
            opacity : 0;
            
        }
    }`

    keyframesList.push({id: animationId, keyframes: keyframes});

    animations.textContent = keyframesList.map(item => item.keyframes).join(' ');

    wave.style.animation = `${animationName} 3s forwards`;

    wave.addEventListener('animationend', () => {
        keyframesList.splice(keyframesList.findIndex((item) => {
            return animationId === item.id;
        }), 1);
        console.log()
        animations.textContent = keyframesList.map(item => item.keyframes).join(' ');
        wave.parentElement.removeChild(wave);
    });
}
const spawnWave = (id) => {
    const wave = document.createElement('div');
    wave.classList = `organizations__wave organizationions__wave--${id}`;

    return wave;
}

const createWaveAnimation = (organizationIndex) => {

    const organization = organizationElements[organizationIndex];

    const waveNum = Math.floor(Math.random()*maxWaves + 1);
    for(let i = 0; i < waveNum; i++) {
        const wave = spawnWave(i);
        organization.appendChild(wave);
        animateWave(wave, organizationIndex);
    }
}

const maxTimeout = 15000;
const minTimeout = 5000;

const randomTimeout = () => minTimeout + (maxTimeout-minTimeout)*Math.random();
const timeOutAnimation = () => {

    setTimeout(() => {
        const organizationIndex = Math.floor(Math.random()*3);
        createWaveAnimation(organizationIndex);
        timeOutAnimation();
    
    }, randomTimeout())
}
//timeOutAnimation();
// Selecting random whole number which is positive and less than 3 ({0, 1, 2})
/* const organizationIndex = Math.floor(Math.random()*3);
createWaveAnimation(organizationIndex); */