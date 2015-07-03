/// <reference path="musicplayer.ts" />
/// <reference path="modal.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
module Shell {
    "use strict";
    var jqueryMap = {
        $searchBar: $('#search-bar'),
        $suggestionBox: $('#suggestion-box'),
        $inputBar: $('#search-bar').find('input'),
        $playlist: $('#playlist'),
        $prevPage: $('#prev-page'),
        $nextPage: $('#next-page'),
        $avatar: $('#avatar')
    };
    var stateMap = {
        $currentItem: null,
        $candidates: null,
        queryString: '',  // 记录下用户上一次搜索的字符串
        jobID: 0,  // 用来处理chrome下keyup问题而设置的setTimeout的id
        pageNum: 1,
        isDisplay: false,
        curSinger: ''
    };
    var configMap = {
        timeout: 500,
        template:
            '<div class="songs">' +
                '<div class="song-name"><span>num. </span>songName</div>' +
                '<div class="song-long">popularity</div>' +
                '<div class="song-size">人气</div>' +
                '<div class="singer-name">singerName</div>' +
            '</div>',
        playingState: {
            init: 0,
            playing: 1,
            pause: 2
        }

    };

    var sendSuggestionRequest = function () {
        // 假如是非firefox浏览器
        if (navigator.userAgent.search(/khtml/i) != -1) {
            return function () {
                // 该函数添加了一个计时器,避免在中文输入法打开的情况下,输入搜索字符串的时候,
                // 由于keyup事件频繁促发而导致的过多jsonp请求
                if ($.trim(jqueryMap.$inputBar.val()) === '') {
                    refreshSuggestionWindow();
                    return false;
                }
                clearTimeout(stateMap.jobID);
                stateMap.jobID = setTimeout(function () {
                    stateMap.queryString = $.trim(jqueryMap.$inputBar.val());
                    Modal.getSuggestions($.trim(jqueryMap.$inputBar.val()), {
                        success: showSuggestion,
                        error: function (textStatus) {
                            console.log(textStatus);
                        }
                    });
                }, configMap.timeout);
            }
        } else if (navigator.userAgent.search(/firefox/i) != -1) {
            return function () {
                if ($.trim(jqueryMap.$inputBar.val()) === '') {
                    refreshSuggestionWindow();
                    return false;
                }
                stateMap.queryString = $.trim(jqueryMap.$inputBar.val());
                Modal.getSuggestions($.trim(jqueryMap.$inputBar.val()), {
                    success: showSuggestion,
                    error: function (textStatus) {
                        console.log(textStatus);
                    }
                });
            }
        }
    }();

    function responseKeyboard(event:JQueryKeyEventObject):boolean {
        var name = $.trim(jqueryMap.$inputBar.val());
        // 按下回车键
        if (event.which === 13) {
            refreshSuggestionWindow();
            stateMap.pageNum = 1;
            Modal.getSongs(name, 1, {
                success: showSongs,
                error: function (textStatus) {
                    console.log(textStatus);
                }
            });
            // 清除chrome下,按下回车键后依旧弹出建议窗口的问题
            clearTimeout(stateMap.jobID);
            // 按下下方向键
        } else if (event.which === 40) {
            if (!stateMap.$candidates) {
                // 候选项为空,直接返回
                return false;
            } else if (!stateMap.$currentItem) {
                stateMap.$currentItem = stateMap.$candidates.first();
                stateMap.$currentItem.addClass('choosed-item');
                jqueryMap.$inputBar.val(stateMap.$currentItem.text());
            } else {
                if (stateMap.$currentItem.next().length === 1) {
                    stateMap.$currentItem.removeClass('choosed-item');
                    stateMap.$currentItem = stateMap.$currentItem.next();
                    stateMap.$currentItem.addClass('choosed-item');
                    jqueryMap.$inputBar.val(stateMap.$currentItem.text());
                }
            }
            // 按下上方向键
        } else if (event.which === 38) {
            if (!stateMap.$candidates) {
                // 候选项为空,直接返回
                return false;
            } else if (!stateMap.$currentItem) {
                return false;
            } else {
                if (stateMap.$currentItem.prev().length === 1) {
                    stateMap.$currentItem.removeClass('choosed-item');
                    stateMap.$currentItem = stateMap.$currentItem.prev();
                    stateMap.$currentItem.addClass('choosed-item');
                    jqueryMap.$inputBar.val(stateMap.$currentItem.text());
                }

            }
            // 当搜索的字符串变化时,就应该发起搜索
        } else if (name != stateMap.queryString ) {
            sendSuggestionRequest();
        }

        return false;

    }

    function showSuggestion(data) {
        refreshSuggestionWindow();
        var result = data.data;
        if (result.length === 0) {
            // 搜索的歌曲(歌手)不存在时,返回的数组为空
            return false;
        }
        var fragment = document.createDocumentFragment();
        result.forEach(function (item, index, array) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(item));
            fragment.appendChild(li);
        });
        jqueryMap.$suggestionBox.append($(fragment));
        // 缓存所有候选项
        stateMap.$candidates = $('#suggestion-box').children();
        return true;
    }

    function showSongs(result) {
        var data = result.data;
        var $fragment = $(document.createDocumentFragment());
        data.forEach(function (item, index, array) {
            var songName = item['song_name'];
            var songID = item['song_id'];
            var popularity = item['pick_count'] || "未知";
            var singerName = item['singer_name'];
            var singerID = item['singer_id'];
            var urlList = item['url_list'];
            var orderNum = index;

            // 把歌曲数据缓存到Modal中
            Modal.storePlaylist({
                singer_id: singerID,
                singer_name: singerName,
                song_id: songID,
                song_name: songName,
                url_list: urlList,
                order_num: orderNum
            });
            var str = configMap.template.replace(/num|songName|popularity|singerName/g, function (match, pos, originalText) {
                switch (match) {
                    case 'songName':
                        return songName;
                    case 'popularity':
                        return popularity;
                    case 'singerName':
                        return singerName;
                    case 'num':
                        return orderNum + 1;
                }
            });
            var $part = $(str);
            $part.attr('data-order', orderNum);
            // 属性名不区分大小写的,会被自动转换成小写
            $part.attr('data-singer-name', singerName);
            $fragment.append($part);

        });
        stateMap.isDisplay = true;
        MusicPlayer.updatePlaylist();
        Modal.emptyPlaylist(true);
        jqueryMap.$playlist.html('');
        jqueryMap.$playlist.append($fragment);

        MusicPlayer.setState({
            curSong: 0,
            playingState: configMap.playingState.init,
            isCross: true
        });
        adjustScrollPosition();
    }

    function refreshSuggestionWindow() {
        // 刷新状态
        jqueryMap.$suggestionBox.html('');
        stateMap.$currentItem = null;
        stateMap.$candidates = null;
        return true;
    }

    function adjustScrollPosition() {
        if (jqueryMap.$playlist.prop('scrollTop') != 0) {
            jqueryMap.$playlist.prop('scrollTop', 0);
        }
    }

    function handlePageEvent(event:JQueryMouseEventObject):boolean {
        if (!stateMap.isDisplay) {
            return false;
        }
        var name = $.trim(jqueryMap.$inputBar.val());
        if (event.target['id'] === "prev-page") {
            if (stateMap.pageNum === 1) {
                alert('已经是第一页');
                return false;
            }
            stateMap.pageNum = stateMap.pageNum - 1;
            Modal.getSongs(name, stateMap.pageNum, {
                success: showSongs,
                error: function (textStatus) {
                    console.log(textStatus);
                }
            });

        } else if (event.target['id'] === "next-page") {
            // 其实是没有办法判断是否到达了最后一页,因为返回的数据,有时候标示的最大页码会变
            stateMap.pageNum = stateMap.pageNum + 1;
            Modal.getSongs(name, stateMap.pageNum, {
                success: showSongs,
                error: function (textStatus) {
                    console.log(textStatus);
                }
            });

        }
        return false;
    }

    function changeSingerPic(result):boolean {
        if (result['data']['singerPic']) {
            var url = 'url(' + result['data']['singerPic'] + ')';
            console.log(url);
            jqueryMap.$avatar.css({
                'background-image': url
            });
        } else {
            url = "../assets/images/Firefox.png";
            jqueryMap.$avatar.css({
                'background-image': url
            });
        }
        return true;
    }

    function getSingerPic(name:string):boolean {
        if (stateMap.curSinger != name) {
            Modal.getSingerPic(name, {
                success: changeSingerPic,
                error: function (textStatus) {
                    console.log(textStatus);
                }
            });
            stateMap.curSinger = name;
        }
        return true;
    }

    export function initModule() {
        jqueryMap.$searchBar.on('keyup', responseKeyboard);
        $('body').on('click', function (event) {
            refreshSuggestionWindow();
            return false;
        });
        jqueryMap.$playlist.on('click', function (event) {
            MusicPlayer.setState({
                curSong: parseInt(event.target.parentElement.dataset['order']),
                playingState: configMap.playingState.init,
                isCross: false
            });
            MusicPlayer.playSong();
            getSingerPic($(event.target.parentNode).attr('data-singer-name'));
        });
        jqueryMap.$prevPage.on('click', handlePageEvent);
        jqueryMap.$nextPage.on('click', handlePageEvent);
    }
}

