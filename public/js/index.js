/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/client/js/index.js ***!
  \********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
eval("// UTILITY FUNCTIONS\n\n// Rendering the element or removing it from the screen smoothly - with animations\n// The element must have 3 CSS Classes available - hidden class, visible class, hiding class\n// Hidden class - display: none, no animation\n// Visible class - display: block (or whatever except none) and an animation of the element appearing on the page (sliding -in or so)\n// Hiding class - animation of the element disappearing\n// Element has only one of these classes at a time.\nconst showOrHideEl = (element, cssClass) => {\n    if([...element.classList].includes(`${cssClass}--hidden`)) {\n        element.classList.remove(`${cssClass}--hidden`);\n        element.classList.add(`${cssClass}--visible`);\n    } else if ([...element.classList].includes(`${cssClass}--visible`)) {\n        element.classList.remove(`${cssClass}--visible`);\n        element.classList.add(`${cssClass}--hiding`);\n    } else {\n        element.classList.remove(`${cssClass}--hiding`);\n        element.classList.add(`${cssClass}--hidden`);\n    }\n}\n\n// ORGANIZATIONS\n\nconst organizationContainer = document.querySelector('.organizations__container');\nconst organizationElements = [...organizationContainer.children];\n\n//When mouse cursor enters organization div, rendering animation\norganizationElements.forEach((organization, id) => {\n    organization.addEventListener('mouseenter', () => {\n       createWaveAnimation(id);\n    })\n})  \n   \n// Creating hidden style element for @keyframes \nconst animations = document.createElement('style');\ndocument.documentElement.appendChild(animations);\n\n// The wave svg isn´t by default pointing to 0 rad, so I experimentally found out the angle correction\nconst angleCorrection = -1; //[rad]\n\n// Counting each wave animation creating. This count is used for creating unique animation id´s\nlet animationCounter = 0;\n\n// Managing all currently needed @keyframes in an array\nlet keyframesList = [];\n\n// Setting max amount and min amount of waves that can appear\nconst maxWaves = 5;\nconst minWaves = 2;\n\n//Setting initial wave range\nlet waveRange = 10; //[rem]\n\n// This function sets the wave range taking the window size in account \nconst setUpWaveRange = () => {\n    if(document.documentElement.clientWidth < 1100 && document.documentElement.clientWidth >= 800) {\n        waveRange = 7;\n    } else if (document.documentElement.clientWidth < 800) {\n        waveRange = 6;\n    } else {\n        waveRange = 10;\n    }\n}\n\n// Whenever window is resized, configuring the wave range, so the wave range is \"responsive\"\nwindow.addEventListener('resize', () => {\n    setUpWaveRange();\n})\n\n// Function animates wave element in specified organization element\nconst animateWave = (wave, organizationIndex) => {\n\n    //Generating random angle to get direction, in which the wave will move\n    const randomAngle = Math.random()*2*Math.PI;\n\n    //Generating X and Y offset from the original position based on the random angle\n    const moveX = Math.cos(randomAngle)*waveRange;\n    const moveY = Math.sin(randomAngle)*waveRange;\n\n    //Animation id refers to the total amount of animations created, therefore is unique\n    const animationId = animationCounter;\n\n    //Generating @keyframes identifier - animation name\n    const animationName = `waveAnimation--${organizationIndex}--${animationId}`\n    animationCounter++;\n\n    //Generating keyframes\n    const keyframes = `@keyframes ${animationName} {\n        0% {\n            transform: scale(0.1) translateX(0) translateY(0) rotate(${randomAngle + angleCorrection}rad);\n            opacity: 0;\n            filter: blur(0px);\n        }\n        50% {\n            opacity: .3;\n        }\n        100% {\n            transform: scale(2) translateX(${moveX}rem) translateY(${moveY}rem) rotate(${randomAngle + angleCorrection}rad);\n            opacity : 0;\n            filter: blur(2px);\n            \n        }\n    }`\n\n    // Adding keyframes to keyframeslist. (Manages all active animations)\n    keyframesList.push({id: animationId, keyframes: keyframes});\n\n    // Replacing the <style> element´s content with a new text content, that contains all the keyframes from animationList\n    animations.textContent = keyframesList.map(item => item.keyframes).join(' ');\n\n    // Applying animation to the wave element\n    wave.style.animation = `${animationName} 3s forwards`;\n\n    // Handling situation, hen wave element animation finishes\n    wave.addEventListener('animationend', () => {\n\n        // Removing animation keyframes from the keyframesList\n        keyframesList.splice(keyframesList.findIndex((item) => {\n            return animationId === item.id;\n        }), 1);\n\n        //Updatng <style> element\n        animations.textContent = keyframesList.map(item => item.keyframes).join(' ');\n\n        // Remowing wave element from DOM\n        wave.parentElement.removeChild(wave);\n    });\n}\n\n//Creates a new wave element\nconst spawnWave = (id) => {\n    const wave = document.createElement('div');\n    wave.classList = `organizations__wave organizationions__wave--${id}`;\n\n    return wave;\n}\n\n//Generates wave animation for specified organization\nconst createWaveAnimation = (organizationIndex) => {\n\n    //Hooking organization element\n    const organization = organizationElements[organizationIndex];\n\n    //Selecting number of animations, that will appear during the animation (number is whole and falls between maxWaves and minWaves)\n    const waveNum = Math.floor(Math.random()*(maxWaves-minWaves) + minWaves);\n\n    //Creating selected number of waves, animating them\n    for(let i = 0; i < waveNum; i++) {\n        const wave = spawnWave(i);\n        organization.appendChild(wave);\n        animateWave(wave, organizationIndex);\n    }\n}\n\n//Setting up wave range initially\nsetUpWaveRange();\n\n//REVIEWS\n\n//Cyclically changes the state of review elements (HIDDEN -> VISIBLE -> HIDING -> HIDDEN -> ...)\nconst showOrHideReviewElements = (reviewLeaf, reviewPerson, reviewText) => {\n    showOrHideEl(reviewLeaf, 'review__leaf');\n    showOrHideEl(reviewPerson, 'review__person');\n    showOrHideEl(reviewText, 'review__text');\n}\n\n//Hooking reviews section\nconst reviewsSection = document.getElementById('reviews');\n\n//Getting array of reviews\nconst reviews = reviewsSection.children;\n\n//Setting up iterator\nlet currentId = 0;\n\n//When called, starts cycling through reviews (browser calls it again, when leaf animation ends) \nconst reviewCycler = () => {\n        //Getting current review\n        const review = reviews[currentId];\n\n        //Adding active class, so the reviw doesn´t have display: none anymore\n        review.classList.add('review--active');\n\n        //Getting reviewLeaf, reviewText and reviewPerson\n        const reviewLeaf = review.querySelector('.review__leaf');\n        const reviewText = review.querySelector('.review__text');\n        const reviewPerson = review.querySelector('.review__person');\n    \n        //Setting state for review elements from HIDDEN to VISIBLE\n        showOrHideReviewElements(reviewLeaf, reviewPerson, reviewText);\n      \n        //Incrementing the iterator\n        currentId++;\n\n        //If the iterator after incrementing exceeds review count, setting it back to 0, so the cycling can continue from the first review\n        if(currentId === reviews.length) {\n            currentId = 0;\n        }\n\n        //Setting timeout for when should the review start disappearing\n        setTimeout(() => {\n\n            //Setting state for review elements from VISIBLE to HIDING\n            showOrHideReviewElements(reviewLeaf, reviewPerson, reviewText);\n\n            //When leaf fall animation finishes\n            reviewLeaf.addEventListener('animationend', () => {\n\n                 //Setting state for review elements from HIDING to HIDDEN\n                showOrHideReviewElements(reviewLeaf, reviewPerson, reviewText);\n\n                //Removing the review active class, therefore display: none is set\n                review.classList.remove('review--active');\n\n                //Beginning antother cycle\n                reviewCycler();\n\n            }, \n            // Making sure, that the leaf fall animation event triggers only once\n            {\n                capture: false,\n                once: true,\n                passive: false\n                });\n        }, 7000);\n       \n\n}\n\n//Starting to cycle when the page loads\nreviewCycler();\n\n\n//////////////////\n///// POST EMAIL FORM\n//////////////////\nconst emailInput = document.getElementById('email');\nemailInput.addEventListener('input', () => {\n    const submit = document.getElementById('submit');\n    submit.classList.remove('hidden');\n    setTimeout(() => {\n        submit.style.opacity = \"1\";\n    }, 20);\n});\n\n//////////////////\n///// POST-SCRIPTUM EXPANSION\n//////////////////\nconst postScriptum = document.getElementById('post-scriptum');\nconst showPSPhoto = () => {\n    postScriptum.classList.remove('closed');\n    postScriptum.removeEventListener('click', showPSPhoto);\n}\npostScriptum.addEventListener('click', showPSPhoto);\n\n//////////////////\n///// SUCCESS MODAL\n//////////////////\nconst search = window.location.search;\nif (search) {\n    const params = search.split('=');\n    if (params && params[0] === '?success' || params[0] === 'success') {\n        const success = params[1];\n\n        const showHideModal = (className, text) => {\n            const modalEl = document.createElement('div');        \n            const header = document.getElementById('header');\n            modalEl.classList.add('modal');\n            modalEl.classList.add(className);\n            modalEl.textContent = text;\n            header.append(modalEl);\n\n            setTimeout(() => {\n                modalEl.remove();\n            }, 5000);\n        }\n\n        switch (success) {\n            case 'true': {\n                showHideModal('success', 'Povedlo se přidat Váš e-mail!');\n                break;\n            }\n            case 'false': {\n                showHideModal('fail', 'Přidání e-mailu se nepodařilo.');\n                break;\n            }\n            default: null;\n        }\n    }\n}\n\n\n//////////////////\n///// ANIMATIONS\n//////////////////\n\n//Collecting all elements with class \"toBeAnimated\"\nconst toBeAnimatedElements = document.querySelectorAll('.toBeAnimated');\n\n//Creating array of pairs of to be animated elements and their distance from document top border  -> [[element1, distance1], [element2, distance2], ... ]\nlet toBeAnimated = [];\nfor (const element of toBeAnimatedElements) {\n    toBeAnimated.push([element, element.getBoundingClientRect().y + document.documentElement.scrollTop]);\n}\n\n\n//Handler for 'scroll' event on document.window, triggers animations\nconst animationTriggerer = () => {\n\n    //Contains id´s of elements (in toBeAnimated[]), that are going to be animated this function call\n    const willBeAnimated = [];\n\n    for (const animation of toBeAnimated) {\n\n        if (animation === undefined) {\n            continue;\n        }\n\n        //If the distance between window top and element´s y coordinate is small enough, animating the element\n        if (animation[1] - document.documentElement.scrollTop <= window.innerHeight - 100) {\n\n            //Removing toBeAnimated class\n            animation[0].classList.remove('toBeAnimated');\n\n            //Finding index of the element\n            const id = toBeAnimated.findIndex((anim) => {\n                return animation === anim;\n            })\n\n            //Adding index to the list\n            willBeAnimated.push(id);\n        }  \n    }\n\n    //If there are some elements that are going to be animated this function call\n    if (willBeAnimated.length > 0) {\n\n        console.log(willBeAnimated);\n        //Mapping toBeAnimated array to an array, in which the elements animated this function call are not included\n        toBeAnimated = toBeAnimated.map((value, idx) => {\n            for (const id of willBeAnimated) {\n                if (id === idx) {\n                    return;\n                }\n            }\n            return value;\n        })\n        console.log('Q');\n        console.log(toBeAnimated);\n    }\n}\n\n//When user scrolls, triggering animations\nwindow.addEventListener('scroll', () => {\n    animationTriggerer();\n})\n\n//Preventing misbehavior on window resize\nwindow.addEventListener('resize', () => {\n\n    //Updating toBeAnimated, because after resizing can the top position be different\n    toBeAnimated = [];\n    for (const element of toBeAnimatedElements) {\n        toBeAnimated.push([element, element.getBoundingClientRect().y + document.documentElement.scrollTop]);\n    }\n})\n\n//Triggering animations on page load\nanimationTriggerer();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xpZW50L2pzL2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGF0amFuYWhvcmthLy4vc3JjL2NsaWVudC9qcy9pbmRleC5qcz8yYTUyIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFVUSUxJVFkgRlVOQ1RJT05TXG5cbi8vIFJlbmRlcmluZyB0aGUgZWxlbWVudCBvciByZW1vdmluZyBpdCBmcm9tIHRoZSBzY3JlZW4gc21vb3RobHkgLSB3aXRoIGFuaW1hdGlvbnNcbi8vIFRoZSBlbGVtZW50IG11c3QgaGF2ZSAzIENTUyBDbGFzc2VzIGF2YWlsYWJsZSAtIGhpZGRlbiBjbGFzcywgdmlzaWJsZSBjbGFzcywgaGlkaW5nIGNsYXNzXG4vLyBIaWRkZW4gY2xhc3MgLSBkaXNwbGF5OiBub25lLCBubyBhbmltYXRpb25cbi8vIFZpc2libGUgY2xhc3MgLSBkaXNwbGF5OiBibG9jayAob3Igd2hhdGV2ZXIgZXhjZXB0IG5vbmUpIGFuZCBhbiBhbmltYXRpb24gb2YgdGhlIGVsZW1lbnQgYXBwZWFyaW5nIG9uIHRoZSBwYWdlIChzbGlkaW5nIC1pbiBvciBzbylcbi8vIEhpZGluZyBjbGFzcyAtIGFuaW1hdGlvbiBvZiB0aGUgZWxlbWVudCBkaXNhcHBlYXJpbmdcbi8vIEVsZW1lbnQgaGFzIG9ubHkgb25lIG9mIHRoZXNlIGNsYXNzZXMgYXQgYSB0aW1lLlxuY29uc3Qgc2hvd09ySGlkZUVsID0gKGVsZW1lbnQsIGNzc0NsYXNzKSA9PiB7XG4gICAgaWYoWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyhgJHtjc3NDbGFzc30tLWhpZGRlbmApKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgJHtjc3NDbGFzc30tLWhpZGRlbmApO1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYCR7Y3NzQ2xhc3N9LS12aXNpYmxlYCk7XG4gICAgfSBlbHNlIGlmIChbLi4uZWxlbWVudC5jbGFzc0xpc3RdLmluY2x1ZGVzKGAke2Nzc0NsYXNzfS0tdmlzaWJsZWApKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgJHtjc3NDbGFzc30tLXZpc2libGVgKTtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGAke2Nzc0NsYXNzfS0taGlkaW5nYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGAke2Nzc0NsYXNzfS0taGlkaW5nYCk7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChgJHtjc3NDbGFzc30tLWhpZGRlbmApO1xuICAgIH1cbn1cblxuLy8gT1JHQU5JWkFUSU9OU1xuXG5jb25zdCBvcmdhbml6YXRpb25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3JnYW5pemF0aW9uc19fY29udGFpbmVyJyk7XG5jb25zdCBvcmdhbml6YXRpb25FbGVtZW50cyA9IFsuLi5vcmdhbml6YXRpb25Db250YWluZXIuY2hpbGRyZW5dO1xuXG4vL1doZW4gbW91c2UgY3Vyc29yIGVudGVycyBvcmdhbml6YXRpb24gZGl2LCByZW5kZXJpbmcgYW5pbWF0aW9uXG5vcmdhbml6YXRpb25FbGVtZW50cy5mb3JFYWNoKChvcmdhbml6YXRpb24sIGlkKSA9PiB7XG4gICAgb3JnYW5pemF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgY3JlYXRlV2F2ZUFuaW1hdGlvbihpZCk7XG4gICAgfSlcbn0pICBcbiAgIFxuLy8gQ3JlYXRpbmcgaGlkZGVuIHN0eWxlIGVsZW1lbnQgZm9yIEBrZXlmcmFtZXMgXG5jb25zdCBhbmltYXRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChhbmltYXRpb25zKTtcblxuLy8gVGhlIHdhdmUgc3ZnIGlzbsK0dCBieSBkZWZhdWx0IHBvaW50aW5nIHRvIDAgcmFkLCBzbyBJIGV4cGVyaW1lbnRhbGx5IGZvdW5kIG91dCB0aGUgYW5nbGUgY29ycmVjdGlvblxuY29uc3QgYW5nbGVDb3JyZWN0aW9uID0gLTE7IC8vW3JhZF1cblxuLy8gQ291bnRpbmcgZWFjaCB3YXZlIGFuaW1hdGlvbiBjcmVhdGluZy4gVGhpcyBjb3VudCBpcyB1c2VkIGZvciBjcmVhdGluZyB1bmlxdWUgYW5pbWF0aW9uIGlkwrRzXG5sZXQgYW5pbWF0aW9uQ291bnRlciA9IDA7XG5cbi8vIE1hbmFnaW5nIGFsbCBjdXJyZW50bHkgbmVlZGVkIEBrZXlmcmFtZXMgaW4gYW4gYXJyYXlcbmxldCBrZXlmcmFtZXNMaXN0ID0gW107XG5cbi8vIFNldHRpbmcgbWF4IGFtb3VudCBhbmQgbWluIGFtb3VudCBvZiB3YXZlcyB0aGF0IGNhbiBhcHBlYXJcbmNvbnN0IG1heFdhdmVzID0gNTtcbmNvbnN0IG1pbldhdmVzID0gMjtcblxuLy9TZXR0aW5nIGluaXRpYWwgd2F2ZSByYW5nZVxubGV0IHdhdmVSYW5nZSA9IDEwOyAvL1tyZW1dXG5cbi8vIFRoaXMgZnVuY3Rpb24gc2V0cyB0aGUgd2F2ZSByYW5nZSB0YWtpbmcgdGhlIHdpbmRvdyBzaXplIGluIGFjY291bnQgXG5jb25zdCBzZXRVcFdhdmVSYW5nZSA9ICgpID0+IHtcbiAgICBpZihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPCAxMTAwICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA+PSA4MDApIHtcbiAgICAgICAgd2F2ZVJhbmdlID0gNztcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8IDgwMCkge1xuICAgICAgICB3YXZlUmFuZ2UgPSA2O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdhdmVSYW5nZSA9IDEwO1xuICAgIH1cbn1cblxuLy8gV2hlbmV2ZXIgd2luZG93IGlzIHJlc2l6ZWQsIGNvbmZpZ3VyaW5nIHRoZSB3YXZlIHJhbmdlLCBzbyB0aGUgd2F2ZSByYW5nZSBpcyBcInJlc3BvbnNpdmVcIlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICBzZXRVcFdhdmVSYW5nZSgpO1xufSlcblxuLy8gRnVuY3Rpb24gYW5pbWF0ZXMgd2F2ZSBlbGVtZW50IGluIHNwZWNpZmllZCBvcmdhbml6YXRpb24gZWxlbWVudFxuY29uc3QgYW5pbWF0ZVdhdmUgPSAod2F2ZSwgb3JnYW5pemF0aW9uSW5kZXgpID0+IHtcblxuICAgIC8vR2VuZXJhdGluZyByYW5kb20gYW5nbGUgdG8gZ2V0IGRpcmVjdGlvbiwgaW4gd2hpY2ggdGhlIHdhdmUgd2lsbCBtb3ZlXG4gICAgY29uc3QgcmFuZG9tQW5nbGUgPSBNYXRoLnJhbmRvbSgpKjIqTWF0aC5QSTtcblxuICAgIC8vR2VuZXJhdGluZyBYIGFuZCBZIG9mZnNldCBmcm9tIHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgcmFuZG9tIGFuZ2xlXG4gICAgY29uc3QgbW92ZVggPSBNYXRoLmNvcyhyYW5kb21BbmdsZSkqd2F2ZVJhbmdlO1xuICAgIGNvbnN0IG1vdmVZID0gTWF0aC5zaW4ocmFuZG9tQW5nbGUpKndhdmVSYW5nZTtcblxuICAgIC8vQW5pbWF0aW9uIGlkIHJlZmVycyB0byB0aGUgdG90YWwgYW1vdW50IG9mIGFuaW1hdGlvbnMgY3JlYXRlZCwgdGhlcmVmb3JlIGlzIHVuaXF1ZVxuICAgIGNvbnN0IGFuaW1hdGlvbklkID0gYW5pbWF0aW9uQ291bnRlcjtcblxuICAgIC8vR2VuZXJhdGluZyBAa2V5ZnJhbWVzIGlkZW50aWZpZXIgLSBhbmltYXRpb24gbmFtZVxuICAgIGNvbnN0IGFuaW1hdGlvbk5hbWUgPSBgd2F2ZUFuaW1hdGlvbi0tJHtvcmdhbml6YXRpb25JbmRleH0tLSR7YW5pbWF0aW9uSWR9YFxuICAgIGFuaW1hdGlvbkNvdW50ZXIrKztcblxuICAgIC8vR2VuZXJhdGluZyBrZXlmcmFtZXNcbiAgICBjb25zdCBrZXlmcmFtZXMgPSBgQGtleWZyYW1lcyAke2FuaW1hdGlvbk5hbWV9IHtcbiAgICAgICAgMCUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjEpIHRyYW5zbGF0ZVgoMCkgdHJhbnNsYXRlWSgwKSByb3RhdGUoJHtyYW5kb21BbmdsZSArIGFuZ2xlQ29ycmVjdGlvbn1yYWQpO1xuICAgICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgICAgIGZpbHRlcjogYmx1cigwcHgpO1xuICAgICAgICB9XG4gICAgICAgIDUwJSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAuMztcbiAgICAgICAgfVxuICAgICAgICAxMDAlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMikgdHJhbnNsYXRlWCgke21vdmVYfXJlbSkgdHJhbnNsYXRlWSgke21vdmVZfXJlbSkgcm90YXRlKCR7cmFuZG9tQW5nbGUgKyBhbmdsZUNvcnJlY3Rpb259cmFkKTtcbiAgICAgICAgICAgIG9wYWNpdHkgOiAwO1xuICAgICAgICAgICAgZmlsdGVyOiBibHVyKDJweCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1gXG5cbiAgICAvLyBBZGRpbmcga2V5ZnJhbWVzIHRvIGtleWZyYW1lc2xpc3QuIChNYW5hZ2VzIGFsbCBhY3RpdmUgYW5pbWF0aW9ucylcbiAgICBrZXlmcmFtZXNMaXN0LnB1c2goe2lkOiBhbmltYXRpb25JZCwga2V5ZnJhbWVzOiBrZXlmcmFtZXN9KTtcblxuICAgIC8vIFJlcGxhY2luZyB0aGUgPHN0eWxlPiBlbGVtZW50wrRzIGNvbnRlbnQgd2l0aCBhIG5ldyB0ZXh0IGNvbnRlbnQsIHRoYXQgY29udGFpbnMgYWxsIHRoZSBrZXlmcmFtZXMgZnJvbSBhbmltYXRpb25MaXN0XG4gICAgYW5pbWF0aW9ucy50ZXh0Q29udGVudCA9IGtleWZyYW1lc0xpc3QubWFwKGl0ZW0gPT4gaXRlbS5rZXlmcmFtZXMpLmpvaW4oJyAnKTtcblxuICAgIC8vIEFwcGx5aW5nIGFuaW1hdGlvbiB0byB0aGUgd2F2ZSBlbGVtZW50XG4gICAgd2F2ZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb25OYW1lfSAzcyBmb3J3YXJkc2A7XG5cbiAgICAvLyBIYW5kbGluZyBzaXR1YXRpb24sIGhlbiB3YXZlIGVsZW1lbnQgYW5pbWF0aW9uIGZpbmlzaGVzXG4gICAgd2F2ZS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XG5cbiAgICAgICAgLy8gUmVtb3ZpbmcgYW5pbWF0aW9uIGtleWZyYW1lcyBmcm9tIHRoZSBrZXlmcmFtZXNMaXN0XG4gICAgICAgIGtleWZyYW1lc0xpc3Quc3BsaWNlKGtleWZyYW1lc0xpc3QuZmluZEluZGV4KChpdGVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uSWQgPT09IGl0ZW0uaWQ7XG4gICAgICAgIH0pLCAxKTtcblxuICAgICAgICAvL1VwZGF0bmcgPHN0eWxlPiBlbGVtZW50XG4gICAgICAgIGFuaW1hdGlvbnMudGV4dENvbnRlbnQgPSBrZXlmcmFtZXNMaXN0Lm1hcChpdGVtID0+IGl0ZW0ua2V5ZnJhbWVzKS5qb2luKCcgJyk7XG5cbiAgICAgICAgLy8gUmVtb3dpbmcgd2F2ZSBlbGVtZW50IGZyb20gRE9NXG4gICAgICAgIHdhdmUucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh3YXZlKTtcbiAgICB9KTtcbn1cblxuLy9DcmVhdGVzIGEgbmV3IHdhdmUgZWxlbWVudFxuY29uc3Qgc3Bhd25XYXZlID0gKGlkKSA9PiB7XG4gICAgY29uc3Qgd2F2ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdhdmUuY2xhc3NMaXN0ID0gYG9yZ2FuaXphdGlvbnNfX3dhdmUgb3JnYW5pemF0aW9uaW9uc19fd2F2ZS0tJHtpZH1gO1xuXG4gICAgcmV0dXJuIHdhdmU7XG59XG5cbi8vR2VuZXJhdGVzIHdhdmUgYW5pbWF0aW9uIGZvciBzcGVjaWZpZWQgb3JnYW5pemF0aW9uXG5jb25zdCBjcmVhdGVXYXZlQW5pbWF0aW9uID0gKG9yZ2FuaXphdGlvbkluZGV4KSA9PiB7XG5cbiAgICAvL0hvb2tpbmcgb3JnYW5pemF0aW9uIGVsZW1lbnRcbiAgICBjb25zdCBvcmdhbml6YXRpb24gPSBvcmdhbml6YXRpb25FbGVtZW50c1tvcmdhbml6YXRpb25JbmRleF07XG5cbiAgICAvL1NlbGVjdGluZyBudW1iZXIgb2YgYW5pbWF0aW9ucywgdGhhdCB3aWxsIGFwcGVhciBkdXJpbmcgdGhlIGFuaW1hdGlvbiAobnVtYmVyIGlzIHdob2xlIGFuZCBmYWxscyBiZXR3ZWVuIG1heFdhdmVzIGFuZCBtaW5XYXZlcylcbiAgICBjb25zdCB3YXZlTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihtYXhXYXZlcy1taW5XYXZlcykgKyBtaW5XYXZlcyk7XG5cbiAgICAvL0NyZWF0aW5nIHNlbGVjdGVkIG51bWJlciBvZiB3YXZlcywgYW5pbWF0aW5nIHRoZW1cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgd2F2ZU51bTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHdhdmUgPSBzcGF3bldhdmUoaSk7XG4gICAgICAgIG9yZ2FuaXphdGlvbi5hcHBlbmRDaGlsZCh3YXZlKTtcbiAgICAgICAgYW5pbWF0ZVdhdmUod2F2ZSwgb3JnYW5pemF0aW9uSW5kZXgpO1xuICAgIH1cbn1cblxuLy9TZXR0aW5nIHVwIHdhdmUgcmFuZ2UgaW5pdGlhbGx5XG5zZXRVcFdhdmVSYW5nZSgpO1xuXG4vL1JFVklFV1NcblxuLy9DeWNsaWNhbGx5IGNoYW5nZXMgdGhlIHN0YXRlIG9mIHJldmlldyBlbGVtZW50cyAoSElEREVOIC0+IFZJU0lCTEUgLT4gSElESU5HIC0+IEhJRERFTiAtPiAuLi4pXG5jb25zdCBzaG93T3JIaWRlUmV2aWV3RWxlbWVudHMgPSAocmV2aWV3TGVhZiwgcmV2aWV3UGVyc29uLCByZXZpZXdUZXh0KSA9PiB7XG4gICAgc2hvd09ySGlkZUVsKHJldmlld0xlYWYsICdyZXZpZXdfX2xlYWYnKTtcbiAgICBzaG93T3JIaWRlRWwocmV2aWV3UGVyc29uLCAncmV2aWV3X19wZXJzb24nKTtcbiAgICBzaG93T3JIaWRlRWwocmV2aWV3VGV4dCwgJ3Jldmlld19fdGV4dCcpO1xufVxuXG4vL0hvb2tpbmcgcmV2aWV3cyBzZWN0aW9uXG5jb25zdCByZXZpZXdzU2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzJyk7XG5cbi8vR2V0dGluZyBhcnJheSBvZiByZXZpZXdzXG5jb25zdCByZXZpZXdzID0gcmV2aWV3c1NlY3Rpb24uY2hpbGRyZW47XG5cbi8vU2V0dGluZyB1cCBpdGVyYXRvclxubGV0IGN1cnJlbnRJZCA9IDA7XG5cbi8vV2hlbiBjYWxsZWQsIHN0YXJ0cyBjeWNsaW5nIHRocm91Z2ggcmV2aWV3cyAoYnJvd3NlciBjYWxscyBpdCBhZ2Fpbiwgd2hlbiBsZWFmIGFuaW1hdGlvbiBlbmRzKSBcbmNvbnN0IHJldmlld0N5Y2xlciA9ICgpID0+IHtcbiAgICAgICAgLy9HZXR0aW5nIGN1cnJlbnQgcmV2aWV3XG4gICAgICAgIGNvbnN0IHJldmlldyA9IHJldmlld3NbY3VycmVudElkXTtcblxuICAgICAgICAvL0FkZGluZyBhY3RpdmUgY2xhc3MsIHNvIHRoZSByZXZpdyBkb2VzbsK0dCBoYXZlIGRpc3BsYXk6IG5vbmUgYW55bW9yZVxuICAgICAgICByZXZpZXcuY2xhc3NMaXN0LmFkZCgncmV2aWV3LS1hY3RpdmUnKTtcblxuICAgICAgICAvL0dldHRpbmcgcmV2aWV3TGVhZiwgcmV2aWV3VGV4dCBhbmQgcmV2aWV3UGVyc29uXG4gICAgICAgIGNvbnN0IHJldmlld0xlYWYgPSByZXZpZXcucXVlcnlTZWxlY3RvcignLnJldmlld19fbGVhZicpO1xuICAgICAgICBjb25zdCByZXZpZXdUZXh0ID0gcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdfX3RleHQnKTtcbiAgICAgICAgY29uc3QgcmV2aWV3UGVyc29uID0gcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdfX3BlcnNvbicpO1xuICAgIFxuICAgICAgICAvL1NldHRpbmcgc3RhdGUgZm9yIHJldmlldyBlbGVtZW50cyBmcm9tIEhJRERFTiB0byBWSVNJQkxFXG4gICAgICAgIHNob3dPckhpZGVSZXZpZXdFbGVtZW50cyhyZXZpZXdMZWFmLCByZXZpZXdQZXJzb24sIHJldmlld1RleHQpO1xuICAgICAgXG4gICAgICAgIC8vSW5jcmVtZW50aW5nIHRoZSBpdGVyYXRvclxuICAgICAgICBjdXJyZW50SWQrKztcblxuICAgICAgICAvL0lmIHRoZSBpdGVyYXRvciBhZnRlciBpbmNyZW1lbnRpbmcgZXhjZWVkcyByZXZpZXcgY291bnQsIHNldHRpbmcgaXQgYmFjayB0byAwLCBzbyB0aGUgY3ljbGluZyBjYW4gY29udGludWUgZnJvbSB0aGUgZmlyc3QgcmV2aWV3XG4gICAgICAgIGlmKGN1cnJlbnRJZCA9PT0gcmV2aWV3cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGN1cnJlbnRJZCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvL1NldHRpbmcgdGltZW91dCBmb3Igd2hlbiBzaG91bGQgdGhlIHJldmlldyBzdGFydCBkaXNhcHBlYXJpbmdcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vU2V0dGluZyBzdGF0ZSBmb3IgcmV2aWV3IGVsZW1lbnRzIGZyb20gVklTSUJMRSB0byBISURJTkdcbiAgICAgICAgICAgIHNob3dPckhpZGVSZXZpZXdFbGVtZW50cyhyZXZpZXdMZWFmLCByZXZpZXdQZXJzb24sIHJldmlld1RleHQpO1xuXG4gICAgICAgICAgICAvL1doZW4gbGVhZiBmYWxsIGFuaW1hdGlvbiBmaW5pc2hlc1xuICAgICAgICAgICAgcmV2aWV3TGVhZi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgLy9TZXR0aW5nIHN0YXRlIGZvciByZXZpZXcgZWxlbWVudHMgZnJvbSBISURJTkcgdG8gSElEREVOXG4gICAgICAgICAgICAgICAgc2hvd09ySGlkZVJldmlld0VsZW1lbnRzKHJldmlld0xlYWYsIHJldmlld1BlcnNvbiwgcmV2aWV3VGV4dCk7XG5cbiAgICAgICAgICAgICAgICAvL1JlbW92aW5nIHRoZSByZXZpZXcgYWN0aXZlIGNsYXNzLCB0aGVyZWZvcmUgZGlzcGxheTogbm9uZSBpcyBzZXRcbiAgICAgICAgICAgICAgICByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZSgncmV2aWV3LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIC8vQmVnaW5uaW5nIGFudG90aGVyIGN5Y2xlXG4gICAgICAgICAgICAgICAgcmV2aWV3Q3ljbGVyKCk7XG5cbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgLy8gTWFraW5nIHN1cmUsIHRoYXQgdGhlIGxlYWYgZmFsbCBhbmltYXRpb24gZXZlbnQgdHJpZ2dlcnMgb25seSBvbmNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FwdHVyZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgb25jZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXNzaXZlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA3MDAwKTtcbiAgICAgICBcblxufVxuXG4vL1N0YXJ0aW5nIHRvIGN5Y2xlIHdoZW4gdGhlIHBhZ2UgbG9hZHNcbnJldmlld0N5Y2xlcigpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8gUE9TVCBFTUFJTCBGT1JNXG4vLy8vLy8vLy8vLy8vLy8vLy9cbmNvbnN0IGVtYWlsSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwnKTtcbmVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdCcpO1xuICAgIHN1Ym1pdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc3VibWl0LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICB9LCAyMCk7XG59KTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLyBQT1NULVNDUklQVFVNIEVYUEFOU0lPTlxuLy8vLy8vLy8vLy8vLy8vLy8vXG5jb25zdCBwb3N0U2NyaXB0dW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9zdC1zY3JpcHR1bScpO1xuY29uc3Qgc2hvd1BTUGhvdG8gPSAoKSA9PiB7XG4gICAgcG9zdFNjcmlwdHVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Nsb3NlZCcpO1xuICAgIHBvc3RTY3JpcHR1bS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dQU1Bob3RvKTtcbn1cbnBvc3RTY3JpcHR1bS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dQU1Bob3RvKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLyBTVUNDRVNTIE1PREFMXG4vLy8vLy8vLy8vLy8vLy8vLy9cbmNvbnN0IHNlYXJjaCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG5pZiAoc2VhcmNoKSB7XG4gICAgY29uc3QgcGFyYW1zID0gc2VhcmNoLnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhcmFtcyAmJiBwYXJhbXNbMF0gPT09ICc/c3VjY2VzcycgfHwgcGFyYW1zWzBdID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHBhcmFtc1sxXTtcblxuICAgICAgICBjb25zdCBzaG93SGlkZU1vZGFsID0gKGNsYXNzTmFtZSwgdGV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kYWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJyk7XG4gICAgICAgICAgICBtb2RhbEVsLmNsYXNzTGlzdC5hZGQoJ21vZGFsJyk7XG4gICAgICAgICAgICBtb2RhbEVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIG1vZGFsRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICAgICAgaGVhZGVyLmFwcGVuZChtb2RhbEVsKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbW9kYWxFbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChzdWNjZXNzKSB7XG4gICAgICAgICAgICBjYXNlICd0cnVlJzoge1xuICAgICAgICAgICAgICAgIHNob3dIaWRlTW9kYWwoJ3N1Y2Nlc3MnLCAnUG92ZWRsbyBzZSBwxZlpZGF0IFbDocWhIGUtbWFpbCEnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2ZhbHNlJzoge1xuICAgICAgICAgICAgICAgIHNob3dIaWRlTW9kYWwoJ2ZhaWwnLCAnUMWZaWTDoW7DrSBlLW1haWx1IHNlIG5lcG9kYcWZaWxvLicpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vIEFOSU1BVElPTlNcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL0NvbGxlY3RpbmcgYWxsIGVsZW1lbnRzIHdpdGggY2xhc3MgXCJ0b0JlQW5pbWF0ZWRcIlxuY29uc3QgdG9CZUFuaW1hdGVkRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9CZUFuaW1hdGVkJyk7XG5cbi8vQ3JlYXRpbmcgYXJyYXkgb2YgcGFpcnMgb2YgdG8gYmUgYW5pbWF0ZWQgZWxlbWVudHMgYW5kIHRoZWlyIGRpc3RhbmNlIGZyb20gZG9jdW1lbnQgdG9wIGJvcmRlciAgLT4gW1tlbGVtZW50MSwgZGlzdGFuY2UxXSwgW2VsZW1lbnQyLCBkaXN0YW5jZTJdLCAuLi4gXVxubGV0IHRvQmVBbmltYXRlZCA9IFtdO1xuZm9yIChjb25zdCBlbGVtZW50IG9mIHRvQmVBbmltYXRlZEVsZW1lbnRzKSB7XG4gICAgdG9CZUFuaW1hdGVkLnB1c2goW2VsZW1lbnQsIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BdKTtcbn1cblxuXG4vL0hhbmRsZXIgZm9yICdzY3JvbGwnIGV2ZW50IG9uIGRvY3VtZW50LndpbmRvdywgdHJpZ2dlcnMgYW5pbWF0aW9uc1xuY29uc3QgYW5pbWF0aW9uVHJpZ2dlcmVyID0gKCkgPT4ge1xuXG4gICAgLy9Db250YWlucyBpZMK0cyBvZiBlbGVtZW50cyAoaW4gdG9CZUFuaW1hdGVkW10pLCB0aGF0IGFyZSBnb2luZyB0byBiZSBhbmltYXRlZCB0aGlzIGZ1bmN0aW9uIGNhbGxcbiAgICBjb25zdCB3aWxsQmVBbmltYXRlZCA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBhbmltYXRpb24gb2YgdG9CZUFuaW1hdGVkKSB7XG5cbiAgICAgICAgaWYgKGFuaW1hdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vSWYgdGhlIGRpc3RhbmNlIGJldHdlZW4gd2luZG93IHRvcCBhbmQgZWxlbWVudMK0cyB5IGNvb3JkaW5hdGUgaXMgc21hbGwgZW5vdWdoLCBhbmltYXRpbmcgdGhlIGVsZW1lbnRcbiAgICAgICAgaWYgKGFuaW1hdGlvblsxXSAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPD0gd2luZG93LmlubmVySGVpZ2h0IC0gMTAwKSB7XG5cbiAgICAgICAgICAgIC8vUmVtb3ZpbmcgdG9CZUFuaW1hdGVkIGNsYXNzXG4gICAgICAgICAgICBhbmltYXRpb25bMF0uY2xhc3NMaXN0LnJlbW92ZSgndG9CZUFuaW1hdGVkJyk7XG5cbiAgICAgICAgICAgIC8vRmluZGluZyBpbmRleCBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgaWQgPSB0b0JlQW5pbWF0ZWQuZmluZEluZGV4KChhbmltKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbiA9PT0gYW5pbTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vQWRkaW5nIGluZGV4IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICB3aWxsQmVBbmltYXRlZC5wdXNoKGlkKTtcbiAgICAgICAgfSAgXG4gICAgfVxuXG4gICAgLy9JZiB0aGVyZSBhcmUgc29tZSBlbGVtZW50cyB0aGF0IGFyZSBnb2luZyB0byBiZSBhbmltYXRlZCB0aGlzIGZ1bmN0aW9uIGNhbGxcbiAgICBpZiAod2lsbEJlQW5pbWF0ZWQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHdpbGxCZUFuaW1hdGVkKTtcbiAgICAgICAgLy9NYXBwaW5nIHRvQmVBbmltYXRlZCBhcnJheSB0byBhbiBhcnJheSwgaW4gd2hpY2ggdGhlIGVsZW1lbnRzIGFuaW1hdGVkIHRoaXMgZnVuY3Rpb24gY2FsbCBhcmUgbm90IGluY2x1ZGVkXG4gICAgICAgIHRvQmVBbmltYXRlZCA9IHRvQmVBbmltYXRlZC5tYXAoKHZhbHVlLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaWQgb2Ygd2lsbEJlQW5pbWF0ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaWQgPT09IGlkeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZygnUScpO1xuICAgICAgICBjb25zb2xlLmxvZyh0b0JlQW5pbWF0ZWQpO1xuICAgIH1cbn1cblxuLy9XaGVuIHVzZXIgc2Nyb2xscywgdHJpZ2dlcmluZyBhbmltYXRpb25zXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgIGFuaW1hdGlvblRyaWdnZXJlcigpO1xufSlcblxuLy9QcmV2ZW50aW5nIG1pc2JlaGF2aW9yIG9uIHdpbmRvdyByZXNpemVcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG5cbiAgICAvL1VwZGF0aW5nIHRvQmVBbmltYXRlZCwgYmVjYXVzZSBhZnRlciByZXNpemluZyBjYW4gdGhlIHRvcCBwb3NpdGlvbiBiZSBkaWZmZXJlbnRcbiAgICB0b0JlQW5pbWF0ZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdG9CZUFuaW1hdGVkRWxlbWVudHMpIHtcbiAgICAgICAgdG9CZUFuaW1hdGVkLnB1c2goW2VsZW1lbnQsIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BdKTtcbiAgICB9XG59KVxuXG4vL1RyaWdnZXJpbmcgYW5pbWF0aW9ucyBvbiBwYWdlIGxvYWRcbmFuaW1hdGlvblRyaWdnZXJlcigpOyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/client/js/index.js\n");
/******/ })()
;