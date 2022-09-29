// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('fipp.ednize');
goog.require('cljs.core');
goog.require('clojure.string');

/**
 * Perform a shallow conversion to an Edn data structure.
 * @interface
 */
fipp.ednize.IEdn = function(){};

fipp.ednize._edn = (function fipp$ednize$_edn(x){
if((((!((x == null)))) && ((!((x.fipp$ednize$IEdn$_edn$arity$1 == null)))))){
return x.fipp$ednize$IEdn$_edn$arity$1(x);
} else {
var x__4433__auto__ = (((x == null))?null:x);
var m__4434__auto__ = (fipp.ednize._edn[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,x);
} else {
var m__4431__auto__ = (fipp.ednize._edn["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,x);
} else {
throw cljs.core.missing_protocol.call(null,"IEdn.-edn",x);
}
}
}
});

fipp.ednize.edn = (function fipp$ednize$edn(x){
if(cljs.core.object_QMARK_.call(null,x)){
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"js","js",-886355190,null),cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__4523__auto__ = (function fipp$ednize$edn_$_iter__5824(s__5825){
return (new cljs.core.LazySeq(null,(function (){
var s__5825__$1 = s__5825;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__5825__$1);
if(temp__4657__auto__){
var s__5825__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__5825__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__5825__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__5827 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__5826 = (0);
while(true){
if((i__5826 < size__4522__auto__)){
var k = cljs.core._nth.call(null,c__4521__auto__,i__5826);
cljs.core.chunk_append.call(null,b__5827,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null,k),(x[k])], null));

var G__5832 = (i__5826 + (1));
i__5826 = G__5832;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__5827),fipp$ednize$edn_$_iter__5824.call(null,cljs.core.chunk_rest.call(null,s__5825__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__5827),null);
}
} else {
var k = cljs.core.first.call(null,s__5825__$2);
return cljs.core.cons.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null,k),(x[k])], null),fipp$ednize$edn_$_iter__5824.call(null,cljs.core.rest.call(null,s__5825__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__4523__auto__.call(null,cljs.core.js_keys.call(null,x));
})()));
} else {
if(cljs.core.array_QMARK_.call(null,x)){
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"js","js",-886355190,null),cljs.core.vec.call(null,x));
} else {
if((((!((x == null))))?(((((x.cljs$lang$protocol_mask$partition0$ & (32768))) || ((cljs.core.PROTOCOL_SENTINEL === x.cljs$core$IDeref$))))?true:(((!x.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IDeref,x):false)):cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IDeref,x))){
var pending_QMARK_ = (function (){var and__4120__auto__ = (((!((x == null))))?(((((x.cljs$lang$protocol_mask$partition1$ & (1))) || ((cljs.core.PROTOCOL_SENTINEL === x.cljs$core$IPending$))))?true:(((!x.cljs$lang$protocol_mask$partition1$))?cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IPending,x):false)):cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IPending,x));
if(and__4120__auto__){
return (!(cljs.core.realized_QMARK_.call(null,x)));
} else {
return and__4120__auto__;
}
})();
var val = ((pending_QMARK_)?null:cljs.core.deref.call(null,x));
var status = ((pending_QMARK_)?new cljs.core.Keyword(null,"pending","pending",-220036727):new cljs.core.Keyword(null,"ready","ready",1086465795));
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"object","object",-1179821820,null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.symbol.call(null,cljs.core.pr_str.call(null,cljs.core.type.call(null,x))),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"val","val",128701612),val], null)], null));
} else {
if((x instanceof Date)){
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"inst","inst",-2008473268,null),(function (){var normalize = (function (n,len){
var ns = cljs.core.str.cljs$core$IFn$_invoke$arity$1(n);
while(true){
if((cljs.core.count.call(null,ns) < len)){
var G__5833 = ["0",ns].join('');
ns = G__5833;
continue;
} else {
return ns;
}
break;
}
});
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(x.getUTCFullYear()),"-",normalize.call(null,(x.getUTCMonth() + (1)),(2)),"-",normalize.call(null,x.getUTCDate(),(2)),"T",normalize.call(null,x.getUTCHours(),(2)),":",normalize.call(null,x.getUTCMinutes(),(2)),":",normalize.call(null,x.getUTCSeconds(),(2)),".",normalize.call(null,x.getUTCMilliseconds(),(3)),"-","00:00"].join('');
})());
} else {
if((((!((x == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === x.fipp$ednize$IEdn$))))?true:(((!x.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_.call(null,fipp.ednize.IEdn,x):false)):cljs.core.native_satisfies_QMARK_.call(null,fipp.ednize.IEdn,x))){
return fipp.ednize._edn.call(null,x);
} else {
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"object","object",-1179821820,null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.symbol.call(null,cljs.core.pr_str.call(null,cljs.core.type.call(null,x)))], null));

}
}
}
}
}
});
cljs.core.UUID.prototype.fipp$ednize$IEdn$ = cljs.core.PROTOCOL_SENTINEL;

cljs.core.UUID.prototype.fipp$ednize$IEdn$_edn$arity$1 = (function (x){
var x__$1 = this;
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"uuid","uuid",-504564192,null),cljs.core.str.cljs$core$IFn$_invoke$arity$1(x__$1));
});

cljs.core.ExceptionInfo.prototype.fipp$ednize$IEdn$ = cljs.core.PROTOCOL_SENTINEL;

cljs.core.ExceptionInfo.prototype.fipp$ednize$IEdn$_edn$arity$1 = (function (x){
var x__$1 = this;
return cljs.core.tagged_literal.call(null,new cljs.core.Symbol(null,"ExceptionInfo","ExceptionInfo",294935087,null),cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"message","message",-406056002),cljs.core.ex_message.call(null,x__$1),new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.ex_data.call(null,x__$1)], null),(function (){var temp__4657__auto__ = cljs.core.ex_cause.call(null,x__$1);
if(cljs.core.truth_(temp__4657__auto__)){
var cause = temp__4657__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cause","cause",231901252),cause], null);
} else {
return null;
}
})()));
});
fipp.ednize.record__GT_tagged = (function fipp$ednize$record__GT_tagged(x){
return cljs.core.tagged_literal.call(null,clojure.string.split.call(null,cljs.core.pr_str.call(null,cljs.core.type.call(null,x)),/\//,(2)),cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,x));
});

//# sourceMappingURL=ednize.js.map
