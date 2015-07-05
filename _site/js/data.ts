/// <reference path="../typings/jquery/jquery.d.ts" />
module Data {
    interface MyData {
        q?:string;
        page?: number;
        size?: number;
        artist?: string;

    }
    interface Callback {
        success:(any)=>any;
        error:(any)=>any;
    }

    export function send(url:string, callbacks:Callback, data:MyData = {}, timeout:number = 3000) {
        $.ajax({
            url:url,
            method: 'GET',
            dataType: 'jsonp',
            timeout: timeout,
            data: data,
            success: function(data, textStatus, jqXHR) {
                callbacks.success(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                callbacks.error(textStatus);
            }
        });
    }

    export function initModule() {

    }

}
