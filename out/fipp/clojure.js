// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('fipp.clojure');
goog.require('cljs.core');
goog.require('clojure.walk');
goog.require('fipp.visit');
goog.require('fipp.edn');
fipp.clojure.block = (function fipp$clojure$block(nodes){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"nest","nest",-314993663),(2),cljs.core.interpose.call(null,new cljs.core.Keyword(null,"line","line",212345235),nodes)], null);
});
fipp.clojure.list_group = (function fipp$clojure$list_group(var_args){
var args__4736__auto__ = [];
var len__4730__auto___5881 = arguments.length;
var i__4731__auto___5882 = (0);
while(true){
if((i__4731__auto___5882 < len__4730__auto___5881)){
args__4736__auto__.push((arguments[i__4731__auto___5882]));

var G__5883 = (i__4731__auto___5882 + (1));
i__4731__auto___5882 = G__5883;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return fipp.clojure.list_group.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

fipp.clojure.list_group.cljs$core$IFn$_invoke$arity$variadic = (function (nodes){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"group","group",582596132),"(",nodes,")"], null);
});

fipp.clojure.list_group.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
fipp.clojure.list_group.cljs$lang$applyTo = (function (seq5880){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq5880));
});

fipp.clojure.maybe_a = (function fipp$clojure$maybe_a(pred,xs){
var x = cljs.core.first.call(null,xs);
if(cljs.core.truth_(pred.call(null,x))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [x,cljs.core.rest.call(null,xs)], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null,xs], null);
}
});
fipp.clojure.pretty_cond_clause = (function fipp$clojure$pretty_cond_clause(p,p__5884){
var vec__5885 = p__5884;
var test = cljs.core.nth.call(null,vec__5885,(0),null);
var result = cljs.core.nth.call(null,vec__5885,(1),null);
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"group","group",582596132),fipp.visit.visit.call(null,p,test),new cljs.core.Keyword(null,"line","line",212345235),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"nest","nest",-314993663),(2),fipp.visit.visit.call(null,p,result)], null)], null);
});
fipp.clojure.pretty_case = (function fipp$clojure$pretty_case(p,p__5889){
var vec__5890 = p__5889;
var seq__5891 = cljs.core.seq.call(null,vec__5890);
var first__5892 = cljs.core.first.call(null,seq__5891);
var seq__5891__$1 = cljs.core.next.call(null,seq__5891);
var head = first__5892;
var first__5892__$1 = cljs.core.first.call(null,seq__5891__$1);
var seq__5891__$2 = cljs.core.next.call(null,seq__5891__$1);
var expr = first__5892__$1;
var more = seq__5891__$2;
var clauses = cljs.core.partition.call(null,(2),more);
var default$ = ((cljs.core.odd_QMARK_.call(null,cljs.core.count.call(null,more)))?cljs.core.last.call(null,more):null);
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",fipp.visit.visit.call(null,p,expr),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.concat.call(null,cljs.core.map.call(null,((function (clauses,default$,vec__5890,seq__5891,first__5892,seq__5891__$1,head,first__5892__$1,seq__5891__$2,expr,more){
return (function (p1__5888_SHARP_){
return fipp.clojure.pretty_cond_clause.call(null,p,p1__5888_SHARP_);
});})(clauses,default$,vec__5890,seq__5891,first__5892,seq__5891__$1,head,first__5892__$1,seq__5891__$2,expr,more))
,clauses),(cljs.core.truth_(default$)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,default$)], null):null))));
});
fipp.clojure.pretty_cond = (function fipp$clojure$pretty_cond(p,p__5894){
var vec__5895 = p__5894;
var seq__5896 = cljs.core.seq.call(null,vec__5895);
var first__5897 = cljs.core.first.call(null,seq__5896);
var seq__5896__$1 = cljs.core.next.call(null,seq__5896);
var head = first__5897;
var more = seq__5896__$1;
var clauses = cljs.core.partition.call(null,(2),more);
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.map.call(null,((function (clauses,vec__5895,seq__5896,first__5897,seq__5896__$1,head,more){
return (function (p1__5893_SHARP_){
return fipp.clojure.pretty_cond_clause.call(null,p,p1__5893_SHARP_);
});})(clauses,vec__5895,seq__5896,first__5897,seq__5896__$1,head,more))
,clauses)));
});
fipp.clojure.pretty_condp = (function fipp$clojure$pretty_condp(p,p__5899){
var vec__5900 = p__5899;
var seq__5901 = cljs.core.seq.call(null,vec__5900);
var first__5902 = cljs.core.first.call(null,seq__5901);
var seq__5901__$1 = cljs.core.next.call(null,seq__5901);
var head = first__5902;
var first__5902__$1 = cljs.core.first.call(null,seq__5901__$1);
var seq__5901__$2 = cljs.core.next.call(null,seq__5901__$1);
var pred = first__5902__$1;
var first__5902__$2 = cljs.core.first.call(null,seq__5901__$2);
var seq__5901__$3 = cljs.core.next.call(null,seq__5901__$2);
var expr = first__5902__$2;
var more = seq__5901__$3;
var clauses = cljs.core.partition.call(null,(2),more);
var default$ = ((cljs.core.odd_QMARK_.call(null,cljs.core.count.call(null,more)))?cljs.core.last.call(null,more):null);
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",fipp.visit.visit.call(null,p,pred)," ",fipp.visit.visit.call(null,p,expr),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.concat.call(null,cljs.core.map.call(null,((function (clauses,default$,vec__5900,seq__5901,first__5902,seq__5901__$1,head,first__5902__$1,seq__5901__$2,pred,first__5902__$2,seq__5901__$3,expr,more){
return (function (p1__5898_SHARP_){
return fipp.clojure.pretty_cond_clause.call(null,p,p1__5898_SHARP_);
});})(clauses,default$,vec__5900,seq__5901,first__5902,seq__5901__$1,head,first__5902__$1,seq__5901__$2,pred,first__5902__$2,seq__5901__$3,expr,more))
,clauses),(cljs.core.truth_(default$)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,default$)], null):null))));
});
fipp.clojure.pretty_arrow = (function fipp$clojure$pretty_arrow(p,p__5904){
var vec__5905 = p__5904;
var seq__5906 = cljs.core.seq.call(null,vec__5905);
var first__5907 = cljs.core.first.call(null,seq__5906);
var seq__5906__$1 = cljs.core.next.call(null,seq__5906);
var head = first__5907;
var stmts = seq__5906__$1;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),cljs.core.interpose.call(null,new cljs.core.Keyword(null,"line","line",212345235),cljs.core.map.call(null,((function (vec__5905,seq__5906,first__5907,seq__5906__$1,head,stmts){
return (function (p1__5903_SHARP_){
return fipp.visit.visit.call(null,p,p1__5903_SHARP_);
});})(vec__5905,seq__5906,first__5907,seq__5906__$1,head,stmts))
,stmts))], null));
});
fipp.clojure.pretty_if = (function fipp$clojure$pretty_if(p,p__5909){
var vec__5910 = p__5909;
var seq__5911 = cljs.core.seq.call(null,vec__5910);
var first__5912 = cljs.core.first.call(null,seq__5911);
var seq__5911__$1 = cljs.core.next.call(null,seq__5911);
var head = first__5912;
var first__5912__$1 = cljs.core.first.call(null,seq__5911__$1);
var seq__5911__$2 = cljs.core.next.call(null,seq__5911__$1);
var test = first__5912__$1;
var more = seq__5911__$2;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",fipp.visit.visit.call(null,p,test),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.map.call(null,((function (vec__5910,seq__5911,first__5912,seq__5911__$1,head,first__5912__$1,seq__5911__$2,test,more){
return (function (p1__5908_SHARP_){
return fipp.visit.visit.call(null,p,p1__5908_SHARP_);
});})(vec__5910,seq__5911,first__5912,seq__5911__$1,head,first__5912__$1,seq__5911__$2,test,more))
,more)));
});
fipp.clojure.pretty_method = (function fipp$clojure$pretty_method(p,p__5914){
var vec__5915 = p__5914;
var seq__5916 = cljs.core.seq.call(null,vec__5915);
var first__5917 = cljs.core.first.call(null,seq__5916);
var seq__5916__$1 = cljs.core.next.call(null,seq__5916);
var params = first__5917;
var body = seq__5916__$1;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,params),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.map.call(null,((function (vec__5915,seq__5916,first__5917,seq__5916__$1,params,body){
return (function (p1__5913_SHARP_){
return fipp.visit.visit.call(null,p,p1__5913_SHARP_);
});})(vec__5915,seq__5916,first__5917,seq__5916__$1,params,body))
,body)));
});
fipp.clojure.pretty_defn = (function fipp$clojure$pretty_defn(p,p__5920){
var vec__5921 = p__5920;
var seq__5922 = cljs.core.seq.call(null,vec__5921);
var first__5923 = cljs.core.first.call(null,seq__5922);
var seq__5922__$1 = cljs.core.next.call(null,seq__5922);
var head = first__5923;
var first__5923__$1 = cljs.core.first.call(null,seq__5922__$1);
var seq__5922__$2 = cljs.core.next.call(null,seq__5922__$1);
var fn_name = first__5923__$1;
var more = seq__5922__$2;
var vec__5924 = fipp.clojure.maybe_a.call(null,cljs.core.string_QMARK_,more);
var docstring = cljs.core.nth.call(null,vec__5924,(0),null);
var more__$1 = cljs.core.nth.call(null,vec__5924,(1),null);
var vec__5927 = fipp.clojure.maybe_a.call(null,cljs.core.map_QMARK_,more__$1);
var attr_map = cljs.core.nth.call(null,vec__5927,(0),null);
var more__$2 = cljs.core.nth.call(null,vec__5927,(1),null);
var vec__5930 = fipp.clojure.maybe_a.call(null,cljs.core.vector_QMARK_,more__$2);
var params = cljs.core.nth.call(null,vec__5930,(0),null);
var body = cljs.core.nth.call(null,vec__5930,(1),null);
var params_on_first_line_QMARK_ = (function (){var and__4120__auto__ = params;
if(cljs.core.truth_(and__4120__auto__)){
return (((docstring == null)) && ((attr_map == null)));
} else {
return and__4120__auto__;
}
})();
var params_after_attr_map_QMARK_ = (function (){var and__4120__auto__ = params;
if(cljs.core.truth_(and__4120__auto__)){
return cljs.core.not.call(null,params_on_first_line_QMARK_);
} else {
return and__4120__auto__;
}
})();
return fipp.clojure.list_group.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,head)," ",fipp.visit.visit.call(null,p,fn_name)], null),(cljs.core.truth_(params_on_first_line_QMARK_)?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [" ",fipp.visit.visit.call(null,p,params)], null):null)),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.concat.call(null,(cljs.core.truth_(docstring)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,docstring)], null):null),(cljs.core.truth_(attr_map)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,attr_map)], null):null),(cljs.core.truth_(params_after_attr_map_QMARK_)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,params)], null):null),(cljs.core.truth_(body)?cljs.core.map.call(null,((function (vec__5924,docstring,more__$1,vec__5927,attr_map,more__$2,vec__5930,params,body,params_on_first_line_QMARK_,params_after_attr_map_QMARK_,vec__5921,seq__5922,first__5923,seq__5922__$1,head,first__5923__$1,seq__5922__$2,fn_name,more){
return (function (p1__5918_SHARP_){
return fipp.visit.visit.call(null,p,p1__5918_SHARP_);
});})(vec__5924,docstring,more__$1,vec__5927,attr_map,more__$2,vec__5930,params,body,params_on_first_line_QMARK_,params_after_attr_map_QMARK_,vec__5921,seq__5922,first__5923,seq__5922__$1,head,first__5923__$1,seq__5922__$2,fn_name,more))
,body):cljs.core.map.call(null,((function (vec__5924,docstring,more__$1,vec__5927,attr_map,more__$2,vec__5930,params,body,params_on_first_line_QMARK_,params_after_attr_map_QMARK_,vec__5921,seq__5922,first__5923,seq__5922__$1,head,first__5923__$1,seq__5922__$2,fn_name,more){
return (function (p1__5919_SHARP_){
return fipp.clojure.pretty_method.call(null,p,p1__5919_SHARP_);
});})(vec__5924,docstring,more__$1,vec__5927,attr_map,more__$2,vec__5930,params,body,params_on_first_line_QMARK_,params_after_attr_map_QMARK_,vec__5921,seq__5922,first__5923,seq__5922__$1,head,first__5923__$1,seq__5922__$2,fn_name,more))
,more__$2)))));
});
fipp.clojure.pretty_fn = (function fipp$clojure$pretty_fn(p,p__5935){
var vec__5936 = p__5935;
var seq__5937 = cljs.core.seq.call(null,vec__5936);
var first__5938 = cljs.core.first.call(null,seq__5937);
var seq__5937__$1 = cljs.core.next.call(null,seq__5937);
var head = first__5938;
var more = seq__5937__$1;
var vec__5939 = fipp.clojure.maybe_a.call(null,cljs.core.symbol_QMARK_,more);
var fn_name = cljs.core.nth.call(null,vec__5939,(0),null);
var more__$1 = cljs.core.nth.call(null,vec__5939,(1),null);
var vec__5942 = fipp.clojure.maybe_a.call(null,cljs.core.vector_QMARK_,more__$1);
var params = cljs.core.nth.call(null,vec__5942,(0),null);
var body = cljs.core.nth.call(null,vec__5942,(1),null);
return fipp.clojure.list_group.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,head)], null),(cljs.core.truth_(fn_name)?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [" ",fipp.visit.visit.call(null,p,fn_name)], null):null),(cljs.core.truth_(params)?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [" ",fipp.visit.visit.call(null,p,params)], null):null)),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,(cljs.core.truth_(body)?cljs.core.map.call(null,((function (vec__5939,fn_name,more__$1,vec__5942,params,body,vec__5936,seq__5937,first__5938,seq__5937__$1,head,more){
return (function (p1__5933_SHARP_){
return fipp.visit.visit.call(null,p,p1__5933_SHARP_);
});})(vec__5939,fn_name,more__$1,vec__5942,params,body,vec__5936,seq__5937,first__5938,seq__5937__$1,head,more))
,body):cljs.core.map.call(null,((function (vec__5939,fn_name,more__$1,vec__5942,params,body,vec__5936,seq__5937,first__5938,seq__5937__$1,head,more){
return (function (p1__5934_SHARP_){
return fipp.clojure.pretty_method.call(null,p,p1__5934_SHARP_);
});})(vec__5939,fn_name,more__$1,vec__5942,params,body,vec__5936,seq__5937,first__5938,seq__5937__$1,head,more))
,more__$1))));
});
fipp.clojure.pretty_fn_STAR_ = (function fipp$clojure$pretty_fn_STAR_(p,p__5948){
var vec__5949 = p__5948;
var _ = cljs.core.nth.call(null,vec__5949,(0),null);
var params = cljs.core.nth.call(null,vec__5949,(1),null);
var body = cljs.core.nth.call(null,vec__5949,(2),null);
var form = vec__5949;
if(((cljs.core.vector_QMARK_.call(null,params)) && (cljs.core.seq_QMARK_.call(null,body)))){
var vec__5952 = cljs.core.split_with.call(null,((function (vec__5949,_,params,body,form){
return (function (p1__5945_SHARP_){
return cljs.core.not_EQ_.call(null,p1__5945_SHARP_,new cljs.core.Symbol(null,"&","&",-2144855648,null));
});})(vec__5949,_,params,body,form))
,params);
var inits = cljs.core.nth.call(null,vec__5952,(0),null);
var rests = cljs.core.nth.call(null,vec__5952,(1),null);
var params_STAR_ = cljs.core.merge.call(null,((cljs.core._EQ_.call(null,cljs.core.count.call(null,inits),(1)))?cljs.core.PersistentArrayMap.createAsIfByAssoc([cljs.core.first.call(null,inits),new cljs.core.Symbol(null,"%","%",-950237169,null)]):cljs.core.zipmap.call(null,inits,cljs.core.map.call(null,((function (vec__5952,inits,rests,vec__5949,_,params,body,form){
return (function (p1__5946_SHARP_){
return cljs.core.symbol.call(null,["%",cljs.core.str.cljs$core$IFn$_invoke$arity$1((p1__5946_SHARP_ + (1)))].join(''));
});})(vec__5952,inits,rests,vec__5949,_,params,body,form))
,cljs.core.range.call(null)))),((cljs.core.seq.call(null,rests))?cljs.core.PersistentArrayMap.createAsIfByAssoc([cljs.core.second.call(null,rests),new cljs.core.Symbol(null,"%&","%&",-728707069,null)]):null));
var body_STAR_ = clojure.walk.prewalk_replace.call(null,params_STAR_,body);
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"group","group",582596132),"#(",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),(2),cljs.core.interpose.call(null,new cljs.core.Keyword(null,"line","line",212345235),cljs.core.map.call(null,((function (vec__5952,inits,rests,params_STAR_,body_STAR_,vec__5949,_,params,body,form){
return (function (p1__5947_SHARP_){
return fipp.visit.visit.call(null,p,p1__5947_SHARP_);
});})(vec__5952,inits,rests,params_STAR_,body_STAR_,vec__5949,_,params,body,form))
,body_STAR_))], null),")"], null);
} else {
return fipp.clojure.pretty_fn.call(null,p,form);
}
});
fipp.clojure.pretty_libspec = (function fipp$clojure$pretty_libspec(p,p__5956){
var vec__5957 = p__5956;
var seq__5958 = cljs.core.seq.call(null,vec__5957);
var first__5959 = cljs.core.first.call(null,seq__5958);
var seq__5958__$1 = cljs.core.next.call(null,seq__5958);
var head = first__5959;
var clauses = seq__5958__$1;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),cljs.core.interpose.call(null,new cljs.core.Keyword(null,"line","line",212345235),cljs.core.map.call(null,((function (vec__5957,seq__5958,first__5959,seq__5958__$1,head,clauses){
return (function (p1__5955_SHARP_){
return fipp.visit.visit.call(null,p,p1__5955_SHARP_);
});})(vec__5957,seq__5958,first__5959,seq__5958__$1,head,clauses))
,clauses))], null));
});
fipp.clojure.pretty_ns = (function fipp$clojure$pretty_ns(p,p__5961){
var vec__5962 = p__5961;
var seq__5963 = cljs.core.seq.call(null,vec__5962);
var first__5964 = cljs.core.first.call(null,seq__5963);
var seq__5963__$1 = cljs.core.next.call(null,seq__5963);
var head = first__5964;
var first__5964__$1 = cljs.core.first.call(null,seq__5963__$1);
var seq__5963__$2 = cljs.core.next.call(null,seq__5963__$1);
var ns_sym = first__5964__$1;
var more = seq__5963__$2;
var vec__5965 = fipp.clojure.maybe_a.call(null,cljs.core.string_QMARK_,more);
var docstring = cljs.core.nth.call(null,vec__5965,(0),null);
var more__$1 = cljs.core.nth.call(null,vec__5965,(1),null);
var vec__5968 = fipp.clojure.maybe_a.call(null,cljs.core.map_QMARK_,more__$1);
var attr_map = cljs.core.nth.call(null,vec__5968,(0),null);
var specs = cljs.core.nth.call(null,vec__5968,(1),null);
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",fipp.visit.visit.call(null,p,ns_sym),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.concat.call(null,(cljs.core.truth_(docstring)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,docstring)], null):null),(cljs.core.truth_(attr_map)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [fipp.visit.visit.call(null,p,attr_map)], null):null),cljs.core.map.call(null,((function (vec__5965,docstring,more__$1,vec__5968,attr_map,specs,vec__5962,seq__5963,first__5964,seq__5963__$1,head,first__5964__$1,seq__5963__$2,ns_sym,more){
return (function (p1__5960_SHARP_){
return fipp.clojure.pretty_libspec.call(null,p,p1__5960_SHARP_);
});})(vec__5965,docstring,more__$1,vec__5968,attr_map,specs,vec__5962,seq__5963,first__5964,seq__5963__$1,head,first__5964__$1,seq__5963__$2,ns_sym,more))
,specs))));
});
fipp.clojure.pretty_quote = (function fipp$clojure$pretty_quote(p,p__5971){
var vec__5972 = p__5971;
var macro = cljs.core.nth.call(null,vec__5972,(0),null);
var arg = cljs.core.nth.call(null,vec__5972,(1),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),(function (){var G__5975 = cljs.core.keyword.call(null,cljs.core.name.call(null,macro));
var G__5975__$1 = (((G__5975 instanceof cljs.core.Keyword))?G__5975.fqn:null);
switch (G__5975__$1) {
case "deref":
return "@";

break;
case "quote":
return "'";

break;
case "unquote":
return "~";

break;
case "var":
return "#'";

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__5975__$1)].join('')));

}
})(),fipp.visit.visit.call(null,p,arg)], null);
});
fipp.clojure.pretty_bindings = (function fipp$clojure$pretty_bindings(p,bvec){
var kvps = (function (){var iter__4523__auto__ = (function fipp$clojure$pretty_bindings_$_iter__5977(s__5978){
return (new cljs.core.LazySeq(null,(function (){
var s__5978__$1 = s__5978;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__5978__$1);
if(temp__4657__auto__){
var s__5978__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__5978__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__5978__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__5980 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__5979 = (0);
while(true){
if((i__5979 < size__4522__auto__)){
var vec__5981 = cljs.core._nth.call(null,c__4521__auto__,i__5979);
var k = cljs.core.nth.call(null,vec__5981,(0),null);
var v = cljs.core.nth.call(null,vec__5981,(1),null);
cljs.core.chunk_append.call(null,b__5980,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),fipp.visit.visit.call(null,p,k)," ",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),fipp.visit.visit.call(null,p,v)], null)], null));

var G__5987 = (i__5979 + (1));
i__5979 = G__5987;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__5980),fipp$clojure$pretty_bindings_$_iter__5977.call(null,cljs.core.chunk_rest.call(null,s__5978__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__5980),null);
}
} else {
var vec__5984 = cljs.core.first.call(null,s__5978__$2);
var k = cljs.core.nth.call(null,vec__5984,(0),null);
var v = cljs.core.nth.call(null,vec__5984,(1),null);
return cljs.core.cons.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),fipp.visit.visit.call(null,p,k)," ",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),fipp.visit.visit.call(null,p,v)], null)], null),fipp$clojure$pretty_bindings_$_iter__5977.call(null,cljs.core.rest.call(null,s__5978__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__4523__auto__.call(null,cljs.core.partition.call(null,(2),bvec));
})();
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"group","group",582596132),"[",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),cljs.core.interpose.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"line","line",212345235),", "], null),kvps)], null),"]"], null);
});
fipp.clojure.pretty_let = (function fipp$clojure$pretty_let(p,p__5989){
var vec__5990 = p__5989;
var seq__5991 = cljs.core.seq.call(null,vec__5990);
var first__5992 = cljs.core.first.call(null,seq__5991);
var seq__5991__$1 = cljs.core.next.call(null,seq__5991);
var head = first__5992;
var first__5992__$1 = cljs.core.first.call(null,seq__5991__$1);
var seq__5991__$2 = cljs.core.next.call(null,seq__5991__$1);
var bvec = first__5992__$1;
var body = seq__5991__$2;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",fipp.clojure.pretty_bindings.call(null,p,bvec),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.block.call(null,cljs.core.map.call(null,((function (vec__5990,seq__5991,first__5992,seq__5991__$1,head,first__5992__$1,seq__5991__$2,bvec,body){
return (function (p1__5988_SHARP_){
return fipp.visit.visit.call(null,p,p1__5988_SHARP_);
});})(vec__5990,seq__5991,first__5992,seq__5991__$1,head,first__5992__$1,seq__5991__$2,bvec,body))
,body)));
});
fipp.clojure.pretty_impls = (function fipp$clojure$pretty_impls(p,opts_PLUS_specs){
return fipp.clojure.block.call(null,cljs.core.map.call(null,(function (p1__5993_SHARP_){
return fipp.visit.visit.call(null,p,p1__5993_SHARP_);
}),opts_PLUS_specs));
});
fipp.clojure.pretty_type = (function fipp$clojure$pretty_type(p,p__5994){
var vec__5995 = p__5994;
var seq__5996 = cljs.core.seq.call(null,vec__5995);
var first__5997 = cljs.core.first.call(null,seq__5996);
var seq__5996__$1 = cljs.core.next.call(null,seq__5996);
var head = first__5997;
var first__5997__$1 = cljs.core.first.call(null,seq__5996__$1);
var seq__5996__$2 = cljs.core.next.call(null,seq__5996__$1);
var fields = first__5997__$1;
var opts_PLUS_specs = seq__5996__$2;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head)," ",fipp.visit.visit.call(null,p,fields),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.pretty_impls.call(null,p,opts_PLUS_specs));
});
fipp.clojure.pretty_reify = (function fipp$clojure$pretty_reify(p,p__5998){
var vec__5999 = p__5998;
var seq__6000 = cljs.core.seq.call(null,vec__5999);
var first__6001 = cljs.core.first.call(null,seq__6000);
var seq__6000__$1 = cljs.core.next.call(null,seq__6000);
var head = first__6001;
var opts_PLUS_specs = seq__6000__$1;
return fipp.clojure.list_group.call(null,fipp.visit.visit.call(null,p,head),new cljs.core.Keyword(null,"line","line",212345235),fipp.clojure.pretty_impls.call(null,p,opts_PLUS_specs));
});
fipp.clojure.build_symbol_map = (function fipp$clojure$build_symbol_map(dispatch){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__4523__auto__ = (function fipp$clojure$build_symbol_map_$_iter__6002(s__6003){
return (new cljs.core.LazySeq(null,(function (){
var s__6003__$1 = s__6003;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__6003__$1);
if(temp__4657__auto__){
var xs__5205__auto__ = temp__4657__auto__;
var vec__6010 = cljs.core.first.call(null,xs__5205__auto__);
var pretty_fn = cljs.core.nth.call(null,vec__6010,(0),null);
var syms = cljs.core.nth.call(null,vec__6010,(1),null);
var iterys__4519__auto__ = ((function (s__6003__$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__){
return (function fipp$clojure$build_symbol_map_$_iter__6002_$_iter__6004(s__6005){
return (new cljs.core.LazySeq(null,((function (s__6003__$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__){
return (function (){
var s__6005__$1 = s__6005;
while(true){
var temp__4657__auto____$1 = cljs.core.seq.call(null,s__6005__$1);
if(temp__4657__auto____$1){
var xs__5205__auto____$1 = temp__4657__auto____$1;
var sym = cljs.core.first.call(null,xs__5205__auto____$1);
var iterys__4519__auto__ = ((function (s__6005__$1,s__6003__$1,sym,xs__5205__auto____$1,temp__4657__auto____$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__){
return (function fipp$clojure$build_symbol_map_$_iter__6002_$_iter__6004_$_iter__6006(s__6007){
return (new cljs.core.LazySeq(null,((function (s__6005__$1,s__6003__$1,sym,xs__5205__auto____$1,temp__4657__auto____$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__){
return (function (){
var s__6007__$1 = s__6007;
while(true){
var temp__4657__auto____$2 = cljs.core.seq.call(null,s__6007__$1);
if(temp__4657__auto____$2){
var s__6007__$2 = temp__4657__auto____$2;
if(cljs.core.chunked_seq_QMARK_.call(null,s__6007__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__6007__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__6009 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__6008 = (0);
while(true){
if((i__6008 < size__4522__auto__)){
var sym__$1 = cljs.core._nth.call(null,c__4521__auto__,i__6008);
cljs.core.chunk_append.call(null,b__6009,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [sym__$1,pretty_fn], null));

var G__6013 = (i__6008 + (1));
i__6008 = G__6013;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__6009),fipp$clojure$build_symbol_map_$_iter__6002_$_iter__6004_$_iter__6006.call(null,cljs.core.chunk_rest.call(null,s__6007__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__6009),null);
}
} else {
var sym__$1 = cljs.core.first.call(null,s__6007__$2);
return cljs.core.cons.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [sym__$1,pretty_fn], null),fipp$clojure$build_symbol_map_$_iter__6002_$_iter__6004_$_iter__6006.call(null,cljs.core.rest.call(null,s__6007__$2)));
}
} else {
return null;
}
break;
}
});})(s__6005__$1,s__6003__$1,sym,xs__5205__auto____$1,temp__4657__auto____$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__))
,null,null));
});})(s__6005__$1,s__6003__$1,sym,xs__5205__auto____$1,temp__4657__auto____$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__))
;
var fs__4520__auto__ = cljs.core.seq.call(null,iterys__4519__auto__.call(null,cljs.core.cons.call(null,sym,((cljs.core.special_symbol_QMARK_.call(null,sym))?null:new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.symbol.call(null,"clojure.core",cljs.core.name.call(null,sym)),cljs.core.symbol.call(null,"cljs.core",cljs.core.name.call(null,sym))], null)))));
if(fs__4520__auto__){
return cljs.core.concat.call(null,fs__4520__auto__,fipp$clojure$build_symbol_map_$_iter__6002_$_iter__6004.call(null,cljs.core.rest.call(null,s__6005__$1)));
} else {
var G__6014 = cljs.core.rest.call(null,s__6005__$1);
s__6005__$1 = G__6014;
continue;
}
} else {
return null;
}
break;
}
});})(s__6003__$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__))
,null,null));
});})(s__6003__$1,vec__6010,pretty_fn,syms,xs__5205__auto__,temp__4657__auto__))
;
var fs__4520__auto__ = cljs.core.seq.call(null,iterys__4519__auto__.call(null,syms));
if(fs__4520__auto__){
return cljs.core.concat.call(null,fs__4520__auto__,fipp$clojure$build_symbol_map_$_iter__6002.call(null,cljs.core.rest.call(null,s__6003__$1)));
} else {
var G__6015 = cljs.core.rest.call(null,s__6003__$1);
s__6003__$1 = G__6015;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__4523__auto__.call(null,dispatch);
})());
});
fipp.clojure.default_symbols = fipp.clojure.build_symbol_map.call(null,cljs.core.PersistentHashMap.fromArrays([fipp.clojure.pretty_fn_STAR_,fipp.clojure.pretty_condp,fipp.clojure.pretty_quote,fipp.clojure.pretty_cond,fipp.clojure.pretty_fn,fipp.clojure.pretty_arrow,fipp.clojure.pretty_reify,fipp.clojure.pretty_let,fipp.clojure.pretty_type,fipp.clojure.pretty_if,fipp.clojure.pretty_defn,fipp.clojure.pretty_ns,fipp.clojure.pretty_case],[new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"fn*","fn*",-752876845,null)], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"condp","condp",1054325175,null)], null),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"deref","deref",1494944732,null),new cljs.core.Symbol(null,"quote","quote",1377916282,null),new cljs.core.Symbol(null,"unquote","unquote",-1004694737,null),new cljs.core.Symbol(null,"var","var",870848730,null)], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cond","cond",1606708055,null)], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"fn","fn",465265323,null)], null),new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,".",".",1975675962,null),new cljs.core.Symbol(null,"..","..",-300507420,null),new cljs.core.Symbol(null,"->","->",-2139605430,null),new cljs.core.Symbol(null,"->>","->>",-1874332161,null),new cljs.core.Symbol(null,"and","and",668631710,null),new cljs.core.Symbol(null,"doto","doto",1252536074,null),new cljs.core.Symbol(null,"or","or",1876275696,null),new cljs.core.Symbol(null,"some->","some->",-1011172200,null),new cljs.core.Symbol(null,"some->>","some->>",-1499987794,null)], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"reify","reify",1885539699,null)], null),new cljs.core.PersistentVector(null, 16, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"binding","binding",-2114503176,null),new cljs.core.Symbol(null,"doseq","doseq",221164135,null),new cljs.core.Symbol(null,"dotimes","dotimes",-818708397,null),new cljs.core.Symbol(null,"for","for",316745208,null),new cljs.core.Symbol(null,"if-let","if-let",1803593690,null),new cljs.core.Symbol(null,"if-some","if-some",1960677609,null),new cljs.core.Symbol(null,"let","let",358118826,null),new cljs.core.Symbol(null,"let*","let*",1920721458,null),new cljs.core.Symbol(null,"loop","loop",1244978678,null),new cljs.core.Symbol(null,"loop*","loop*",615029416,null),new cljs.core.Symbol(null,"when-first","when-first",821699168,null),new cljs.core.Symbol(null,"when-let","when-let",-1383043480,null),new cljs.core.Symbol(null,"when-some","when-some",1700415903,null),new cljs.core.Symbol(null,"with-local-vars","with-local-vars",837642072,null),new cljs.core.Symbol(null,"with-open","with-open",172119667,null),new cljs.core.Symbol(null,"with-redefs","with-redefs",-1143728263,null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"deftype","deftype",1980826088,null),new cljs.core.Symbol(null,"defrecord","defrecord",273038109,null)], null),new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"def","def",597100991,null),new cljs.core.Symbol(null,"defonce","defonce",-1681484013,null),new cljs.core.Symbol(null,"if","if",1181717262,null),new cljs.core.Symbol(null,"if-not","if-not",-265415609,null),new cljs.core.Symbol(null,"when","when",1064114221,null),new cljs.core.Symbol(null,"when-not","when-not",-1223136340,null)], null),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"defmacro","defmacro",2054157304,null),new cljs.core.Symbol(null,"defmulti","defmulti",1936112154,null),new cljs.core.Symbol(null,"defn","defn",-126010802,null),new cljs.core.Symbol(null,"defn-","defn-",1097765044,null)], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ns","ns",2082130287,null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"case","case",-1510733573,null),new cljs.core.Symbol(null,"cond->","cond->",561741875,null),new cljs.core.Symbol(null,"cond->>","cond->>",348844960,null)], null)]));
fipp.clojure.pprint = (function fipp$clojure$pprint(var_args){
var G__6017 = arguments.length;
switch (G__6017) {
case 1:
return fipp.clojure.pprint.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return fipp.clojure.pprint.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

fipp.clojure.pprint.cljs$core$IFn$_invoke$arity$1 = (function (x){
return fipp.clojure.pprint.call(null,x,cljs.core.PersistentArrayMap.EMPTY);
});

fipp.clojure.pprint.cljs$core$IFn$_invoke$arity$2 = (function (x,options){
return fipp.edn.pprint.call(null,x,cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"symbols","symbols",1211743),fipp.clojure.default_symbols], null),options));
});

fipp.clojure.pprint.cljs$lang$maxFixedArity = 2;


//# sourceMappingURL=clojure.js.map
