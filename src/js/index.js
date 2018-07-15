    var timer,
        flag = 1,
        speed = 2,
        score = 0,
        main = $('.wrapper .main');
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
            if(len >= 7){
                for(var i = 0; i < len; i++ ){
                    if($(main.children()[i-1]).hasClass('i')){
                        console.log('end1');
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
            console.log(flag + ',' +tar.className);
            if (tar.className == 'i') {
                $(tar).css('backgroundColor', '#ddd');
                $(tar).removeClass();
                score ++;
            }else{
                // console.log('end2');
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
        $('.bg').css('display','none');
        $('.wrapper').css('border','1px solid black');
        move();
}
function reStart(){
    flag = 1;
    score = 0;
    speed = 2;
    $('.bg').css('display','none');
    $('.wrapper').css('border','1px solid black');
    main.html('');
    move();
}
function end(){
    $('.wrapper').css('border','0');
    $('.bg').css('display','block');
    $('.wrapper .content p').html('游戏结束<br>得分'+ score ).css('display','block');
    $('.wrapper .content .btn').html('重新开始游戏');
}
$('.btn').click(function(){
    if($('.btn').html() == '开始游戏')
    {
        clickStart();        
    }else{
        reStart();
    }
})

