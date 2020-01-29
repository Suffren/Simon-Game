const pads = ['green', 'red', 'yellow', 'blue'];

let sequence = [];
function addRandomSound () {
    let newSound = Math.floor(Math.random() * Math.floor(4));
    sequence.push(newSound);
}

let success;
let startBtn = document.getElementsByClassName('btn')[0];
startBtn.addEventListener('click', function () { // Réinitialisation
    success = 0;
    sequence = [];
    addRandomSound();
    activatePad(pads[sequence[0]]);
});

function playPad (padName) {
    activatePad(padName);
    if(sequence.length !== 0)
        checkSequence(padName);
}

function activatePad (padName) {
    // Jouer le son concerné
    let audio = new Audio(document.getElementById(padName).children[0].src);
    audio.play();

    // Allumer et éteindre le bouton
    document.getElementById(padName).style = 'background-color: purple; box-shadow: 0px 0px 30px purple';
    setTimeout(function () {
        document.getElementById(padName).style = `background-color: ${padName}; box-shadow: 0px`;
    }, 300);
}

function checkSequence (padName) {
    let idxActivePad = pads.indexOf(padName);// Trouver l'index du pad concerné
    if(sequence[success] === idxActivePad) { // Vérifier si le pad cliqué correspond à l'élément courant de la séquence
        success += 1;                          // Si oui, c'est un essai réussi de plus
        if(sequence.length !== success) {      // Si le nombre d'essais ne correspond pas encore à la fin de la séquence,
            return;                                 // On passe au pad suivant
        } else {                               // Si le joueur arrive avec succès à la fin de la séquence,
            if (sequence.length === 14)             // Le jeu se termine après 15 essais réussis
                return alert('gagné !');

            setTimeout( () => {                // Sinon, refaire écouter la séquence en y ajoutant un nouveau son
                addRandomSound();
                playSequence();
            } , 600);                          // Léger délai avant la lecture de la séquence

            success = 0;
        }
    } else { // Echec
        sequence = [];
        alert('Perdu !');
    }
}

function playSequence () {
    playSeqBtn.setAttribute('disabled', 'disabled'); // Désactiver le bouton de lecture pendant celle ci
    let i = 0;
    function defer() {
        setTimeout(function () {
            i++;
            if (i <= sequence.length) {            // Commnencer au début de la séquence
                activatePad(pads[sequence[i -1]]); // Obtenir l'index du pad en cours et l'activer
                defer();
            } else {
                playSeqBtn.removeAttribute('disabled');
            }
        }, 550);
    }
    defer();
}

let playSeqBtn = document.getElementsByClassName('btn2')[0];
playSeqBtn.addEventListener('click', function () {
    playSequence();
});