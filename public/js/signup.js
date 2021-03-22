//#region var declaration
const axios = require('axios');
const HIBP_API_URL = 'https://api.pwnedpasswords.com/range/';
const BREACH_ERRORMESSAGE = "breach";
const BADCOMBO_ERRORMESSAGE = "badCombo";
//#endregion

//#region password checker
/**
 * Secure Hash Algorithm (SHA1)
 * http://www.webtoolkit.info/
 **/
 function SHA1(msg) {
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    function Utf8Encode(string) {
        string = string.toString().replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14) word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}

/**
 * The password the the user gave on the signup page will be checked for breaches in the HIBP Database
 * @param {String} password the password that the user filled in
 * @returns a boolean that says if it has been breached
 */
// Check if password is breached
async function checkPsswdIsBreached(password) {
    var result = false;
    var hash = SHA1(password);
    var prefix = hash.substring(0, 5);
    var suffix = hash.substring(5, hash.length); 

    // API call starts here
    const apiAnswer = axios.get(`${HIBP_API_URL}/${prefix}`) // This Url gives a json response with 500 lines of hashed passwords
        .then(response => {
            var responseOnePerLine = response.data.split("\n");

            // Run over those 500 lines
            for (var i = 0; i < responseOnePerLine.length; i++) {
                var data = responseOnePerLine[i].split(":");

                // if the suffix is found in tis list, it's been breached
                if (data[0].toLowerCase() == suffix) {
                    return result = true;
                }
            }
            return result;
        })
        .catch(error => console.error('On get API Answer error', error));
        
    return apiAnswer;
}

/**
 * Control if password length is least 8
 * @param {String} password the password that the user filled in
 * @returns a boolean that says if the password is longer than 8 characters
 */
function lengthIsOK(password) {
    var result = false;
    //changeClassLBad();
    if (password.length >= 8) {
        console.log("1.    lengthIsOK = true (long enough)");
        //changeClassLGood();
        result = true;
    }else{
        console.log("1.    lengthIsOK = false (too short)");
    }
    return result;
}
//#endregion

//#region class change colours
/* function changeClassLGood() {
    document.getElementById("psswdLength").classList.remove("badPsswd");
    document.getElementById("psswdLength").classList.add("goodPsswd");
}

function changeClassLBad() {
    document.getElementById("psswdLength").classList.remove("goodPsswd");
    document.getElementById("psswdLength").classList.add("badPsswd");
} */
//#endregion

//#region main button to trigger = "sign up"
/**
 * This function calls the functions lengthIsOK() and checkPsswdIsBreached() to check if the password may be used
 * @param {String} password the password that the user filled in
 * @returns a boolean that says if both lengthIsOK and psswdIsBreached are okay
 */
// onClick "register"
async function signup(password) {
    password = password.toString();
    var result = false; // set result on false, this is safer because if something goes wrong, the standard answer is false and the function won't succeed
    
    // call checkPsswdIsBreached()
    var psswdIsBreached = await checkPsswdIsBreached(password)
        .then(response => {
            return response
        }).catch(error => console.error('On get API Answer'+ error, error));

    // Call lengthIsOk()
    if (lengthIsOK(password)) {        
        if (psswdIsBreached === false) {  
            console.log("2.    psswdIsBreached = false (password is not breached)");          
            result = true;
        }else{
            console.log("!!!!! BREACH !!!!!"); 
        }
    }
    return result;
}
//#endregion

module.exports = {signup, lengthIsOK, SHA1}