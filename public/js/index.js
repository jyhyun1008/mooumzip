var popSound = new Audio('https://for.stella.place/D1/f89f27b6-7c43-4803-a2cd-6c8549636611.flac');

function playPop() {
    popSound.play();
}

// Board

function openBoard() {
    document.querySelector('#boardbox').style.display='flex'
    document.querySelector('#feedbox').style.display='none'
    document.querySelector('#jitsibox').style.display='none'
}

function boardEnd() {
    document.querySelector('#boardbox').style.display='none'
    document.querySelector('#feedbox').style.display='block'
}