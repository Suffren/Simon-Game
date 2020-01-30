'use strict';

const pads = ['green', 'red', 'yellow', 'blue'];

let playSeqBtn = document.getElementsByClassName('btn2')[0];
playSeqBtn.setAttribute('disabled', 'disabled');
playSeqBtn.addEventListener('click', function () {
    playSequence(sequence, 500).then(function () { playSeqBtn.removeAttribute('disabled')});
});

let startSequence = [2,3,1,0];
let sequence = [];
function addRandomSound () {
    let newSound = Math.floor(Math.random() * Math.floor(4));
    sequence.push(newSound);
}

let success = 0;
let startBtn = document.getElementsByClassName('btn')[0];
startBtn.addEventListener('click', function () { // Réinitialisation
    success = 0;
    sequence = [];
    addRandomSound();
    playSequence(startSequence, 200).then(function () {
        setTimeout(
            function () {
                playSeqBtn.removeAttribute('disabled');
                activatePad(pads[sequence[0]]);
            },
        1000)
        });
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
                playSequence(sequence, 500).then(function() { playSeqBtn.removeAttribute('disabled')});
            } , 1000);                         // Léger délai avant la lecture de la séquence

            success = 0;
        }
    } else { // Echec
        playSeqBtn.setAttribute('disabled', 'disabled');
        sequence = [];
        alert('Perdu !');
    }
}

function playSequence (seq, delay) {
    success = 0;
    playSeqBtn.setAttribute('disabled', 'disabled');    // Désactiver le bouton de lecture pendant celle ci

    var promise = new Promise( resolve => resolve());   // Création d'un promesse déjà tenue
    seq.forEach(function (el, idx) {                    // Pour chaque élement de la séquence
        promise = promise.then(function () {                // Excécution asynchrone
            activatePad(pads[seq[idx]]);                    // ... de l'activation d'un pad
            return new Promise(function (resolve) {         // puis attendre le temps du délai
                setTimeout(resolve, delay);
            });
        });
    });
    return promise;
}