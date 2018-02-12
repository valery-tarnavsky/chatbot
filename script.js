var chat = (function(){
    var config        = null,
        messagesWrap  = document.querySelector('.messages'),
        message       = document.querySelector('.message'),
        chatInput     = document.querySelector('.message_input'),
        sendButton    = document.querySelector('.send_message'),
        dialog;

    function fixDateFormat(){
        var tmpDate = new Date();
        var fixDate = {
            hours: tmpDate.getHours(),
            minutes: tmpDate.getMinutes(),
            seconds: tmpDate.getSeconds()
        };
        for (var k in fixDate) {
            fixDate[k] = fixDate[k] < 10  ? ('0'+ fixDate[k]) : fixDate[k];
        }
        return fixDate.hours + ":" + fixDate.minutes + ":" + fixDate.seconds;
    }

    function findResponse(msg) {
        var result;
        for(var i = 0; i < config.request.length; i++){
            for(var j = 0; j < config.response.length; j++){
                config.request[i].forEach(function(item) {
                    if(item == msg){
                        var items = config.response[i];
                        result = items[Math.floor(Math.random()*items.length)];
                    }
                });
            }
        }
        return result;
    }

    function findBestMatch(str) {
        var arr = str.split(' ');
        var item = {index: null, match: 0};
        for(var i = 0; i < config.request.length; i++){
            var currentTrigger = config.request[i].join(';');
            var match = 0;
            for(var j = 0; j < arr.length; j++){
                if(currentTrigger.indexOf(arr[j]) != -1){
                    match += +currentTrigger.match(new RegExp(arr[j], 'gi')).length;
                    /*console.log('Word:', response[j], ' | currentTrigger:', currentTrigger, ' | match: ', match);*/
                }
            }
            if (match > item.match){
                item.index = i;
                item.match = match;
            }
        }
        return item.index || item.index === 0 ? findResponse(config.request[item.index][0]) : null;
    }

    function getBotMsg(msg){
        return findResponse(msg) || findBestMatch(msg) || config.alternative;
    }

    function scrollToBottom(element){
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    function saveToLocalStorage(obj) {
        localStorage.setItem('dialog', JSON.stringify(obj));
    }

    function insertDataToTmp(className, msg, date) {
        return '<li class="message '+ className +' fade-in" data-visibility="hidden">' +
                    '<div class="avatar"></div>' +
                    '<div class="text_wrapper">' +
                        '<div class="text">'+ msg +'</div>' +
                        '<span class="date">'+ date +'</span>' +
                    '</div>' +
                '</li>';
    }

    function updateDialog(obj){
        var newMsg = insertDataToTmp(obj.role, obj.msg, obj.date);
        messagesWrap.insertAdjacentHTML('beforeend', newMsg);
        scrollToBottom(messagesWrap);
    }

    function saveMsg(obj) {
        dialog.push(obj);
        saveToLocalStorage(dialog);
        return obj;
    }

    function setReplyTime (str){
        return str.length*20;
    }

    function prepareStr(str) {
        return str.toLowerCase().replace(/[^\w\s\d]/gi, "").replace(/i /g,' ').replace(/a /g,' ').replace(/\s+/g,' ').trim();
    }

    function validate() {
        return chatInput.value != "" && chatInput.value.length > 1;
    }

    function initDialog() {
        if(!validate()){return false}
        var userMsg = chatInput.value;
        chatInput.value = "";
        var botMsg  = getBotMsg(prepareStr(userMsg));
        updateDialog(saveMsg({msg: userMsg, role:'user', date : fixDateFormat()}));
        setTimeout(function() {
            updateDialog(saveMsg({msg: botMsg, role: 'bot', date : fixDateFormat()}));
        }, setReplyTime(botMsg));
    }

    function isEnterButtonPressed(e){
        var key = e.which || e.keyCode;
        key === 13 && initDialog();
    }

    function initListeners() {
        chatInput.addEventListener("keypress", isEnterButtonPressed);
        sendButton.addEventListener("click", initDialog)
    }

    function showDialog(arr) {
        arr.forEach(function(item){
            updateDialog(item);
        });
    }

    function getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('dialog'));
    }

    function getDialog() {
        dialog = getFromLocalStorage() ||  [];
        if(dialog.length){
            showDialog(dialog);
        }
    }

    return {
        setChatData : function(chatData){
            config = chatData;
        },
        init: function(){
            /*localStorage.clear();*/
            getDialog();
            initListeners();
        }
    }
})();

chat.setChatData({
   request : [
       ["hello","hi","hey", "morning", "evening", "afternoon"],
       ["want visit your gym"],
       ["membership card","membership cost", "membership price", "buy membership", "club card"],
       ["premium", "about premium", "premium card", "premium cost price","premium membership"],
       ["classic", "classic card", "classic cost price","classic membership"],
       ["pool membership","visit pool", "pool card"],
       ["thanks", "thank you"]
    ],
  response: [
      ["Hello, how can I help you?","Hi! Do you have any questions?"],
      ["Great! You need membership card for that"],
      [/*"What kind of membership card are you interested in: Premium or Classic?", */"We have Premium and Classic membership cards. Which card are you interested in?"],
      ["Premium membership gym card is 240$, includes visits to the gym, swimming pool and yoga classes - from 7AM to 21PM"],
      ["Classic club card costs 170$, includes visits to the gym and yoga classes  - from 11AM to 17PM "],
      ["You can visit pool with Premium club card only"],
      ["You're welcome", "I was glad to help"]
    ],
    alternative : ["Sho?"]
});
chat.init();
