// UTILITY FUNCTIONS

// Rendering the element or removing it from the screen smoothly - with animations
// The element must have 3 CSS Classes available - hidden class, visible class, hiding class
// Hidden class - display: none, no animation
// Visible class - display: block (or whatever except none) and an animation of the element appearing on the page (sliding -in or so)
// Hiding class - animation of the element disappearing
// Element has only one of these classes at a time.
// The hiding class is changed to hidden class after 'animationend' event on the element
const showOrHideEl = (element, cssClass) => {
    if([...element.classList].includes(`${cssClass}--hidden`)) {
        element.classList.remove(`${cssClass}--hidden`);
        element.classList.add(`${cssClass}--visible`);
    } else if ([...element.classList].includes(`${cssClass}--visible`)) {
        element.classList.remove(`${cssClass}--visible`);
        element.classList.add(`${cssClass}--hiding`);
    } else {
        element.classList.remove(`${cssClass}--hiding`);
        element.classList.add(`${cssClass}--hidden`);
    }
}

// ORGANIZATIONS

const organizationContainer = document.querySelector('.organizations__container');
const organizationElements = [...organizationContainer.children];

//When mouse cursor enters organization div, rendering animation
organizationElements.forEach((organization, id) => {
    organization.addEventListener('mouseenter', () => {
       createWaveAnimation(id);
    })
})  
   
// Creating hidden style element for @keyframes 
const animations = document.createElement('style');
document.documentElement.appendChild(animations);

// The wave svg isn´t by default pointing to 0 rad, so I experimentally found out the angle correction
const angleCorrection = -1; //[rad]

// Counting each wave animation creating. This count is used for creating unique animation id´s
let animationCounter = 0;

// Managing all currently needed @keyframes in an array
let keyframesList = [];

// Setting max amount and min amount of waves that can appear
const maxWaves = 6;
const minWaves = 3;

//Setting initial wave range
let waveRange = 10; //[rem]

// This function sets the wave range taking the window size in account 
const setUpWaveRange = () => {
    if(document.documentElement.clientWidth < 1100 && document.documentElement.clientWidth >= 800) {
        waveRange = 7;
    } else if (document.documentElement.clientWidth < 800) {
        waveRange = 6;
    } else {
        waveRange = 10;
    }
}

// Whenever window is resized, configuring the wave range, so the wave range is "responsive"
window.addEventListener('resize', () => {
    setUpWaveRange();
})

// Function animates wave element in specified organization element
const animateWave = (wave, organizationIndex) => {

    //Generating random angle to get direction, in which the wave will move
    const randomAngle = Math.random()*2*Math.PI;

    //Generating X and Y offset from the original position based on the random angle
    const moveX = Math.cos(randomAngle)*waveRange;
    const moveY = Math.sin(randomAngle)*waveRange;

    //Animation id refers to the total amount of animations created, therefore is unique
    const animationId = animationCounter;

    //Generating @keyframes identifier - animation name
    const animationName = `waveAnimation--${organizationIndex}--${animationId}`
    animationCounter++;

    //Generating keyframes
    const keyframes = `@keyframes ${animationName} {
        0% {
            transform: scale(0.1) translateX(0) translateY(0) rotate(${randomAngle + angleCorrection}rad);
            opacity: 0;
            filter: blur(0px);
        }
        50% {
            opacity: .3;
        }
        100% {
            transform: scale(2) translateX(${moveX}rem) translateY(${moveY}rem) rotate(${randomAngle + angleCorrection}rad);
            opacity : 0;
            filter: blur(2px);
            
        }
    }`

    // Adding keyframes to keyframeslist. (Manages all active animations)
    keyframesList.push({id: animationId, keyframes: keyframes});

    // Replacing the <style> element´s content with a new text content, that contains all the keyframes from animationList
    animations.textContent = keyframesList.map(item => item.keyframes).join(' ');

    // Applying animation to the wave element
    wave.style.animation = `${animationName} 3s forwards`;

    // Handling situation, hen wave element animation finishes
    wave.addEventListener('animationend', () => {

        // Removing animation keyframes from the keyframesList
        keyframesList.splice(keyframesList.findIndex((item) => {
            return animationId === item.id;
        }), 1);

        //Updatng <style> element
        animations.textContent = keyframesList.map(item => item.keyframes).join(' ');

        // Remowing wave element from DOM
        wave.parentElement.removeChild(wave);
    });
}

//Creates a new wave element
const spawnWave = (id) => {
    const wave = document.createElement('div');
    wave.classList = `organizations__wave organizationions__wave--${id}`;

    return wave;
}

//Generates wave animation for specified organization
const createWaveAnimation = (organizationIndex) => {

    //Hooking organization element
    const organization = organizationElements[organizationIndex];

    //Selecting number of animations, that will appear during the animation (number is whole and falls between maxWaves and minWaves)
    const waveNum = Math.floor(Math.random()*(maxWaves-minWaves) + minWaves);

    //Creating selected number of waves, animating them
    for(let i = 0; i < waveNum; i++) {
        const wave = spawnWave(i);
        organization.appendChild(wave);
        animateWave(wave, organizationIndex);
    }
}

//Setting up wave range initially
setUpWaveRange();

//REVIEWS

const reviewsSection = document.getElementById('reviews');
const reviews = reviewsSection.children;

let currentId = 0;
const reviewCycler = () => {
        const review = reviews[currentId];
        const reviewLeaf = review.querySelector('.review__leaf');
        const reviewText = review.querySelector('span');
        const reviewPerson = reviewLeaf.querySelector('.review__person');

      /*  showOrHideEl(reviewLeaf, 'review__leaf'); */
       showOrHideEl(review, 'review');
      

        currentId++;
        if(currentId === reviews.length) {
            currentId = 0;
        }
        setTimeout(() => {
            reviewLeaf.classList.remove('review__leaf--visible');;
            reviewLeaf.classList.add('review__leaf--hiding');
            review.classList.remove('review--visible');
            review.classList.add('review--hiding');
        }, 15000);
        reviewLeaf.addEventListener('animationend', () => {
            reviewLeaf.classList.remove('review__leaf--hiding');;
            reviewLeaf.classList.add('review__leaf--hidden');
           

            /* review.addEventListener('animationend', (e) => {
                e.stopImmediatePropagation();
            }, 
            {
                capture: false,
                once: true,
                passive: false
            }); */

            review.classList.remove('review--hiding');
                review.classList.add('review--hidden');
                reviewCycler();
           /*  review.addEventListener('animationend', (event) => {
               
                
            }, {
                capture: false,
                once: true,
                passive: false
                }); */
        }, {
            capture: false,
            once: true,
            passive: false
            });

}
reviewCycler(); 