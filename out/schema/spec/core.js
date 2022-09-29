// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('schema.spec.core');
goog.require('cljs.core');
goog.require('schema.utils');

/**
 * Specs are a common language for Schemas to express their structure.
 * These two use-cases aren't privileged, just the two that are considered core
 * to being a Spec.
 * @interface
 */
schema.spec.core.CoreSpec = function(){};

/**
 * List all subschemas
 */
schema.spec.core.subschemas = (function schema$spec$core$subschemas(this$){
if((((!((this$ == null)))) && ((!((this$.schema$spec$core$CoreSpec$subschemas$arity$1 == null)))))){
return this$.schema$spec$core$CoreSpec$subschemas$arity$1(this$);
} else {
var x__4433__auto__ = (((this$ == null))?null:this$);
var m__4434__auto__ = (schema.spec.core.subschemas[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,this$);
} else {
var m__4431__auto__ = (schema.spec.core.subschemas["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"CoreSpec.subschemas",this$);
}
}
}
});

/**
 * Create a function that takes [data], and either returns a walked version of data
 *   (by default, usually just data), or a utils/ErrorContainer containing value that looks
 *   like the 'bad' parts of data with ValidationErrors at the leaves describing the failures.
 * 
 *   params are: subschema-checker, return-walked?, and cache.
 * 
 *   params is a map specifying:
 *    - subschema-checker - a function for checking subschemas
 *    - returned-walked? - a boolean specifying whether to return a walked version of the data
 *      (otherwise, nil is returned which increases performance)
 *    - cache - a map structure from schema to checker, which speeds up checker creation
 *      when the same subschema appears multiple times, and also facilitates handling
 *      recursive schemas.
 */
schema.spec.core.checker = (function schema$spec$core$checker(this$,params){
if((((!((this$ == null)))) && ((!((this$.schema$spec$core$CoreSpec$checker$arity$2 == null)))))){
return this$.schema$spec$core$CoreSpec$checker$arity$2(this$,params);
} else {
var x__4433__auto__ = (((this$ == null))?null:this$);
var m__4434__auto__ = (schema.spec.core.checker[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,this$,params);
} else {
var m__4431__auto__ = (schema.spec.core.checker["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,this$,params);
} else {
throw cljs.core.missing_protocol.call(null,"CoreSpec.checker",this$);
}
}
}
});

schema.spec.core._PLUS_no_precondition_PLUS_ = (function schema$spec$core$_PLUS_no_precondition_PLUS_(_){
return null;
});
/**
 * Helper for making preconditions.
 * Takes a schema, predicate p, and error function err-f.
 * If the datum passes the predicate, returns nil.
 * Otherwise, returns a validation error with description (err-f datum-description),
 * where datum-description is a (short) printable stand-in for the datum.
 */
schema.spec.core.precondition = (function schema$spec$core$precondition(s,p,err_f){
return (function (x){
var temp__4657__auto__ = (function (){try{if(cljs.core.truth_(p.call(null,x))){
return null;
} else {
return new cljs.core.Symbol(null,"not","not",1044554643,null);
}
}catch (e983){if((e983 instanceof Object)){
var e_SHARP_ = e983;
return new cljs.core.Symbol(null,"throws?","throws?",789734533,null);
} else {
throw e983;

}
}})();
if(cljs.core.truth_(temp__4657__auto__)){
var reason = temp__4657__auto__;
return schema.utils.error.call(null,schema.utils.make_ValidationError.call(null,s,x,(new cljs.core.Delay(((function (reason,temp__4657__auto__){
return (function (){
return err_f.call(null,schema.utils.value_name.call(null,x));
});})(reason,temp__4657__auto__))
,null)),reason));
} else {
return null;
}
});
});
/**
 * A helper to start a checking run, by setting the appropriate params.
 * For examples, see schema.core/checker or schema.coerce/coercer.
 */
schema.spec.core.run_checker = (function schema$spec$core$run_checker(f,return_walked_QMARK_,s){
return f.call(null,s,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"subschema-checker","subschema-checker",1137701360),f,new cljs.core.Keyword(null,"return-walked?","return-walked?",-1684646015),return_walked_QMARK_,new cljs.core.Keyword(null,"cache","cache",-1237023054),cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY)], null));
});
schema.spec.core.with_cache = (function schema$spec$core$with_cache(cache,cache_key,wrap_recursive_delay,result_fn){
var temp__4655__auto__ = cljs.core.deref.call(null,cache).call(null,cache_key);
if(cljs.core.truth_(temp__4655__auto__)){
var w = temp__4655__auto__;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword("schema.spec.core","in-progress","schema.spec.core/in-progress",-1604867615),w)){
return wrap_recursive_delay.call(null,(new cljs.core.Delay(((function (w,temp__4655__auto__){
return (function (){
return cljs.core.deref.call(null,cache).call(null,cache_key);
});})(w,temp__4655__auto__))
,null)));
} else {
return w;
}
} else {
cljs.core.swap_BANG_.call(null,cache,cljs.core.assoc,cache_key,new cljs.core.Keyword("schema.spec.core","in-progress","schema.spec.core/in-progress",-1604867615));

var res = result_fn.call(null);
cljs.core.swap_BANG_.call(null,cache,cljs.core.assoc,cache_key,res);

return res;
}
});
/**
 * Should be called recursively on each subschema in the 'checker' method of a spec.
 * Handles caching and error wrapping behavior.
 */
schema.spec.core.sub_checker = (function schema$spec$core$sub_checker(p__986,p__987){
var map__988 = p__986;
var map__988__$1 = (((((!((map__988 == null))))?(((((map__988.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__988.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__988):map__988);
var schema__$1 = cljs.core.get.call(null,map__988__$1,new cljs.core.Keyword(null,"schema","schema",-1582001791));
var error_wrap = cljs.core.get.call(null,map__988__$1,new cljs.core.Keyword(null,"error-wrap","error-wrap",-1295833514));
var map__989 = p__987;
var map__989__$1 = (((((!((map__989 == null))))?(((((map__989.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__989.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__989):map__989);
var params = map__989__$1;
var subschema_checker = cljs.core.get.call(null,map__989__$1,new cljs.core.Keyword(null,"subschema-checker","subschema-checker",1137701360));
var cache = cljs.core.get.call(null,map__989__$1,new cljs.core.Keyword(null,"cache","cache",-1237023054));
var sub = schema.spec.core.with_cache.call(null,cache,schema__$1,((function (map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache){
return (function (d){
return ((function (map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache){
return (function (x){
return cljs.core.deref.call(null,d).call(null,x);
});
;})(map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache))
});})(map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache))
,((function (map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache){
return (function (){
return subschema_checker.call(null,schema__$1,params);
});})(map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache))
);
if(cljs.core.truth_(error_wrap)){
return ((function (sub,map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache){
return (function (x){
var res = sub.call(null,x);
var temp__4655__auto__ = schema.utils.error_val.call(null,res);
if(cljs.core.truth_(temp__4655__auto__)){
var e = temp__4655__auto__;
return schema.utils.error.call(null,error_wrap.call(null,res));
} else {
return res;
}
});
;})(sub,map__988,map__988__$1,schema__$1,error_wrap,map__989,map__989__$1,params,subschema_checker,cache))
} else {
return sub;
}
});

//# sourceMappingURL=core.js.map
