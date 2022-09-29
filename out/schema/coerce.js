// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('schema.coerce');
goog.require('cljs.core');
goog.require('cljs.reader');
goog.require('schema.core');
goog.require('schema.spec.core');
goog.require('schema.utils');
goog.require('clojure.string');
/**
 * A Schema for Schemas
 */
schema.coerce.Schema = cljs.core.with_meta.call(null,schema.core.__GT_Protocol.call(null,schema.core.Schema),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"proto-sym","proto-sym",-886371734),new cljs.core.Symbol("s","Schema","s/Schema",-1305723789,null),new cljs.core.Keyword(null,"proto-pred","proto-pred",1885698716),(function (p1__1499__1500__auto__){
if((!((p1__1499__1500__auto__ == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === p1__1499__1500__auto__.schema$core$Schema$)))){
return true;
} else {
if((!p1__1499__1500__auto__.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,schema.core.Schema,p1__1499__1500__auto__);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,schema.core.Schema,p1__1499__1500__auto__);
}
})], null));
/**
 * A function from schema to coercion function, or nil if no special coercion is needed.
 * The returned function is applied to the corresponding data before validation (or walking/
 * coercion of its sub-schemas, if applicable)
 */
schema.coerce.CoercionMatcher = schema.core.make_fn_schema.call(null,schema.core.maybe.call(null,schema.core.make_fn_schema.call(null,schema.core.Any,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,schema.core.Any,new cljs.core.Symbol(null,"arg0","arg0",-1024593414,null))], null)], null))),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,schema.coerce.Schema,new cljs.core.Symbol(null,"arg0","arg0",-1024593414,null))], null)], null));
var ufv2948_2955 = schema.utils.use_fn_validation;
var output_schema2947_2956 = schema.core.Any;
var input_schema2949_2957 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,schema.core.Any,cljs.core.with_meta(new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null)], null))),schema.core.one.call(null,schema.coerce.CoercionMatcher,cljs.core.with_meta(new cljs.core.Symbol(null,"coercion-matcher","coercion-matcher",-1929420453,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null)], null)))], null);
var input_checker2950_2958 = (new cljs.core.Delay(((function (ufv2948_2955,output_schema2947_2956,input_schema2949_2957){
return (function (){
return schema.core.checker.call(null,input_schema2949_2957);
});})(ufv2948_2955,output_schema2947_2956,input_schema2949_2957))
,null));
var output_checker2951_2959 = (new cljs.core.Delay(((function (ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958){
return (function (){
return schema.core.checker.call(null,output_schema2947_2956);
});})(ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958))
,null));
var ret__2250__auto___2960 = /**
 * Inputs: [schema coercion-matcher :- CoercionMatcher]
 * 
 *   Produce a function that simultaneously coerces and validates a datum.  Returns
 * a coerced value, or a schema.utils.ErrorContainer describing the error.
 */
schema.coerce.coercer = ((function (ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959){
return (function schema$coerce$coercer(G__2952,G__2953){
var validate__789__auto__ = cljs.core.deref.call(null,ufv2948_2955);
if(cljs.core.truth_(validate__789__auto__)){
var args__790__auto___2961 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [G__2952,G__2953], null);
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"input","input",556931961),cljs.core.with_meta(new cljs.core.Symbol(null,"coercer","coercer",-783242414,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Produce a function that simultaneously coerces and validates a datum.  Returns\n   a coerced value, or a schema.utils.ErrorContainer describing the error."], null)),input_schema2949_2957,cljs.core.deref.call(null,input_checker2950_2958),args__790__auto___2961);
} else {
var temp__4657__auto___2962 = cljs.core.deref.call(null,input_checker2950_2958).call(null,args__790__auto___2961);
if(cljs.core.truth_(temp__4657__auto___2962)){
var error__791__auto___2963 = temp__4657__auto___2962;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Input to %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"coercer","coercer",-783242414,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Produce a function that simultaneously coerces and validates a datum.  Returns\n   a coerced value, or a schema.utils.ErrorContainer describing the error."], null)),cljs.core.pr_str.call(null,error__791__auto___2963)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),input_schema2949_2957,new cljs.core.Keyword(null,"value","value",305978217),args__790__auto___2961,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___2963], null));
} else {
}
}
} else {
}

var o__792__auto__ = (function (){var schema__$1 = G__2952;
var coercion_matcher = G__2953;
while(true){
return schema.spec.core.run_checker.call(null,((function (validate__789__auto__,ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959){
return (function (s,params){
var c = schema.spec.core.checker.call(null,schema.core.spec.call(null,s),params);
var temp__4655__auto__ = coercion_matcher.call(null,s);
if(cljs.core.truth_(temp__4655__auto__)){
var coercer = temp__4655__auto__;
return ((function (coercer,temp__4655__auto__,c,validate__789__auto__,ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959){
return (function (x){
try{var v = coercer.call(null,x);
if(schema.utils.error_QMARK_.call(null,v)){
return v;
} else {
return c.call(null,v);
}
}catch (e2954){if((e2954 instanceof Object)){
var t = e2954;
return schema.utils.error.call(null,schema.utils.make_ValidationError.call(null,s,x,(new cljs.core.Delay(((function (t,coercer,temp__4655__auto__,c,validate__789__auto__,ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959){
return (function (){
return t;
});})(t,coercer,temp__4655__auto__,c,validate__789__auto__,ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959))
,null)),null));
} else {
throw e2954;

}
}});
;})(coercer,temp__4655__auto__,c,validate__789__auto__,ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959))
} else {
return c;
}
});})(validate__789__auto__,ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959))
,true,schema__$1);
break;
}
})();
if(cljs.core.truth_(validate__789__auto__)){
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"output","output",-1105869043),cljs.core.with_meta(new cljs.core.Symbol(null,"coercer","coercer",-783242414,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Produce a function that simultaneously coerces and validates a datum.  Returns\n   a coerced value, or a schema.utils.ErrorContainer describing the error."], null)),output_schema2947_2956,cljs.core.deref.call(null,output_checker2951_2959),o__792__auto__);
} else {
var temp__4657__auto___2964 = cljs.core.deref.call(null,output_checker2951_2959).call(null,o__792__auto__);
if(cljs.core.truth_(temp__4657__auto___2964)){
var error__791__auto___2965 = temp__4657__auto___2964;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Output of %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"coercer","coercer",-783242414,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Produce a function that simultaneously coerces and validates a datum.  Returns\n   a coerced value, or a schema.utils.ErrorContainer describing the error."], null)),cljs.core.pr_str.call(null,error__791__auto___2965)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),output_schema2947_2956,new cljs.core.Keyword(null,"value","value",305978217),o__792__auto__,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___2965], null));
} else {
}
}
} else {
}

return o__792__auto__;
});})(ufv2948_2955,output_schema2947_2956,input_schema2949_2957,input_checker2950_2958,output_checker2951_2959))
;
schema.utils.declare_class_schema_BANG_.call(null,schema.utils.fn_schema_bearer.call(null,schema.coerce.coercer),schema.core.__GT_FnSchema.call(null,output_schema2947_2956,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [input_schema2949_2957], null)));

var ufv2967_2973 = schema.utils.use_fn_validation;
var output_schema2966_2974 = schema.core.Any;
var input_schema2968_2975 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,schema.core.Any,cljs.core.with_meta(new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null)], null))),schema.core.one.call(null,schema.coerce.CoercionMatcher,cljs.core.with_meta(new cljs.core.Symbol(null,"coercion-matcher","coercion-matcher",-1929420453,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null)], null)))], null);
var input_checker2969_2976 = (new cljs.core.Delay(((function (ufv2967_2973,output_schema2966_2974,input_schema2968_2975){
return (function (){
return schema.core.checker.call(null,input_schema2968_2975);
});})(ufv2967_2973,output_schema2966_2974,input_schema2968_2975))
,null));
var output_checker2970_2977 = (new cljs.core.Delay(((function (ufv2967_2973,output_schema2966_2974,input_schema2968_2975,input_checker2969_2976){
return (function (){
return schema.core.checker.call(null,output_schema2966_2974);
});})(ufv2967_2973,output_schema2966_2974,input_schema2968_2975,input_checker2969_2976))
,null));
var ret__2250__auto___2978 = /**
 * Inputs: [schema coercion-matcher :- CoercionMatcher]
 * 
 *   Like `coercer`, but is guaranteed to return a value that satisfies schema (or throw).
 */
schema.coerce.coercer_BANG_ = ((function (ufv2967_2973,output_schema2966_2974,input_schema2968_2975,input_checker2969_2976,output_checker2970_2977){
return (function schema$coerce$coercer_BANG_(G__2971,G__2972){
var validate__789__auto__ = cljs.core.deref.call(null,ufv2967_2973);
if(cljs.core.truth_(validate__789__auto__)){
var args__790__auto___2979 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [G__2971,G__2972], null);
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"input","input",556931961),cljs.core.with_meta(new cljs.core.Symbol(null,"coercer!","coercer!",1324120992,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like `coercer`, but is guaranteed to return a value that satisfies schema (or throw)."], null)),input_schema2968_2975,cljs.core.deref.call(null,input_checker2969_2976),args__790__auto___2979);
} else {
var temp__4657__auto___2980 = cljs.core.deref.call(null,input_checker2969_2976).call(null,args__790__auto___2979);
if(cljs.core.truth_(temp__4657__auto___2980)){
var error__791__auto___2981 = temp__4657__auto___2980;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Input to %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"coercer!","coercer!",1324120992,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like `coercer`, but is guaranteed to return a value that satisfies schema (or throw)."], null)),cljs.core.pr_str.call(null,error__791__auto___2981)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),input_schema2968_2975,new cljs.core.Keyword(null,"value","value",305978217),args__790__auto___2979,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___2981], null));
} else {
}
}
} else {
}

var o__792__auto__ = (function (){var schema__$1 = G__2971;
var coercion_matcher = G__2972;
while(true){
var c = schema.coerce.coercer.call(null,schema__$1,coercion_matcher);
return ((function (c,validate__789__auto__,ufv2967_2973,output_schema2966_2974,input_schema2968_2975,input_checker2969_2976,output_checker2970_2977){
return (function (value){
var coerced = c.call(null,value);
var temp__4657__auto___2982 = schema.utils.error_val.call(null,coerced);
if(cljs.core.truth_(temp__4657__auto___2982)){
var error_2983 = temp__4657__auto___2982;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Value cannot be coerced to match schema: %s",cljs.core.pr_str.call(null,error_2983)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),schema__$1,new cljs.core.Keyword(null,"value","value",305978217),value,new cljs.core.Keyword(null,"error","error",-978969032),error_2983], null));
} else {
}

return coerced;
});
;})(c,validate__789__auto__,ufv2967_2973,output_schema2966_2974,input_schema2968_2975,input_checker2969_2976,output_checker2970_2977))
break;
}
})();
if(cljs.core.truth_(validate__789__auto__)){
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"output","output",-1105869043),cljs.core.with_meta(new cljs.core.Symbol(null,"coercer!","coercer!",1324120992,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like `coercer`, but is guaranteed to return a value that satisfies schema (or throw)."], null)),output_schema2966_2974,cljs.core.deref.call(null,output_checker2970_2977),o__792__auto__);
} else {
var temp__4657__auto___2984 = cljs.core.deref.call(null,output_checker2970_2977).call(null,o__792__auto__);
if(cljs.core.truth_(temp__4657__auto___2984)){
var error__791__auto___2985 = temp__4657__auto___2984;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Output of %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"coercer!","coercer!",1324120992,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like `coercer`, but is guaranteed to return a value that satisfies schema (or throw)."], null)),cljs.core.pr_str.call(null,error__791__auto___2985)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),output_schema2966_2974,new cljs.core.Keyword(null,"value","value",305978217),o__792__auto__,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___2985], null));
} else {
}
}
} else {
}

return o__792__auto__;
});})(ufv2967_2973,output_schema2966_2974,input_schema2968_2975,input_checker2969_2976,output_checker2970_2977))
;
schema.utils.declare_class_schema_BANG_.call(null,schema.utils.fn_schema_bearer.call(null,schema.coerce.coercer_BANG_),schema.core.__GT_FnSchema.call(null,output_schema2966_2974,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [input_schema2968_2975], null)));

var ufv2988_2993 = schema.utils.use_fn_validation;
var output_schema2987_2994 = schema.coerce.CoercionMatcher;
var input_schema2989_2995 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.coerce.CoercionMatcher], null),cljs.core.with_meta(new cljs.core.Symbol(null,"matchers","matchers",-39860883,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null)], null)], null)))], null);
var input_checker2990_2996 = (new cljs.core.Delay(((function (ufv2988_2993,output_schema2987_2994,input_schema2989_2995){
return (function (){
return schema.core.checker.call(null,input_schema2989_2995);
});})(ufv2988_2993,output_schema2987_2994,input_schema2989_2995))
,null));
var output_checker2991_2997 = (new cljs.core.Delay(((function (ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996){
return (function (){
return schema.core.checker.call(null,output_schema2987_2994);
});})(ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996))
,null));
var ret__2250__auto___2998 = /**
 * Inputs: [matchers :- [CoercionMatcher]]
 *   Returns: CoercionMatcher
 * 
 *   A matcher that takes the first match from matchers.
 */
schema.coerce.first_matcher = ((function (ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996,output_checker2991_2997){
return (function schema$coerce$first_matcher(G__2992){
var validate__789__auto__ = cljs.core.deref.call(null,ufv2988_2993);
if(cljs.core.truth_(validate__789__auto__)){
var args__790__auto___2999 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [G__2992], null);
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"input","input",556931961),cljs.core.with_meta(new cljs.core.Symbol(null,"first-matcher","first-matcher",-2060940642,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A matcher that takes the first match from matchers."], null)),input_schema2989_2995,cljs.core.deref.call(null,input_checker2990_2996),args__790__auto___2999);
} else {
var temp__4657__auto___3000 = cljs.core.deref.call(null,input_checker2990_2996).call(null,args__790__auto___2999);
if(cljs.core.truth_(temp__4657__auto___3000)){
var error__791__auto___3001 = temp__4657__auto___3000;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Input to %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"first-matcher","first-matcher",-2060940642,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A matcher that takes the first match from matchers."], null)),cljs.core.pr_str.call(null,error__791__auto___3001)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),input_schema2989_2995,new cljs.core.Keyword(null,"value","value",305978217),args__790__auto___2999,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___3001], null));
} else {
}
}
} else {
}

var o__792__auto__ = (function (){var matchers = G__2992;
while(true){
return ((function (validate__789__auto__,ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996,output_checker2991_2997){
return (function (schema__$1){
return cljs.core.first.call(null,cljs.core.keep.call(null,((function (validate__789__auto__,ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996,output_checker2991_2997){
return (function (p1__2986_SHARP_){
return p1__2986_SHARP_.call(null,schema__$1);
});})(validate__789__auto__,ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996,output_checker2991_2997))
,matchers));
});
;})(validate__789__auto__,ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996,output_checker2991_2997))
break;
}
})();
if(cljs.core.truth_(validate__789__auto__)){
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"output","output",-1105869043),cljs.core.with_meta(new cljs.core.Symbol(null,"first-matcher","first-matcher",-2060940642,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A matcher that takes the first match from matchers."], null)),output_schema2987_2994,cljs.core.deref.call(null,output_checker2991_2997),o__792__auto__);
} else {
var temp__4657__auto___3002 = cljs.core.deref.call(null,output_checker2991_2997).call(null,o__792__auto__);
if(cljs.core.truth_(temp__4657__auto___3002)){
var error__791__auto___3003 = temp__4657__auto___3002;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Output of %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"first-matcher","first-matcher",-2060940642,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol(null,"CoercionMatcher","CoercionMatcher",1341105319,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A matcher that takes the first match from matchers."], null)),cljs.core.pr_str.call(null,error__791__auto___3003)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),output_schema2987_2994,new cljs.core.Keyword(null,"value","value",305978217),o__792__auto__,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___3003], null));
} else {
}
}
} else {
}

return o__792__auto__;
});})(ufv2988_2993,output_schema2987_2994,input_schema2989_2995,input_checker2990_2996,output_checker2991_2997))
;
schema.utils.declare_class_schema_BANG_.call(null,schema.utils.fn_schema_bearer.call(null,schema.coerce.first_matcher),schema.core.__GT_FnSchema.call(null,output_schema2987_2994,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [input_schema2989_2995], null)));

schema.coerce.string__GT_keyword = (function schema$coerce$string__GT_keyword(s){
if(typeof s === 'string'){
return cljs.core.keyword.call(null,s);
} else {
return s;
}
});
/**
 * returns true for strings that are equal, ignoring case, to the string 'true'
 * (following java.lang.Boolean/parseBoolean semantics)
 */
schema.coerce.string__GT_boolean = (function schema$coerce$string__GT_boolean(s){
if(typeof s === 'string'){
return cljs.core._EQ_.call(null,"true",clojure.string.lower_case.call(null,s));
} else {
return s;
}
});
schema.coerce.keyword_enum_matcher = (function schema$coerce$keyword_enum_matcher(schema__$1){
if((((((schema__$1 instanceof schema.core.EnumSchema)) && (cljs.core.every_QMARK_.call(null,cljs.core.keyword_QMARK_,schema__$1.vs)))) || ((((schema__$1 instanceof schema.core.EqSchema)) && ((schema__$1.v instanceof cljs.core.Keyword)))))){
return schema.coerce.string__GT_keyword;
} else {
return null;
}
});
schema.coerce.set_matcher = (function schema$coerce$set_matcher(schema__$1){
if((schema__$1 instanceof cljs.core.PersistentHashSet)){
return (function (x){
if(cljs.core.sequential_QMARK_.call(null,x)){
return cljs.core.set.call(null,x);
} else {
return x;
}
});
} else {
return null;
}
});
/**
 * Take a single-arg function f, and return a single-arg function that acts as identity
 * if f throws an exception, and like f otherwise.  Useful because coercers are not explicitly
 * guarded for exceptions, and failing to coerce will generally produce a more useful error
 * in this case.
 */
schema.coerce.safe = (function schema$coerce$safe(f){
return (function (x){
try{return f.call(null,x);
}catch (e3004){if((e3004 instanceof Object)){
var e = e3004;
return x;
} else {
throw e3004;

}
}});
});
/**
 * Returns instance of UUID if input is a string.
 * Note: in CLJS, this does not guarantee a specific UUID string representation,
 *       similar to #uuid reader
 */
schema.coerce.string__GT_uuid = (function schema$coerce$string__GT_uuid(p1__3006_SHARP_){
if(typeof p1__3006_SHARP_ === 'string'){
return cljs.core.uuid.call(null,p1__3006_SHARP_);
} else {
return p1__3006_SHARP_;
}
});
schema.coerce._PLUS_json_coercions_PLUS_ = cljs.core.merge.call(null,cljs.core.PersistentArrayMap.createAsIfByAssoc([schema.core.Keyword,schema.coerce.string__GT_keyword,schema.core.Bool,schema.coerce.string__GT_boolean,schema.core.Uuid,schema.coerce.string__GT_uuid]));
/**
 * A matcher that coerces keywords and keyword eq/enums from strings, and longs and doubles
 *   from numbers on the JVM (without losing precision)
 */
schema.coerce.json_coercion_matcher = (function schema$coerce$json_coercion_matcher(schema__$1){
var or__4131__auto__ = schema.coerce._PLUS_json_coercions_PLUS_.call(null,schema__$1);
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
var or__4131__auto____$1 = schema.coerce.keyword_enum_matcher.call(null,schema__$1);
if(cljs.core.truth_(or__4131__auto____$1)){
return or__4131__auto____$1;
} else {
return schema.coerce.set_matcher.call(null,schema__$1);
}
}
});
/**
 * Reads one object from a string. Returns nil when string is nil or empty
 */
schema.coerce.edn_read_string = cljs.reader.read_string;
schema.coerce._PLUS_string_coercions_PLUS_ = cljs.core.merge.call(null,schema.coerce._PLUS_json_coercions_PLUS_,cljs.core.PersistentArrayMap.createAsIfByAssoc([schema.core.Num,schema.coerce.safe.call(null,schema.coerce.edn_read_string),schema.core.Int,schema.coerce.safe.call(null,schema.coerce.edn_read_string)]));
/**
 * A matcher that coerces keywords, keyword eq/enums, s/Num and s/Int,
 *   and long and doubles (JVM only) from strings.
 */
schema.coerce.string_coercion_matcher = (function schema$coerce$string_coercion_matcher(schema__$1){
var or__4131__auto__ = schema.coerce._PLUS_string_coercions_PLUS_.call(null,schema__$1);
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
var or__4131__auto____$1 = schema.coerce.keyword_enum_matcher.call(null,schema__$1);
if(cljs.core.truth_(or__4131__auto____$1)){
return or__4131__auto____$1;
} else {
return schema.coerce.set_matcher.call(null,schema__$1);
}
}
});

//# sourceMappingURL=coerce.js.map
