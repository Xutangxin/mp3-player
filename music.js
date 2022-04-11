const musicBox = {
  musicDom: null,
  songs: [],
  index: 0,
  init: function () {
    this.musicDom = document.createElement('audio');
    document.body.appendChild(this.musicDom);
  },
  add: function (src) {
    this.songs.push(src);
  },
  play: function () {
    this.musicDom.src = this.songs[this.index];
    this.musicDom.play();
  },
  stop: function () {
    this.musicDom.pause();
  },
  next: function () {
    const len = this.songs.length;
    if (this.index < len - 1) {
      this.index++;
    } else {
      this.index = 0;
    }
    this.play();
    displayInfo();
  },
  prev: function () {
    const len = this.songs.length;
    if (this.index > 0) {
      this.index--;
    } else {
      this.index = len - 1;
    }
    this.play();
    displayInfo();
  },
  getcurrentsong: function () {
    const info = this.songs[this.index];
    return info.split('/')[2].split('.')[0];
  }
};

// 封装工具包对象
const utils = {
  moveToCenter: function (dom) {
    dom.style.position = 'absolute';
    dom.style.top = '50%';
    dom.style.left = '50%';
    dom.style['margin-top'] = -dom.offsetHeight / 2 + 'px';
    dom.style['margin-left'] = -dom.offsetWidth / 2 + 'px';
  },
  dom: function (id) {
    if (id.toString().indexOf('#') != -1) {
      id = id.replace('#', '');
    }
    return getElement(`#${id}`);
  },
  randomNum: function (num) {
    return Math.floor(Math.random() * (num + 1));
  }
};

musicBox.init();
const playList = [
  './assets/乔楚熙 - 彩虹.mp3',
  './assets/Glee Cast - All or Nothing.mp3',
  './assets/Justin Bieber、Ludacris - Baby.mp3',
  './assets/Michael Jackson - The Way You Make Me Feel.mp3'
];
playList.forEach((item) => {
  musicBox.add(item);
});
const track = getElement('.trackBox');
var timer;

function playSongs() {
  let flag = false;
  const playbtn = getElement('#playSong');
  const playicon = getElement('.playicon');
  const info = getElement('#info');
  const timeText = getElement('.progress .time');
  const progressBar = getElement('.progress .bar');
  playbtn.onclick = function () {
    if (this.getAttribute('src') == '../img/stop.svg') {
      this.setAttribute('src', '../img/play.svg');
      flag = true;
    } else {
      this.setAttribute('src', '../img/stop.svg');
      flag = false;
    }
    if (flag) {
      musicBox.play();
      playicon.className += ' r';
      displayInfo();
      changeSongs();
      [timeText, progressBar, track].forEach((el) => {
        showElement(el);
      });
      beatTrack();
    } else {
      musicBox.stop();
      playicon.className = 'playicon';
      info.innerHTML = '';
      [timeText, progressBar, track].forEach((el) => {
        hideElement(el);
      });
    }
  };
}

// 上一首下一首切歌功能
function changeSongs() {
  const preSong = getElement('#preSong');
  const nextSong = getElement('#nextSong');
  const playSong = getElement('#playSong');
  const playIcon = getElement('.playicon');
  const timeText = getElement('.progress .time');
  const progressBar = getElement('.progress .bar');
  const trackBox = getElement('.trackBox');
  preSong.addEventListener('click', function () {
    showElement(trackBox);
    beatTrack();
    playSong.src = '../img/play.svg';
    musicBox.prev();
    playIcon.className += ' r';
    showElement(timeText);
    showElement(progressBar);
  });
  nextSong.addEventListener('click', function () {
    showElement(trackBox);
    beatTrack();
    playSong.src = '../img/play.svg';
    musicBox.next();
    playIcon.className += ' r';
    showElement(timeText);
    showElement(progressBar);
  });
}
// 显示歌曲信息
function displayInfo() {
  const info = getElement('#info');
  const infotext = musicBox.getcurrentsong();
  info.innerHTML = '正在播放：' + infotext;
}

// audio标签元素自带的ontimeupdate 事件，每次时间更新的时候，就会自动进入里面的逻辑;
// 可以在里面获取总时长和当前时长，然后就可以计算出百分比，通过给div动态设置宽度来实现进度条的效果。
musicBox.musicDom.ontimeupdate = function () {
  const timeText = getElement('.progress .time');
  const progressBar = getElement('.progress .bar');
  const currentTime = Math.floor(this.currentTime); //获取当前时间
  const total = this.duration; //获取总时长
  const percent = Math.floor((currentTime / total) * 100) + '%';
  const m = parseInt(currentTime / 60); //分钟
  const s = parseInt(currentTime % 60); //秒钟
  const time = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s); //格式化
  progressBar.style.width = percent;
  timeText.innerHTML = time;
};

// 设置音轨盒子
function beatTrack() {
  const trackBox = getElement('.trackBox');
  const singleWidth = 10;
  const maxWidth = trackBox.clientWidth;
  const nums = maxWidth / singleWidth;
  let tracks = '';
  let left;
  for (let i = 0; i < nums; i++) {
    left = i * 10 + 'px';
    tracks += '<i class="items" style="left:' + left + '"></i> ';
  }
  trackBox.innerHTML = tracks;
  //定时器模拟音轨动画
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(function () {
    for (let i = 0; i < nums; i++) {
      document.getElementsByClassName('items')[i].style.height =
        utils.randomNum(150) + 'px';
    }
  }, 300);
}

function getElement(des) {
  return document.querySelector(des);
}

function showElement(el) {
  el.style.display = 'block';
}

function hideElement(el) {
  el.style.display = 'none';
}

const musicPlayer = getElement('.music');
utils.moveToCenter(musicPlayer);
playSongs();
changeSongs();
