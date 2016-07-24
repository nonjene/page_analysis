
var oData = {
    resources: []
};
var tool = {
    truncate: function (str, length) {
        length = length || 80;
        if (str.length <= length) {
            return str;
        }
        var half = length / 2;
        return str.substr(0, half - 2) + '...' + str.substr(str.length - half + 1);
    },

    pad: function (str, length) {
        var padded = str.toString();
        if (padded.length > length) {
            return tool.pad(padded, length * 2);
        }
        return this.repeat(' ', length - padded.length) + padded;
    },

    repeat: function (chr, length) {
        for (var str = '', l = 0; l < length; l++) {
            str += chr;
        }
        return str;
    },
    size: function (val, type) {
        var after = "KB";

        if (typeof val !== 'number') {
            return val;
        }
        if (type === 'number') {
            return (val / 1000).toFixed(2);
        }
        return (val / 1000).toFixed(2) + after;
    }
};
module.exports = function (page, evt) {


    evt.once('onLoadStarted', function (startTime) {
        if (!oData.start) {
            oData.start = startTime;
        }
    });
    evt.on('onResourceRequested', function (request, networkRequest) {
        if(request.url.indexOf('data:')===0){
            return;
        }
        var now = new Date().getTime();
        oData.resources[request.id] = {
            id: request.id,
            url: request.url,
            request: request,
            responses: {},
            duration: '-',
            times: {
                request: now
            }
        };
        if (!oData.start || now < oData.start) {
            oData.start = now;
        }
    });
    evt.on('onResourceReceived', function (res) {
        var now = new Date().getTime(),
            resource = oData.resources[res.id];
        if(!resource){
            return;
        }
        resource.responses[res.stage] = res;
        if (!resource.times[res.stage]) {
            resource.times[res.stage] = now;
            resource.duration = now - resource.times.request;
        }

        res.headers.forEach(function (header) {
            if (header.name.toLowerCase() == 'content-length') {
                resource.size = parseInt(header.value);
            }
            /*if (header.name === 'Connection') {
                resource.connection = header.value;
            }*/
        });
        /*if (res.contentType) {
            resource.contentType = res.contentType;
        }*/
        if (!resource.size || resource.size === '0') {
            if (res.bodySize) {
                resource.size = res.bodySize;
            }
        }
    });
    evt.once('onLoadFinished', function (status, cb) {
        var start = oData.start,
            finish = new Date().getTime(),
            resources = oData.resources,
            slowest, fastest, totalDuration = 0,
            largest, smallest, totalSize = 0,
            missingSize = false,
            elapsed = finish - start;
        resources.forEach(function (resource) {
            if (!resource.times.start) {
                resource.times.start = resource.times.end;
            }
            if (!slowest || resource.duration > slowest.duration) {
                slowest = resource;
            }
            if (!fastest || resource.duration < fastest.duration) {
                fastest = resource;
            }
            totalDuration += resource.duration;

            if (resource.size) {
                if (!largest || resource.size > largest.size) {
                    largest = resource;
                }
                if (!smallest || resource.size < smallest.size) {
                    smallest = resource;
                }
                totalSize += resource.size;
            } else {
                resource.size = '-';
                missingSize = true;
            }
        });

        var list = resources.map(function (resource) {
            var type;
            try{
                type = resource.responses.end.contentType.split('/')[1].split(';')[0];
            }catch(e){
                type = '-'
            }
            
            return {
                id: resource.id,
                time: resource.duration,
                size: tool.size(resource.size, 'number'),
                type: type,
                //connection: resource.connection,
                urlShort: tool.truncate(resource.url, 60),
                url:resource.url
            };
        });

        var summary = [
            {
                name: "资源总数",
                val: resources.length - 1
            },
            {
                name: '页面耗时',
                val: elapsed + 'ms'
            }, {
                name: "最慢资源",
                val: slowest.duration + 'ms',
                point: tool.truncate(slowest.url)
            }, {
                name: "最大资源",
                val: tool.size(largest.size),
                point: tool.truncate(largest.url)
            }, {
                name: "最快资源",
                val: fastest.duration + 'ms',
                point: tool.truncate(fastest.url)
            }, {
                name: "最小资源",
                val: tool.size(smallest.size),
                point: tool.truncate(smallest.url)
            }, /* {
                name: "所有资源耗时",
                val: totalDuration + 'ms'
            },*/ {
                name: "所有资源大小",
                val: tool.size(totalSize) + (missingSize ? '(至少)' : '')
            },
            {
                name: "网速",
                val: (totalSize / elapsed).toFixed(2) + 'KB/s'
            }
        ];
        cb && cb({ summary: summary, list: list });
    });
};
