// UTILITY FUNCTIONS

// Rendering the element or removing it from the screen smoothly - with animations
// The element must have 3 CSS Classes available - hidden class, visible class, hiding class
// Hidden class - display: none, no animation
// Visible class - display: block (or whatever except none) and an animation of the element appearing on the page (sliding -in or so)
// Hiding class - animation of the element disappearing
// Element has only one of these classes at a time.
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
const maxWaves = 5;
const minWaves = 2;

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

//Cyclically changes the state of review elements (HIDDEN -> VISIBLE -> HIDING -> HIDDEN -> ...)
const showOrHideReviewElements = (reviewLeaf, reviewPerson, reviewText) => {
    showOrHideEl(reviewLeaf, 'review__leaf');
    showOrHideEl(reviewPerson, 'review__person');
    showOrHideEl(reviewText, 'review__text');
}

//Hooking reviews section
const reviewsSection = document.getElementById('reviews');

//Getting array of reviews
const reviews = reviewsSection.children;

//Setting up iterator
let currentId = 0;

//When called, starts cycling through reviews (browser calls it again, when leaf animation ends) 
const reviewCycler = () => {
        //Getting current review
        const review = reviews[currentId];

        //Adding active class, so the reviw doesn´t have display: none anymore
        review.classList.add('review--active');

        //Getting reviewLeaf, reviewText and reviewPerson
        const reviewLeaf = review.querySelector('.review__leaf');
        const reviewText = review.querySelector('.review__text');
        const reviewPerson = review.querySelector('.review__person');
    
        //Setting state for review elements from HIDDEN to VISIBLE
        showOrHideReviewElements(reviewLeaf, reviewPerson, reviewText);
      
        //Incrementing the iterator
        currentId++;

        //If the iterator after incrementing exceeds review count, setting it back to 0, so the cycling can continue from the first review
        if(currentId === reviews.length) {
            currentId = 0;
        }

        //Setting timeout for when should the review start disappearing
        setTimeout(() => {

            //Setting state for review elements from VISIBLE to HIDING
            showOrHideReviewElements(reviewLeaf, reviewPerson, reviewText);

            //When leaf fall animation finishes
            reviewLeaf.addEventListener('animationend', () => {

                 //Setting state for review elements from HIDING to HIDDEN
                showOrHideReviewElements(reviewLeaf, reviewPerson, reviewText);

                //Removing the review active class, therefore display: none is set
                review.classList.remove('review--active');

                //Beginning antother cycle
                reviewCycler();

            }, 
            // Making sure, that the leaf fall animation event triggers only once
            {
                capture: false,
                once: true,
                passive: false
                });
        }, 7000);
       

}

//Starting to cycle when the page loads
reviewCycler();


//////////////////
///// POST EMAIL FORM
//////////////////
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', () => {
    const submit = document.getElementById('submit');
    submit.classList.remove('hidden');
    setTimeout(() => {
        submit.style.opacity = "1";
    }, 20);
});


//////////////////
///// ANIMATIONS
//////////////////

//Collecting all elements with class "toBeAnimated"
const toBeAnimatedElements = document.querySelectorAll('.toBeAnimated');

//Creating array of pairs of to be animated elements and their distance from document top border  -> [[element1, distance1], [element2, distance2], ... ]
let toBeAnimated = [];
for (const element of toBeAnimatedElements) {
    toBeAnimated.push([element, element.getBoundingClientRect().y + document.documentElement.scrollTop]);
}

//Handler for 'scroll' event on document.window, triggers animations
const animationTriggerer = () => {

    //Contains id´s of elements (in toBeAnimated[]), that are going to be animated this function call
    const willBeAnimated = [];

    for (const animation of toBeAnimated) {

        if (animation === undefined) {
            continue;
        }

        //If the distance between window top and element´s y coordinate is small enough, animating the element
        if (animation[1] - document.documentElement.scrollTop <= window.innerHeight - 100) {

            //Removing toBeAnimated class
            animation[0].classList.remove('toBeAnimated');

            //Finding index of the element
            const id = toBeAnimated.findIndex((anim) => {
                return animation === anim;
            })

            //Adding index to the list
            willBeAnimated.push(id);
        }  
    }

    //If there are some elements that are going to be animated this function call
    if (willBeAnimated.length > 0) {

        //Mapping toBeAnimated array to an array, in which the elements animated this function call are not included
        toBeAnimated = toBeAnimated.map((value, idx) => {
            for (const id of willBeAnimated) {
                if (id === idx) {
                    return;
                }
            }
            return value;
        })
    }
}

//When user scrolls, triggering animations
window.addEventListener('scroll', () => {
    animationTriggerer();
})

//Triggering animations on page load
animationTriggerer();