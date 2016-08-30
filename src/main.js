require('../css/app.css'); // 加载样式
//require('../css/allComponent.scss'); // 加载组件样式

var React = require('react');
var ReactDom = require('react-dom');
var AppBanner = require('../components/AppBanner/appBanner.js'); //加载组件

var Header = React.createClass({
	getInitialState: function() {
		return {navShow : false};
	},
	getDefaultProps: function() {
		return {
			dataList : [
				{link: '#', title: '手机软件'},
				{link: '#', title: '智能硬件'},
				{link: '#', title: '用户服务'},
				{link: '#', title: '企业服务'},
				{link: '#', title: '360商城'},
				{link: '#', title: '手机游戏'},
				{link: '#', title: '论坛'},
				{link: '#', title: '社会招聘'},
				{link: '#', title: '校园招聘'}
			]
		}
	},
	showNav: function() {
		var isShow = this.state.navShow ? false : true;
		this.setState({ navShow : isShow });
	},
	render: function(){
		var visiable = this.state.navShow ? 'block' : 'none';
		return (
			<header className="app-header bc">
				<div className="header-top clearfix">
					<a href="#" className="logo fl"><img src="./images/logo.png" alt="logo"/></a>
					<a href="javascript:void(0);" className="header-btn fr" onClick={this.showNav}></a>
				</div>
				<div className="header-nav" style={{display: visiable}}>
					<ul className="clearfix">
						{
							this.props.dataList.map(function(item, index){
								return (
									<li key={index}><a href={item.link}>{item.title}</a></li>
								);
							})
						}
					</ul>
				</div>
			</header>
		);
	}
});

var Banner = React.createClass({
	getInitialState: function() {
		return {
			height : 220  // 组件高度
		};
	},
	getDefaultProps: function() {
		return {
			dataList : [
				{link: '#', imgSrc: './images/banner/banner-01.jpg'},
				{link: '#', imgSrc: './images/banner/banner-02.jpg'},
				{link: '#', imgSrc: './images/banner/banner-03.jpg'}
			]
		}
	},
	componentDidMount: function() {
		// 初始化变量
		this.id = this.refs.appBanner;
		this.len = this.id.getElementsByClassName("banner-item").length;
		this.tag = this.id.getElementsByClassName("banner-content")[0];
		this.left = 0;			// 组件偏移位置
		this.wd = 0;			// 组件宽度
		this.current = 0;		// 组件当前索引值
		this.startX = 0;		// 手指触摸起始位置
		this.nowX = 0;			// 手指触摸结束位置
		this.isTouch = false;	// 手指是否按下
		this.isAnimate = false; // 组件是否在进行动画
		// 初始化组件高度
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		// 初始化组件样式
		if(this.len<=1) return;
		this.setCss();
		window.addEventListener('resize', this.setCss);
		// 设置轮播定时器
		this.timer = setInterval(function(){
			this.changePic(this.current);
		}.bind(this), 5000);
	},
	handleResize: function() {
		var height,
			t_img = null,   // 查询图片高度的定时器
			isLoad = true ; // 判断图片是否加载
		var that = this;
		// 判断图片加载状况，加载完成后回调
		isImgLoad(function(){
			that.setState({
				height: height
			});
		});
		// 判断图片加载的函数
		function isImgLoad(callback) {
			height = that.id.getElementsByTagName("img")[0].height;
			if(height===0 || height===that.state.height){
				isLoad = false;
			}
			if(isLoad){
				clearTimeout(t_img);
				callback();
				return;
			}else{
				isLoad = true;
				t_img = setTimeout(function(){
					isImgLoad(callback);
				}, 10);
			}
		}
	},
	setCss: function() {
		this.wd = this.id.offsetWidth;
		this.left = (this.current+1)*(-1)*this.wd;
		this.tag.style.cssText = 'width:'+(this.len*this.wd)+'px;-webkit-transform:translate3d('+this.left+'px, 0px, 0px)';
		for(var i=0;i<this.len;i++){
			this.id.getElementsByClassName("banner-item")[i].style.width = this.wd+'px';
		}
	},
	onTouchStart: function(e) {
		clearInterval(this.timer);
		this.timer = null;
		if(this.isTouch){
			return;
		}
		this.isTouch = true;
		var event = e || window.event;
		this.startX = event.touches[0].pageX;
	},
	onTouchMove: function(e) {
		var event = e || window.event;
		e.preventDefault();
		if(!this.isTouch || this.isAnimate){
			return;
		}
		this.nowX = event.touches[0].pageX;
		var moveX = this.nowX - this.startX,
			left = this.left + moveX;
		this.tag.style.webkitTransform = 'translate3d('+ left +'px, 0px, 0px)';
	},
	onTouchEnd: function(e) {
		if(!this.isTouch){
			return;
		}
		this.isTouch = false;
		var moveX = this.nowX==0 ? 0 : (this.nowX - this.startX);
		if(Math.abs(moveX)>50){
			var flag = moveX>0 ? 1 : -1;
			this.left += this.wd*flag;
			this.current += flag*(-1);
			this.isAnimate = true;
		}
		this.animate();
		this.startX = 0;
		this.nowX = 0;
	},
	// 点击切换
	changePic: function(index,e) {
		if(this.isTouch || this.isAnimate){
			console.log(this.isTouch, this.isAnimate);
			return;
		}
		clearInterval(this.timer);
		this.timer = null;
		this.current = (index>this.len-3) ? 0 : ++index;
		this.left = (-1)*(this.current+1)*this.wd;
		this.animate();
	},
	animate: function(afterChange) {
		this.tag.style.webkitTransition = '200ms all ease';
		this.tag.style.webkitTransform = 'translate3d('+ this.left +'px, 0px, 0px)';
		this.tag.addEventListener('webkitTransitionEnd', function(){
			//动画执行完回调函数
			this.animateCallBack();
		}.bind(this), false);
	},
	animateCallBack: function() {
		this.isAnimate = false;
		this.tag.style.transition = 'none';
		if(this.current==-1){
			this.left = (2-this.len)*this.wd;
			this.current = this.len-3;
		} else if(this.current==(this.len-2)){
			this.left = (-1)*this.wd;
			this.current = 0;
		}
		this.tag.style.webkitTransform = 'translate3d('+ this.left +'px, 0px, 0px)';
		// 设置banner圆点样式
		for(var i=0;i<this.len-2;i++){
			this.id.getElementsByTagName('span')[i].className = '';
		}
		this.id.getElementsByTagName('span')[this.current].className = 'active';
		// 如果轮播定时器被清除，重新设置定时器
		if(this.timer==null){
			this.timer = setInterval(function(){
				this.changePic(this.current);
			}.bind(this), 5000);
		}
	},
	render: function() {
		var len = this.props.dataList.length;
		// touch事件组合
		var Events = {
			onTouchStart : this.onTouchStart,
			onTouchMove  : this.onTouchMove,
			onTouchEnd   : this.onTouchEnd
		};
		var Events = len>1 ? Events : '';
		return (
			<div className="app-banner" ref="appBanner" {...Events} style={{height: this.state.height}}>
				<div className="banner-content">
					{ len>1 ?
					<div className="banner-item active">
						<a href={this.props.dataList[len-1].link}><img src={this.props.dataList[len-1].imgSrc} alt="banner"/></a>
					</div>
					: ''}
					{
						this.props.dataList.map(function(item,index){
							return (
								<div key={'banner_'+index} className="banner-item active">
									<a href={item.link} target="_blank"><img src={item.imgSrc} alt="banner"/></a>
								</div>
							);
						})
					}
					{ len>1 ?
					<div className="banner-item active">
						<a href={this.props.dataList[0].link}><img src={this.props.dataList[0].imgSrc} alt="banner"/></a>
					</div>
					: ''}
				</div>
				{/* banner的圆点组件 */}
				{ len>1 ?
				<div className="banner-control">
				{
					this.props.dataList.map(function(item,index){
						return (
							<BannerItem key={index} className={index==0? 'active' : ''} onClick={this.changePic.bind(this,index-1)} />
						);
					}, this)
				}
				</div>
				: ''}
			</div>
		);
	}
});

var BannerItem = React.createClass({
  handleClick:function(){
    this.props.onClick()
  },
  render: function(){
    return (
      <span className={this.props.className} onClick={this.handleClick}></span>
    );
  }
});

var Nav = React.createClass({
  getDefaultProps: function() {
    return {
      dataList : [
        {link:'#', imgSrc:'images/nav/nav-01.png', text:'全部产品'},
        {link:'#', imgSrc:'images/nav/nav-02.png', text:'360搜索'},
        {link:'#', imgSrc:'images/nav/nav-03.png', text:'360商城'},
        {link:'#', imgSrc:'images/nav/nav-04.png', text:'360游戏'}
      ]
    }
  },
  render: function() {
    return (
      <nav className="nav">
        <ul>
        {
          this.props.dataList.map(function(item, index){
            return (
              <li key={index}>
                <a href={item.link}>
                  <img src={item.imgSrc} alt="nav"/>
                  <p className="tc">{item.text}</p>
                </a>
              </li>
            );
          })
        }
        </ul>
      </nav>
    );
  }
});

var Wall = React.createClass({
  render: function(){
    return (
      <div className="wall"></div>
    );
  }
});

var PhoneSoftware = React.createClass({
	getDefaultProps: function() {
		return {
			dataList: [
				{imgSrc:'images/soft/soft-01.png', title:'手机卫士', size:'8.95M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-02.png', title:'手机助手', size:'6.5M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-03.png', title:'浏览器', size:'25.2M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-04.png', title:'360商城', size:'2.1M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-05.png', title:'影视大全', size:'20.7M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-06.png', title:'省电王', size:'2.8M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-07.png', title:'免费WIFI', size:'3.8M', downloddLink:'#'},
				{imgSrc:'images/soft/soft-08.png', title:'ROOT', size:'4.8M', downloddLink:'#'}
			],
			dataList2: [
				{imgSrc:'images/ico-01.png', title:'360搜索'},
				{imgSrc:'images/ico-02.png', title:'手机桌面'},
				{imgSrc:'images/ico-03.png', title:'360云盘'},
				{imgSrc:'images/ico-04.png', title:'清理大师'},
				{imgSrc:'images/ico-05.png', title:'手机专家'},
				{imgSrc:'images/ico-06.png', title:'流量卫士'},
				{imgSrc:'images/ico-07.png', title:'360天气'},
				{imgSrc:'images/ico-08.png', title:'免费电话'},
				{imgSrc:'images/ico-09.png', title:'360金融'},
				{imgSrc:'images/ico-10.png', title:'360淘金'}
			]
		}
	},
	render: function() {
		return (
			<div className="list">
				<h3 className="list-tit">手机软件</h3>
				<ul className="soft-list">
				{
					this.props.dataList.map(function(item, index){
						return (
							<li key={index}>
								<img src={item.imgSrc} alt=""/>
								<p>{item.title}</p>
								<p>{item.size}</p>
								<a href={item.downloddLink}>下载</a>
							</li>
						);
					})
				}
				</ul>
				<ul className="text-list">
				{
					this.props.dataList2.map(function(item, index){
						return(
							<li key={index}>
								<div>
									<a href="#"><img src={item.imgSrc} alt=""/>{item.title}</a>
								</div>
							</li>
						);
					})
				}
				</ul>
			</div>
		);
	}
});

var Hardware =React.createClass({
	getDefaultProps: function() {
		return {
			dataList: [
				{imgSrc:'images/hardware/hardware-01.png', title:'奇酷手机青春版', slogan:'岂止安全', price:'999'},
				{imgSrc:'images/hardware/hardware-02.png', title:'360儿童卫士3代', slogan:'打电话防走丢的定位手表', price:'399'},
				{imgSrc:'images/hardware/hardware-03.png', title:'QiKU移动电源', slogan:'10000mAh大容量', price:'69'},
				{imgSrc:'images/hardware/hardware-04.png', title:'360路由大户型P1', slogan:'信号强 连接快', price:'99'},
				{imgSrc:'images/hardware/hardware-05.png', title:'360智能摄像机(夜视版)', slogan:'连上手机 再远也能看', price:'199'},
				{imgSrc:'images/hardware/hardware-06.png', title:'360行车记录仪', slogan:'拍的清楚 看的方便', price:'359'}
			]
		}
	},
	render: function() {
		return(
			<div className="list">
				<h4 className="list-tit">智能硬件</h4>
				<ul className="hardware-list">
				{
					this.props.dataList.map(function(item, index, obj){
						return(
							<li key={index} className={(index==1||index==2)? 'small' : ''}>
							<a href="#">
								<p className="title">{item.title}</p>
								<div>
									<p className="slogan">{item.slogan}</p>
									<p className="price">{item.price}元</p>
								</div>
								<p className="img"><img src={item.imgSrc} alt=""/></p>
							</a>
							{index==obj.length-1? <a className="more-btn" href="#"></a> : ''}
							</li>
						);
					})
				}
				</ul>
			</div>
		);
	}
});

var UserService = React.createClass({
	getDefaultProps: function() {
		return{
			dataList:[
				{url:'#', title:'360搜索'},
				{url:'#', title:'360导航'},
				{url:'#', title:'360金融'},
				{url:'#', title:'360淘金'},
				{url:'#', title:'360新闻'},
				{url:'#', title:'360影视'},
				{url:'#', title:'雷电手机应用'},
				{url:'#', title:'360天气'}
			]
		}
	},
	render: function() {
		return(
			<div className="list">
				<h4 className="list-tit">用户服务</h4>
				<ul className="user-list">
				{
					this.props.dataList.map(function(item, index){
						return(
							<li key={index}>
								<a href={item.url}>{item.title}</a>
							</li>
						);
					})
				}
				</ul>
			</div>
		);
	}
});

var Safety = React.createClass({
	getDefaultProps: function(){
		return{
			dataList:[
				{url:'#', imgSrc:'images/safe/safe-01.png'},
				{url:'#', imgSrc:'images/safe/safe-02.png'},
				{url:'#', imgSrc:'images/safe/safe-03.png'},
				{url:'#', imgSrc:'images/safe/safe-04.png'}
			]
		}
	},
	render: function() {
		return(
			<div className="list">
				<h4 className="list-tit">企业安全</h4>
				<ul className="safe-list">
				{
					this.props.dataList.map(function(item, index){
						return(
							<li key={index}>
								<a href={item.url}><img src={item.imgSrc} alt=""/></a>
							</li>
						);
					})
				}
				</ul>
			</div>
		);
	}
});

var Search = React.createClass({
	render: function() {
		return(
			<div className="search">
				<form action="">
					<input type="text" placeholder="搜一下"/>
					<button type="button">搜一下</button>
				</form>
			</div>
		);
	}
});

var Footer = React.createClass({
	render: function() {
		return(
			<div className="footer">
				<ul className="footer-link">
					<li><a href="#">登录</a></li>
					<li><a href="#">注册</a></li>
					<li><a href="#">电脑板</a></li>
					<li><a href="#">360商城</a></li>
				</ul>
				<p className="copyright">© 360.com 奇虎360 京ICP备08010314号-6</p>
			</div>
		);
	}
});

var AppComponent = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<Banner />
				<Nav />
				<Wall />
				<PhoneSoftware />
				<Wall />
				<Hardware />
				<Wall />
				<UserService />
				<Wall />
				<Safety />
				<Search />
				<Footer />
			</div>
		);
	}
});

ReactDom.render(
	<AppComponent />,
	document.getElementById('main')
);

