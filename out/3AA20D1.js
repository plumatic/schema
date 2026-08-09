goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__12391__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__12391 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__12392__i = 0, G__12392__a = new Array(arguments.length -  0);
while (G__12392__i < G__12392__a.length) {G__12392__a[G__12392__i] = arguments[G__12392__i + 0]; ++G__12392__i;}
  args = new cljs.core.IndexedSeq(G__12392__a,0,null);
} 
return G__12391__delegate.call(this,args);};
G__12391.cljs$lang$maxFixedArity = 0;
G__12391.cljs$lang$applyTo = (function (arglist__12393){
var args = cljs.core.seq(arglist__12393);
return G__12391__delegate(args);
});
G__12391.cljs$core$IFn$_invoke$arity$variadic = G__12391__delegate;
return G__12391;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__12394__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__12394 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__12395__i = 0, G__12395__a = new Array(arguments.length -  0);
while (G__12395__i < G__12395__a.length) {G__12395__a[G__12395__i] = arguments[G__12395__i + 0]; ++G__12395__i;}
  args = new cljs.core.IndexedSeq(G__12395__a,0,null);
} 
return G__12394__delegate.call(this,args);};
G__12394.cljs$lang$maxFixedArity = 0;
G__12394.cljs$lang$applyTo = (function (arglist__12396){
var args = cljs.core.seq(arglist__12396);
return G__12394__delegate(args);
});
G__12394.cljs$core$IFn$_invoke$arity$variadic = G__12394__delegate;
return G__12394;
})()
);

return null;
});
