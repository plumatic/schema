goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__12795__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__12795 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__12796__i = 0, G__12796__a = new Array(arguments.length -  0);
while (G__12796__i < G__12796__a.length) {G__12796__a[G__12796__i] = arguments[G__12796__i + 0]; ++G__12796__i;}
  args = new cljs.core.IndexedSeq(G__12796__a,0,null);
} 
return G__12795__delegate.call(this,args);};
G__12795.cljs$lang$maxFixedArity = 0;
G__12795.cljs$lang$applyTo = (function (arglist__12797){
var args = cljs.core.seq(arglist__12797);
return G__12795__delegate(args);
});
G__12795.cljs$core$IFn$_invoke$arity$variadic = G__12795__delegate;
return G__12795;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__12798__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__12798 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__12799__i = 0, G__12799__a = new Array(arguments.length -  0);
while (G__12799__i < G__12799__a.length) {G__12799__a[G__12799__i] = arguments[G__12799__i + 0]; ++G__12799__i;}
  args = new cljs.core.IndexedSeq(G__12799__a,0,null);
} 
return G__12798__delegate.call(this,args);};
G__12798.cljs$lang$maxFixedArity = 0;
G__12798.cljs$lang$applyTo = (function (arglist__12800){
var args = cljs.core.seq(arglist__12800);
return G__12798__delegate(args);
});
G__12798.cljs$core$IFn$_invoke$arity$variadic = G__12798__delegate;
return G__12798;
})()
);

return null;
});
