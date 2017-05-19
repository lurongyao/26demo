/**
 * ITCAST WEB
 * Created by zhousg on 2017/2/16.
 */
window.onload = function(){
    /*顶部搜索*/
    search();
    /*轮播图*/
    banner();
    /*倒计时*/
    downTime();
}
var search = function(){
    /*
     * 1.默认顶部固定浮动  背景透明
     * 2.当页面滚动的时候  背景透明度逐渐加深  和滚动的高度成正比
     * 3.当滚动到一定的距离之后  透明度固定不变
     * */

    /*获取需要操作的dom元素*/
    var searchBox = document.querySelector('.jd_search_box');
    var bannerBox = document.querySelector('.jd_banner');
    /*一定距离*/
    var height = bannerBox.offsetHeight;

    /*滚动事件监听*/
    window.onscroll = function(){
        /*获取页面滚动的距离*/
        /*document.body.scrollTop 这个是谷歌获取距离页面顶部高度的*/
        /*document.documentElement.scrollTop 获取IE的顶部距离*/
        var top = document.body.scrollTop;
        var opacity = 0;
        if(top < height){
            opacity = top/height*0.85;
        }else{
            opacity = 0.85;
        }
        searchBox.style.background = 'rgba(201, 21, 35, '+opacity+')';
    }

}
var banner = function(){
    /*
     * 1.自动轮播   定时器+左滚动+过渡动画
     * 2.点对应滚动 先清除当前样式再给对应的加上当前样式  now
     * 3.滑动起来   touch相关事件
     * 4.当滑动结束之后  如果不超过一定的距离  吸附回去、 1/3
     * 5.当滑动结束之后  如果超过了一定的距离  切换图片（上一张 下一张）
     * */


    /*获取相关的dom元素*/
    var banner = document.querySelector('.jd_banner');
    var width = banner.offsetWidth;
    /*图片盒子*/
    var imageBox = banner.querySelector('ul:first-child');/*必须使用有效的选择器 css能用*/
    /*点盒子*/
    var pointBox = banner.querySelector('ul:last-child');
    var points = pointBox.querySelectorAll('li');


    /*加过渡*/
    var addTransition = function(){
        imageBox.style.transition = 'all 0.2s';
        imageBox.style.webkitTransition = 'all 0.2s';/*处理兼容*/
    };
    /*清过渡*/
    var removeTransition = function(){
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    };
    /*设置定位*/
    var setTranslateX = function(translateX){
        imageBox.style.transform = 'translateX('+translateX+'px)';
        imageBox.style.webkitTransform = 'translateX('+translateX+'px)';
    }

   
    /*1.无缝自动轮播*/
    var index = 1;/*默认索引*/
    var timer = setInterval(function(){
        index ++;
        /*动画的移动图片盒子*/
        /*加过渡*/
        addTransition();
        /*做定位*/
        setTranslateX(-index*width);
    },1000);

    /*有没有方法可以监听到 过渡结束时候的事件*/
    /* transitionend animationend */
    imageBox.addEventListener('transitionend',function(){
        /*无缝衔接*/
        if(index >= 9){
            index = 1;
            /*瞬间定位*/
            /*清过渡*/
            removeTransition();
            /*做定位*/
            setTranslateX(-index*width);
        }
        /*滑动的时候无缝衔接*/
        else if(index <= 0){
            index = 8;
            /*瞬间定位*/
            /*清过渡*/
            removeTransition();
            /*做定位*/
            setTranslateX(-index*width);
        }

        /*2.点对应滚动 */
        /*过渡结束之后设置对应的点*/
        /*index的取值范围？一定在 1-8 之间*/
        setPoint();
    });

    /*设置当前点*/
    var setPoint = function(){
        /*一定在 1-8 之间*/
        /*清除之前的样式*/
        for(var i = 0 ; i < points.length ; i ++){
            //points[i].className = ' ';
            points[i].classList.remove('now');
        }
        /*对应的加上*/
        points[index-1].classList.add('now');
    }

    /*3.滑动起来*/
    var startX = 0;/*记录开始滑动时候的X坐标*/
    var isMove = false;/*默认是没有滑动*/
    var distanceX = 0;/*记录滑动的距离*/
    imageBox.addEventListener('touchstart',function(e){
        clearInterval(timer);
        startX = e.touches[0].clientX;
    });
    imageBox.addEventListener('touchmove',function(e){
        var moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        /*计算将要去定位的位置*/
        var position = -index*width+distanceX;
        /*清过渡*/
        removeTransition();
        /*做定位*/
        setTranslateX(position);
        isMove = true;
    });
    imageBox.addEventListener('touchend',function(e){
        /*4,5需求*/
        /*4.当滑动结束之后  如果不超过一定的距离  吸附回去*/
        if(isMove && Math.abs(distanceX) < width/3){
            /*加过渡*/
            addTransition();
            /*定位回原来的位子*/
            setTranslateX(-index*width);
        }
        /*5.当滑动结束之后  如果超过了一定的距离  切换图片（上一张 下一张）*/
        else if(isMove && Math.abs(distanceX) >= width/3){

            /*做定位 和方向有关系*/
            if(distanceX > 0){
                /*向右滑 上一张*/
                index --;
            }else{
                /*向左滑 下一张*/
                index ++;
            }
            /*加过渡*/
            addTransition();
            /*定位*/
            setTranslateX(-index*width);
        }

        /*加上定时器*/
        clearInterval(timer);
        timer = setInterval(function(){
            index ++;
            /*动画的移动图片盒子*/
            /*加过渡*/
            addTransition();
            /*做定位*/
            setTranslateX(-index*width);
        },1000);
        /*重置参数*/
        startX = 0;
        isMove = 0;
        distanceX = false;
    });
}
