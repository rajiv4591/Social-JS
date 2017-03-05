var e = document.getElementById('sel1');

var platform = 'Facebook';

var g, f, l;

f = $ocial('facebook', '1642184569421913');

f.implement(function (data) {
    if(data.name) {
        document.getElementById('selectdiv').style.display = 'none';
        document.getElementById('details').style.display = 'block';
        document.getElementById('display').src = data.image_url;
        document.getElementById('loggedin').innerHTML = 'Welcome ' + data.name + ' ! You just logged in from Facebook';
    }
});

document.getElementById('details').style.display = 'none';

e.addEventListener("change", function() {
    var x = e.options[e.selectedIndex].text;
    
    if(document.getElementById("$ocial-login").childElementCount < 3) { 
        if (x === 'Google') {

            g = $ocial('google', '622122088501-me5a6plg5t9j2k5dek0h036ualigt87k');

            g.implement(function (data) {
                platform = 'Google';
                if(data.name) {
                    document.getElementById('selectdiv').style.display = 'none';
                    document.getElementById('details').style.display = 'block';
                    document.getElementById('display').src = data.image_url;
                    document.getElementById('loggedin').innerHTML = 'Welcome ' + data.name + ' ! You just logged in from Google';
                }
            });
        } else if (x === 'Facebook') {

            f = $ocial('facebook', '1642184569421913');

            f.implement(function (data) {
                platform = 'Facebook';
                if(data.name) {
                    document.getElementById('selectdiv').style.display = 'none';
                    document.getElementById('details').style.display = 'block';
                    document.getElementById('display').src = data.image_url;
                    document.getElementById('loggedin').innerHTML = 'Welcome ' + data.name + ' ! You just logged in from Facebook';
                }
            });
        } else if (x === 'Linkedin') {
            l = $ocial('linkedin', '78my27jow7jaf0');

            l.implement(function (data) {
                platform = 'Linkedin';
                if(data.name) {
                    document.getElementById('selectdiv').style.display = 'none';
                    document.getElementById('details').style.display = 'block';
                    document.getElementById('display').src = data.image_url;
                    document.getElementById('loggedin').innerHTML = 'Welcome ' + data.name + ' ! You just logged in from Linkedin';
                }
            });
        }
    }
});

function signOut () {
    if (platform === 'Google') {
        g.signOut(function () {
            document.getElementById('selectdiv').style.display = 'block';
            document.getElementById('details').style.display = 'none';
        });
    } else if (platform === 'Facebook') {
        f.signOut(function () {
            document.getElementById('selectdiv').style.display = 'block';
            document.getElementById('details').style.display = 'none';
        });
    } else if (platform === 'Linkedin') {
        l.signOut(function () {
            document.getElementById('selectdiv').style.display = 'block';
            document.getElementById('details').style.display = 'none';
        });
    }
}