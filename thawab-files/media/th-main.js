/**
 *
 * copyright © 2010 ojuba.org, Muayyad Saleh Alsadi
 *
 **/
var resultsPerPage=50;
var async_tips_div, mouse_x, mouse_y;

function main_search_row_factory(u, bu, r) {
  return "<tr><td>"+html_escape(r.k)+"</td><td>-</td><td>-</td><td><a onmouseover='asynctip(this);' onmouseout='asynctip_hide(this);' class='external' target='_blank' rel='"+u+r.i+"' href='"+bu+encodeURI(r.k)+"#"+encodeURI(r.n)+"'>"+ html_escape(r.t)+"</a></td><td>"+html_escape(r.r)+"</td>\n";
}
var search_row_factory=main_search_row_factory;

function showSearchPage(hash, pg){
	var j,i=(pg-1)*resultsPerPage,o,h,l;
	var u=script+'/ajax/searchExcerpt/'+hash+'/',bu=script+'/view/';
	l=document.getElementById("loading");
	l.style.display="block";
	getJson("/json/searchResults", {h:hash,i:i,c:resultsPerPage},
		function (d) {
			var c=d.c,a=d.a;
			o=document.getElementById("SearchResults");
			h=""
			o.innerHTML=h;
			for (j=0;j<c;++j) {
				r=a[j];
				h+=search_row_factory(u, bu, r);
			}
			o.innerHTML=h;
			o=document.getElementsByClassName("current");
			for (j=0;j<o.length;++j) rm_class(o.item(j),"current");
			o=document.getElementById("pg_"+pg);
			if (o) o.setAttribute(klass, "current"+( o.getAttribute(klass) || "" ).replace("current",""));
			l.style.display="none"; /* should be faded */
		},
		function () {
			l.style.display="none"; /* should show error */
		}
	);
	return false;
}


function doSearch(q) {
	var i,pages,o,h,l;
	l=document.getElementById("loading");
	l.style.display="block";
	getJson(script+"/json/search", {q:q}, 
		function (d) {
			document.getElementById("SearchTime").innerHTML=d.t;
			document.getElementById("SearchRCount").innerHTML=d.c;
			pages=-Math.floor(-d.c/resultsPerPage);
			document.getElementById("SearchPagesCount").innerHTML=pages;
			o=document.getElementById("SearchPages");
			h='';
			o.innerHTML=h;
			if (d.c>0) {
			for (i=1;i<=pages;++i) h+='<span><a id="pg_'+i+'" onclick="showSearchPage(\''+d.h+'\', '+i+');">'+(i)+'</a></span>';
			o.innerHTML=h;
			showSearchPage(d.h,1);
			}
			l.style.display="none"; /* should be faded */
		},
		function () {
			l.style.display="none"; /* should show error */
		}
	);
	return false;

}

function moveMouse(E) {
	var e=window.event || E;
	mouse_x=window.pageXOffset+e.clientX
	mouse_y=window.pageYOffset+e.clientY
}

function asynctip(e) {
	var l=document.getElementById("loading");
	l.style.display="block";
	async_tips_div.style.top=(mouse_y+e.offsetHeight+5)+"px";
	async_tips_div.innerHTML="...";
	async_tips_div.style.display="block";
	u=e.getAttribute('rel');
	getAjax(u, { },
		function (d) {
			async_tips_div.innerHTML=d;
			l.style.display="none"; /* should be faded */
		},
		function () {
			async_tips_div.style.display="none";
			l.style.display="none"; /* should show error */
		}
	);

}

function asynctip_hide(e) {
	async_tips_div.style.display="none";
}

function async_tips_init() {
	var d=document.createElement("div");
	d.id="async_tips_div";
	d.style.width="60%";
	d.style.display="none";
	document.body.appendChild(d);
	async_tips_div=d;

	if (typeof document.attachEvent!='undefined') {
		document.attachEvent('onmousemove',moveMouse);
	} else {
	document.addEventListener('mousemove',moveMouse,false);
	}
}

init_ls.push(async_tips_init);