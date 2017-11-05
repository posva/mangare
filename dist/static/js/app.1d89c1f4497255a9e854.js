webpackJsonp([2,0],{0:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}a(296),a(173);var r=a(31),i=n(r),s=a(88),u=n(s),o=a(272),c=n(o),d=a(294),f=n(d),l=a(95),p=n(l),g=a(34);a(89),a(147);var h=a(273),_=n(h),m=a(92),v=n(m);i.default.use(c.default),i.default.use(u.default),i.default.use(f.default),i.default.filter("formattedDate",g.formattedDate),new i.default({el:"#app",router:v.default,store:p.default,render:function(e){return e(_.default)}})},32:function(e,t,a){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.state=t.types=t.mutations=t.getters=t.actions=void 0;var i,s,u,o=a(53),c=r(o),d=a(33),f=n(d),l=a(90),p=n(l),g=a(31),h=r(g),_={manga:null,currentChapter:0,currentPage:0},m=(i={},(0,c.default)(i,f.SET_MANGA,function(e,t){e.manga=t}),(0,c.default)(i,f.RESET_MANGA,function(e){e.manga=null}),(0,c.default)(i,f.SET_CHAPTER,function(e,t){var a=t.mangaId,n=t.chapter;if(a===e.manga._id)for(var r=e.manga.chapters,i=0,s=r.length;i<s;++i)if(r[i]._id===n._id){h.default.set(r,i,n);break}}),(0,c.default)(i,f.SET_CURRENT_PAGE,function(e,t){e.currentPage=Number(t)}),(0,c.default)(i,f.SET_CURRENT_CHAPTER,function(e,t){e.currentChapter=Number(t)}),i),v=(s={},(0,c.default)(s,f.FETCH_MANGA,p.fetchManga),(0,c.default)(s,f.FETCH_CHAPTER,p.fetchChapter),(0,c.default)(s,f.NEXT_PAGE,p.nextPage),s),E=(u={},(0,c.default)(u,f.PAGES,function(e,t){return t[f.CHAPTER]&&t[f.CHAPTER].pages||[]}),(0,c.default)(u,f.MANGA,function(e){return e.manga}),(0,c.default)(u,f.CHAPTER,function(e){var t=e.manga,a=e.currentChapter;return t&&t.chapters[a-1]}),(0,c.default)(u,f.CURRENT_PAGE,function(e,t){return t[f.PAGES]&&t[f.PAGES][e.currentPage-1]||""}),(0,c.default)(u,f.CURRENT_PAGE_INDEX,function(e){return e.currentPage}),(0,c.default)(u,f.PREVIOUS_PAGE_PARAMS,function(e,t){var a=e.currentPage-1,n=e.currentChapter;return a<1&&n>1&&(--n,a=9999),a=Math.max(1,a),{mangaId:e.manga&&e.manga._id||0,chapter:n,page:a}}),(0,c.default)(u,f.NEXT_PAGE_PARAMS,function(e,t){var a=e.currentPage+1,n=e.currentChapter,r=t[f.CHAPTER]&&t[f.CHAPTER].pageCount||1/0;return a>r&&n<e.manga.chapterCount&&(++n,a=1),a=Math.min(r,a),{mangaId:e.manga&&e.manga._id||0,chapter:n,page:a}}),u);t.default={state:_,getters:E,mutations:m,actions:v},t.actions=v,t.getters=E,t.mutations=m,t.types=f,t.state=_},33:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SET_MANGA="Reading/SET_MANGA",t.RESET_MANGA="Reading/RESET_MANGA",t.SET_CHAPTER="Reading/SET_CHAPTER",t.SET_CURRENT_PAGE="Reading/SET_CURRENT_PAGE",t.SET_CURRENT_CHAPTER="Reading/SET_CURRENT_CHAPTER",t.MANGA="Reading/MANGA",t.CHAPTER="Reading/CHAPTER",t.PAGES="Reading/PAGES",t.CURRENT_PAGE="Reading/CURRENT_PAGE",t.CURRENT_PAGE_INDEX="Reading/CURRENT_PAGE_INDEX",t.NEXT_PAGE_PARAMS="Reading/NEXT_PAGE_PARAMS",t.PREVIOUS_PAGE_PARAMS="Reading/PREVIOUS_PAGE_PARAMS",t.FETCH_MANGA="Reading/FETCH_MANGA",t.FETCH_CHAPTER="Reading/FETCH_CHAPTER",t.NEXT_PAGE="Reading/NEXT_PAGE",t.PREVIOUS_PAGE="Reading/PREVIOUS_PAGE"},34:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){e(d.START_REQUEST)}function i(e){e(d.END_REQUEST)||e(d.SET_FAILED_STATE,!0)}function s(e){e(d.END_REQUEST)}function u(e){return f.format(e instanceof Date?e:new Date(e))}Object.defineProperty(t,"__esModule",{value:!0}),t.startRequest=r,t.failRequest=i,t.endRequest=s,t.formattedDate=u;var o=a(167),c=n(o),d=a(52),f=new c.default("en")},49:function(e,t,a){var n,r;a(156),n=a(105);var i=a(293);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,r._scopeId="data-v-fd22c108",e.exports=n},51:function(e,t,a){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.state=t.types=t.mutations=t.getters=t.actions=void 0;var i,s,u=a(53),o=r(u),c=a(52),d=n(c),f={pendingRequests:0,failed:!1},l=(i={},(0,o.default)(i,d.START_REQUEST,function(e){return++e.pendingRequests}),(0,o.default)(i,d.SET_FAILED_STATE,function(e,t){e.failed=t}),(0,o.default)(i,d.END_REQUEST,function(e){return e.pendingRequests=Math.max(0,e.pendingRequests-1)}),i),p={},g=(s={},(0,o.default)(s,d.PENDING_REQUESTS,function(e){return e.pendingRequests}),(0,o.default)(s,d.FAILED,function(e){return e.failed}),s);t.default={state:f,getters:g,mutations:l,actions:p},t.actions=p,t.getters=g,t.mutations=l,t.types=d,t.state=f},52:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.START_REQUEST="Loading/START_REQUEST",t.END_REQUEST="Loading/END_REQUEST",t.SET_FAILED_STATE="Loading/SET_FAILED_STATE",t.PENDING_REQUESTS="Loading/PENDING_REQUESTS",t.FAILED="Loading/FAILED"},89:function(e,t,a){!function(e,t,a,n,r,i,s){e.GoogleAnalyticsObject=r,e[r]=e[r]||function(){(e[r].q=e[r].q||[]).push(arguments)},e[r].l=1*new Date,i=t.createElement(a),s=t.getElementsByTagName(a)[0],i.async=1,i.src=n,s.parentNode.insertBefore(i,s)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga"),ga("create","UA-77964253-1","auto"),ga("send","pageview")},90:function(e,t,a){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var a=e.commit,n=e.state;return n.manga&&n.manga._id===t?c.default.resolve():((0,g.startRequest)(a),a(p.RESET_MANGA),h(t).get().then(function(e){a(p.SET_MANGA,e),(0,g.endRequest)(a)}).catch(function(e){console.error(e),(0,g.failRequest)(a)}))}function s(e,t){var a=e.commit,n=e.state,r=(e.getters,t.mangaId),i=t.chapter;a(p.SET_CURRENT_CHAPTER,i);var s=n.manga.chapters.find(function(e){var t=e._id;return t===i});if(s&&s.pages)return c.default.resolve(s);var u=h(r+"/chapters/"+i);return(0,g.startRequest)(a),u.get().then(function(e){return a(p.SET_CHAPTER,{mangaId:r,chapter:e}),(0,g.endRequest)(a),e}).catch(function(e){console.error(e),(0,g.failRequest)(a)})}function u(e){var t=e.commit,a=e.state;t(p.SET_CURRENT_PAGE,a.currentPage+1)}Object.defineProperty(t,"__esModule",{value:!0});var o=a(35),c=r(o);t.fetchManga=i,t.fetchChapter=s,t.nextPage=u;var d=a(67),f=r(d),l=a(33),p=n(l),g=a(34),h=(0,f.default)("/api/mangas")},91:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){return new u.default(function(t){return setTimeout(t,e)})}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c.default,t=e===c.default?"nextTick":"$nextTick";return new u.default(function(a){return e[t](a)})}Object.defineProperty(t,"__esModule",{value:!0});var s=a(35),u=n(s);t.timeout=r,t.nextTick=i;var o=a(31),c=n(o)},92:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.routes=void 0;var r=a(88),i=n(r),s=a(282),u=n(s),o=a(278),c=n(o),d=a(277),f=n(d),l=a(279),p=n(l),g=t.routes=[{name:"search",path:"/search",component:u.default},{path:"/manga/:mangaId/:chapter",component:f.default,children:[{name:"page",path:":page",component:p.default},{path:"",redirect:function(e){return{name:"page",params:{mangaId:e.params.mangaId,chapter:e.params.chapter,page:1}}}}]},{name:"manga",path:"/manga/:mangaId",component:c.default},{path:"*",redirect:"/search"}];t.default=new i.default({mode:"history",routes:g})},93:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=e.commit;return E.get().then(function(e){t("SET_MANGA_LIST",e)}).catch(function(e){t("ERROR_REQUEST",e)})}function i(e,t){var a=e.commit,n=e.state;return a("SET_MANGA",(0,h.default)(n.mangaList,{_id:t})),a("START_REFRESH_MANGA",t),E(t).get().then(function(e){a("SET_MANGA",e),a("UPDATE_MANGA",e),a("END_REFRESH_MANGA",t)}).catch(function(e){a("END_REFRESH_MANGA",t),a("ERROR_REQUEST",e)})}function s(e,t){var a=e.commit;return a("START_REFRESH_MANGA",t),E(t).get().then(function(e){a("UPDATE_MANGA",e),a("END_REFRESH_MANGA",t)}).catch(function(e){a("END_REFRESH_MANGA",t),a("ERROR_REQUEST",e)})}function u(e,t){var a=e.commit;a("DOWNLOAD_SET_PROGRESS",{id:t,progress:0})}function o(e,t,a){var n=e.commit;n({type:"DOWNLOAD_SET_PROGRESS",silent:!0,payload:{id:t,progress:a}})}function c(e,t){var a=e.commit,n=(t._id,t.pages),r=t.name,i=[],s=[],u=0,o=2*n.length;return n.forEach(function(e,t){i.push(R.get({url:e}).then(function(e){var a={data:e,format:null};return s[t]=a,new f.default(function(e){var t=new Image;t.onload=function(){a.format=t.width>t.height?["a3","l"]:["a4","p"],console.log(++u/o),e()},t.src=a.data})}).catch(function(e){a("ERROR_REQUEST",e)}))}),f.default.all(i).then(function(){var e=new m.default,t=(0,v.nextTick)();s.forEach(function(a,n){t=t.then(function(){return n>0&&e.addPage.apply(e,a.format),e.addImage(a.data,0,0,"l"===a.format[1]?420:210,297),console.log(++u/o),(0,v.timeout)(0)})}),t.then(function(){e.save(r+".pdf")}).catch(function(e){a("ERROR",e)})})}Object.defineProperty(t,"__esModule",{value:!0});var d=a(35),f=n(d);t.fetchMangaList=r,t.viewManga=i,t.fetchManga=s,t.resetDownloadProgress=u,t.setDownloadProgress=o,t.downloadChapter=c;var l=a(67),p=n(l),g=a(81),h=n(g),_=a(175),m=n(_),v=a(91),E=(0,p.default)("/api/mangas"),R=(0,p.default)("/api/image",{responseAs:"text"})},94:function(e,t){"use strict";function a(e){return e.mangaList}function n(e){return e.refreshingMangas}function r(e){return e.pendingRefreshRequests}function i(e){return e.manga}function s(e){return e.downloads}Object.defineProperty(t,"__esModule",{value:!0}),t.mangaList=a,t.refreshingMangas=n,t.pendingRefreshRequests=r,t.manga=i,t.downloads=s},95:function(e,t,a){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.mutations=t.state=void 0;var i=a(31),s=r(i),u=a(6),o=r(u),c=a(81),d=r(c),f=a(94),l=n(f),p=a(93),g=n(p),h=a(32),_=r(h),m=a(51),v=r(m);s.default.use(o.default);var E=t.state={mangaList:[],manga:{_id:null,name:null,description:null,image:null,updatedAt:null,uri:null,chapterCount:0,chapters:[{date:null,_id:null,name:null,uri:null}],completed:!1},pendingRefreshRequests:0,refreshingMangas:{},downloads:{}},R=t.mutations={START_REFRESH_MANGA:function(e,t){++e.pendingRefreshRequests,s.default.set(e.refreshingMangas,t,!0)},END_REFRESH_MANGA:function(e,t){--e.pendingRefreshRequests,s.default.set(e.refreshingMangas,t,!1)},SET_MANGA:function(e,t){t&&s.default.set(e,"manga",t)},SET_MANGA_LIST:function(e,t){e.mangaList=t},UPDATE_MANGA:function(e,t){if(e.mangaList.length){var a=(0,d.default)(e.mangaList,{_id:t._id});["image","name","description","updatedAt","completed","uri","chapterCount"].forEach(function(e){void 0!==t[e]&&s.default.set(a,e,t[e])})}},ERROR_REQUEST:function(e,t){console.error(t)},ERROR:function(e,t){console.error(t)},DOWNLOAD_SET_PROGRESS:function(e,t){var a=t.id,n=t.progress;s.default.set(e.downloads,a,n)}},A=new o.default.Store({strict:!1,state:E,mutations:R,getters:l,actions:g,modules:{reading:_.default,loading:v.default}});t.default=A},96:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(274),i=n(r);t.default={name:"App",data:function(){return{progress:{percent:0,options:{show:!0,canSuccess:!0,color:"rgb(32, 161, 255)",failedColor:"red",height:"4px"}}}},components:{ProgressBar:i.default},ready:function(){}}},97:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),s=a(6),u=a(51),o=300,c=.05,d=.7;t.default={data:function(){return{disappearing:!1,currentProgress:0}},computed:(0,i.default)({},(0,s.mapGetters)({pendingRequests:u.types.PENDING_REQUESTS,failed:u.types.FAILED}),{style:function(){return{opacity:+(!!this.pendingRequests||this.disappearing),width:Math.round(100*this.progress)+"%"}},classes:function(){return{"pb--failed":this.failed}},progress:function(){return this.pendingRequests?this.currentProgress/this.pendingRequests:1},maxProgress:function(){return c*this.pendingRequests}}),methods:{resetProgress:function(){var e=this;this.currentProgress=c/(this.pendingRequests||0),this.disappearing=!1,clearTimeout(this.disappearTimeout),setTimeout(function(){return e.increment()},o)},increment:function(){var e=this;this.currentProgress<d*this.pendingRequests&&(this.currentProgress+=c,setTimeout(function(){return e.increment()},o))},resetFailed:function(e){var t=e.propertyName;this.failed&&"opacity"===t&&this.$store.commit(u.types.SET_FAILED_STATE,!1)}},watch:{pendingRequests:function(e,t){var a=this;e!==t&&(t?e>0?e>t?setTimeout(function(){return a.increment()},o):this.currentProgress=this.currentProgress/t*e:(this.disappearing=!0,this.disappearTimeout=setTimeout(function(){return a.disappearing=!1},500)):this.resetProgress())}}}},98:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),s=a(49),u=n(s),o=a(33),c=a(6),d=a(34);t.default={name:"ChapterList",props:{chapters:Array,currentPreview:Number},computed:{currentPages:function(){return this.chapters,this.currentPreview>-1?this.chapters[this.currentPreview].pages:[]}},methods:(0,i.default)({isLoading:function(e){return this.currentPreview===e&&!this.chapters[e].pages},isPreviewVisible:function(e){return this.currentPreview===e},openPage:function(e){},pageLink:function(e){return{name:"page",params:{mangaId:this.$route.params.mangaId,chapter:this.currentPreview+1,page:e+1}}},togglePreview:function(e){this.$emit("current-preview",this.currentPreview===e?-1:e)},downloadChapter:function(e){var t=this;this.fetchChapter({mangaId:this.$route.params.mangaId,chapter:e}).then(function(e){return t.generatePdf(e)})},formattedDate:d.formattedDate},(0,c.mapActions)({fetchChapter:o.FETCH_CHAPTER,generatePdf:"downloadChapter"})),components:{Spinner:u.default},watch:{currentPreview:function(e,t){e!==t&&e>-1&&this.chapters&&!this.chapters[e].pages&&this.fetchChapter({mangaId:this.$route.params.mangaId,chapter:this.chapters[e]._id})}}}},99:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(49),i=n(r);t.default={name:"PagePreview",components:{Spinner:i.default},data:function(){return{imageReady:!0,displayOverlay:!1,pressOptions:{time:400}}},computed:{loadingPageMessage:function(){return"Loading page "+this.pageIndex+"/"+(this.pageCount||"?")},chapterMessage:function(){return"Chapter "+this.chapterIndex+"/"+this.chapterCount},chapterCount:function(){return this.manga&&this.manga.chapterCount||"?"}},props:{manga:Object,pageCount:[Number,String],pageUrl:String,pageIndex:[Number,String],chapterIndex:[Number,String],mangaLink:Object},methods:{handleTap:function(e){if(this.imageReady)return this.displayOverlay?void(this.displayOverlay=!1):void(this.$refs.container.$el===e.target?this.$emit("exit"):this.$emit("next"))},toggleOverlay:function(){this.displayOverlay=!0}},watch:{pageUrl:function(e){var t=this;this.displayOverlay=!1;var a=setTimeout(function(){return t.imageReady=!1},180),n=new Image;n.onload=function(){clearTimeout(a),t.imageReady=!0},n.onerror=function(){clearTimeout(a),t.imageReady=!0},n.src=e}}}},100:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"Chapter"}},101:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),s=a(275),u=n(s),o=a(49),c=n(o),d=a(32),f=a(6);t.default={name:"Manga",computed:(0,i.default)({title:function(){return this.isReady?this.manga.name:"Opening books..."},chapterCount:function(){return this.isReady?this.manga.chapterCount+" chapters":""},isReady:function(){return this.manga&&this.manga.image},isLoading:function(){return!this.manga},banner:function(){return this.manga?this.manga.image&&this.manga.image.match("cloudinary")&&window.innerWidth<700?this.manga.image.replace("upload/","upload/c_scale,e_blur:1188,w_700/"):this.manga.image:""},bannerStyle:function(){return{backgroundImage:'url("'+this.banner+'")',transform:"translate3d(0, "+this.imageOffset+"px, 0)"}}},(0,f.mapGetters)({manga:d.types.MANGA})),data:function(){return{imageOffset:0,currentPreview:-1}},methods:(0,f.mapActions)({fetchManga:d.types.FETCH_MANGA}),created:function(){var e=this;this.fetchManga(this.$route.params.mangaId).then(function(){var t=Number(e.$route.query.previewChapter)-1;t>-1&&(e.currentPreview=t)})},mounted:function(){var e=this;this.onScroll=function(){e.imageOffset=.7*window.scrollY-45},window.addEventListener("scroll",this.onScroll,!1)},destroyed:function(){window.removeEventListener("scroll",this.onScroll)},watch:{"$route.query.previewChapter":function(e){var t=(Number(e)||0)-1;this.currentPreview=t},currentPreview:function(e){var t=e+1;if(t!==Number(this.$route.query.previewChapter)){var a=(0,i.default)({},this.$route.query);delete a.previewChapter,t&&(a.previewChapter=t),this.$router.replace({query:a})}}},components:{ChapterList:u.default,Spinner:c.default}}},102:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),s=a(6),u=a(32),o=a(276),c=n(o),d=27,f=37,l=39,p=.375;t.default={name:"Page",components:{PagePreview:c.default},computed:(0,i.default)({},(0,s.mapGetters)({manga:u.types.MANGA,chapter:u.types.CHAPTER,currentPage:u.types.CURRENT_PAGE,currentPageIndex:u.types.CURRENT_PAGE_INDEX,nextPageParams:u.types.NEXT_PAGE_PARAMS,previousPageParams:u.types.PREVIOUS_PAGE_PARAMS}),{pageCount:function(){return this.chapter&&this.chapter.pageCount},mangaLink:function(){return{name:"manga",params:{mangaId:this.$route.params.mangaId},query:{previewChapter:this.$route.params.chapter}}},style:function(){return{visibility:this.display?"initial":"hidden",opacity:this.scaling?1-Math.min(1,p/this.scale):1}},imageStyle:function(){return{transform:"scale("+this.scale+")"}}}),data:function(){return{display:!1,scaling:!1,scale:1}},methods:(0,i.default)({},(0,s.mapMutations)({setCurrentPage:u.types.SET_CURRENT_PAGE}),(0,s.mapActions)({fetchManga:u.types.FETCH_MANGA,fetchChapter:u.types.FETCH_CHAPTER}),{returnToManga:function(){this.$router.push(this.mangaLink)},pinch:function(e){e.scale<p&&(this.display=!1),this.scaling=!1,this.scale=1},pinchmove:function(e){this.scaling=!0,this.scale=Math.min(1,e.scale)},handleClick:function(e){e.target===this.$refs.container&&(this.display=!1)},nextPage:function(){this.$router.push({name:"page",params:this.nextPageParams})},previousPage:function(){this.$router.push({name:"page",params:this.previousPageParams})},handleKey:function(e){switch(e.keyCode){case f:this.previousPage();break;case l:this.nextPage();break;case d:this.returnToManga()}},fixPage:function(e,t){var a=Math.min(this.pageCount||1/0,Math.max(1,this.$route.params.page));this.$router.replace({name:"page",params:{mangaId:e,chapter:t,page:a}})}}),mounted:function(){var e=this;this.keyListener=this.handleKey.bind(this),document.addEventListener("keydown",this.keyListener);var t=this.$route.params.mangaId,a=this.$route.params.chapter;this.setCurrentPage(this.$route.params.page),this.fetchManga(t).then(function(){return e.fetchChapter({mangaId:t,chapter:a})}).then(function(){e.fixPage(t,a)})},watch:{"$route.params.page":function(e){this.setCurrentPage(e)},"$route.params.chapter":function(e,t){var a=this;t=Number(t),e=Number(e),t!==e&&this.fetchChapter({mangaId:this.$route.params.mangaId,chapter:e}).then(function(){a.fixPage(a.$route.params.mangaId,e)})}},beforeDestroy:function(){document.removeEventListener("keydown",this.keyListener)}}},103:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),s=a(6);t.default={props:{manga:Object},computed:(0,i.default)({isVisible:function(){var e=this.$el.getBoundingClientRect(),t=Math.max(document.documentElement.clientHeight,window.innerHeight);return!(e.bottom<0||e.top-t>=0)},canRefresh:function(){return!this.manga.image||new Date-new Date(this.manga.updatedAt)>9936e4},isRefreshing:function(){return!!this.refreshingMangas[this.manga._id]},progressClasses:function(){return{active:this.isRefreshing}},chapterCount:function(){return"number"==typeof this.manga.chapterCount?this.manga.chapterCount:"?"},image:function(){return this.manga.updatedAt,this.manga.image||"https://placeholdit.imgix.net/~text?txtsize=33&txt=%F0%9F%8D%99Mangare&w=221&h=350"},route:function(){return{name:"manga",params:{mangaId:this.manga._id}}}},(0,s.mapGetters)(["refreshingMangas","pendingRefreshRequests"])),methods:(0,i.default)({refreshManga:function(){this.fetchManga(this.manga._id)},quickRead:function(){},quickDownload:function(){}},(0,s.mapActions)(["fetchManga"])),directives:{fit:{inserted:function(e){requestAnimationFrame(function(){if(e&&e.parentNode)for(var t=e.parentNode.offsetHeight,a=e.offsetHeight,n=parseInt(window.getComputedStyle(e).fontSize);a>t-2*n;)e.style.fontSize=--n+"px",e.parentNode.style.padding=n+"px",a=e.offsetHeight})}}},mounted:function(){var e=this;this.refreshMangaTimeout=-1,this.manga.image||!(new Date-new Date(this.manga.updatedAt)>9936e4)&&this.manga.chapterCount||!function(){var t=function t(){e.pendingRefreshRequests<3?e.refreshManga():setTimeout(t,500)};e.refreshMangaTimeout=setTimeout(t,850)}()},destroyed:function(){clearTimeout(this.refreshMangaTimeout)}}},104:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(255),i=n(r);t.default={props:{disabled:Boolean,value:{type:String,required:!0,twoWay:!0}},data:function(){return{searchFocused:!1}},methods:{onInput:(0,i.default)(function(e){this.$emit("input",e.target.value)},100)},computed:{model:function(){return this.value},label:function(){return this.disabled?"Loading...":"Search"},searchContainerClass:function(){return{filled:this.value||this.searchFocused,disabled:this.disabled}}}}},105:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},106:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),i=n(r),s=a(6),u=a(260),o=n(u),c=a(266),d=n(c),f=a(157),l=a(281),p=n(l),g=a(280),h=n(g),_={pre:"<em>",post:"</em>",extract:function(e){return e.name}};t.default={name:"Search",data:function(){return{searchQuery:""}},watch:{"$route.query.query":function(e){this.searchQuery=e||""}},computed:(0,i.default)({message:function(){return this.mangaList.length?"What do you want to read today?":"Building the library..."},isReady:function(){return this.mangaList.length&&this.searchQuery},searchResults:function(){var e=(0,f.filter)(this.searchQuery,this.mangaList,_);return(0,o.default)((0,d.default)(e,20),function(e){return e.original.highlighted=e.string,e.original})}},(0,s.mapGetters)(["mangaList"])),methods:(0,i.default)({updateQuery:function(){var e={name:this.$route.name,query:{query:this.searchQuery}};this.$router.replace(e)}},(0,s.mapActions)(["fetchMangaList"])),created:function(){this.searchQuery=this.$route.query.query||"",this.mangaList.length||this.fetchMangaList()},components:{SearchBar:p.default,MangaCard:h.default}}},147:function(e,t){},148:function(e,t){},149:function(e,t){},150:function(e,t){},151:function(e,t){},152:function(e,t){},153:function(e,t){},154:function(e,t){},155:function(e,t){},156:function(e,t){},270:function(e,t,a){e.exports=a.p+"static/img/gon.2764c8f.png"},271:function(e,t){e.exports="data:image/png;base64,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"},273:function(e,t,a){var n,r;a(149),n=a(96);var i=a(285);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},274:function(e,t,a){var n,r;a(155),n=a(97);var i=a(292);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,r._scopeId="data-v-fbed4272",e.exports=n},275:function(e,t,a){var n,r;a(153),n=a(98);var i=a(289);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},276:function(e,t,a){var n,r;a(150),n=a(99);var i=a(286);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},277:function(e,t,a){var n,r;n=a(100);var i=a(290);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},278:function(e,t,a){var n,r;a(152),n=a(101);var i=a(288);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},279:function(e,t,a){var n,r;n=a(102);var i=a(284);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},280:function(e,t,a){var n,r;a(154),n=a(103);var i=a(291);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},281:function(e,t,a){var n,r;a(148),n=a(104);var i=a(283);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},282:function(e,t,a){var n,r;a(151),n=a(106);var i=a(287);r=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(r=n=n.default),"function"==typeof r&&(r=r.options),r.render=i.render,r.staticRenderFns=i.staticRenderFns,e.exports=n},283:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"search-container",class:e.searchContainerClass},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],attrs:{disabled:e.disabled,autocomplete:"off",id:"search-input",name:"query",type:"text"},domProps:{value:e._s(e.model)},on:{focus:function(t){e.searchFocused=!0},blur:function(t){e.searchFocused=!1},input:[function(t){t.target.composing||(e.model=t.target.value)},e.onInput]}}),e._v(" "),a("label",{attrs:{for:"search-input"}},[a("span",[e._v(e._s(e.label))])])])},staticRenderFns:[]}},284:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("PagePreview",{attrs:{"page-url":e.currentPage,"page-index":e.currentPageIndex,"chapter-index":e.$route.params.chapter,"page-count":e.pageCount,"manga-link":e.mangaLink,manga:e.manga},on:{exit:e.returnToManga,previous:e.previousPage,next:e.nextPage}})},staticRenderFns:[]}},285:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("ProgressBar"),e._v(" "),a("nav",{attrs:{id:"nav"}},[a("router-link",{attrs:{to:{name:"search"}}},[a("h1",[a("img",{staticClass:"logo emoji",attrs:{draggable:"false",alt:"🍙",src:"//twemoji.maxcdn.com/2/72x72/1f359.png"}}),e._v("\n        Mangare\n      ")])])],1),e._v(" "),a("section",{attrs:{id:"container"}},[a("router-view")],1)],1)},staticRenderFns:[]}},286:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-touch",{ref:"container",staticClass:"page-preview",attrs:{tag:"div","press-options":e.pressOptions},on:{tap:function(t){t.preventDefault(),e.handleTap(t)},swipeleft:function(t){e.$emit("next")},swiperight:function(t){e.$emit("previous")},press:e.toggleOverlay}},[e.pageUrl&&e.imageReady?a("img",{staticClass:"page-preview__image",attrs:{src:e.pageUrl,title:"Next Page"}}):a("div",{staticClass:"page-preview__loader"},[a("div",{staticClass:"page-preview__loader-container"},[a("Spinner"),e._v(" "),a("p",{staticClass:"page-preview__loader__text"},[e._v(e._s(e.loadingPageMessage))]),e._v(" "),a("img",{staticClass:"page-preview__loader__manga-image",attrs:{alt:e.manga&&e.manga.name,src:e.manga&&e.manga.image}}),e._v(" "),a("p",{staticClass:"page-preview__loader__text"},[e._v(e._s(e.chapterMessage))]),e._v(" "),a("router-link",{attrs:{to:e.mangaLink}},[e._v("Go Back to "+e._s(e.manga&&e.manga.name))])],1)]),e._v(" "),e.displayOverlay?a("div",{staticClass:"page-preview__overlay"},[a("div",{staticClass:"page-preview__overlay__previous-page"},[e._v("\n      Swipe right / ←\n      "),a("br"),e._v("\n      Go to previous page\n    ")]),e._v(" "),a("div",{staticClass:"page-preview__overlay__exit"},[e._v("\n      Tap outside / ESC\n      "),a("br"),e._v("\n      Go back to the manga\n    ")]),e._v(" "),a("div",{
staticClass:"page-preview__overlay__next-page"},[e._v("\n      Tap / Swipe Left / →\n      "),a("br"),e._v("\n      Go to next page\n    ")])]):e._e()])},staticRenderFns:[]}},287:function(e,t,a){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"_flex"},[n("SearchBar",{directives:[{name:"model",rawName:"v-model",value:e.searchQuery,expression:"searchQuery"}],attrs:{disabled:!e.mangaList.length},domProps:{value:e.searchQuery},on:{input:function(t){e.searchQuery=t}},nativeOn:{change:function(t){e.updateQuery(t)}}}),e._v(" "),e.isReady?n("div",{staticClass:"search-resutls"},e._l(e.searchResults,function(e){return n("MangaCard",{key:e._id,attrs:{manga:e}})})):n("div",{staticClass:"search-message"},[n("img",{directives:[{name:"show",rawName:"v-show",value:e.mangaList.length,expression:"mangaList.length"}],attrs:{src:a(270)}}),e._v(" "),n("p",[e._v(e._s(e.message))])])],1)},staticRenderFns:[]}},288:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"manga"},[a("div",{staticClass:"manga__banner"},[a("div",{staticClass:"manga__banner__background",style:e.bannerStyle}),e._v(" "),a("div",{staticClass:"manga__banner__filter"}),e._v(" "),a("div",{staticClass:"manga__banner__title"},[a("h2",[e._v(e._s(e.title))]),e._v(" "),a("p",[e._v(e._s(e.chapterCount))])]),e._v(" "),e.isReady?a("div",{staticClass:"manga__banner__description"},[e.manga.image?a("img",{staticClass:"manga__banner__description__image",attrs:{src:e.manga.image}}):e._e(),e._v(" "),a("p",{staticClass:"manga__banner__description__text"},[e._v(e._s(e.manga.description))])]):e._e()]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.isReady,expression:"isReady"}],staticClass:"manga__content-container"},[a("div",{staticClass:"manga__chapters"},[e.isLoading?a("div",{staticClass:"spinner-container"},[a("div",{staticClass:"spinner-div"},[a("Spinner"),e._v(" "),a("p",[e._v("Retrieving chapters...")])],1)]):a("ChapterList",{ref:"chapters",attrs:{chapters:e.manga.chapters,"current-preview":e.currentPreview},on:{"current-preview":function(t){e.currentPreview=t}}})],1)]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.isReady,expression:"!isReady"}],staticClass:"manga__content-loader"},[a("p",[e._v("...")])])])},staticRenderFns:[]}},289:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("table",{staticClass:"chapters"},[e._m(0),e._v(" "),a("tbody",[e._l(e.chapters,function(t,n){return[a("tr",{staticClass:"chapters__row"},[a("td",{staticClass:"chapter__row__index"},[e._v(e._s(n+1))]),e._v(" "),a("td",{staticClass:"chapter__row__title"},[a("a",{attrs:{href:"#"},on:{click:function(t){t.preventDefault(),e.togglePreview(n)}}},[e._v(e._s(t.name))])]),e._v(" "),a("td",{staticClass:"chapter__row__page-count"},[e._v(e._s(t.pageCount?t.pageCount:"?"))]),e._v(" "),a("td",{staticClass:"chapter__row__published",attrs:{title:e.formattedDate(t.date)}},[e._v(e._s(e._f("formattedDate")(t.date)))]),e._v(" "),a("td",{staticClass:"chapter__row__actions"},[a("button",{on:{click:function(a){e.downloadChapter(t._id)}}},[e._v("Download")])])]),e._v(" "),a("tr",{staticClass:"chapter__preview-tr no-highlight"},[a("td",{attrs:{colspan:"5"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.isPreviewVisible(n),expression:"isPreviewVisible(cIndex)"}],staticClass:"chapter__preview",attrs:{transition:"height","data-image":n}},[e.isLoading(n)?a("div",{staticClass:"spinner-container"},[a("div",{staticClass:"spinner-div"},[a("Spinner")],1)]):a("div",{staticClass:"chapter__preview-inner"},e._l(t.pages,function(t,r){return a("div",{key:n,staticClass:"chapter__preview__page-image"},[a("router-link",{directives:[{name:"lazy",rawName:"v-lazy",value:t,expression:"page"}],attrs:{tag:"img",to:e.pageLink(r)}})],1)}))])])])]})],2)])])},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("thead",[a("tr",{staticClass:"chapters__header"},[a("th",[e._v("Chapter")]),e._v(" "),a("th",[e._v("Title")]),e._v(" "),a("th",[e._v("Page count")]),e._v(" "),a("th",[e._v("Published")]),e._v(" "),a("th",[e._v("Actions")])])])}]}},290:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("router-view")},staticRenderFns:[]}},291:function(e,t,a){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("figure",{staticClass:"manga-card"},[n("img",{staticClass:"manga-card__image",attrs:{title:e.manga.name,src:e.image}}),e._v(" "),n("figcaption",{staticClass:"manga-card__hover"},[n("router-link",{attrs:{to:e.route}},[n("div",{staticClass:"manga-card__title-container"},[n("h2",{directives:[{name:"fit",rawName:"v-fit",value:e.manga.name,expression:"manga.name"}],staticClass:"manga-card__title"},[e._v(e._s(e.manga.name))])])]),e._v(" "),n("div",{staticClass:"manga-card__information"},[n("p",{staticClass:"manga-card__information__chapters"},[e._v(e._s(e.chapterCount)+" Chapters")]),e._v(" "),n("div",{staticClass:"manga-card__information__updated-at"},[n("span",[e._v("Updated "+e._s(e._f("formattedDate")(e.manga.updatedAt)))]),e._v(" "),n("button",{staticClass:"manga-card__refresh-button",attrs:{disabled:!e.canRefresh},on:{click:e.refreshManga}},[n("img",{attrs:{src:a(271)}})])]),e._v(" "),n("ul",{staticClass:"manga-card__information__actions"},[n("li",[n("router-link",{attrs:{title:"Go to the Manga page",to:e.route}},[e._v("Details")])],1),e._v(" "),n("li",[n("a",{attrs:{title:"Read last chapter online",href:"#"},on:{click:function(t){t.stopPropagation(),t.preventDefault(),e.quickRead(t)}}},[e._v("Quick Read")])]),e._v(" "),n("li",[n("a",{attrs:{title:"Download last chapter online",href:"#"},on:{click:function(t){t.stopPropagation(),t.preventDefault(),e.quickDownload(t)}}},[e._v("Quick Download")])])])])],1),e._v(" "),n("div",{staticClass:"refreshing-banner",class:e.progressClasses},[n("span",[e._v("Refreshing...")])])])},staticRenderFns:[]}},292:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"pb",class:e.classes,style:e.style,on:{transitionend:e.resetFailed}})},staticRenderFns:[]}},293:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c||t;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"sk-folding-cube"},[a("div",{staticClass:"sk-cube1 sk-cube"}),e._v(" "),a("div",{staticClass:"sk-cube2 sk-cube"}),e._v(" "),a("div",{staticClass:"sk-cube4 sk-cube"}),e._v(" "),a("div",{staticClass:"sk-cube3 sk-cube"})])}]}},297:function(e,t){},298:function(e,t){},299:function(e,t){},300:function(e,t){}});
//# sourceMappingURL=app.1d89c1f4497255a9e854.js.map