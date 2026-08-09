// Compiled by ClojureScript 1.11.4 {:target :nodejs, :nodejs-rt true, :optimizations :none}
goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
(cljs.core._STAR_print_newline_STAR_ = false);

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__12925__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__12925 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__12926__i = 0, G__12926__a = new Array(arguments.length -  0);
while (G__12926__i < G__12926__a.length) {G__12926__a[G__12926__i] = arguments[G__12926__i + 0]; ++G__12926__i;}
  args = new cljs.core.IndexedSeq(G__12926__a,0,null);
} 
return G__12925__delegate.call(this,args);};
G__12925.cljs$lang$maxFixedArity = 0;
G__12925.cljs$lang$applyTo = (function (arglist__12927){
var args = cljs.core.seq(arglist__12927);
return G__12925__delegate(args);
});
G__12925.cljs$core$IFn$_invoke$arity$variadic = G__12925__delegate;
return G__12925;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__12928__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__12928 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__12929__i = 0, G__12929__a = new Array(arguments.length -  0);
while (G__12929__i < G__12929__a.length) {G__12929__a[G__12929__i] = arguments[G__12929__i + 0]; ++G__12929__i;}
  args = new cljs.core.IndexedSeq(G__12929__a,0,null);
} 
return G__12928__delegate.call(this,args);};
G__12928.cljs$lang$maxFixedArity = 0;
G__12928.cljs$lang$applyTo = (function (arglist__12930){
var args = cljs.core.seq(arglist__12930);
return G__12928__delegate(args);
});
G__12928.cljs$core$IFn$_invoke$arity$variadic = G__12928__delegate;
return G__12928;
})()
);

return null;
});

//# sourceMappingURL=nodejs.js.map
