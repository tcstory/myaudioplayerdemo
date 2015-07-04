/// <reference path="data.ts" />
module Modal {
    interface Callback {
        success:(any)=>any;
        error:(any)=>any;
    }

    interface SongItem {
        song_id:number;
        song_name:string;
        singer_name:string;
        singer_id:number;
        url_list:Array<Object>;
        order_num:number;
    }

    var _playlist:Array<SongItem> = [];

    var stateMap = {
        playlist: _playlist
    };

    /**
     * 获取建议列表
     * @param name
     * @param callbacks
     * @returns {boolean}
     */
    export function getSuggestions(name:string, callbacks:Callback):boolean {
        var data = {
            q: name,
            size: 5
        };
        var url = "http://so.ard.iyyin.com/suggest.do?";
        Data.send(url, 3000, data, callbacks);
        return true;
    }

    /**
     * 获取歌曲
     * @param name
     * @param page
     * @param callbacks
     * @returns {boolean}
     */
    export function getSongs(name:string, page:number, callbacks:Callback):boolean {
        var data = {
            q: name,
            size: 50,
            page: page
        };
        var url = 'http://so.ard.iyyin.com/s/song_with_out?';
        Data.send(url, 3000, data, callbacks);
        return true;
    }

    /**
     * 获取歌手头像
     * @param name
     * @param callbacks
     * @returns {boolean}
     */
    export function getSingerPic(name:string, callbacks:Callback):boolean {
        var data = {
            artist: name
        };
        var url = 'http://lp.music.ttpod.com/pic/down?';
        Data.send(url, 3000, data, callbacks);
        return false;
    }

    /**
     * 把歌曲列表缓存到模块里面
     * @param item
     */
    export function storePlaylist(item:SongItem) {
        stateMap.playlist.push(item);
    }

    /**
     * 返回在模块中缓存的歌曲列表
     * @returns {Array<SongItem>|Modal._playlist}
     */
    export function getPlaylist() {
        return stateMap.playlist;
    }

    /**
     * 情况模块内部的歌曲列表
     * @param flag
     */
    export function emptyPlaylist(flag:boolean) {
        if (flag) {
            stateMap.playlist = [];
        }
    }

    /**
     * 初始化Modal模块
     * @returns {boolean}
     */
    export function initModule():boolean {
        return true;
    }
}
