var main = document.querySelector('#main')
var hit = document.createElement('button')
var start_game = document.createElement('button')
var hand_div = document.createElement('div')
var card_container = document.createElement('div')
var card_background_container = document.createElement('div')
var card_container2 = document.createElement('div')
var submit_button = document.createElement('button')
var reset_db_button = document.createElement('button')
var submitButtonDiv = document.querySelector('.modalSubmitButton')
var database = firebase.firestore()
reset_db_button.setAttribute('id','resetDbButton')
submit_button.setAttribute('id','nameSubmitButton')
submit_button.innerHTML = 'Submit name'
reset_db_button.innerHTML = 'Reset Database'

firebase
.firestore()
.collection('players')
.doc('players')
.get()
.then(doc => {
    var details = doc.data()
    var player1 = details.player1
    var player2 = details.player2

    console.log(player1)
    console.log(player2)
})
submit_button.addEventListener('click',()=>{
    var modal = document.querySelector('#Modal')
    var input_Value = document.getElementById('name-input').value
    if(input_Value != ''){
        modal.style.display = 'none'
        console.log(input_Value)
    }

    firebase
    .firestore()
    .collection('players')
    .doc('players')
    .get()
    .then(doc =>{
        var details = doc.data()
        console.log(details)

        if(details.player1.name === ''){
            firebase
            .firestore()
            .collection('players')
            .doc('players')
            .update({
                player1:{
                    hand: [],
                    hand_value_hard : 0,
                    hand_value_soft : 0,
                    name:input_Value
                }
            })
        }
        else if(details.player2.name === ''){
            firebase
            .firestore()
            .collection('players')
            .doc('players')
            .update({
                player2:{
                    hand: [],
                    hand_value_hard : 0,
                    hand_value_soft : 0,
                    name:input_Value
                }
            })
        }
    })
})

reset_db_button.addEventListener('click',()=>{
    firebase
    .firestore()
    .collection('players')
    .doc('players')
    .update({
        player1 : {
            hand: [],
            hand_value_hard : 0,
            hand_value_soft : 0,
            name : ''
        },
        player2 : {
            hand: [],
            hand_value_hard : 0,
            hand_value_soft : 0,
            name : ''
        }
    })

    firebase
    .firestore()
    .collection('players')
    .doc('players')
    .get()
    .then(doc =>{
        var details = doc.data()
        console.log(details)

        if(details.player1.name === '' && details.player2.name === ''){
            reset_db_button.innerHTML = 'Database reset!'
            setTimeout(()=>{
                reset_db_button.innerHTML = 'Reset Database'  
            },3000)
           
        }
    })
})
submitButtonDiv.append(reset_db_button)
submitButtonDiv.append(submit_button)


start_game.setAttribute('id','start-game')
hit.setAttribute('id','hit')
card_background_container.setAttribute('id','card-background-container')
card_container2.setAttribute('id','card-container2')
card_container.setAttribute('id','card-container')
var all_cards = ['2_h','3_h','4_h','5_h','6_h','7_h','8_h','9_h','10_h','J_h','Q_h','K_h','A_h','2_s','3_s','4_s','5_s','6_s','7_s','8_s','9_s','10_s','J_s','Q_s','K_s','A_s','2_d','3_d','4_d','5_d','6_d','7_d','8_d','9_d','10_d','J_d','Q_d','K_d','A_s','2_c','3_c','4_c','5_c','6_c','7_c','8_c','9_c','10_c','J_c','Q_c','K_c','A_c']

var hand = []
var hand_total_nums = []
var hand_total_nums2 = []
var hand_total = 0
var hand_total2 = 0
var total_hand_value = document.createElement('h1')


hit.style.display = 'none'
total_hand_value.innerHTML = ''
start_game.innerHTML = 'Click to start game'
hit.innerHTML = 'Hit'

start_game.addEventListener('click',()=>{
    
    hit.style.display = 'inline'
    for(var i = 1;i<=2;i++){
        var randNum = parseInt(Math.random() * all_cards.length)
        hand.push(all_cards[randNum])   
    }
    for(var card of hand){
        var cardNumber = card.split('_')[0].toLowerCase()
        if(cardNumber === 'j' || cardNumber === 'q' || cardNumber === 'k'){
            hand_total_nums.push(10)
            hand_total_nums2.push(10)
        }
        else if(cardNumber === 'a'){
            hand_total_nums.push(1)
            hand_total_nums2.push(11)
        }
        else{
            hand_total_nums.push(cardNumber)
            hand_total_nums2.push(cardNumber)
        }
        

        var cardImg = document.createElement('img')
        cardImg.setAttribute('id','card')
        cardImg.setAttribute('align','bottom')
        cardImg.setAttribute('src',`./assets/card-${card}.png`)
        cardImg.setAttribute('width',170)
        cardImg.setAttribute('height',260)

        var cardImg2 = document.createElement('img')
        cardImg2.setAttribute('id','card')
        cardImg2.setAttribute('align','bottom')
        cardImg2.setAttribute('src',`./assets/card-${card}.png`)
        cardImg2.setAttribute('width',170)
        cardImg2.setAttribute('height',260)
        
        card_container2.append(cardImg2)
        card_container.append(cardImg)

        card_background_container.append(card_container2)
        card_background_container.append(card_container)

        main.append(card_background_container)

        firebase
        .firestore()
        .collection('players')
        .doc('players')
        .get()
        .then(doc =>{
            var details = doc.data()

            details.player1.hand = hand
            firebase
            .firestore()
            .collection('players')
            .doc('players')
            .update(details)
        })
    }   
    hand_total = parseInt(hand_total_nums[0]) + parseInt(hand_total_nums[1])
    hand_total2 = parseInt(hand_total_nums2[0]) + parseInt(hand_total_nums2[1])
    total_hand_value.innerHTML = `Your hand's value is: ${hand_total} / ${hand_total2}`
    firebase
    .firestore()
    .collection('players')
    .doc('players')
    .get()
    .then(doc=>{
        var details = doc.data()
        details.player1.hand_value_hard = hand_total2
        details.player1.hand_value_soft = hand_total
        details.player1.hand = hand
        
        firebase
        .firestore()
        .collection('players')
        .doc('players')
        .update(details)
    })
    start_game.style.display = 'none'
    console.log(hand_total, hand, hand_total_nums)
    console.log(hand_total2, hand, hand_total_nums2)
    if(hand_total === 21 || hand_total2 === 21){
        var win_div = document.createElement('h1')
        win_div.innerHTML = 'Blackjack! You win'
        hit.style.display = 'none'
        var reset_button = document.createElement('button')
        reset_button.addEventListener('click',()=>{
            console.log('reset button pressed')
            firebase
            .firestore()
            .collection('players')
            .doc('players')
            .get()
            .then(doc => {
                var details = doc.data()
                details.player1.hand = []
                details.player1.hand_value_hard = 0
                details.player1.hand_value_soft = 0
                details.player1.name = ''

                firebase
                .firestore()
                .collection('players')
                .doc('players')
                .update(details)
            })
            location.reload()
        })
        reset_button.innerHTML = 'Reset'
        main.append(reset_button)
        main.append(win_div)
    }
})
hit.addEventListener('click', ()=>{
    var randNum = parseInt(Math.random() * all_cards.length)
    var newCard = all_cards[randNum]
    hand.push(newCard)

    
    var cardNumber = newCard.split('_')[0].toLowerCase()
        if(cardNumber === 'j' || cardNumber === 'q' || cardNumber === 'k'){
            hand_total_nums.push(10)
            hand_total_nums2.push(10)
        }
        else if(cardNumber === 'a'){
            hand_total_nums.push(1)
            hand_total_nums2.push(11)
        }
        else{
            hand_total_nums.push(cardNumber)
            hand_total_nums2.push(cardNumber)
        }

    hand_total = hand_total_nums.reduce((a,b)=> parseInt(a) + parseInt(b) , 0)
    hand_total2 = hand_total_nums2.reduce((a,b)=> parseInt(a) + parseInt(b) , 0)
    console.log(hand_total)
    console.log(hand_total2)
    total_hand_value.style.justifyContent = 'center'
    total_hand_value.innerHTML = `Your hand's value is: ${hand_total} / ${hand_total2}`
    start_game.style.display = 'none'

    firebase
    .firestore()
    .collection('players')
    .doc('players')
    .get()
    .then(doc => {
        var details = doc.data()
        details.player1.hand = hand
        details.player1.hand_value_hard = hand_total2
        details.player1.hand_value_soft = hand_total

        firebase
        .firestore()
        .collection('players')
        .doc('players')
        .update(details)
    })
    var cardImg = document.createElement('img')
    cardImg.setAttribute('id','card')
    cardImg.setAttribute('align','bottom')
    cardImg.setAttribute('src',`./assets/card-${newCard}.png`)
    cardImg.setAttribute('width',170)
    cardImg.setAttribute('height',260)

    var cardImg2 = document.createElement('img')
    cardImg2.setAttribute('id','card')
    cardImg2.setAttribute('align','bottom')
    cardImg2.setAttribute('src',`./assets/card-${newCard}.png`)
    cardImg2.setAttribute('width',170)
    cardImg2.setAttribute('height',260)
    
    card_container2.append(cardImg2)
    card_container.append(cardImg)

    card_background_container.append(card_container2)
    card_background_container.append(card_container)

    main.append(card_background_container)



    
    if(hand_total === 21 || hand_total2 === 21){
        var win_div = document.createElement('h1')
        win_div.innerHTML = 'Blackjack! You win'
        hit.style.display = 'none'
        var reset_button = document.createElement('button')
        reset_button.addEventListener('click',()=>{
            console.log('reset button pressed')
            firebase
            .firestore()
            .collection('players')
            .doc('players')
            .get()
            .then(doc => {
                var details = doc.data()
                details.player1.hand = []
                details.player1.hand_value_hard = 0
                details.player1.hand_value_soft = 0
                details.player1.name = ''

                firebase
                .firestore()
                .collection('players')
                .doc('players')
                .update(details)
            })
            location.reload()
        })
        reset_button.innerHTML = 'Reset'
        main.append(reset_button)
        main.append(win_div)
    }
    else if(hand_total > 21 && hand_total2 > 21){
        var win_div = document.createElement('h1')
        win_div.innerHTML = 'Bust! You lose'
        hit.style.display = 'none'
        var reset_button = document.createElement('button')
        reset_button.addEventListener('click',()=>{
            console.log('reset button pressed')
            firebase
            .firestore()
            .collection('players')
            .doc('players')
            .get()
            .then(doc => {
                var details = doc.data()
                details.player1.hand = []
                details.player1.hand_value_hard = 0
                details.player1.hand_value_soft = 0
                details.player1.name = ''

                firebase
                .firestore()
                .collection('players')
                .doc('players')
                .update(details)
            })
            setTimeout(()=>{
                location.reload()
            },1000)
        })
        reset_button.innerHTML = 'Reset'
        main.append(reset_button)
        main.append(win_div)
    }

})
var buttonDiv = document.createElement('div')
buttonDiv.setAttribute('id','button-div')
buttonDiv.append(start_game)
buttonDiv.append(hit)



main.append(total_hand_value)
main.append(buttonDiv)
main.append(hand_div)