'use strict';

const pads = ['green', 'red', 'yellow', 'blue'];

let playSeqBtn = document.getElementById('playSeq');
let btnElts = [...document.getElementsByClassName('btn')];
let padElts = [...document.getElementsByClassName('pad')];

playSeqBtn.setAttribute('disabled', 'disabled');
playSeqBtn.addEventListener('click', () =>
    playSequence(sequence, 500).then( () => enableButtons() )
);

const bootSequence = [2,3,1,0];
let sequence = [];
let addRandomSound = () => {
    let newSound = Math.floor(Math.random() * Math.floor(4));
    sequence.push(newSound);
}

let success = 0;
let startBtn = document.getElementsByClassName('btn')[0];
startBtn.addEventListener('click', () => { // Réinitialisation
    success = 0;
    sequence = [];
    addRandomSound();
    playSequence(bootSequence, 200).then( () => {
        setTimeout( () => {
                enableButtons();
                activatePad(pads[sequence[0]]);
        }, 1000)
    });
});

let playPad = (padName) => {
    activatePad(padName);
    if(sequence.length !== 0)
        checkSequence(padName);
}

let activatePad = (padName) => {
    // Jouer le son concerné
    let audio = new Audio(document.getElementById(padName).children[0].src);
    audio.play();

    // Allumer et éteindre le pad
    document.getElementById(padName).style = 'background-color: purple; box-shadow: 0px 0px 30px purple;';
    setTimeout( () => document.getElementById(padName).style = `background-color: ${padName}; box-shadow: 0px;`, 300);
}

let checkSequence = (padName) => {
    let idxActivePad = pads.indexOf(padName);// Trouver l'index du pad concerné
    if(sequence[success] === idxActivePad) { // Vérifier si le pad cliqué correspond à l'élément courant de la séquence
        success += 1;                          // Si oui, c'est un essai réussi de plus
        if(sequence.length !== success) {      // Si le nombre d'essais ne correspond pas encore à la fin de la séquence,
            return;                                 // On passe au pad suivant
        } else {                               // Si le joueur arrive avec succès à la fin de la séquence,
            if (sequence.length === 3) {            // Le jeu se termine après 15 essais réussis
                sequence = [];
                return playSequence(bootSequence.concat(bootSequence).concat(bootSequence), 150).then( () => enableButtons() );
            }

            setTimeout( () => {                // Sinon, refaire écouter la séquence en y ajoutant un nouveau son
                addRandomSound();
                playSequence(sequence, 500).then( () => enableButtons() );
            } , 1000);                         // Léger délai avant la lecture de la séquence

            success = 0;
        }
    } else { // Echec
        playSeqBtn.setAttribute('disabled', 'disabled');
        sequence = [];
        alert('Perdu !');
    }
}

let playSequence = (seq, delay) => {
    success = 0;
    // Désactiver boutons et pads lors de la lecture
    btnElts.concat(padElts).forEach( el => { el.setAttribute('disabled', 'disabled'); } );

    var promise = Promise.resolve();                    // Création d'un promesse déjà tenue
    seq.forEach( (el, idx) => {                         // Pour chaque élement de la séquence
        promise = promise.then( () => {                     // Excécution asynchrone
            activatePad(pads[seq[idx]]);                        // ... de l'activation d'un pad
            return new Promise( (resolve) =>                    // puis attendre le temps du délai
                setTimeout(resolve, delay)
            );
        });
    });

    return promise;
}

let enableButtons = () => ( btnElts.concat(padElts).forEach( el => { el.removeAttribute('disabled');} ) );
