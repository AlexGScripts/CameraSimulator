const switchEl = document.querySelector('.uselessSwitch');
const messageEl = document.querySelector('.message');
let attemptCount = 0;

switchEl.addEventListener('click', () => {
    if (switchEl.classlist.contains('on')) return;

    switchEl.classList.add('on');
    document.body.style.backgroundColor = '#f0f0f0';
    document.body.style.color = '#000';

    attemptCount++;
    messageEl.textContent = `Nice try. Attemps: ${attemptCount}`;

setTimeout(() => {
    switchEl.classList.remove('on');
    document.body.style.backgroundColor = '#111';
    document.body.style.color = '#fff';
}, 1000 + Math.random() * 2000);
});
