// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('schema.test');
goog.require('cljs.core');
goog.require('schema.core');
/**
 * A fixture for tests: put
 * (use-fixtures :once schema.test/validate-schemas)
 * in your test file to turn on schema validation globally during all test executions.
 */
schema.test.validate_schemas = (function schema$test$validate_schemas(fn_test){
var body__2220__auto__ = (function (){var ufv7466 = schema.utils.use_fn_validation;
var output_schema7465 = schema.core.Any;
var input_schema7467 = cljs.core.PersistentVector.EMPTY;
var input_checker7468 = (new cljs.core.Delay(((function (ufv7466,output_schema7465,input_schema7467){
return (function (){
return schema.core.checker.call(null,input_schema7467);
});})(ufv7466,output_schema7465,input_schema7467))
,null));
var output_checker7469 = (new cljs.core.Delay(((function (ufv7466,output_schema7465,input_schema7467,input_checker7468){
return (function (){
return schema.core.checker.call(null,output_schema7465);
});})(ufv7466,output_schema7465,input_schema7467,input_checker7468))
,null));
var f__2240__auto__ = cljs.core.with_meta(((function (ufv7466,output_schema7465,input_schema7467,input_checker7468,output_checker7469){
return (function schema$test$validate_schemas_$_fn7464(){
var validate__789__auto__ = cljs.core.deref.call(null,ufv7466);
if(cljs.core.truth_(validate__789__auto__)){
var args__790__auto___7470 = cljs.core.PersistentVector.EMPTY;
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"input","input",556931961),cljs.core.with_meta(new cljs.core.Symbol(null,"fn7464","fn7464",203254543,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null)], null)),input_schema7467,cljs.core.deref.call(null,input_checker7468),args__790__auto___7470);
} else {
var temp__4657__auto___7471 = cljs.core.deref.call(null,input_checker7468).call(null,args__790__auto___7470);
if(cljs.core.truth_(temp__4657__auto___7471)){
var error__791__auto___7472 = temp__4657__auto___7471;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Input to %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"fn7464","fn7464",203254543,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null)], null)),cljs.core.pr_str.call(null,error__791__auto___7472)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),input_schema7467,new cljs.core.Keyword(null,"value","value",305978217),args__790__auto___7470,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___7472], null));
} else {
}
}
} else {
}

var o__792__auto__ = (function (){while(true){
return fn_test.call(null);
break;
}
})();
if(cljs.core.truth_(validate__789__auto__)){
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"output","output",-1105869043),cljs.core.with_meta(new cljs.core.Symbol(null,"fn7464","fn7464",203254543,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null)], null)),output_schema7465,cljs.core.deref.call(null,output_checker7469),o__792__auto__);
} else {
var temp__4657__auto___7473 = cljs.core.deref.call(null,output_checker7469).call(null,o__792__auto__);
if(cljs.core.truth_(temp__4657__auto___7473)){
var error__791__auto___7474 = temp__4657__auto___7473;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Output of %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"fn7464","fn7464",203254543,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null)], null)),cljs.core.pr_str.call(null,error__791__auto___7474)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),output_schema7465,new cljs.core.Keyword(null,"value","value",305978217),o__792__auto__,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___7474], null));
} else {
}
}
} else {
}

return o__792__auto__;
});})(ufv7466,output_schema7465,input_schema7467,input_checker7468,output_checker7469))
,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),schema.core.__GT_FnSchema.call(null,output_schema7465,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [input_schema7467], null))], null));
return f__2240__auto__;
})();
if(cljs.core.truth_(schema.core.fn_validation_QMARK_.call(null))){
return body__2220__auto__.call(null);
} else {
schema.core.set_fn_validation_BANG_.call(null,true);

try{return body__2220__auto__.call(null);
}finally {schema.core.set_fn_validation_BANG_.call(null,false);
}}
});

//# sourceMappingURL=test.js.map
