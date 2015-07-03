/// <reference path="data.ts" />
var Modal;
(function (Modal) {
    var _playlist = [];
    var stateMap = {
        playlist: _playlist
    };
    function getSuggestions(name, callbacks) {
        var data = {
            q: name,
            size: 5
        };
        var url = "http://so.ard.iyyin.com/suggest.do?";
        Data.send(url, 3000, data, callbacks);
        return true;
    }
    Modal.getSuggestions = getSuggestions;
    function getSongs(name, page, callbacks) {
        var data = {
            q: name,
            size: 50,
            page: page
        };
        var url = 'http://so.ard.iyyin.com/s/song_with_out?';
        Data.send(url, 3000, data, callbacks);
        return true;
    }
    Modal.getSongs = getSongs;
    function getSingerPic(name, callbacks) {
        var data = {
            artist: name
        };
        var url = 'http://lp.music.ttpod.com/pic/down?';
        Data.send(url, 3000, data, callbacks);
        return false;
    }
    Modal.getSingerPic = getSingerPic;
    function storePlaylist(item) {
        stateMap.playlist.push(item);
    }
    Modal.storePlaylist = storePlaylist;
    function getPlaylist() {
        console.log(stateMap.playlist);
        return stateMap.playlist;
    }
    Modal.getPlaylist = getPlaylist;
    function emptyPlaylist(flag) {
        if (flag) {
            stateMap.playlist = [];
        }
    }
    Modal.emptyPlaylist = emptyPlaylist;
    function initModule() {
        return true;
    }
    Modal.initModule = initModule;
})(Modal || (Modal = {}));
//# sourceMappingURL=modal.js.map