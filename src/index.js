import { fromEvent,Subject } from "rxjs";
import WORDS_LIST from './wordsList.json'

const letterRows = document.getElementsByClassName("letter-row");
const onKeyEventDown$ = fromEvent(document, "keydown");
const backsacpe = "Backspace";
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const keyDown$ = new Subject();
const getRandomWord = () =>  WORDS_LIST[Math.floor(Math.random()* WORDS_LIST.length)];
let rightWord = getRandomWord();
const messageText = document.getElementById('message-text');
const buttonRestart = document.getElementById('restart-button');
const userWinOrLoose$ = new Subject();
let aciertos = 0;

buttonRestart.addEventListener('click', () =>restart())


const insertLetter = {
  next: (event) => {
    const pressedKey = event.key.toUpperCase();
    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
        if(userAnswer.length == rightWord.length){
            messageText.textContent = "Presione enter para verificar";
        }
        else{
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add("filled-letter");
            userAnswer.push(pressedKey); 
            letterIndex++; 
        }
      
    }
  },
};

const deleteLetter = {
    next: (event) =>{
        if(event.key == backsacpe){
            if(letterIndex != 0 || letterRowIndex !=0 ){
                if(letterIndex == 0){
                    letterRowIndex--;
                    letterIndex = Array.from(letterRows)[letterRowIndex].children.length;
                }
                letterIndex --;
                let letterBox =
                    Array.from(letterRows)[letterRowIndex].children[letterIndex];
                letterBox.textContent = "";
                letterBox.classList.remove("filled-letter");
                userAnswer.pop();
            }
        }
    }
}

const checkWord = {
    next: (event) =>{
        if(event.key == 'Enter'){
            if(userAnswer.length ==   Array.from(letterRows)[letterRowIndex].children.length){    
                
                let letterContainer =
                    Array.from(letterRows)[letterRowIndex];
                console.log(userAnswer);
                for(let i=0; i<userAnswer.length; i++){
                    let letterClass = 'letter-grey';
                    let findLetter = rightWord.indexOf(userAnswer[i]);
                    if(userAnswer[i] === rightWord[i]){
                        letterClass = 'letter-green';
                    }else if(findLetter != -1){
                        letterClass = 'letter-yellow';
                    }
                    letterContainer.children[i].classList.add(letterClass);
                }
                aciertos = userAnswer.join("") == rightWord?aciertos+1:aciertos;
                console.log(Array.from(letterRows).length);
                if(letterRowIndex+1 ==  Array.from(letterRows).length){
                    onFinish$.next();
                }
                else{
                    userWinOrLoose$.next(userAnswer.join("") == rightWord);
                    letterIndex= 0;
                    userAnswer = [];
                    letterRowIndex++;
                }
                

            }else{
                messageText.textContent = `Te faltan ${Array.from(letterRows)[letterRowIndex].children.length - userAnswer.length} letras`;
            }
        }
    }
}

const onRestart$ =new Subject();

onRestart$.subscribe(()=>{
    console.log("ok");
    let letterContainer = Array.from(letterRows);
    for(let i=0; i<letterContainer.length;i++){
        for(let j=0;j<letterContainer[i].children.length;j++){
            let letterBox = letterContainer[i].children[j];
            letterBox.textContent = "";
            letterBox.classList.remove('letter-green');
            letterBox.classList.remove('letter-grey');
            letterBox.classList.remove('letter-yellow');
            letterBox.classList.remove('letter-yellow');
            letterBox.classList.remove("filled-letter");
        }
    }
})


const onFinish$ = new Subject();
onFinish$.subscribe(()=>{
    messageText.textContent =  `Juego terminado, Obtuvo ${aciertos}. `;
    keyDown$.unsubscribe(insertLetter);
    keyDown$.unsubscribe(deleteLetter);
    keyDown$.unsubscribe(checkWord);
    onKeyEventDown$.unsubscribe(keyDown$)
})





userWinOrLoose$.subscribe((res) => {
    messageText.textContent = res?"Has acertado":"Has fallado";
    rightWord = getRandomWord();
    console.log(rightWord);
});


restart();

function restart(){
    aciertos = 0;
    rightWord = getRandomWord();
    letterIndex = 0;
    letterRowIndex = 0;
    keyDown$.subscribe(insertLetter);
    keyDown$.subscribe(deleteLetter);
    keyDown$.subscribe(checkWord);
    onKeyEventDown$.subscribe(keyDown$)
    onRestart$.next();
}