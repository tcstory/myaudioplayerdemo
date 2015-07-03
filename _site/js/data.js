/// <reference path="../typings/jquery/jquery.d.ts" />
var Data;
(function (Data) {
    function send(url, timeout, data, callbacks) {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'jsonp',
            timeout: timeout,
            data: data,
            success: function (data, textStatus, jqXHR) {
                callbacks.success(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callbacks.error(textStatus);
            }
        });
    }
    Data.send = send;
    function initModule() {
    }
    Data.initModule = initModule;
})(Data || (Data = {}));
//# sourceMappingURL=data.js.map