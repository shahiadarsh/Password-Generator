const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector('[data-lengthNumber]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton ');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');

const symbol = '~><?[]@`#$%^&*()-=_+{}\|/.,';

let password="";
let passwordLength=10;
let checkcount=0;

handleSlider();

setIndicator("#ccc");

//set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
}

//set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow

    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(97,123);
}

function generateUppercase(){
    return String.fromCharCode(65,91);
}

function generateSymbol(){
    let randNUm = getRndInteger(0 , symbol.length);
    return symbol.charAt(randNUm);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator('#0f0')
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


//eventListner

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() =>{
    if(passwordDisplay.value){
        copyContent();
    }
})


function handelCheckboxChange(){
    checkcount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkcount++;
        }
    });

    //special condition
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handelCheckboxChange)
});

generateBtn.addEventListener('click',()=>{

    //none of the checkbox are selected
    if(checkcount<=0){
        return ;
    }
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
    }

    //remove old password
    password="";

    //let's start the journey

    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }

    // if(numbersCheck.checked){
    //     password+=generateRndNumber();
    // }

    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr =[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRndNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password

    password = shufflePassword(Array.from(password));

    //show the UI 

    passwordDisplay.value=password;

    //calculate strenght
    calcStrength();

})