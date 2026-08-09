goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__587__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__587 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__588__i = 0, G__588__a = new Array(arguments.length -  0);
while (G__588__i < G__588__a.length) {G__588__a[G__588__i] = arguments[G__588__i + 0]; ++G__588__i;}
  args = new cljs.core.IndexedSeq(G__588__a,0,null);
} 
return G__587__delegate.call(this,args);};
G__587.cljs$lang$maxFixedArity = 0;
G__587.cljs$lang$applyTo = (function (arglist__589){
var args = cljs.core.seq(arglist__589);
return G__587__delegate(args);
});
G__587.cljs$core$IFn$_invoke$arity$variadic = G__587__delegate;
return G__587;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__590__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__590 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__591__i = 0, G__591__a = new Array(arguments.length -  0);
while (G__591__i < G__591__a.length) {G__591__a[G__591__i] = arguments[G__591__i + 0]; ++G__591__i;}
  args = new cljs.core.IndexedSeq(G__591__a,0,null);
} 
return G__590__delegate.call(this,args);};
G__590.cljs$lang$maxFixedArity = 0;
G__590.cljs$lang$applyTo = (function (arglist__592){
var args = cljs.core.seq(arglist__592);
return G__590__delegate(args);
});
G__590.cljs$core$IFn$_invoke$arity$variadic = G__590__delegate;
return G__590;
})()
);

return null;
});
