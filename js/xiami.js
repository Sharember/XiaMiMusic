$(window).load(function(){
	//loadBG();
	fPlay();
});
$(function(){
	//setTimeout("fPlay()",500);
	/*歌曲列表效果*/
	$(".songList").hover(function(){
		$(this).find(".more").show();
		$(this).find(".dele").show();
	},function(){
		$(this).find(".more").hide();
		$(this).find(".dele").hide();
	});
	/*自定义滚动条*/
	$(".songUL").rollbar({zIndex:80});
	//$("#lyr").rollbar({zIndex:80});
	/*复选框*/
	$(".checkIn").click(function(){
		var s=$(this).attr("select");
		if (s==0) {
			$(this).css("background-position","-37px -710px");
			$(this).attr("select","1");
		};
		if (s==1) {
			$(this).css("background-position","");
			$(this).attr("select","0");
		};		
	});
	$(".checkAll").click(function(){
		var s=$(this).attr("select");
		if (s==0) {
			$(this).css("background-position","-37px -710px");
			$(".checkIn[select='0']").css("background-position","-37px -710px");
			$(".checkIn[select='0']").attr("select","1");
			$(this).attr("select","1");
		};
		if (s==1) {
			$(this).css("background-position","");
			$(".checkIn[select='1']").css("background-position","");
			$(".checkIn[select='1']").attr("select","0");
			$(this).attr("select","0");
		};
		
	});
	/*点击列表播放按钮*/
	$(".start em").click(function(){
		/*开始放歌*/
		var sid=$(this).attr("sonN");
		songIndex=sid;
		$("#audio").attr("src",'songs/'+sid+'.mp3');	
		audio=document.getElementById("audio");//获得音频元素
		/*显示歌曲总长度*/
		if(audio.paused){
			audio.play();
		} 				
		else
			audio.pause();	
		audio.addEventListener('timeupdate',updateProgress,false);
		
		audio.addEventListener('play',audioPlay,false);
		audio.addEventListener('pause',audioPause,false);
		audio.addEventListener('ended',audioEnded,false); 
		/*播放歌词*/
		getReady(sid);//准备播放
		mPlay();//显示歌词
		//对audio元素监听pause事件
		/*外观改变*/
		var html="";
		html+='<div class="manyou">';
		html+='	<a href="#" class="manyouA">漫游相似歌曲</a>';
		html+='</div>';
		$(".start em").css({
			"background":"",
			"color":""
		});
		$(".manyou").remove();
		$(".songList").css("background-color","#f5f5f5");
		$(this).css({
			"background":'url("css/images/T1X4JEFq8qXXXaYEA_-11-12.gif") no-repeat',
			"color":"transparent"
		});
		$(this).parent().parent().parent().append(html);
		$(this).parent().parent().parent().css("background-color","#f0f0f0");

		/*底部显示歌曲信息*/
		var songName=$(this).parent().parent().find(".colsn").html();
		var singerName =$(this).parent().parent().find(".colcn").html();
		$(".songName").html(songName);
		$(".songPlayer").html(singerName);
		/*换右侧图片*/
		$("#canvas1").attr("src",'images/'+sid+'.jpg');
		$("#canvas1").load(function(){
			loadBG();
		});
		//setTimeout('loadBG()',100);
		$(".blur").css("opacity","0");
		$(".blur").animate({opacity:"1"},1000);

	});
	/*双击播放*/
	$(".songList").dblclick(function(){
		var sid = $(this).find(".start em").html();
		$(".start em[sonN="+sid+"]").click();
	});
	/*底部进度条控制*/
	$( ".dian" ).draggable({ 
		containment:".pro2",
		drag: function() {
			var l=$(".dian").css("left");
			var le = parseInt(l);
			audio.currentTime = audio.duration*(le/678);
      	}
	});
	/*音量控制*/
	$( ".dian2" ).draggable({ 
		containment:".volControl",
		drag: function() {
			var l=$(".dian2").css("left");
			var le = parseInt(l);
			audio.volume=(le/80);
      }
	});
	/*底部播放按钮*/
	$(".playBtn").click(function(){	
		var p = $(this).attr("isplay");		
		if (p==0) {
			$(this).css("background-position","0 -30px");
			$(this).attr("isplay","1");
		};
		if (p==1) {
			$(this).css("background-position","");
			$(this).attr("isplay","0");
		};
		if(audio.paused) 
			audio.play();
		else
			audio.pause();
		
	});
	$(".mode").click(function(){
		// var t = calcTime(Math.floor(audio.currentTime))+'/'+calcTime(Math.floor(audio.duration));
		// //alert(t);
		// var p =Math.floor(audio.currentTime)/Math.floor(audio.duration);
		// alert(p);
		//alert(lytext[1]);
	});
	/*切歌*/
	$(".prevBtn").click(function(){
		var sid = parseInt(songIndex)-1;
		$(".start em[sonN="+sid+"]").click();
	});
	$(".nextBtn").click(function(){
		var sid = parseInt(songIndex)+1;
		$(".start em[sonN="+sid+"]").click();
	});

});

/*首尾模糊效果*/
function loadBG(){
	//alert();
	// stackBlurImage('canvas1', 'canvas', 60, false);
	var c=document.getElementById("canvas");
	var ctx=c.getContext("2d");
	var img=document.getElementById("canvas1");
	ctx.drawImage(img,45,45,139,115,0,0,1366,700);
	stackBlurCanvasRGBA('canvas',0,0,1366,700,60);
}
function calcTime(time){
	var hour;         	var minute;    	var second;
	hour = String ( parseInt ( time / 3600 , 10 ));
	if (hour.length ==1 )   hour='0'+hour;
	minute=String(parseInt((time%3600)/60,10));
	if(minute.length==1) minute='0'+minute;
	second=String(parseInt(time%60,10));
	if(second.length==1)second='0'+second;
	return minute+":"+second;
}
function updateProgress(ev){
	/*显示歌曲总长度*/
	var songTime = calcTime(Math.floor(audio.duration));
	$(".duration").html(songTime);
	/*显示歌曲当前时间*/
	var curTime = calcTime(Math.floor(audio.currentTime));
	$(".position").html(curTime);
	/*进度条*/
	var lef = 678*(Math.floor(audio.currentTime)/Math.floor(audio.duration));
	var llef = Math.floor(lef).toString()+"px";
	$(".dian").css("left",llef);
}
function audioPlay(ev){
	$(".iplay").css("background",'url("css/images/T1oHFEFwGeXXXYdLba-18-18.gif") 0 0');
	$(".playBtn").css("background-position","0 -30px");
	$(".playBtn").attr("isplay","1");
}
function audioPause(ev){
	$(".iplay").css("background","");
	// $(".start em").css({
	// 	"background":'url("css/images/pause.png") no-repeat 50% 50%',
	// 	"color":"transparent"
	// });
}
function audioEnded(ev){
	var sid = parseInt(songIndex)+1;
	$(".start em[sonN="+sid+"]").click();
}


/*显示歌词部分*/
var scrollt=0; var tflag=0;//存放时间和歌词的数组的下标
var lytext=new Array();//放存汉字的歌词 
var lytime=new Array();//存放时间
var delay=10; var line=0; var scrollh=0; 
var songIndex=2;
function getLy(s)//取得歌词 
{ 	
	var ly="";
	if (s=="2") {
		ly="[00:00] 漂洋过海来看你.[00:02] 演唱：刘明湘.[00:04] 词曲：李宗盛.[00:08] 歌词编辑：丁仔.[00:15] 中文歌词库 www.dingzai.com.[00:21] 为你我用了半年的积蓄.[00:24] 飘洋过海的来看你.[00:29] 为了这次相聚.[00:31] 我连见面时的呼吸 都曾反复练习.[00:36] .[00:38] 言语从来没能将我的情意.[00:42] 表达千万分之一.[00:47] 为了这个遗憾 我在夜里想了又想.[00:51] 不肯睡去.[00:54] .[00:55] 记忆它总是慢慢的累积.[00:59] 在我心中无法抹去.[01:04] 为了你的承诺.[01:05] 我在最绝望的时候 都忍着不哭泣.[01:13] .[01:14] 陌生的城市啊 熟悉的角落里.[01:23] 也曾彼此安慰 也曾相拥叹息.[01:26] 不管将会面对什么样的结局.[01:30] .[01:31] 在漫天风沙里望着你远去.[01:35] 我竟悲伤的不能自已.[01:39] 多盼能送君千里 直到山穷水尽.[01:44] 一生和你相依.[01:49] .[02:07] 陌生的城市啊 熟悉的角落里.[02:15] 也曾彼此安慰 也曾相拥叹息.[02:19] 不管将会面对什么样的结局.[02:23] .[02:23] 在漫天风沙里望着你远去.[02:27] 我竟悲伤的不能自已.[02:32] 多盼能送君千里 直到山穷水尽.[02:36] 一生和你相依.[02:42] .[02:43] 多盼能送君千里 直到山穷水尽.[02:50] 一生和你相依";
	};
	if (s=="1"){
		ly="[00:00]盛夏光年（live）.[00:03]作词：阿信·五月天.[00:04]作曲：阿信·五月天.[00:05]演唱：陈冰.[00:12].[00:14]我骄傲的破坏.[00:17]我痛恨的平凡.[00:19]才想起那些是我最爱.[00:23].[00:24]让盛夏去贪玩.[00:27]把残酷的未来.[00:29]狂放到光年外.[00:34].[00:34]放弃规则 放纵去爱.[00:39]放肆自己 放空未来.[00:44]我不转弯 我不转弯.[00:49]我不转弯 我不转弯.[00:56].[01:14]我要我疯 我要我爱 就是.[01:17]我要我疯 我要我爱.[01:19]一万首的mp3 一万次疯狂的爱.[01:21]灭不了一个渺小的孤单.[01:24].[01:25]我要我疯 我要我爱 就是.[01:27]我要我疯 我要我爱.[01:29]盛夏的一场狂欢 来到了光年之外.[01:32]长大难道是人必经的溃烂.[01:35].[01:36]放弃规则 放纵去爱.[01:40]放肆自己 放空未来.[01:45]我不转弯 我不转弯.[01:50]我不转弯 我不转弯.[01:58].[02:05]我不转弯.[02:15]我不转弯我不 我不转弯我不 我不转弯.[02:25]我不转弯.[02:36]";
	};
	if(s>2){
		ly="[00:00] .[00:02]纯音乐暂无歌词"
	};
 	return ly; 
} 
function show(t)//显示歌词 
{ 
	var div1=document.getElementById("lyr");//取得层
	document.getElementById("lyr").innerHTML=" ";//每次调用清空以前的一次 
	if(t<lytime[lytime.length-1])//先舍弃数组的最后一个
		{ 	
			for(var k=0;k<lytext.length;k++)
				{ 
	   			if(lytime[k]<=t&&t<lytime[k+1]) 
	   			{ scrollh=k*25;//让当前的滚动条的顶部改变一行的高度 
	   			div1.innerHTML+="<font color=#f60 style=font-weight:bold>"+lytext[k]+"</font><br>"; 
	   			} 
	   			else if(t<lytime[lytime.length-1])//数组的最后一个要舍弃
	   	 		div1.innerHTML+=lytext[k]+"<br>"; 
	 			} 
 		}
   else//加上数组的最后一个
      { 
         for(var j=0;j<lytext.length-1;j++) 
            div1.innerHTML+=lytext[j]+"<br>"; 
            div1.innerHTML+="<font color=red style=font-weight:bold>"+lytext[lytext.length-1]+"</font><br>"; 
      } 
} 
function scrollBar()//设置滚动条的滚动 
{ 
      if(document.getElementById("lyr").scrollTop<=scrollh) 
         document.getElementById("lyr").scrollTop+=1; 
      if(document.getElementById("lyr").scrollTop>=scrollh+50) 
         document.getElementById("lyr").scrollTop-=1; 
      window.setTimeout("scrollBar()",delay); 
} 
function getReady(s)//在显示歌词前做好准备工作 
{ 	
	var ly=getLy(s);//得到歌词
	//alert(ly);
	// lytext.length=0;
	// lytime.length=0;
	// lytext = new Array();
	// lytime = new Array();
	if (ly=="") {
		$("#lry").html("本歌暂无歌词！");
	};
	var arrly=ly.split(".");//转化成数组
  	//alert(arrly[1]);
  	tflag=0;
  	for( var i=0;i<lytext.length;i++)
	{
		lytext[i]="";
	}
	for( var i=0;i<lytime.length;i++)
	{
		lytime[i]="";
	}
  	$("#lry").html(" ");
  	document.getElementById("lyr").scrollTop=0;
	for(var i=0;i<arrly.length;i++) 
  	sToArray(arrly[i]);
  	// alert(lytext[2]);
  	// alert(lytime[2]);
	sortAr();
	//$("#lyr").html("");
  	// for(var j=0;j<lytext.length;j++) 
   //   { 
   //      document.getElementById("lyr").innerHTML+=lytime[j]+lytext[j]+"<br>"; 
   //   }
	scrollBar(); 
}
function sToArray(str)//解析如“[02:02][00:24]没想到是你”的字符串前放入数组
{  
	
   var left=0;//"["的个数
   var leftAr=new Array(); 
   for(var k=0;k<str.length;k++) 
   { 
      if(str.charAt(k)=="[") { leftAr[left]=k; left++; } 
   } 
   if(left!=0) 
   {
      for(var i=0;i<leftAr.length;i++) 
      {  
         lytext[tflag]=str.substring(str.lastIndexOf("]")+1);//放歌词 
         lytime[tflag]=conSeconds(str.substring(leftAr[i]+1,leftAr[i]+6));//放时间
         tflag++; 
      } 
   } 
     //alert(str.substring(leftAr[0]+1,leftAr[0]+6)); 
} 
function sortAr()//按时间重新排序时间和歌词的数组 
{ 
	var temp=null; var temp1=null; for(var k=0;k<lytime.length;k++) { for(var j=0;j<lytime.length-k;j++) { if(lytime[j]>lytime[j+1]) { temp=lytime[j]; temp1=lytext[j]; lytime[j]=lytime[j+1]; lytext[j]=lytext[j+1]; lytime[j+1]=temp; lytext[j+1]=temp1; } } } 
} 
function conSeconds(t)//把形如：01：25的时间转化成秒；
{	
   var m=t.substring(0,t.indexOf(":")); 
   var s=t.substring(t.indexOf(":")+1); 
   m=parseInt(m.replace(/0/,""));
   //if(isNaN(s)) s=0; 
   var totalt=parseInt(m)*60+parseInt(s); 
   //alert
   // (parseInt(s.replace(//b(0+)/gi,""))); 
   //if(isNaN(totalt))  return 0; 
  
	return totalt; 
} 
// function getSeconds()//得到当前播放器播放位置的时间 
// { var t=getPosition(); t=t.toString();//数字转换成字符串
//  var s=t.substring(0,t.lastIndexOf("."));//得到当前的秒 
//  //alert(s); 
//  return s; 
//  } 
//  function getPosition()//返回当前播放的时间位置
//   { var mm=document.getElementById("MediaPlayer1"); 
//    //var mmt=;
//    //alert(mmt); 
//    return mm.CurrentPosition; 
// } 
function mPlay()//开始播放
{ 
	// var ms=parseInt(getSeconds()); 
	// if(isNaN(ms)) show(0); 
	// else show(ms);
   var ms =audio.currentTime;
   show(ms); 
	window.setTimeout("mPlay()",100) 
}
function fPlay(){
	$(".start em[sonN="+songIndex+"]").click();
} 
// window.setTimeout("mPlay()",100);
// window.setTimeout("getReady()",100);
// function test()//测试使用，
// { 
// 	alert(lytime[lytime.length-1]); 
// }

// [00:00]漂洋过海来看你 .[00:04]演唱：刘明湘 .[00:08]作词：李宗盛 .[00:12]作曲：李宗盛 .[00:18]为你 我用了半年的积蓄 .[00:21]飘洋过海的来看你 .[00:26]为了这次相聚 .[00:28]我连见面时的呼吸 都曾反复练习 .[00:33] .[00:35]言语从来没能将我的情意 .[00:38]表达千万分之一 .[00:43]为了这个遗憾 我在夜里想了又想 .[00:48]不肯睡去 .[00:51] .[00:52]记忆它总是慢慢的累积 .[00:56]在我心中无法抹去 .[01:00]为了你的承诺 .[01:02]我在最绝望的时候 都忍着不哭泣 .[01:08] .[01:11]陌生的城市啊 熟悉的角落里 .[01:19]也曾彼此安慰 也曾相拥叹息 .[01:23]不管将会面对什么样的结局 .[01:27] .[01:28]在漫天风沙里望着你远去 .[01:31]我竟悲伤的不能自已 .[01:36]多盼能送君千里 直到山穷水尽 .[01:40]一生和你相依 .[01:44] .[02:03]陌生的城市啊 熟悉的角落里 .[02:12]也曾彼此安慰 也曾相拥叹息 .[02:16]不管将会面对什么样的结局 .[02:20] .[02:20]在漫天风沙里望着你远去 .[02:24]我竟悲伤的不能自已 .[02:28]多盼能送君千里 直到山穷水尽 .[02:33]一生和你相依 .[02:36] .[02:39]多盼能送君千里 直到山穷水尽 .[02:47]一生和你相依 .[02:55] 
//[00:00] 漂洋过海来看你.[00:02] 演唱：刘明湘.[00:04] 词曲：李宗盛.[00:08] 歌词编辑：丁仔.[00:15] 中文歌词库 www.dingzai.com.[00:21] 为你我用了半年的积蓄.[00:24] 飘洋过海的来看你.[00:29] 为了这次相聚.[00:31] 我连见面时的呼吸 都曾反复练习.[00:36] .[00:38] 言语从来没能将我的情意.[00:42] 表达千万分之一.[00:47] 为了这个遗憾 我在夜里想了又想.[00:51] 不肯睡去.[00:54] .[00:55] 记忆它总是慢慢的累积.[00:59] 在我心中无法抹去.[01:04] 为了你的承诺.[01:05] 我在最绝望的时候 都忍着不哭泣.[01:13] .[01:14] 陌生的城市啊 熟悉的角落里.[01:23] 也曾彼此安慰 也曾相拥叹息.[01:26] 不管将会面对什么样的结局.[01:30] .[01:31] 在漫天风沙里望着你远去.[01:35] 我竟悲伤的不能自已.[01:39] 多盼能送君千里 直到山穷水尽.[01:44] 一生和你相依.[01:49] .[02:07] 陌生的城市啊 熟悉的角落里.[02:15] 也曾彼此安慰 也曾相拥叹息.[02:19] 不管将会面对什么样的结局.[02:23] .[02:23] 在漫天风沙里望着你远去.[02:27] 我竟悲伤的不能自已.[02:32] 多盼能送君千里 直到山穷水尽.[02:36] 一生和你相依.[02:42] .[02:43] 多盼能送君千里 直到山穷水尽.[02:50] 一生和你相依


//[00:00]盛夏光年（live）.[00:03]作词：阿信·五月天.[00:04]作曲：阿信·五月天.[00:05]演唱：陈冰.[00:12].[00:14]我骄傲的破坏.[00:17]我痛恨的平凡.[00:19]才想起那些是我最爱.[00:23].[00:24]让盛夏去贪玩.[00:27]把残酷的未来.[00:29]狂放到光年外.[00:34].[00:34]放弃规则 放纵去爱.[00:39]放肆自己 放空未来.[00:44]我不转弯 我不转弯.[00:49]我不转弯 我不转弯.[00:56].[01:14]我要我疯 我要我爱 就是.[01:17]我要我疯 我要我爱.[01:19]一万首的mp3 一万次疯狂的爱.[01:21]灭不了一个渺小的孤单.[01:24].[01:25]我要我疯 我要我爱 就是.[01:27]我要我疯 我要我爱.[01:29]盛夏的一场狂欢 来到了光年之外.[01:32]长大难道是人必经的溃烂.[01:35].[01:36]放弃规则 放纵去爱.[01:40]放肆自己 放空未来.[01:45]我不转弯 我不转弯.[01:50]我不转弯 我不转弯.[01:58].[02:05]我不转弯.[02:15]我不转弯我不 我不转弯我不 我不转弯.[02:25]我不转弯.[02:36]
