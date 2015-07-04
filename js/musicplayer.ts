/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="modal.ts" />
module MusicPlayer {
    "use strict";

    interface SongItem {
        song_id:number;
        song_name:string;
        singer_name:string;
        singer_id:number;
        url_list:Array<Object>,
        order_num:number;
    }

    var _playlist:Array<SongItem> = [];

    var jqueryMap = {
        $playBtn: $('#play-btn'),
        $prevBtn: $('#prev-btn'),
        $nextBtn: $('#next-btn'),
        $volumeBarOuter: $('#volume-bar-outer'),
        $volumeBarInner: $('#volume-bar-inner'),
        $progressBarOuter: $('#progress-bar-outer'),
        $progressBarInner: $('#progress-bar-inner'),
        $audio: $('audio'),
        $songTime: $('#song-time')
    };
    var configMap = {
        volumeBarOuterWidth: jqueryMap.$volumeBarOuter.width(),
        volumeBarOuterOffsetLeft: jqueryMap.$volumeBarOuter.prop('offsetLeft'),
        progressBarOuterWidth: jqueryMap.$progressBarOuter.width(),
        progressBarOuterOffsetLeft: jqueryMap.$progressBarOuter.prop('offsetLeft'),
        playingState: {
            init: 0,
            playing: 1,
            pause: 2
        },
        musicQuality: { // 要播放的音乐品质
            compress: 0,
            standard: 1,
            high: 2
        }
    };
    var stateMap = {
        curSong: 0, //当前歌曲
        curState: configMap.playingState.init,
        playlist: _playlist,
        timeId: true, // 用来控制是否允许更新进度条
        quality: configMap.musicQuality.standard,
        isCross: false  // 如果播放列表得到了更新,那么设置为true
    };
    var audio = <HTMLAudioElement>jqueryMap.$audio.get(0);

    /**
     * 由于timeupdate每250ms触发一次,所以要控制一下更新进度条的频率
     * @returns {boolean}
     */
    function timeupdateHandler():boolean {
        if(stateMap.timeId) {
            setTimeout(function () {
                // 更新进度条
                jqueryMap.$progressBarInner.css('width', function (index, oldValue) {
                    var duration = audio.duration;
                    var curTime = audio.currentTime;
                    var percentage = curTime / duration;
                    return configMap.progressBarOuterWidth * percentage;
                });

                // 更新显示的时间
                // parseFloat和parseInt的参数都是string类型的
                var curTime = parseFloat(audio.currentTime+'');
                var minutes = parseInt(curTime/60+'');
                var seconds:number|string = parseInt(curTime % 60+'');
                if (seconds.toString().length === 1) {
                    seconds = '0' + seconds;
                }
                jqueryMap.$songTime.text(minutes+':'+seconds);
                stateMap.timeId = true;
            }, 800)
        }
        stateMap.timeId = false;
        return false;
    }

    /**
     * 处理音量控制
     * @param event
     * @returns {boolean}
     */
    function volumeBarClickHandler(event):boolean {
        var diff = event.clientX - configMap.volumeBarOuterOffsetLeft;
        var percentage = diff / configMap.volumeBarOuterWidth;
        audio.volume = percentage;
        jqueryMap.$volumeBarInner.css('width', function (index, oldValue) {
            return configMap.volumeBarOuterWidth * percentage;
        });
        return false;
    }

    /**
     * 处理进度条控制
     * @param event
     * @returns {boolean}
     */
    function progressBarHandler(event):boolean {
        var diff = event.clientX - configMap.progressBarOuterOffsetLeft;
        var percentage = diff / configMap.progressBarOuterWidth;
        var curTime = audio.duration * percentage;
        audio.currentTime = curTime;
        jqueryMap.$progressBarInner.css('width', function (index, oldValue) {
            return configMap.progressBarOuterWidth * percentage;
        });
        return false;
    }

    /**
     * 播放歌曲
     * @returns {boolean}
     */
    export function playSong():boolean {
        switch (stateMap.curState) {
            case configMap.playingState.init:
                // 有些歌曲有版权纠纷,所以返回的播放列表为空 例如"蔡依林"第一页结果的歌曲"倒带"
                var songPath = stateMap.playlist[stateMap.curSong]['url_list'][stateMap.quality]['url'];
                jqueryMap.$audio.attr({
                    src: songPath
                });
                stateMap.curState = configMap.playingState.playing;
                jqueryMap.$playBtn.css({
                    'background-position': '13px -548px'
                });
                audio.play();
                return true;
            case configMap.playingState.playing:
                jqueryMap.$playBtn.css({
                    'background-position': '13px -448px'
                });
                pauseSong();
                return true;
            case configMap.playingState.pause:
                jqueryMap.$playBtn.css({
                    'background-position': '13px -548px'
                });
                stateMap.curState = configMap.playingState.playing;
                audio.play();
                return true;
        }
    }

    function pauseSong():boolean {
        stateMap.curState = configMap.playingState.pause;
        audio.pause();
        return true;
    }

    function prevSong():boolean {
        stateMap.curSong = stateMap.curSong - 1;
        if (stateMap.curSong < 0) {
            stateMap.curSong = 0;
            alert('已经是第一首歌了');
            return false;
        }
        var songPath = stateMap.playlist[stateMap.curSong]['url_list'][stateMap.quality]['url'];
        jqueryMap.$audio.attr({
            src: songPath
        });
        stateMap.curState = configMap.playingState.playing;
        audio.play();
        return true;
    }

    function nextSong():boolean {
        stateMap.curSong = stateMap.curSong + 1;
        if (stateMap.curSong > stateMap.playlist.length - 1) {
            stateMap.curSong = stateMap.curSong - 1;
            alert('已经是最后一首歌了');
            return false;
        }
        var songPath = stateMap.playlist[stateMap.curSong]['url_list'][stateMap.quality]['url'];
        jqueryMap.$audio.attr({
            src: songPath
        });
        stateMap.curState = configMap.playingState.playing;
        audio.play();
        return true;
    }

    /**
     * 更新播放列表
     * @returns {boolean}
     */
    export function updatePlaylist() {
        stateMap.playlist = Modal.getPlaylist();
        return true;
    }

    /**
     * 设置当前播放器的状态
     * @param obj
     */
    export function setState(obj:{curSong:number;playingState:number;isCross:boolean}) {
        stateMap.curSong = obj.curSong;
        stateMap.curState = obj.playingState;
        stateMap.isCross = obj.isCross;
    }

    export function initModule() {

        // --- Initializing User Interface
        jqueryMap.$volumeBarInner.css('width', function (index, oldValue) {
            var curVolume = audio.volume;
            var percentage = curVolume / 1;
            return configMap.volumeBarOuterWidth * percentage;
        });
        // --- End ---

        //  --- Binding events ---
        jqueryMap.$prevBtn.on('click', function (event) {
            prevSong();
            return false;
        });
        jqueryMap.$playBtn.on('click', function (event) {
            playSong();
            return false;
        });
        jqueryMap.$nextBtn.on('click', function (event) {
            nextSong();
            return false;
        });
        jqueryMap.$audio.on('ended', function (event) {
            if (stateMap.isCross) {
                playSong();
            } else {
                nextSong();
            }
            return false;
        });
        jqueryMap.$volumeBarOuter.on('click', volumeBarClickHandler);
        jqueryMap.$progressBarOuter.on('click', progressBarHandler);
        jqueryMap.$audio.on('timeupdate', timeupdateHandler);
        // --- End ---

        return true;
    }

}
