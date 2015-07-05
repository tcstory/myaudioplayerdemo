/// <reference path="data.ts" />
var Modal;
(function (Modal) {
    var _playlist = [];
    var stateMap = {
        playlist: _playlist
    };
    /**
     * 获取建议列表
     * @param name
     * @param callbacks
     * @returns {boolean}
     */
    function getSuggestions(name, callbacks) {
        var data = {
            q: name,
            size: 5
        };
        var url = "http://so.ard.iyyin.com/suggest.do?";
        Data.send(url, callbacks, data, 3000);
        return true;
    }
    Modal.getSuggestions = getSuggestions;
    /**
     * 获取歌曲
     * @param name
     * @param page
     * @param callbacks
     * @returns {boolean}
     */
    function getSongs(name, page, callbacks) {
        var data = {
            q: name,
            size: 50,
            page: page
        };
        var url = 'http://so.ard.iyyin.com/s/song_with_out?';
        Data.send(url, callbacks, data, 3000);
        return true;
    }
    Modal.getSongs = getSongs;
    /**
     * 获取歌手头像
     * @param name
     * @param callbacks
     * @returns {boolean}
     */
    function getSingerPic(name, callbacks) {
        var data = {
            artist: name
        };
        var url = 'http://lp.music.ttpod.com/pic/down?';
        Data.send(url, callbacks, data, 3000);
        return false;
    }
    Modal.getSingerPic = getSingerPic;
    /**
     * 把歌曲列表缓存到模块里面
     * @param item
     */
    function storePlaylist(item) {
        stateMap.playlist.push(item);
    }
    Modal.storePlaylist = storePlaylist;
    /**
     * 返回在模块中缓存的歌曲列表
     * @returns {Array<SongItem>|Modal._playlist}
     */
    function getPlaylist() {
        return stateMap.playlist;
    }
    Modal.getPlaylist = getPlaylist;
    /**
     * 情况模块内部的歌曲列表
     * @param flag
     */
    function emptyPlaylist(flag) {
        if (flag) {
            stateMap.playlist = [];
        }
    }
    Modal.emptyPlaylist = emptyPlaylist;
    /**
     * 返回热门歌曲
     * @param url
     * @param callbacks
     */
    function getRandomSongs(url, callbacks) {
        Data.send(url, callbacks);
    }
    Modal.getRandomSongs = getRandomSongs;
    /**
     * 初始化Modal模块
     * @returns {boolean}
     */
    function initModule() {
        return true;
    }
    Modal.initModule = initModule;
})(Modal || (Modal = {}));
//# sourceMappingURL=modal.js.map