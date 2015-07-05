/// <reference path="../typings/jquery/jquery.d.ts" />
var Data;
(function (Data) {
    function send(url, callbacks, data, timeout) {
        if (data === void 0) { data = {}; }
        if (timeout === void 0) { timeout = 3000; }
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