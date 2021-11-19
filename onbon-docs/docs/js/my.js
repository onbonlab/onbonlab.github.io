$(document).ready(function () {
    'use strict';


    //返回顶部
    window.onscroll = function () {
        var goTop = document.getElementsByClassName("back2top");
        if (goTop.length > 0) {
            goTop[0].style.display = document.documentElement.scrollTop >= 200 || document.body.scrollTop >= 200 ? 'block' : 'none';
            goTop[0].onclick = function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
    }

    // comments
    var isDirIndex = location.pathname.endsWith("/index.html");
    var hr = document.getElementsByTagName("footer")[0].getElementsByTagName("hr")[0];
    hr.insertAdjacentHTML('beforebegin', '</hr><div id="gitalk-container"><h1>This is a gitalk container.</h1></div>');
	
	const gitalk = new Gitalk({
	  clientID: '3baa3b16a3d577c43a23',
	  clientSecret: '43510ababc849a377a047f733f6e5735b062835c',
	  repo: 'onbonlab.github.io',
	  owner: 'onbonlab',
	  admin: ['tataba'],
	  id: location.pathname,      // Ensure uniqueness and length less than 50
	  distractionFreeMode: false  // Facebook-like distraction free mode
	})

	gitalk.render('gitalk-container')
	
});
