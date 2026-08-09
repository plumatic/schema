goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__737__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__737 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__738__i = 0, G__738__a = new Array(arguments.length -  0);
while (G__738__i < G__738__a.length) {G__738__a[G__738__i] = arguments[G__738__i + 0]; ++G__738__i;}
  args = new cljs.core.IndexedSeq(G__738__a,0,null);
} 
return G__737__delegate.call(this,args);};
G__737.cljs$lang$maxFixedArity = 0;
G__737.cljs$lang$applyTo = (function (arglist__739){
var args = cljs.core.seq(arglist__739);
return G__737__delegate(args);
});
G__737.cljs$core$IFn$_invoke$arity$variadic = G__737__delegate;
return G__737;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__740__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__740 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__741__i = 0, G__741__a = new Array(arguments.length -  0);
while (G__741__i < G__741__a.length) {G__741__a[G__741__i] = arguments[G__741__i + 0]; ++G__741__i;}
  args = new cljs.core.IndexedSeq(G__741__a,0,null);
} 
return G__740__delegate.call(this,args);};
G__740.cljs$lang$maxFixedArity = 0;
G__740.cljs$lang$applyTo = (function (arglist__742){
var args = cljs.core.seq(arglist__742);
return G__740__delegate(args);
});
G__740.cljs$core$IFn$_invoke$arity$variadic = G__740__delegate;
return G__740;
})()
);

return null;
});
