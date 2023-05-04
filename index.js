const colorPicker = document.querySelector('input[type="color"]'); //color input element
let colorValue = (colorPicker.value).substring(1); //color currently selected with # removed
const selectScheme = document.getElementById('schemes'); //color scheme dropdown element
let schemeValue = selectScheme.value; //color scheme currently selected
const colorSchemes = document.querySelector('.color-schemes'); //color columns container
const footer = document.querySelector('footer'); //area where hex value is visible
const randomColorBtn = document.querySelector('.random-color button')


//update colorValue when the color picker is used
colorPicker.addEventListener('input', (e) => {
    colorValue = (e.target.value).substring(1);
    colorScheme(colorValue, schemeValue) //run function to update color palette
})

//update schemeValue when another scheme is selected
selectScheme.addEventListener('input', (e) => {
    schemeValue = e.target.value;
    colorScheme(colorValue, schemeValue) //run function to update color palette
})

//generate random color
randomColorBtn.addEventListener('click', () => {
    const randomValue = Math.floor(Math.random()*16777215).toString(16);
    colorValue = randomValue;
    colorPicker.value = `#${randomValue}`
    colorScheme(colorValue, schemeValue)
})

//copy color value in column
colorSchemes.addEventListener('click', (e) => {
    const clickedColumn = e.target.style["background-color"]
    const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`; //rgb2hex source: https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
    columnColor = rgb2hex(clickedColumn);
    copyColor(columnColor, e);
})

//copy hex value from hex column
footer.addEventListener('click', (e) => {
    const hexText = (e.target.innerText).toLowerCase();
    copyColor(hexText, e);
})

function colorScheme() {
    fetch(`https://www.thecolorapi.com/scheme?hex=${colorValue}&mode=${schemeValue}&count=5`)
    .then( response => response.json() )
    .then( data => {
        colorSchemes.innerHTML = ''; //reset color scheme selection
        footer.innerHTML = ''; //reset hex text
        let counter = 0;
        data.colors.map( function(colorText) {
            //Give me color bars!
            colorSchemes.innerHTML += `
                <div class="color-column animate pop delay-${++counter}" style="background-color: ${colorText.hex.value}"></div>
            `;
            //color bar hex value
            footer.innerHTML += `
                <div class="hex-value"><h3 class="hex-text">${colorText.hex.value}</h3></div>
            `;
        })
    })
}

function removeCopyMsg() {
    //removes previous copied message feedback
    //color columns
    const colorColumns = document.querySelectorAll('.color-column');
    for(let i = 0; i < colorColumns.length; ++i) {
        colorColumns[i].innerHTML = '';
    }    
    //hex columns
    const hexColumns = document.querySelectorAll(".hex-text")
    for(let i = 0; i < hexColumns.length; ++i) {
        if(hexColumns[i].innerText.length > 7) {
            const hexH3 = hexColumns[i]
            hexH3.innerText = hexH3.innerText.substring(0, 7)
        }
    }
}

function copyStatus(e) {
    //add copied/emoji message to color or hex value clicked
    if(e.target.classList.contains("color-column")) {
        removeCopyMsg()
        e.target.innerHTML = `<h3 class="copied">Copied</h3>`;
    }else if(e.target.classList.contains("hex-text")) {
        removeCopyMsg()
        e.target.innerHTML += ` ✅`
    }
}

//copy color value to clipboard
function copyColor(colorData, e) {
        navigator.clipboard.writeText(colorData).then(
            () => {
                copyStatus(e)    
            }, () => {
                console.log('Copy Failed')
            }
        )
}

colorScheme()