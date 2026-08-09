goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__10175__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__10175 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__10176__i = 0, G__10176__a = new Array(arguments.length -  0);
while (G__10176__i < G__10176__a.length) {G__10176__a[G__10176__i] = arguments[G__10176__i + 0]; ++G__10176__i;}
  args = new cljs.core.IndexedSeq(G__10176__a,0,null);
} 
return G__10175__delegate.call(this,args);};
G__10175.cljs$lang$maxFixedArity = 0;
G__10175.cljs$lang$applyTo = (function (arglist__10177){
var args = cljs.core.seq(arglist__10177);
return G__10175__delegate(args);
});
G__10175.cljs$core$IFn$_invoke$arity$variadic = G__10175__delegate;
return G__10175;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__10178__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__10178 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__10179__i = 0, G__10179__a = new Array(arguments.length -  0);
while (G__10179__i < G__10179__a.length) {G__10179__a[G__10179__i] = arguments[G__10179__i + 0]; ++G__10179__i;}
  args = new cljs.core.IndexedSeq(G__10179__a,0,null);
} 
return G__10178__delegate.call(this,args);};
G__10178.cljs$lang$maxFixedArity = 0;
G__10178.cljs$lang$applyTo = (function (arglist__10180){
var args = cljs.core.seq(arglist__10180);
return G__10178__delegate(args);
});
G__10178.cljs$core$IFn$_invoke$arity$variadic = G__10178__delegate;
return G__10178;
})()
);

return null;
});
