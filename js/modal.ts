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


    export function getSuggestions(name:string, callbacks:Callback):boolean {
        var data = {
            q: name,
            size: 5
        };
        var url = "http://so.ard.iyyin.com/suggest.do?";
        Data.send(url, 3000, data, callbacks);
        return true;
    }
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

    export function getSingerPic(name:string, callbacks:Callback):boolean {
        var data = {
            artist: name
        };
        var url = 'http://lp.music.ttpod.com/pic/down?';
        Data.send(url, 3000, data, callbacks);
        return false;
    }

    export function storePlaylist(item:SongItem) {
        stateMap.playlist.push(item);
    }
    export function getPlaylist() {
        console.log(stateMap.playlist);
        return stateMap.playlist;
    }
    export function emptyPlaylist(flag:boolean) {
        if (flag) {
            stateMap.playlist = [];
        }
    }


    export function initModule():boolean {
        return true;
    }
}
