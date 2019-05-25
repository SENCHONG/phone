var input_number = document.getElementsByClassName('number')[0];
var detail_box = document.getElementsByClassName('detail-box')[0];
var detail = document.getElementsByClassName('detail')[0];
var btn = document.getElementsByClassName('btn')[0];
var res_box = document.getElementsByClassName('res-box')[0];
var result = document.getElementsByClassName('result')[0];
var phone_number = '';

function is019(str) {
    var arr = ['0', '1', '9'];
    return arr.includes(str[0]);
}

function isInt12456910(int) {
    var arr = [1, 2, 9, 4, 6, 9, 10];
    return arr.includes(int);
}
btn.onclick = function() {
    var res = new Phone({
        number: phone_number,
        data: database //database.js
    }).getRes();
    result.innerHTML = res;
    res_box.style.display = 'block';
}


input_number.oninput = function() {
    result.innerHTML = '';
    res_box.style.display = 'none';
    detail_box.style.display = 'block';
    detail.style.display = 'block';
    if (this.value == '' || this.value % 1 != 0) {
        detail.innerHTML = '请输入纯数字';
    } else {
        if (this.value.length < 12) {
            if (isInt12456910(this.value.length)) {
                phone_number = '';
                detail.innerHTML = this.value.length + '位 ' + this.value + ' 不识别1/2/4/6/9/10位的数字';
                btn.style.display = 'none';
            } else {
                phone_number = this.value;
                detail.innerHTML = this.value.length + '位 ' + this.value;
                btn.style.display = 'block';
            }

        } else {
            phone_number = '';
            detail.innerHTML = this.value.length + '位 ' + this.value.substr(0, 11) + '... 已超出11位';
            btn.style.display = 'none';
        }

    }

}


function jsonp(num) {
    var oScript = document.createElement('script');
    oScript.src = 'data/jsonp/' + num + '.js';
    document.body.appendChild(oScript);
    document.body.removeChild(oScript);
}

function callbackData(data) {
    var res = data[phone_number.substr(0, 7)];
    result.innerHTML = res ? res : '错误的手机号';
}

function Phone(obj) {
    this.number = '' + obj.number || '';
    this.data = obj.data;
    this.init();
}

Phone.prototype = {
    init: function() {
        if (this.number == '') {
            this.res = '号码为空';
            return;
        }
        this.len = this.number.length;
        this.divideLen();
    },
    divideLen: function() {
        switch (this.len) {
            case 3:
            case 5:
                this.check3_5();
                break;
            case 7:
            case 8:
                this.check7_8();
                break;
            case 11:
                this.check11();
                break;
            default:
                this.res = '错误';
                break;
        }
    },
    check3_5: function() {
        if (this.len == 5) {
            this.res = this.data['length5'][this.number];
        } else {
            this.res = this.data['length3'][this.number];

        }
    },
    check7_8: function() {
        if (this.strIs019(this.number[0])) {
            this.res = '以0/1/9开头的错误' + this.len + '位号码';
        } else {
            this.res = '符合要求的座机号';
        }
    },
    check11: function() {
        if (parseInt(this.number[0]) <= 0) {
            // 区号为三位
            if (parseInt(this.number[1]) <= 2) {
                if (this.strIs019(this.number.substr(3, 8))) {
                    this.res = '座机号以0/1/9开头的错误号码';
                } else {
                    var res = this.data['area_code'][this.number.substr(0, 3)];
                    this.res = res ? res + ' 固定电话' : '区号错误，座机号正确';
                }
                // 区号为四位
            } else {
                if (this.strIs019(this.number.substr(4, 7))) {
                    this.res = '座机号以0/1/9开头的错误号码';
                } else {
                    var res = this.data['area_code'][this.number.substr(0, 4)];
                    this.res = res ? res + ' 固定电话' : '区号错误，座机号正确';
                }
            }
        } else if (parseInt(this.number[0]) <= 1) {
            var str3 = this.number.substr(0, 3);
            if (this.data.strInJsonpArr.includes(str3)) {
                // 按道理来说是不判断归属地的
                // this.res = '正确的手机号';
                this.res = '请稍等...';
                // 由于强迫症的原因 就是要把数据全部本地化 只好动态加载 破坏了代码的结构性
                this.jsonp(str3);
            } else {
                this.res = '错误的手机号';
            }
        } else {
            this.res = '错误的手机号';
        }

    },
    strIs019: function(str) {
        var arr = ['0', '1', '9'];
        return arr.includes(str[0]);
    },
    getRes: function() {
        return this.res || '无结果';
    },
    getLen: function() {
        return this.len;
    },
    jsonp: function(num) {
        var oScript = document.createElement('script');
        oScript.src = 'data/jsonp/' + num + '.js';
        document.body.appendChild(oScript);
        document.body.removeChild(oScript);
    }
};