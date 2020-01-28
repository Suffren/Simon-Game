const pads = ['green', 'red', 'yellow', 'blue'];

let sequence = [];
function addRandomSound () {
    let newSound = Math.floor(Math.random() * Math.floor(4));
    sequence.push(newSound);
}

let success;
let startButton = document.getElementsByClassName('btn')[0];
startButton.addEventListener('click', function () { // Réinitialisation
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
    var audio = new Audio(document.getElementById(padName).children[0].src);
    audio.play();

    // Allumer et éteindre le bouton
    document.getElementById(padName).style = 'background-color: purple; box-shadow: 0px 0px 30px purple';
    setTimeout(function () {
        document.getElementById(padName).style = `background-color: ${padName}; box-shadow: 0px`;
    }, 300);
}

function checkSequence (padName) {
    let idxActivePad = pads.indexOf(padName);// Trouver l'index du pad concerné
    if(sequence[success] === idxActivePad) { // Vérifier si le Pad cliqué correspond à l'élément courant de la séquence
        success += 1;                          // Si oui, c'est un essai réussi de plus
        if(sequence.length !== success) {      // Si le nombre d'essais ne  correspond pas encore à la fin de la séquence,
            return;                                 // On passe au pad suivant
        } else {                               // Si le nombre d'essai arrive à la fin de la séquence,
            if (sequence.length === 14)             // Le jeu se termine après 15 essais réussis
                return alert('gagné !');

            setTimeout( () => {                // Sinon, refaire écouter la séquence en y ajoutant un nouveau son
                addRandomSound();
                playSequence();
            } , 600)
            success = 0;
        }
    } else {
        startButton.removeAttribute("disabled"); // Echec
        sequence = [];
        alert('Perdu !');
    }
}

function playSequence () {
    var i = 0;
    function deferred() {
        setTimeout(function () {
            i++;
            if (i <= sequence.length) {
                activatePad(pads[sequence[i -1]])
                deferred();
            }
        }, 550);
    }
    deferred();
}

// A implémenter: Possibilité de rejouer la séquence en mode "Facile"
// let playSeq = document.getElementsByClassName('btn2')[0];
// playSeq.addEventListener('click', function () {
//     playSequence();
// });