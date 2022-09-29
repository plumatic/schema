goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core.set_print_fn_BANG_.call(null,(function() { 
var G__7632__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__7632 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__7633__i = 0, G__7633__a = new Array(arguments.length -  0);
while (G__7633__i < G__7633__a.length) {G__7633__a[G__7633__i] = arguments[G__7633__i + 0]; ++G__7633__i;}
  args = new cljs.core.IndexedSeq(G__7633__a,0,null);
} 
return G__7632__delegate.call(this,args);};
G__7632.cljs$lang$maxFixedArity = 0;
G__7632.cljs$lang$applyTo = (function (arglist__7634){
var args = cljs.core.seq(arglist__7634);
return G__7632__delegate(args);
});
G__7632.cljs$core$IFn$_invoke$arity$variadic = G__7632__delegate;
return G__7632;
})()
);

cljs.core.set_print_err_fn_BANG_.call(null,(function() { 
var G__7635__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__7635 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__7636__i = 0, G__7636__a = new Array(arguments.length -  0);
while (G__7636__i < G__7636__a.length) {G__7636__a[G__7636__i] = arguments[G__7636__i + 0]; ++G__7636__i;}
  args = new cljs.core.IndexedSeq(G__7636__a,0,null);
} 
return G__7635__delegate.call(this,args);};
G__7635.cljs$lang$maxFixedArity = 0;
G__7635.cljs$lang$applyTo = (function (arglist__7637){
var args = cljs.core.seq(arglist__7637);
return G__7635__delegate(args);
});
G__7635.cljs$core$IFn$_invoke$arity$variadic = G__7635__delegate;
return G__7635;
})()
);

return null;
});
