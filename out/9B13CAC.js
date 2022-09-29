goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__10125__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__10125 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__10126__i = 0, G__10126__a = new Array(arguments.length -  0);
while (G__10126__i < G__10126__a.length) {G__10126__a[G__10126__i] = arguments[G__10126__i + 0]; ++G__10126__i;}
  args = new cljs.core.IndexedSeq(G__10126__a,0,null);
} 
return G__10125__delegate.call(this,args);};
G__10125.cljs$lang$maxFixedArity = 0;
G__10125.cljs$lang$applyTo = (function (arglist__10127){
var args = cljs.core.seq(arglist__10127);
return G__10125__delegate(args);
});
G__10125.cljs$core$IFn$_invoke$arity$variadic = G__10125__delegate;
return G__10125;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__10128__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__10128 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__10129__i = 0, G__10129__a = new Array(arguments.length -  0);
while (G__10129__i < G__10129__a.length) {G__10129__a[G__10129__i] = arguments[G__10129__i + 0]; ++G__10129__i;}
  args = new cljs.core.IndexedSeq(G__10129__a,0,null);
} 
return G__10128__delegate.call(this,args);};
G__10128.cljs$lang$maxFixedArity = 0;
G__10128.cljs$lang$applyTo = (function (arglist__10130){
var args = cljs.core.seq(arglist__10130);
return G__10128__delegate(args);
});
G__10128.cljs$core$IFn$_invoke$arity$variadic = G__10128__delegate;
return G__10128;
})()
);

return null;
});
