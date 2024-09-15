const domain = 'meet.jit.si';
const options = {
    roomName: `mooumzip-jitsi-room${location.pathname.split('/')[2]}`,
    parentNode: document.querySelector('#jitsi'),
    lang: 'ko',
    userInfo: {
        displayName: localStorage.getItem('signinName')
    }
};

function makeJitsiGreatAgain() {
    const JITSIAPI = new JitsiMeetExternalAPI(domain, options)
    document.querySelector('#feedbox').style.display='none'
}
