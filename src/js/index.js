    // timer：定时器，控制方块运动 timer2:定时器，控制页面动画
    var timer,timer2,timer3,LStorage,
        flag = 1,
        speed = 3,
        score = 0,
        main = $('.wrapper #main');
/**创建单排方块并插入到dom结构当中
 * 
 */
function createRow(){
    var rowLi = $('<li></li>'),
        index = Math.floor(Math.random()*4);
        
    rowLi.attr('class','row');
    for(var i = 0; i < 4; i++){
        var item = $('<div></div>');
        // item.attr('class','item');
        rowLi.append(item);
    }
    var blackItem = rowLi.children()[index];
    $(blackItem).css('background','black');
    // 标识有颜色的方块
    $(blackItem).addClass("i");
    //将dom结构全部生成完毕最后一次性插入到页面当中
    if(main.children().length == 0){
        main.append(rowLi);
    }
    else{
        rowLi.insertBefore(main.children()[0]);    
    }
}
/**方块运动函数
 * 
 */
function move(){
    clearInterval(timer);
    clearInterval(timer2);
        timer = setInterval(function(){
            var nowPosition = parseInt(main.css('top')) + speed;
            main.css('top',nowPosition + 'px');
            if($(main).position().top >= 0){
                createRow();
                main.css({
                    'top':'-100px'
                })
            }
            var len = main.children().length;
            if(len == 7){
            for (var i = 0; i < len; i++) {
                var flag = $(main.children()[len - 1].children[i]).hasClass('i');

                if(flag) {
                    end();
                    clearInterval(timer);
                }
            }
            main.children()[len - 1].remove();
            }
        },30)
        bindEvent();//要放到定时器之外，否则点击事件函数会每隔一段时间触发一次，不符合要求
    }
    /**点击事件函数
     *  
     */
   function bindEvent() {
    main.off().on('click', function (event) {//jquery的事件委托
        if (flag) {
            var tar = event.target;//当前事件的源对象
            if (tar.className == 'i') {
                var random = Math.floor(Math.random()*90),
                    random2 = Math.floor(Math.random()*22);
                if(random >= 88){
                    $(tar).css({backgroundImage : 'url(src/img/'+0+'.jpg)',backgroundSize:'cover'});
                }else{
                    $(tar).css('backgroundColor', '#ddd');
                }
                
                $(tar).removeClass();
                score ++;
            }else{
                end();
                clearInterval(timer);
                flag = false;
            }
            if (score % 20 == 0) {
                speed++;
            }
        }

    })
}
function clickStart(){
        $('.bg').addClass('animated fadeOutUp');
        
        timer2 = setInterval(function(){  
            $('.bg').css('display','none');
            move();
            $('.bg').removeClass('animated fadeOutUp');   
            music.play();    
        },500);
        $('.wrapper').css('border','1px solid black');
}
function reStart(){
    flag = 1;
    score = 0;
    speed = 3;
    $('.bg').addClass('animated fadeOutUp');
    $('.wrapper').css('border','1px solid black');
    
    timer2 = setInterval(function(){
        $('.bg').css('display','none');
        move();
        music.play();
    },500);
}
// 游戏结束，将得分存入到sessionStorage当中并保存
function end(){
    music.pause();
    clearInterval(timer);
    clearInterval(timer2);
    LStorage = window.localStorage;
    var record = {},
    recordedArr = [];
    record["time"] = getTime();
    record["score"] = score;
    if(localStorage.recorded){
        recordedArr = JSON.parse(localStorage.recorded);
    }
    recordedArr.push(record);
    localStorage.recorded = JSON.stringify(recordedArr);
    main.html('');
    $('.wrapper').css('border','0');
    $('.bg').css('display','block');
    $('.bg').removeClass('animated fadeOutUp');
    $('.wrapper .content .result').addClass('animated zoomIn').html('恭喜你获得<br><span class="score">'+ score +'</span>分');
    timer2 = setInterval(function(){
          $('.wrapper .content .result').css('display','block');
          
    },700)
    $('.wrapper .content .btn').css('display','block').html('再玩一次');
}
//获取当前时间
function getTime(){
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.day = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六')[date.getDay()];
    this.hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    this.second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    var currentTime = this.month + '月' + this.date + '日' + this.hour + ':' + this.minute + ':' + this.second ;
    return currentTime;
    console.log(currentTime);
 }
$('.btn').click(function(){
    if($('.btn').html() == '开始游戏')
    {
        clickStart();        
    }else{
        reStart();
    }
})
//查看历史游戏记录
$('.content .record').click(function(){
    clearInterval(timer2);
    $('.historyRecord').removeClass('animated fadeOut');
    $('.historyRecord').addClass('animated fadeIn');
    timer2 = setTimeout(function(){
        $('.historyRecord').css('display','block');
    },300)
    LStorage = window.localStorage;
    getRecord(LStorage);
})
function getRecord(data){
    $('.historyRecord ul li:gt(0)').remove();
    if(data.recorded){
        var recordedArray = JSON.parse(data.recorded),
        len = recordedArray.length;
        var str = '';
        for(var i = len - 1; i >= 0; i--){
            str += '<li>\
                        <span>'+recordedArray[i].time+'</span><span>'+recordedArray[i].score+'</span>\
                    </li>';
        }
        $('.historyRecord ul').append(str);
    }
    
}
//返回主界面
$('.return').click(function(){
    clearInterval(timer2);
    $('.historyRecord').removeClass('animated fadeIn');
    $('.historyRecord').addClass('animated fadeOut');
    timer3 = setTimeout(function(){
        // $('.historyRecord').removeClass('animated fadeOut');
        $('.historyRecord').css('display','none');
    },300)

})
//清空历史游戏记录
$('.delete').click(function(){
    console.log('jin 删除');
    cleanRecord();
    $('.historyRecord ul li:gt(0)').css('display','none');
})
function cleanRecord(){
    window.localStorage.removeItem("recorded");
}

