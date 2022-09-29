// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('schema.core');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('schema.utils');
goog.require('schema.spec.core');
goog.require('schema.spec.leaf');
goog.require('schema.spec.variant');
goog.require('schema.spec.collection');

/**
 * @interface
 */
schema.core.Schema = function(){};

/**
 * A spec is a record of some type that expresses the structure of this schema
 *   in a declarative and/or imperative way.  See schema.spec.* for examples.
 */
schema.core.spec = (function schema$core$spec(this$){
if((((!((this$ == null)))) && ((!((this$.schema$core$Schema$spec$arity$1 == null)))))){
return this$.schema$core$Schema$spec$arity$1(this$);
} else {
var x__4433__auto__ = (((this$ == null))?null:this$);
var m__4434__auto__ = (schema.core.spec[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,this$);
} else {
var m__4431__auto__ = (schema.core.spec["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"Schema.spec",this$);
}
}
}
});

/**
 * Expand this schema to a human-readable format suitable for pprinting,
 *   also expanding class schematas at the leaves.  Example:
 * 
 *   user> (s/explain {:a s/Keyword :b [s/Int]} )
 *   {:a Keyword, :b [Int]}
 */
schema.core.explain = (function schema$core$explain(this$){
if((((!((this$ == null)))) && ((!((this$.schema$core$Schema$explain$arity$1 == null)))))){
return this$.schema$core$Schema$explain$arity$1(this$);
} else {
var x__4433__auto__ = (((this$ == null))?null:this$);
var m__4434__auto__ = (schema.core.explain[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,this$);
} else {
var m__4431__auto__ = (schema.core.explain["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"Schema.explain",this$);
}
}
}
});

/**
 * Compile an efficient checker for schema, which returns nil for valid values and
 * error descriptions otherwise.
 */
schema.core.checker = (function schema$core$checker(schema__$1){
return cljs.core.comp.call(null,schema.utils.error_val,schema.spec.core.run_checker.call(null,(function (s,params){
return schema.spec.core.checker.call(null,schema.core.spec.call(null,s),params);
}),false,schema__$1));
});
/**
 * Return nil if x matches schema; otherwise, returns a value that looks like the
 * 'bad' parts of x with ValidationErrors at the leaves describing the failures.
 * 
 * If you will be checking many datums, it is much more efficient to create
 * a 'checker' once and call it on each of them.
 */
schema.core.check = (function schema$core$check(schema__$1,x){
return schema.core.checker.call(null,schema__$1).call(null,x);
});
/**
 * Compile an efficient validator for schema.
 */
schema.core.validator = (function schema$core$validator(schema__$1){
var c = schema.core.checker.call(null,schema__$1);
return ((function (c){
return (function (value){
var temp__4657__auto___2377 = c.call(null,value);
if(cljs.core.truth_(temp__4657__auto___2377)){
var error_2378 = temp__4657__auto___2377;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Value does not match schema: %s",cljs.core.pr_str.call(null,error_2378)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),schema__$1,new cljs.core.Keyword(null,"value","value",305978217),value,new cljs.core.Keyword(null,"error","error",-978969032),error_2378], null));
} else {
}

return value;
});
;})(c))
});
/**
 * Throw an exception if value does not satisfy schema; otherwise, return value.
 * If you will be validating many datums, it is much more efficient to create
 * a 'validator' once and call it on each of them.
 */
schema.core.validate = (function schema$core$validate(schema__$1,value){
return schema.core.validator.call(null,schema__$1).call(null,value);
});
schema.core.instance_precondition = (function schema$core$instance_precondition(s,klass){
return schema.spec.core.precondition.call(null,s,(function (p1__2380_SHARP_){
var and__4120__auto__ = (!((p1__2380_SHARP_ == null)));
if(and__4120__auto__){
var or__4131__auto__ = (klass === p1__2380_SHARP_.constructor);
if(or__4131__auto__){
return or__4131__auto__;
} else {
return p1__2380_SHARP_ instanceof klass;
}
} else {
return and__4120__auto__;
}
}),(function (p1__2381_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"instance?","instance?",1075939923,null),(new cljs.core.List(null,klass,(new cljs.core.List(null,p1__2381_SHARP_,null,(1),null)),(2),null)),(3),null));
}));
});
schema.core._class_spec = (function schema$core$_class_spec(this$){
var pre = schema.core.instance_precondition.call(null,this$,this$);
var temp__4655__auto__ = schema.utils.class_schema.call(null,this$);
if(cljs.core.truth_(temp__4655__auto__)){
var class_schema = temp__4655__auto__;
return schema.spec.variant.variant_spec.call(null,pre,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),class_schema], null)], null));
} else {
return schema.spec.leaf.leaf_spec.call(null,pre);
}
});
schema.core._class_explain = (function schema$core$_class_explain(this$){
var temp__4655__auto__ = schema.utils.class_schema.call(null,this$);
if(cljs.core.truth_(temp__4655__auto__)){
var more_schema = temp__4655__auto__;
return schema.core.explain.call(null,more_schema);
} else {
var pred__2382 = cljs.core._EQ_;
var expr__2383 = this$;
if(cljs.core.truth_(pred__2382.call(null,Boolean,expr__2383))){
return new cljs.core.Symbol(null,"Bool","Bool",195910502,null);
} else {
if(cljs.core.truth_(pred__2382.call(null,Number,expr__2383))){
return new cljs.core.Symbol(null,"Num","Num",-2044934708,null);
} else {
if(cljs.core.truth_(pred__2382.call(null,Date,expr__2383))){
return new cljs.core.Symbol(null,"Inst","Inst",292408622,null);
} else {
if(cljs.core.truth_(pred__2382.call(null,cljs.core.UUID,expr__2383))){
return new cljs.core.Symbol(null,"Uuid","Uuid",-1866694318,null);
} else {
return this$;
}
}
}
}
}
});
goog.object.set(schema.core.Schema,"function",true);

goog.object.set(schema.core.spec,"function",(function (this$){
return schema.core._class_spec.call(null,this$);
}));

goog.object.set(schema.core.explain,"function",(function (this$){
return schema.core._class_explain.call(null,this$);
}));

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.AnythingSchema = (function (_,__meta,__extmap,__hash){
this._ = _;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.AnythingSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.AnythingSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2387,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2391 = k2387;
var G__2391__$1 = (((G__2391 instanceof cljs.core.Keyword))?G__2391.fqn:null);
switch (G__2391__$1) {
case "_":
return self__._;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2387,else__4388__auto__);

}
});

schema.core.AnythingSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2392){
var vec__2393 = p__2392;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2393,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2393,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.AnythingSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.AnythingSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"_","_",1453416199),self__._],null))], null),self__.__extmap));
});

schema.core.AnythingSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2386){
var self__ = this;
var G__2386__$1 = this;
return (new cljs.core.RecordIter((0),G__2386__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"_","_",1453416199)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.AnythingSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.AnythingSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.AnythingSchema(self__._,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.AnythingSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.AnythingSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1432036169 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.AnythingSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2388,other2389){
var self__ = this;
var this2388__$1 = this;
return (((!((other2389 == null)))) && ((this2388__$1.constructor === other2389.constructor)) && (cljs.core._EQ_.call(null,this2388__$1._,other2389._)) && (cljs.core._EQ_.call(null,this2388__$1.__extmap,other2389.__extmap)));
});

schema.core.AnythingSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"_","_",1453416199),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.AnythingSchema(self__._,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.AnythingSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2386){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2396 = cljs.core.keyword_identical_QMARK_;
var expr__2397 = k__4393__auto__;
if(cljs.core.truth_(pred__2396.call(null,new cljs.core.Keyword(null,"_","_",1453416199),expr__2397))){
return (new schema.core.AnythingSchema(G__2386,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.AnythingSchema(self__._,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2386),null));
}
});

schema.core.AnythingSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"_","_",1453416199),self__._,null))], null),self__.__extmap));
});

schema.core.AnythingSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2386){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.AnythingSchema(self__._,G__2386,self__.__extmap,self__.__hash));
});

schema.core.AnythingSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.AnythingSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.AnythingSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_);
});

schema.core.AnythingSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return new cljs.core.Symbol(null,"Any","Any",1277492269,null);
});

schema.core.AnythingSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"_","_",-1201019570,null)], null);
});

schema.core.AnythingSchema.cljs$lang$type = true;

schema.core.AnythingSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/AnythingSchema",null,(1),null));
});

schema.core.AnythingSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/AnythingSchema");
});

/**
 * Positional factory function for schema.core/AnythingSchema.
 */
schema.core.__GT_AnythingSchema = (function schema$core$__GT_AnythingSchema(_){
return (new schema.core.AnythingSchema(_,null,null,null));
});

/**
 * Factory function for schema.core/AnythingSchema, taking a map of keywords to field values.
 */
schema.core.map__GT_AnythingSchema = (function schema$core$map__GT_AnythingSchema(G__2390){
var extmap__4424__auto__ = (function (){var G__2399 = cljs.core.dissoc.call(null,G__2390,new cljs.core.Keyword(null,"_","_",1453416199));
if(cljs.core.record_QMARK_.call(null,G__2390)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2399);
} else {
return G__2399;
}
})();
return (new schema.core.AnythingSchema(new cljs.core.Keyword(null,"_","_",1453416199).cljs$core$IFn$_invoke$arity$1(G__2390),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.AnythingSchema.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.AnythingSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * Any value, including nil.
 */
schema.core.Any = (new schema.core.AnythingSchema(null,null,null,null));

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.EqSchema = (function (v,__meta,__extmap,__hash){
this.v = v;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.EqSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.EqSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2404,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2408 = k2404;
var G__2408__$1 = (((G__2408 instanceof cljs.core.Keyword))?G__2408.fqn:null);
switch (G__2408__$1) {
case "v":
return self__.v;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2404,else__4388__auto__);

}
});

schema.core.EqSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2409){
var vec__2410 = p__2409;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2410,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2410,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.EqSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.EqSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"v","v",21465059),self__.v],null))], null),self__.__extmap));
});

schema.core.EqSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2403){
var self__ = this;
var G__2403__$1 = this;
return (new cljs.core.RecordIter((0),G__2403__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"v","v",21465059)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.EqSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.EqSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.EqSchema(self__.v,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.EqSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.EqSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-907989292 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.EqSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2405,other2406){
var self__ = this;
var this2405__$1 = this;
return (((!((other2406 == null)))) && ((this2405__$1.constructor === other2406.constructor)) && (cljs.core._EQ_.call(null,this2405__$1.v,other2406.v)) && (cljs.core._EQ_.call(null,this2405__$1.__extmap,other2406.__extmap)));
});

schema.core.EqSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"v","v",21465059),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.EqSchema(self__.v,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.EqSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2403){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2413 = cljs.core.keyword_identical_QMARK_;
var expr__2414 = k__4393__auto__;
if(cljs.core.truth_(pred__2413.call(null,new cljs.core.Keyword(null,"v","v",21465059),expr__2414))){
return (new schema.core.EqSchema(G__2403,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.EqSchema(self__.v,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2403),null));
}
});

schema.core.EqSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"v","v",21465059),self__.v,null))], null),self__.__extmap));
});

schema.core.EqSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2403){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.EqSchema(self__.v,G__2403,self__.__extmap,self__.__hash));
});

schema.core.EqSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.EqSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.EqSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (p1__2401_SHARP_){
return cljs.core._EQ_.call(null,self__.v,p1__2401_SHARP_);
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2402_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"=","=",-1501502141,null),(new cljs.core.List(null,self__.v,(new cljs.core.List(null,p1__2402_SHARP_,null,(1),null)),(2),null)),(3),null));
});})(this$__$1))
));
});

schema.core.EqSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"eq","eq",1021992460,null),(new cljs.core.List(null,self__.v,null,(1),null)),(2),null));
});

schema.core.EqSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"v","v",1661996586,null)], null);
});

schema.core.EqSchema.cljs$lang$type = true;

schema.core.EqSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/EqSchema",null,(1),null));
});

schema.core.EqSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/EqSchema");
});

/**
 * Positional factory function for schema.core/EqSchema.
 */
schema.core.__GT_EqSchema = (function schema$core$__GT_EqSchema(v){
return (new schema.core.EqSchema(v,null,null,null));
});

/**
 * Factory function for schema.core/EqSchema, taking a map of keywords to field values.
 */
schema.core.map__GT_EqSchema = (function schema$core$map__GT_EqSchema(G__2407){
var extmap__4424__auto__ = (function (){var G__2416 = cljs.core.dissoc.call(null,G__2407,new cljs.core.Keyword(null,"v","v",21465059));
if(cljs.core.record_QMARK_.call(null,G__2407)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2416);
} else {
return G__2416;
}
})();
return (new schema.core.EqSchema(new cljs.core.Keyword(null,"v","v",21465059).cljs$core$IFn$_invoke$arity$1(G__2407),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.EqSchema.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.EqSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must be (= v).
 */
schema.core.eq = (function schema$core$eq(v){
return (new schema.core.EqSchema(v,null,null,null));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Isa = (function (h,parent,__meta,__extmap,__hash){
this.h = h;
this.parent = parent;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Isa.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Isa.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2421,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2425 = k2421;
var G__2425__$1 = (((G__2425 instanceof cljs.core.Keyword))?G__2425.fqn:null);
switch (G__2425__$1) {
case "h":
return self__.h;

break;
case "parent":
return self__.parent;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2421,else__4388__auto__);

}
});

schema.core.Isa.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2426){
var vec__2427 = p__2426;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2427,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2427,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Isa.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Isa{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"h","h",1109658740),self__.h],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"parent","parent",-878878779),self__.parent],null))], null),self__.__extmap));
});

schema.core.Isa.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2420){
var self__ = this;
var G__2420__$1 = this;
return (new cljs.core.RecordIter((0),G__2420__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"h","h",1109658740),new cljs.core.Keyword(null,"parent","parent",-878878779)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Isa.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Isa.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Isa(self__.h,self__.parent,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Isa.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Isa.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (1593744337 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Isa.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2422,other2423){
var self__ = this;
var this2422__$1 = this;
return (((!((other2423 == null)))) && ((this2422__$1.constructor === other2423.constructor)) && (cljs.core._EQ_.call(null,this2422__$1.h,other2423.h)) && (cljs.core._EQ_.call(null,this2422__$1.parent,other2423.parent)) && (cljs.core._EQ_.call(null,this2422__$1.__extmap,other2423.__extmap)));
});

schema.core.Isa.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"parent","parent",-878878779),null,new cljs.core.Keyword(null,"h","h",1109658740),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Isa(self__.h,self__.parent,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Isa.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2420){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2430 = cljs.core.keyword_identical_QMARK_;
var expr__2431 = k__4393__auto__;
if(cljs.core.truth_(pred__2430.call(null,new cljs.core.Keyword(null,"h","h",1109658740),expr__2431))){
return (new schema.core.Isa(G__2420,self__.parent,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2430.call(null,new cljs.core.Keyword(null,"parent","parent",-878878779),expr__2431))){
return (new schema.core.Isa(self__.h,G__2420,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Isa(self__.h,self__.parent,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2420),null));
}
}
});

schema.core.Isa.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"h","h",1109658740),self__.h,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"parent","parent",-878878779),self__.parent,null))], null),self__.__extmap));
});

schema.core.Isa.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2420){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Isa(self__.h,self__.parent,G__2420,self__.__extmap,self__.__hash));
});

schema.core.Isa.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Isa.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Isa.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (p1__2418_SHARP_){
if(cljs.core.truth_(self__.h)){
return cljs.core.isa_QMARK_.call(null,self__.h,p1__2418_SHARP_,self__.parent);
} else {
return cljs.core.isa_QMARK_.call(null,p1__2418_SHARP_,self__.parent);
}
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2419_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"isa?","isa?",1358492324,null),(new cljs.core.List(null,p1__2419_SHARP_,(new cljs.core.List(null,self__.parent,null,(1),null)),(2),null)),(3),null));
});})(this$__$1))
));
});

schema.core.Isa.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"isa?","isa?",1358492324,null),(new cljs.core.List(null,self__.parent,null,(1),null)),(2),null));
});

schema.core.Isa.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"h","h",-1544777029,null),new cljs.core.Symbol(null,"parent","parent",761652748,null)], null);
});

schema.core.Isa.cljs$lang$type = true;

schema.core.Isa.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Isa",null,(1),null));
});

schema.core.Isa.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Isa");
});

/**
 * Positional factory function for schema.core/Isa.
 */
schema.core.__GT_Isa = (function schema$core$__GT_Isa(h,parent){
return (new schema.core.Isa(h,parent,null,null,null));
});

/**
 * Factory function for schema.core/Isa, taking a map of keywords to field values.
 */
schema.core.map__GT_Isa = (function schema$core$map__GT_Isa(G__2424){
var extmap__4424__auto__ = (function (){var G__2433 = cljs.core.dissoc.call(null,G__2424,new cljs.core.Keyword(null,"h","h",1109658740),new cljs.core.Keyword(null,"parent","parent",-878878779));
if(cljs.core.record_QMARK_.call(null,G__2424)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2433);
} else {
return G__2433;
}
})();
return (new schema.core.Isa(new cljs.core.Keyword(null,"h","h",1109658740).cljs$core$IFn$_invoke$arity$1(G__2424),new cljs.core.Keyword(null,"parent","parent",-878878779).cljs$core$IFn$_invoke$arity$1(G__2424),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Isa.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Isa.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must be a child of parent.
 */
schema.core.isa = (function schema$core$isa(var_args){
var G__2436 = arguments.length;
switch (G__2436) {
case 1:
return schema.core.isa.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return schema.core.isa.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

schema.core.isa.cljs$core$IFn$_invoke$arity$1 = (function (parent){
return (new schema.core.Isa(null,parent,null,null,null));
});

schema.core.isa.cljs$core$IFn$_invoke$arity$2 = (function (h,parent){
return (new schema.core.Isa(h,parent,null,null,null));
});

schema.core.isa.cljs$lang$maxFixedArity = 2;


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.EnumSchema = (function (vs,__meta,__extmap,__hash){
this.vs = vs;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.EnumSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.EnumSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2441,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2445 = k2441;
var G__2445__$1 = (((G__2445 instanceof cljs.core.Keyword))?G__2445.fqn:null);
switch (G__2445__$1) {
case "vs":
return self__.vs;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2441,else__4388__auto__);

}
});

schema.core.EnumSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2446){
var vec__2447 = p__2446;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2447,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2447,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.EnumSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.EnumSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"vs","vs",-2022097090),self__.vs],null))], null),self__.__extmap));
});

schema.core.EnumSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2440){
var self__ = this;
var G__2440__$1 = this;
return (new cljs.core.RecordIter((0),G__2440__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vs","vs",-2022097090)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.EnumSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.EnumSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.EnumSchema(self__.vs,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.EnumSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.EnumSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (2002701468 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.EnumSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2442,other2443){
var self__ = this;
var this2442__$1 = this;
return (((!((other2443 == null)))) && ((this2442__$1.constructor === other2443.constructor)) && (cljs.core._EQ_.call(null,this2442__$1.vs,other2443.vs)) && (cljs.core._EQ_.call(null,this2442__$1.__extmap,other2443.__extmap)));
});

schema.core.EnumSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"vs","vs",-2022097090),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.EnumSchema(self__.vs,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.EnumSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2440){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2450 = cljs.core.keyword_identical_QMARK_;
var expr__2451 = k__4393__auto__;
if(cljs.core.truth_(pred__2450.call(null,new cljs.core.Keyword(null,"vs","vs",-2022097090),expr__2451))){
return (new schema.core.EnumSchema(G__2440,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.EnumSchema(self__.vs,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2440),null));
}
});

schema.core.EnumSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"vs","vs",-2022097090),self__.vs,null))], null),self__.__extmap));
});

schema.core.EnumSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2440){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.EnumSchema(self__.vs,G__2440,self__.__extmap,self__.__hash));
});

schema.core.EnumSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.EnumSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.EnumSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (p1__2438_SHARP_){
return cljs.core.contains_QMARK_.call(null,self__.vs,p1__2438_SHARP_);
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2439_SHARP_){
return (new cljs.core.List(null,self__.vs,(new cljs.core.List(null,p1__2439_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
));
});

schema.core.EnumSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.cons.call(null,new cljs.core.Symbol(null,"enum","enum",-975417337,null),self__.vs);
});

schema.core.EnumSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"vs","vs",-381565563,null)], null);
});

schema.core.EnumSchema.cljs$lang$type = true;

schema.core.EnumSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/EnumSchema",null,(1),null));
});

schema.core.EnumSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/EnumSchema");
});

/**
 * Positional factory function for schema.core/EnumSchema.
 */
schema.core.__GT_EnumSchema = (function schema$core$__GT_EnumSchema(vs){
return (new schema.core.EnumSchema(vs,null,null,null));
});

/**
 * Factory function for schema.core/EnumSchema, taking a map of keywords to field values.
 */
schema.core.map__GT_EnumSchema = (function schema$core$map__GT_EnumSchema(G__2444){
var extmap__4424__auto__ = (function (){var G__2453 = cljs.core.dissoc.call(null,G__2444,new cljs.core.Keyword(null,"vs","vs",-2022097090));
if(cljs.core.record_QMARK_.call(null,G__2444)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2453);
} else {
return G__2453;
}
})();
return (new schema.core.EnumSchema(new cljs.core.Keyword(null,"vs","vs",-2022097090).cljs$core$IFn$_invoke$arity$1(G__2444),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.EnumSchema.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.EnumSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must be = to some element of vs.
 */
schema.core.enum$ = (function schema$core$enum(var_args){
var args__4736__auto__ = [];
var len__4730__auto___2456 = arguments.length;
var i__4731__auto___2457 = (0);
while(true){
if((i__4731__auto___2457 < len__4730__auto___2456)){
args__4736__auto__.push((arguments[i__4731__auto___2457]));

var G__2458 = (i__4731__auto___2457 + (1));
i__4731__auto___2457 = G__2458;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return schema.core.enum$.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

schema.core.enum$.cljs$core$IFn$_invoke$arity$variadic = (function (vs){
return (new schema.core.EnumSchema(cljs.core.set.call(null,vs),null,null,null));
});

schema.core.enum$.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
schema.core.enum$.cljs$lang$applyTo = (function (seq2455){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq2455));
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Predicate = (function (p_QMARK_,pred_name,__meta,__extmap,__hash){
this.p_QMARK_ = p_QMARK_;
this.pred_name = pred_name;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Predicate.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Predicate.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2461,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2465 = k2461;
var G__2465__$1 = (((G__2465 instanceof cljs.core.Keyword))?G__2465.fqn:null);
switch (G__2465__$1) {
case "p?":
return self__.p_QMARK_;

break;
case "pred-name":
return self__.pred_name;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2461,else__4388__auto__);

}
});

schema.core.Predicate.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2466){
var vec__2467 = p__2466;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2467,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2467,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Predicate.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Predicate{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"p?","p?",-1172161701),self__.p_QMARK_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"pred-name","pred-name",-3677451),self__.pred_name],null))], null),self__.__extmap));
});

schema.core.Predicate.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2460){
var self__ = this;
var G__2460__$1 = this;
return (new cljs.core.RecordIter((0),G__2460__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"p?","p?",-1172161701),new cljs.core.Keyword(null,"pred-name","pred-name",-3677451)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Predicate.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Predicate.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Predicate(self__.p_QMARK_,self__.pred_name,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Predicate.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Predicate.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (2041221968 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Predicate.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2462,other2463){
var self__ = this;
var this2462__$1 = this;
return (((!((other2463 == null)))) && ((this2462__$1.constructor === other2463.constructor)) && (cljs.core._EQ_.call(null,this2462__$1.p_QMARK_,other2463.p_QMARK_)) && (cljs.core._EQ_.call(null,this2462__$1.pred_name,other2463.pred_name)) && (cljs.core._EQ_.call(null,this2462__$1.__extmap,other2463.__extmap)));
});

schema.core.Predicate.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pred-name","pred-name",-3677451),null,new cljs.core.Keyword(null,"p?","p?",-1172161701),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Predicate(self__.p_QMARK_,self__.pred_name,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Predicate.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2460){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2470 = cljs.core.keyword_identical_QMARK_;
var expr__2471 = k__4393__auto__;
if(cljs.core.truth_(pred__2470.call(null,new cljs.core.Keyword(null,"p?","p?",-1172161701),expr__2471))){
return (new schema.core.Predicate(G__2460,self__.pred_name,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2470.call(null,new cljs.core.Keyword(null,"pred-name","pred-name",-3677451),expr__2471))){
return (new schema.core.Predicate(self__.p_QMARK_,G__2460,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Predicate(self__.p_QMARK_,self__.pred_name,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2460),null));
}
}
});

schema.core.Predicate.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"p?","p?",-1172161701),self__.p_QMARK_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"pred-name","pred-name",-3677451),self__.pred_name,null))], null),self__.__extmap));
});

schema.core.Predicate.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2460){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Predicate(self__.p_QMARK_,self__.pred_name,G__2460,self__.__extmap,self__.__hash));
});

schema.core.Predicate.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Predicate.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Predicate.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,self__.p_QMARK_,((function (this$__$1){
return (function (p1__2459_SHARP_){
return (new cljs.core.List(null,self__.pred_name,(new cljs.core.List(null,p1__2459_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
));
});

schema.core.Predicate.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if(cljs.core._EQ_.call(null,self__.p_QMARK_,cljs.core.integer_QMARK_)){
return new cljs.core.Symbol(null,"Int","Int",-2116888740,null);
} else {
if(cljs.core._EQ_.call(null,self__.p_QMARK_,cljs.core.keyword_QMARK_)){
return new cljs.core.Symbol(null,"Keyword","Keyword",-850065993,null);
} else {
if(cljs.core._EQ_.call(null,self__.p_QMARK_,cljs.core.symbol_QMARK_)){
return new cljs.core.Symbol(null,"Symbol","Symbol",716452869,null);
} else {
if(cljs.core._EQ_.call(null,self__.p_QMARK_,cljs.core.string_QMARK_)){
return new cljs.core.Symbol(null,"Str","Str",907970895,null);
} else {
return (new cljs.core.List(null,new cljs.core.Symbol(null,"pred","pred",-727012372,null),(new cljs.core.List(null,self__.pred_name,null,(1),null)),(2),null));

}
}
}
}
});

schema.core.Predicate.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p?","p?",468369826,null),new cljs.core.Symbol(null,"pred-name","pred-name",1636854076,null)], null);
});

schema.core.Predicate.cljs$lang$type = true;

schema.core.Predicate.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Predicate",null,(1),null));
});

schema.core.Predicate.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Predicate");
});

/**
 * Positional factory function for schema.core/Predicate.
 */
schema.core.__GT_Predicate = (function schema$core$__GT_Predicate(p_QMARK_,pred_name){
return (new schema.core.Predicate(p_QMARK_,pred_name,null,null,null));
});

/**
 * Factory function for schema.core/Predicate, taking a map of keywords to field values.
 */
schema.core.map__GT_Predicate = (function schema$core$map__GT_Predicate(G__2464){
var extmap__4424__auto__ = (function (){var G__2473 = cljs.core.dissoc.call(null,G__2464,new cljs.core.Keyword(null,"p?","p?",-1172161701),new cljs.core.Keyword(null,"pred-name","pred-name",-3677451));
if(cljs.core.record_QMARK_.call(null,G__2464)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2473);
} else {
return G__2473;
}
})();
return (new schema.core.Predicate(new cljs.core.Keyword(null,"p?","p?",-1172161701).cljs$core$IFn$_invoke$arity$1(G__2464),new cljs.core.Keyword(null,"pred-name","pred-name",-3677451).cljs$core$IFn$_invoke$arity$1(G__2464),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Predicate.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Predicate.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value for which p? returns true (and does not throw).
 * Optional pred-name can be passed for nicer validation errors.
 */
schema.core.pred = (function schema$core$pred(var_args){
var G__2476 = arguments.length;
switch (G__2476) {
case 1:
return schema.core.pred.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return schema.core.pred.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

schema.core.pred.cljs$core$IFn$_invoke$arity$1 = (function (p_QMARK_){
return schema.core.pred.call(null,p_QMARK_,cljs.core.symbol.call(null,schema.utils.fn_name.call(null,p_QMARK_)));
});

schema.core.pred.cljs$core$IFn$_invoke$arity$2 = (function (p_QMARK_,pred_name){
if(cljs.core.ifn_QMARK_.call(null,p_QMARK_)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Not a function: %s",p_QMARK_)));
}

return (new schema.core.Predicate(p_QMARK_,pred_name,null,null,null));
});

schema.core.pred.cljs$lang$maxFixedArity = 2;

schema.core.protocol_name = (function schema$core$protocol_name(protocol){
return new cljs.core.Keyword(null,"proto-sym","proto-sym",-886371734).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,protocol));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Protocol = (function (p,__meta,__extmap,__hash){
this.p = p;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Protocol.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Protocol.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2480,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2484 = k2480;
var G__2484__$1 = (((G__2484 instanceof cljs.core.Keyword))?G__2484.fqn:null);
switch (G__2484__$1) {
case "p":
return self__.p;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2480,else__4388__auto__);

}
});

schema.core.Protocol.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2485){
var vec__2486 = p__2485;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2486,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2486,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Protocol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Protocol{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"p","p",151049309),self__.p],null))], null),self__.__extmap));
});

schema.core.Protocol.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2479){
var self__ = this;
var G__2479__$1 = this;
return (new cljs.core.RecordIter((0),G__2479__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"p","p",151049309)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Protocol.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Protocol.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Protocol(self__.p,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Protocol.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Protocol.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1892592712 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Protocol.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2481,other2482){
var self__ = this;
var this2481__$1 = this;
return (((!((other2482 == null)))) && ((this2481__$1.constructor === other2482.constructor)) && (cljs.core._EQ_.call(null,this2481__$1.p,other2482.p)) && (cljs.core._EQ_.call(null,this2481__$1.__extmap,other2482.__extmap)));
});

schema.core.Protocol.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"p","p",151049309),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Protocol(self__.p,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Protocol.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2479){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2489 = cljs.core.keyword_identical_QMARK_;
var expr__2490 = k__4393__auto__;
if(cljs.core.truth_(pred__2489.call(null,new cljs.core.Keyword(null,"p","p",151049309),expr__2490))){
return (new schema.core.Protocol(G__2479,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Protocol(self__.p,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2479),null));
}
});

schema.core.Protocol.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"p","p",151049309),self__.p,null))], null),self__.__extmap));
});

schema.core.Protocol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2479){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Protocol(self__.p,G__2479,self__.__extmap,self__.__hash));
});

schema.core.Protocol.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Protocol.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Protocol.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,new cljs.core.Keyword(null,"proto-pred","proto-pred",1885698716).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,this$__$1)),((function (this$__$1){
return (function (p1__2478_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"satisfies?","satisfies?",-433227199,null),(new cljs.core.List(null,schema.core.protocol_name.call(null,this$__$1),(new cljs.core.List(null,p1__2478_SHARP_,null,(1),null)),(2),null)),(3),null));
});})(this$__$1))
));
});

schema.core.Protocol.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"protocol","protocol",-2001965651,null),(new cljs.core.List(null,schema.core.protocol_name.call(null,this$__$1),null,(1),null)),(2),null));
});

schema.core.Protocol.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p","p",1791580836,null)], null);
});

schema.core.Protocol.cljs$lang$type = true;

schema.core.Protocol.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Protocol",null,(1),null));
});

schema.core.Protocol.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Protocol");
});

/**
 * Positional factory function for schema.core/Protocol.
 */
schema.core.__GT_Protocol = (function schema$core$__GT_Protocol(p){
return (new schema.core.Protocol(p,null,null,null));
});

/**
 * Factory function for schema.core/Protocol, taking a map of keywords to field values.
 */
schema.core.map__GT_Protocol = (function schema$core$map__GT_Protocol(G__2483){
var extmap__4424__auto__ = (function (){var G__2492 = cljs.core.dissoc.call(null,G__2483,new cljs.core.Keyword(null,"p","p",151049309));
if(cljs.core.record_QMARK_.call(null,G__2483)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2492);
} else {
return G__2492;
}
})();
return (new schema.core.Protocol(new cljs.core.Keyword(null,"p","p",151049309).cljs$core$IFn$_invoke$arity$1(G__2483),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Protocol.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Protocol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

RegExp.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

RegExp.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,cljs.core.some_fn.call(null,schema.spec.core.precondition.call(null,this$__$1,cljs.core.string_QMARK_,((function (this$__$1){
return (function (p1__975__976__auto__){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"string?","string?",-1129175764,null),(new cljs.core.List(null,p1__975__976__auto__,null,(1),null)),(2),null));
});})(this$__$1))
),schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (p1__2496_SHARP_){
return cljs.core.re_find.call(null,this$__$1,p1__2496_SHARP_);
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2497_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"re-find","re-find",1143444147,null),(new cljs.core.List(null,schema.core.explain.call(null,this$__$1),(new cljs.core.List(null,p1__2497_SHARP_,null,(1),null)),(2),null)),(3),null));
});})(this$__$1))
)));
});

RegExp.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.symbol.call(null,["#\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.str.cljs$core$IFn$_invoke$arity$1(this$__$1).slice((1),(-1))),"\""].join(''));
});
/**
 * Satisfied only by String.
 * Is (pred string?) and not js/String in cljs because of keywords.
 */
schema.core.Str = schema.core.pred.call(null,cljs.core.string_QMARK_,new cljs.core.Symbol(null,"string?","string?",-1129175764,null));
/**
 * Boolean true or false
 */
schema.core.Bool = Boolean;
/**
 * Any number
 */
schema.core.Num = Number;
/**
 * Any integral number
 */
schema.core.Int = schema.core.pred.call(null,cljs.core.integer_QMARK_,new cljs.core.Symbol(null,"integer?","integer?",1303791671,null));
/**
 * A keyword
 */
schema.core.Keyword = schema.core.pred.call(null,cljs.core.keyword_QMARK_,new cljs.core.Symbol(null,"keyword?","keyword?",1917797069,null));
/**
 * A symbol
 */
schema.core.Symbol = schema.core.pred.call(null,cljs.core.symbol_QMARK_,new cljs.core.Symbol(null,"symbol?","symbol?",1820680511,null));
/**
 * A regular expression
 */
schema.core.Regex = (function (){
if((typeof schema !== 'undefined') && (typeof schema.core !== 'undefined') && (typeof schema.core.t_schema$core2500 !== 'undefined')){
} else {

/**
* @constructor
 * @implements {schema.core.Schema}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
schema.core.t_schema$core2500 = (function (meta2501){
this.meta2501 = meta2501;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
schema.core.t_schema$core2500.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_2502,meta2501__$1){
var self__ = this;
var _2502__$1 = this;
return (new schema.core.t_schema$core2500(meta2501__$1));
});

schema.core.t_schema$core2500.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_2502){
var self__ = this;
var _2502__$1 = this;
return self__.meta2501;
});

schema.core.t_schema$core2500.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.t_schema$core2500.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (p1__2498_SHARP_){
return (p1__2498_SHARP_ instanceof RegExp);
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2499_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"instance?","instance?",1075939923,null),(new cljs.core.List(null,new cljs.core.Symbol("js","RegExp","js/RegExp",1778210562,null),(new cljs.core.List(null,p1__2499_SHARP_,null,(1),null)),(2),null)),(3),null));
});})(this$__$1))
));
});

schema.core.t_schema$core2500.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return new cljs.core.Symbol(null,"Regex","Regex",205914413,null);
});

schema.core.t_schema$core2500.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"meta2501","meta2501",-1345266975,null)], null);
});

schema.core.t_schema$core2500.cljs$lang$type = true;

schema.core.t_schema$core2500.cljs$lang$ctorStr = "schema.core/t_schema$core2500";

schema.core.t_schema$core2500.cljs$lang$ctorPrWriter = (function (this__4374__auto__,writer__4375__auto__,opt__4376__auto__){
return cljs.core._write.call(null,writer__4375__auto__,"schema.core/t_schema$core2500");
});

/**
 * Positional factory function for schema.core/t_schema$core2500.
 */
schema.core.__GT_t_schema$core2500 = (function schema$core$__GT_t_schema$core2500(meta2501){
return (new schema.core.t_schema$core2500(meta2501));
});

}

return (new schema.core.t_schema$core2500(cljs.core.PersistentArrayMap.EMPTY));
})()
;
/**
 * The local representation of #inst ...
 */
schema.core.Inst = Date;
/**
 * The local representation of #uuid ...
 */
schema.core.Uuid = cljs.core.UUID;

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Maybe = (function (schema,__meta,__extmap,__hash){
this.schema = schema;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Maybe.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Maybe.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2504,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2508 = k2504;
var G__2508__$1 = (((G__2508 instanceof cljs.core.Keyword))?G__2508.fqn:null);
switch (G__2508__$1) {
case "schema":
return self__.schema;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2504,else__4388__auto__);

}
});

schema.core.Maybe.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2509){
var vec__2510 = p__2509;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2510,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2510,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Maybe.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Maybe{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null))], null),self__.__extmap));
});

schema.core.Maybe.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2503){
var self__ = this;
var G__2503__$1 = this;
return (new cljs.core.RecordIter((0),G__2503__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Maybe.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Maybe.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Maybe(self__.schema,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Maybe.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Maybe.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-805411239 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Maybe.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2505,other2506){
var self__ = this;
var this2505__$1 = this;
return (((!((other2506 == null)))) && ((this2505__$1.constructor === other2506.constructor)) && (cljs.core._EQ_.call(null,this2505__$1.schema,other2506.schema)) && (cljs.core._EQ_.call(null,this2505__$1.__extmap,other2506.__extmap)));
});

schema.core.Maybe.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Maybe(self__.schema,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Maybe.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2503){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2513 = cljs.core.keyword_identical_QMARK_;
var expr__2514 = k__4393__auto__;
if(cljs.core.truth_(pred__2513.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2514))){
return (new schema.core.Maybe(G__2503,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Maybe(self__.schema,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2503),null));
}
});

schema.core.Maybe.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null))], null),self__.__extmap));
});

schema.core.Maybe.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2503){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Maybe(self__.schema,G__2503,self__.__extmap,self__.__hash));
});

schema.core.Maybe.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Maybe.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Maybe.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),cljs.core.nil_QMARK_,new cljs.core.Keyword(null,"schema","schema",-1582001791),schema.core.eq.call(null,null)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema], null)], null));
});

schema.core.Maybe.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"maybe","maybe",1326133967,null),(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),null,(1),null)),(2),null));
});

schema.core.Maybe.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema","schema",58529736,null)], null);
});

schema.core.Maybe.cljs$lang$type = true;

schema.core.Maybe.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Maybe",null,(1),null));
});

schema.core.Maybe.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Maybe");
});

/**
 * Positional factory function for schema.core/Maybe.
 */
schema.core.__GT_Maybe = (function schema$core$__GT_Maybe(schema__$1){
return (new schema.core.Maybe(schema__$1,null,null,null));
});

/**
 * Factory function for schema.core/Maybe, taking a map of keywords to field values.
 */
schema.core.map__GT_Maybe = (function schema$core$map__GT_Maybe(G__2507){
var extmap__4424__auto__ = (function (){var G__2516 = cljs.core.dissoc.call(null,G__2507,new cljs.core.Keyword(null,"schema","schema",-1582001791));
if(cljs.core.record_QMARK_.call(null,G__2507)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2516);
} else {
return G__2516;
}
})();
return (new schema.core.Maybe(new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2507),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Maybe.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Maybe.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must either be nil or satisfy schema
 */
schema.core.maybe = (function schema$core$maybe(schema__$1){
return (new schema.core.Maybe(schema__$1,null,null,null));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.NamedSchema = (function (schema,name,__meta,__extmap,__hash){
this.schema = schema;
this.name = name;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.NamedSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.NamedSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2520,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2524 = k2520;
var G__2524__$1 = (((G__2524 instanceof cljs.core.Keyword))?G__2524.fqn:null);
switch (G__2524__$1) {
case "schema":
return self__.schema;

break;
case "name":
return self__.name;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2520,else__4388__auto__);

}
});

schema.core.NamedSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2525){
var vec__2526 = p__2525;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2526,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2526,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.NamedSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.NamedSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"name","name",1843675177),self__.name],null))], null),self__.__extmap));
});

schema.core.NamedSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2519){
var self__ = this;
var G__2519__$1 = this;
return (new cljs.core.RecordIter((0),G__2519__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"name","name",1843675177)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.NamedSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.NamedSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.NamedSchema(self__.schema,self__.name,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.NamedSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.NamedSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (456601728 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.NamedSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2521,other2522){
var self__ = this;
var this2521__$1 = this;
return (((!((other2522 == null)))) && ((this2521__$1.constructor === other2522.constructor)) && (cljs.core._EQ_.call(null,this2521__$1.schema,other2522.schema)) && (cljs.core._EQ_.call(null,this2521__$1.name,other2522.name)) && (cljs.core._EQ_.call(null,this2521__$1.__extmap,other2522.__extmap)));
});

schema.core.NamedSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null,new cljs.core.Keyword(null,"name","name",1843675177),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.NamedSchema(self__.schema,self__.name,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.NamedSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2519){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2529 = cljs.core.keyword_identical_QMARK_;
var expr__2530 = k__4393__auto__;
if(cljs.core.truth_(pred__2529.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2530))){
return (new schema.core.NamedSchema(G__2519,self__.name,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2529.call(null,new cljs.core.Keyword(null,"name","name",1843675177),expr__2530))){
return (new schema.core.NamedSchema(self__.schema,G__2519,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.NamedSchema(self__.schema,self__.name,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2519),null));
}
}
});

schema.core.NamedSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"name","name",1843675177),self__.name,null))], null),self__.__extmap));
});

schema.core.NamedSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2519){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.NamedSchema(self__.schema,self__.name,G__2519,self__.__extmap,self__.__hash));
});

schema.core.NamedSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.NamedSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.NamedSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,new cljs.core.Keyword(null,"wrap-error","wrap-error",536732809),((function (this$__$1){
return (function (p1__2518_SHARP_){
return schema.utils.__GT_NamedError.call(null,self__.name,p1__2518_SHARP_);
});})(this$__$1))
], null)], null));
});

schema.core.NamedSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"named","named",1218138048,null),(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),(new cljs.core.List(null,self__.name,null,(1),null)),(2),null)),(3),null));
});

schema.core.NamedSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.Symbol(null,"name","name",-810760592,null)], null);
});

schema.core.NamedSchema.cljs$lang$type = true;

schema.core.NamedSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/NamedSchema",null,(1),null));
});

schema.core.NamedSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/NamedSchema");
});

/**
 * Positional factory function for schema.core/NamedSchema.
 */
schema.core.__GT_NamedSchema = (function schema$core$__GT_NamedSchema(schema__$1,name){
return (new schema.core.NamedSchema(schema__$1,name,null,null,null));
});

/**
 * Factory function for schema.core/NamedSchema, taking a map of keywords to field values.
 */
schema.core.map__GT_NamedSchema = (function schema$core$map__GT_NamedSchema(G__2523){
var extmap__4424__auto__ = (function (){var G__2532 = cljs.core.dissoc.call(null,G__2523,new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"name","name",1843675177));
if(cljs.core.record_QMARK_.call(null,G__2523)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2532);
} else {
return G__2532;
}
})();
return (new schema.core.NamedSchema(new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2523),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(G__2523),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.NamedSchema.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.NamedSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must satisfy schema, and has a name for documentation purposes.
 */
schema.core.named = (function schema$core$named(schema__$1,name){
return (new schema.core.NamedSchema(schema__$1,name,null,null,null));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Either = (function (schemas,__meta,__extmap,__hash){
this.schemas = schemas;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Either.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Either.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2536,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2540 = k2536;
var G__2540__$1 = (((G__2540 instanceof cljs.core.Keyword))?G__2540.fqn:null);
switch (G__2540__$1) {
case "schemas":
return self__.schemas;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2536,else__4388__auto__);

}
});

schema.core.Either.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2541){
var vec__2542 = p__2541;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2542,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2542,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Either.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Either{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schemas","schemas",575070579),self__.schemas],null))], null),self__.__extmap));
});

schema.core.Either.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2535){
var self__ = this;
var G__2535__$1 = this;
return (new cljs.core.RecordIter((0),G__2535__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schemas","schemas",575070579)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Either.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Either.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Either(self__.schemas,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Either.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Either.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1018568510 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Either.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2537,other2538){
var self__ = this;
var this2537__$1 = this;
return (((!((other2538 == null)))) && ((this2537__$1.constructor === other2538.constructor)) && (cljs.core._EQ_.call(null,this2537__$1.schemas,other2538.schemas)) && (cljs.core._EQ_.call(null,this2537__$1.__extmap,other2538.__extmap)));
});

schema.core.Either.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schemas","schemas",575070579),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Either(self__.schemas,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Either.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2535){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2545 = cljs.core.keyword_identical_QMARK_;
var expr__2546 = k__4393__auto__;
if(cljs.core.truth_(pred__2545.call(null,new cljs.core.Keyword(null,"schemas","schemas",575070579),expr__2546))){
return (new schema.core.Either(G__2535,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Either(self__.schemas,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2535),null));
}
});

schema.core.Either.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schemas","schemas",575070579),self__.schemas,null))], null),self__.__extmap));
});

schema.core.Either.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2535){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Either(self__.schemas,G__2535,self__.__extmap,self__.__hash));
});

schema.core.Either.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Either.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Either.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,(function (){var iter__4523__auto__ = ((function (this$__$1){
return (function schema$core$iter__2548(s__2549){
return (new cljs.core.LazySeq(null,((function (this$__$1){
return (function (){
var s__2549__$1 = s__2549;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2549__$1);
if(temp__4657__auto__){
var s__2549__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2549__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2549__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2551 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2550 = (0);
while(true){
if((i__2550 < size__4522__auto__)){
var s = cljs.core._nth.call(null,c__4521__auto__,i__2550);
cljs.core.chunk_append.call(null,b__2551,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),cljs.core.complement.call(null,schema.core.checker.call(null,s)),new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null));

var G__2554 = (i__2550 + (1));
i__2550 = G__2554;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2551),schema$core$iter__2548.call(null,cljs.core.chunk_rest.call(null,s__2549__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2551),null);
}
} else {
var s = cljs.core.first.call(null,s__2549__$2);
return cljs.core.cons.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),cljs.core.complement.call(null,schema.core.checker.call(null,s)),new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null),schema$core$iter__2548.call(null,cljs.core.rest.call(null,s__2549__$2)));
}
} else {
return null;
}
break;
}
});})(this$__$1))
,null,null));
});})(this$__$1))
;
return iter__4523__auto__.call(null,self__.schemas);
})(),((function (this$__$1){
return (function (p1__2534_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"some-matching-either-clause?","some-matching-either-clause?",-1443305015,null),(new cljs.core.List(null,p1__2534_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
);
});

schema.core.Either.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.cons.call(null,new cljs.core.Symbol(null,"either","either",-2144373018,null),cljs.core.map.call(null,schema.core.explain,self__.schemas));
});

schema.core.Either.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schemas","schemas",-2079365190,null)], null);
});

schema.core.Either.cljs$lang$type = true;

schema.core.Either.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Either",null,(1),null));
});

schema.core.Either.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Either");
});

/**
 * Positional factory function for schema.core/Either.
 */
schema.core.__GT_Either = (function schema$core$__GT_Either(schemas){
return (new schema.core.Either(schemas,null,null,null));
});

/**
 * Factory function for schema.core/Either, taking a map of keywords to field values.
 */
schema.core.map__GT_Either = (function schema$core$map__GT_Either(G__2539){
var extmap__4424__auto__ = (function (){var G__2552 = cljs.core.dissoc.call(null,G__2539,new cljs.core.Keyword(null,"schemas","schemas",575070579));
if(cljs.core.record_QMARK_.call(null,G__2539)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2552);
} else {
return G__2552;
}
})();
return (new schema.core.Either(new cljs.core.Keyword(null,"schemas","schemas",575070579).cljs$core$IFn$_invoke$arity$1(G__2539),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Either.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Either.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must satisfy at least one schema in schemas.
 * Note that `either` does not work properly with coercion
 * 
 * DEPRECATED: prefer `conditional` or `cond-pre`
 * 
 * WARNING: either does not work with coercion.  It is also slow and gives
 * bad error messages.  Please consider using `conditional` and friends
 * instead; they are more efficient, provide better error messages,
 * and work with coercion.
 */
schema.core.either = (function schema$core$either(var_args){
var args__4736__auto__ = [];
var len__4730__auto___2556 = arguments.length;
var i__4731__auto___2557 = (0);
while(true){
if((i__4731__auto___2557 < len__4730__auto___2556)){
args__4736__auto__.push((arguments[i__4731__auto___2557]));

var G__2558 = (i__4731__auto___2557 + (1));
i__4731__auto___2557 = G__2558;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return schema.core.either.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

schema.core.either.cljs$core$IFn$_invoke$arity$variadic = (function (schemas){
return (new schema.core.Either(schemas,null,null,null));
});

schema.core.either.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
schema.core.either.cljs$lang$applyTo = (function (seq2555){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq2555));
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.ConditionalSchema = (function (preds_and_schemas,error_symbol,__meta,__extmap,__hash){
this.preds_and_schemas = preds_and_schemas;
this.error_symbol = error_symbol;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.ConditionalSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.ConditionalSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2561,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2565 = k2561;
var G__2565__$1 = (((G__2565 instanceof cljs.core.Keyword))?G__2565.fqn:null);
switch (G__2565__$1) {
case "preds-and-schemas":
return self__.preds_and_schemas;

break;
case "error-symbol":
return self__.error_symbol;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2561,else__4388__auto__);

}
});

schema.core.ConditionalSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2566){
var vec__2567 = p__2566;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2567,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2567,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.ConditionalSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.ConditionalSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355),self__.preds_and_schemas],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428),self__.error_symbol],null))], null),self__.__extmap));
});

schema.core.ConditionalSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2560){
var self__ = this;
var G__2560__$1 = this;
return (new cljs.core.RecordIter((0),G__2560__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355),new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.ConditionalSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.ConditionalSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.ConditionalSchema(self__.preds_and_schemas,self__.error_symbol,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.ConditionalSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.ConditionalSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (1418435858 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.ConditionalSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2562,other2563){
var self__ = this;
var this2562__$1 = this;
return (((!((other2563 == null)))) && ((this2562__$1.constructor === other2563.constructor)) && (cljs.core._EQ_.call(null,this2562__$1.preds_and_schemas,other2563.preds_and_schemas)) && (cljs.core._EQ_.call(null,this2562__$1.error_symbol,other2563.error_symbol)) && (cljs.core._EQ_.call(null,this2562__$1.__extmap,other2563.__extmap)));
});

schema.core.ConditionalSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355),null,new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.ConditionalSchema(self__.preds_and_schemas,self__.error_symbol,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.ConditionalSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2560){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2570 = cljs.core.keyword_identical_QMARK_;
var expr__2571 = k__4393__auto__;
if(cljs.core.truth_(pred__2570.call(null,new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355),expr__2571))){
return (new schema.core.ConditionalSchema(G__2560,self__.error_symbol,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2570.call(null,new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428),expr__2571))){
return (new schema.core.ConditionalSchema(self__.preds_and_schemas,G__2560,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.ConditionalSchema(self__.preds_and_schemas,self__.error_symbol,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2560),null));
}
}
});

schema.core.ConditionalSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355),self__.preds_and_schemas,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428),self__.error_symbol,null))], null),self__.__extmap));
});

schema.core.ConditionalSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2560){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.ConditionalSchema(self__.preds_and_schemas,self__.error_symbol,G__2560,self__.__extmap,self__.__hash));
});

schema.core.ConditionalSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.ConditionalSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.ConditionalSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,(function (){var iter__4523__auto__ = ((function (this$__$1){
return (function schema$core$iter__2573(s__2574){
return (new cljs.core.LazySeq(null,((function (this$__$1){
return (function (){
var s__2574__$1 = s__2574;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2574__$1);
if(temp__4657__auto__){
var s__2574__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2574__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2574__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2576 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2575 = (0);
while(true){
if((i__2575 < size__4522__auto__)){
var vec__2577 = cljs.core._nth.call(null,c__4521__auto__,i__2575);
var p = cljs.core.nth.call(null,vec__2577,(0),null);
var s = cljs.core.nth.call(null,vec__2577,(1),null);
cljs.core.chunk_append.call(null,b__2576,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),p,new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null));

var G__2589 = (i__2575 + (1));
i__2575 = G__2589;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2576),schema$core$iter__2573.call(null,cljs.core.chunk_rest.call(null,s__2574__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2576),null);
}
} else {
var vec__2580 = cljs.core.first.call(null,s__2574__$2);
var p = cljs.core.nth.call(null,vec__2580,(0),null);
var s = cljs.core.nth.call(null,vec__2580,(1),null);
return cljs.core.cons.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),p,new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null),schema$core$iter__2573.call(null,cljs.core.rest.call(null,s__2574__$2)));
}
} else {
return null;
}
break;
}
});})(this$__$1))
,null,null));
});})(this$__$1))
;
return iter__4523__auto__.call(null,self__.preds_and_schemas);
})(),((function (this$__$1){
return (function (p1__2559_SHARP_){
return (new cljs.core.List(null,(function (){var or__4131__auto__ = self__.error_symbol;
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
if(cljs.core._EQ_.call(null,(1),cljs.core.count.call(null,self__.preds_and_schemas))){
return cljs.core.symbol.call(null,schema.utils.fn_name.call(null,cljs.core.ffirst.call(null,self__.preds_and_schemas)));
} else {
return new cljs.core.Symbol(null,"some-matching-condition?","some-matching-condition?",1512398506,null);
}
}
})(),(new cljs.core.List(null,p1__2559_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
);
});

schema.core.ConditionalSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.cons.call(null,new cljs.core.Symbol(null,"conditional","conditional",-1212542970,null),cljs.core.concat.call(null,cljs.core.mapcat.call(null,((function (this$__$1){
return (function (p__2583){
var vec__2584 = p__2583;
var pred = cljs.core.nth.call(null,vec__2584,(0),null);
var schema__$1 = cljs.core.nth.call(null,vec__2584,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.symbol.call(null,schema.utils.fn_name.call(null,pred)),schema.core.explain.call(null,schema__$1)], null);
});})(this$__$1))
,self__.preds_and_schemas),(cljs.core.truth_(self__.error_symbol)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.error_symbol], null):null)));
});

schema.core.ConditionalSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"preds-and-schemas","preds-and-schemas",333765172,null),new cljs.core.Symbol(null,"error-symbol","error-symbol",817051099,null)], null);
});

schema.core.ConditionalSchema.cljs$lang$type = true;

schema.core.ConditionalSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/ConditionalSchema",null,(1),null));
});

schema.core.ConditionalSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/ConditionalSchema");
});

/**
 * Positional factory function for schema.core/ConditionalSchema.
 */
schema.core.__GT_ConditionalSchema = (function schema$core$__GT_ConditionalSchema(preds_and_schemas,error_symbol){
return (new schema.core.ConditionalSchema(preds_and_schemas,error_symbol,null,null,null));
});

/**
 * Factory function for schema.core/ConditionalSchema, taking a map of keywords to field values.
 */
schema.core.map__GT_ConditionalSchema = (function schema$core$map__GT_ConditionalSchema(G__2564){
var extmap__4424__auto__ = (function (){var G__2587 = cljs.core.dissoc.call(null,G__2564,new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355),new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428));
if(cljs.core.record_QMARK_.call(null,G__2564)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2587);
} else {
return G__2587;
}
})();
return (new schema.core.ConditionalSchema(new cljs.core.Keyword(null,"preds-and-schemas","preds-and-schemas",-1306766355).cljs$core$IFn$_invoke$arity$1(G__2564),new cljs.core.Keyword(null,"error-symbol","error-symbol",-823480428).cljs$core$IFn$_invoke$arity$1(G__2564),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.ConditionalSchema.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.ConditionalSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * Define a conditional schema.  Takes args like cond,
 * (conditional pred1 schema1 pred2 schema2 ...),
 * and checks the first schemaX where predX (an ordinary Clojure function
 * that returns true or false) returns true on the value.
 * Unlike cond, throws if the value does not match any condition.
 * :else may be used as a final condition in the place of (constantly true).
 * More efficient than either, since only one schema must be checked.
 * An optional final argument can be passed, a symbol to appear in
 * error messages when none of the conditions match.
 */
schema.core.conditional = (function schema$core$conditional(var_args){
var args__4736__auto__ = [];
var len__4730__auto___2601 = arguments.length;
var i__4731__auto___2602 = (0);
while(true){
if((i__4731__auto___2602 < len__4730__auto___2601)){
args__4736__auto__.push((arguments[i__4731__auto___2602]));

var G__2603 = (i__4731__auto___2602 + (1));
i__4731__auto___2602 = G__2603;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return schema.core.conditional.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

schema.core.conditional.cljs$core$IFn$_invoke$arity$variadic = (function (preds_and_schemas){
if(((cljs.core.seq.call(null,preds_and_schemas)) && (((cljs.core.even_QMARK_.call(null,cljs.core.count.call(null,preds_and_schemas))) || ((cljs.core.last.call(null,preds_and_schemas) instanceof cljs.core.Symbol)))))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Expected even, nonzero number of args (with optional trailing symbol); got %s",cljs.core.count.call(null,preds_and_schemas))));
}

return (new schema.core.ConditionalSchema(cljs.core.vec.call(null,(function (){var iter__4523__auto__ = (function schema$core$iter__2591(s__2592){
return (new cljs.core.LazySeq(null,(function (){
var s__2592__$1 = s__2592;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2592__$1);
if(temp__4657__auto__){
var s__2592__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2592__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2592__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2594 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2593 = (0);
while(true){
if((i__2593 < size__4522__auto__)){
var vec__2595 = cljs.core._nth.call(null,c__4521__auto__,i__2593);
var pred = cljs.core.nth.call(null,vec__2595,(0),null);
var schema__$1 = cljs.core.nth.call(null,vec__2595,(1),null);
cljs.core.chunk_append.call(null,b__2594,(function (){
if(cljs.core.ifn_QMARK_.call(null,pred)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,["Conditional predicate ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pred)," must be a function"].join(''))));
}

return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [((cljs.core._EQ_.call(null,pred,new cljs.core.Keyword(null,"else","else",-1508377146)))?cljs.core.constantly.call(null,true):pred),schema__$1], null);
})()
);

var G__2604 = (i__2593 + (1));
i__2593 = G__2604;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2594),schema$core$iter__2591.call(null,cljs.core.chunk_rest.call(null,s__2592__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2594),null);
}
} else {
var vec__2598 = cljs.core.first.call(null,s__2592__$2);
var pred = cljs.core.nth.call(null,vec__2598,(0),null);
var schema__$1 = cljs.core.nth.call(null,vec__2598,(1),null);
return cljs.core.cons.call(null,(function (){
if(cljs.core.ifn_QMARK_.call(null,pred)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,["Conditional predicate ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pred)," must be a function"].join(''))));
}

return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [((cljs.core._EQ_.call(null,pred,new cljs.core.Keyword(null,"else","else",-1508377146)))?cljs.core.constantly.call(null,true):pred),schema__$1], null);
})()
,schema$core$iter__2591.call(null,cljs.core.rest.call(null,s__2592__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__4523__auto__.call(null,cljs.core.partition.call(null,(2),preds_and_schemas));
})()),((cljs.core.odd_QMARK_.call(null,cljs.core.count.call(null,preds_and_schemas)))?cljs.core.last.call(null,preds_and_schemas):null),null,null,null));
});

schema.core.conditional.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
schema.core.conditional.cljs$lang$applyTo = (function (seq2590){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq2590));
});


/**
 * @interface
 */
schema.core.HasPrecondition = function(){};

/**
 * Return a predicate representing the Precondition for this schema:
 *   the predicate returns true if the precondition is satisfied.
 *   (See spec.core for more details)
 */
schema.core.precondition = (function schema$core$precondition(this$){
if((((!((this$ == null)))) && ((!((this$.schema$core$HasPrecondition$precondition$arity$1 == null)))))){
return this$.schema$core$HasPrecondition$precondition$arity$1(this$);
} else {
var x__4433__auto__ = (((this$ == null))?null:this$);
var m__4434__auto__ = (schema.core.precondition[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,this$);
} else {
var m__4431__auto__ = (schema.core.precondition["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"HasPrecondition.precondition",this$);
}
}
}
});

schema.spec.leaf.LeafSpec.prototype.schema$core$HasPrecondition$ = cljs.core.PROTOCOL_SENTINEL;

schema.spec.leaf.LeafSpec.prototype.schema$core$HasPrecondition$precondition$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.complement.call(null,this$__$1.pre);
});

schema.spec.variant.VariantSpec.prototype.schema$core$HasPrecondition$ = cljs.core.PROTOCOL_SENTINEL;

schema.spec.variant.VariantSpec.prototype.schema$core$HasPrecondition$precondition$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.every_pred.call(null,cljs.core.complement.call(null,this$__$1.pre),cljs.core.apply.call(null,cljs.core.some_fn,(function (){var iter__4523__auto__ = ((function (this$__$1){
return (function schema$core$iter__2605(s__2606){
return (new cljs.core.LazySeq(null,((function (this$__$1){
return (function (){
var s__2606__$1 = s__2606;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2606__$1);
if(temp__4657__auto__){
var s__2606__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2606__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2606__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2608 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2607 = (0);
while(true){
if((i__2607 < size__4522__auto__)){
var map__2609 = cljs.core._nth.call(null,c__4521__auto__,i__2607);
var map__2609__$1 = (((((!((map__2609 == null))))?(((((map__2609.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__2609.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__2609):map__2609);
var guard = cljs.core.get.call(null,map__2609__$1,new cljs.core.Keyword(null,"guard","guard",-873147811));
var schema__$1 = cljs.core.get.call(null,map__2609__$1,new cljs.core.Keyword(null,"schema","schema",-1582001791));
cljs.core.chunk_append.call(null,b__2608,(cljs.core.truth_(guard)?cljs.core.every_pred.call(null,guard,schema.core.precondition.call(null,schema.core.spec.call(null,schema__$1))):schema.core.precondition.call(null,schema.core.spec.call(null,schema__$1))));

var G__2613 = (i__2607 + (1));
i__2607 = G__2613;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2608),schema$core$iter__2605.call(null,cljs.core.chunk_rest.call(null,s__2606__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2608),null);
}
} else {
var map__2611 = cljs.core.first.call(null,s__2606__$2);
var map__2611__$1 = (((((!((map__2611 == null))))?(((((map__2611.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__2611.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__2611):map__2611);
var guard = cljs.core.get.call(null,map__2611__$1,new cljs.core.Keyword(null,"guard","guard",-873147811));
var schema__$1 = cljs.core.get.call(null,map__2611__$1,new cljs.core.Keyword(null,"schema","schema",-1582001791));
return cljs.core.cons.call(null,(cljs.core.truth_(guard)?cljs.core.every_pred.call(null,guard,schema.core.precondition.call(null,schema.core.spec.call(null,schema__$1))):schema.core.precondition.call(null,schema.core.spec.call(null,schema__$1))),schema$core$iter__2605.call(null,cljs.core.rest.call(null,s__2606__$2)));
}
} else {
return null;
}
break;
}
});})(this$__$1))
,null,null));
});})(this$__$1))
;
return iter__4523__auto__.call(null,this$__$1.options);
})()));
});

schema.spec.collection.CollectionSpec.prototype.schema$core$HasPrecondition$ = cljs.core.PROTOCOL_SENTINEL;

schema.spec.collection.CollectionSpec.prototype.schema$core$HasPrecondition$precondition$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.complement.call(null,this$__$1.pre);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.CondPre = (function (schemas,__meta,__extmap,__hash){
this.schemas = schemas;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.CondPre.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.CondPre.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2616,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2620 = k2616;
var G__2620__$1 = (((G__2620 instanceof cljs.core.Keyword))?G__2620.fqn:null);
switch (G__2620__$1) {
case "schemas":
return self__.schemas;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2616,else__4388__auto__);

}
});

schema.core.CondPre.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2621){
var vec__2622 = p__2621;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2622,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2622,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.CondPre.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.CondPre{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schemas","schemas",575070579),self__.schemas],null))], null),self__.__extmap));
});

schema.core.CondPre.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2615){
var self__ = this;
var G__2615__$1 = this;
return (new cljs.core.RecordIter((0),G__2615__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schemas","schemas",575070579)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.CondPre.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.CondPre.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.CondPre(self__.schemas,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.CondPre.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.CondPre.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-56613580 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.CondPre.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2617,other2618){
var self__ = this;
var this2617__$1 = this;
return (((!((other2618 == null)))) && ((this2617__$1.constructor === other2618.constructor)) && (cljs.core._EQ_.call(null,this2617__$1.schemas,other2618.schemas)) && (cljs.core._EQ_.call(null,this2617__$1.__extmap,other2618.__extmap)));
});

schema.core.CondPre.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schemas","schemas",575070579),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.CondPre(self__.schemas,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.CondPre.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2615){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2625 = cljs.core.keyword_identical_QMARK_;
var expr__2626 = k__4393__auto__;
if(cljs.core.truth_(pred__2625.call(null,new cljs.core.Keyword(null,"schemas","schemas",575070579),expr__2626))){
return (new schema.core.CondPre(G__2615,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.CondPre(self__.schemas,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2615),null));
}
});

schema.core.CondPre.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schemas","schemas",575070579),self__.schemas,null))], null),self__.__extmap));
});

schema.core.CondPre.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2615){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.CondPre(self__.schemas,G__2615,self__.__extmap,self__.__hash));
});

schema.core.CondPre.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.CondPre.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.CondPre.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,(function (){var iter__4523__auto__ = ((function (this$__$1){
return (function schema$core$iter__2628(s__2629){
return (new cljs.core.LazySeq(null,((function (this$__$1){
return (function (){
var s__2629__$1 = s__2629;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2629__$1);
if(temp__4657__auto__){
var s__2629__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2629__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2629__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2631 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2630 = (0);
while(true){
if((i__2630 < size__4522__auto__)){
var s = cljs.core._nth.call(null,c__4521__auto__,i__2630);
cljs.core.chunk_append.call(null,b__2631,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),schema.core.precondition.call(null,schema.core.spec.call(null,s)),new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null));

var G__2634 = (i__2630 + (1));
i__2630 = G__2634;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2631),schema$core$iter__2628.call(null,cljs.core.chunk_rest.call(null,s__2629__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2631),null);
}
} else {
var s = cljs.core.first.call(null,s__2629__$2);
return cljs.core.cons.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),schema.core.precondition.call(null,schema.core.spec.call(null,s)),new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null),schema$core$iter__2628.call(null,cljs.core.rest.call(null,s__2629__$2)));
}
} else {
return null;
}
break;
}
});})(this$__$1))
,null,null));
});})(this$__$1))
;
return iter__4523__auto__.call(null,self__.schemas);
})(),((function (this$__$1){
return (function (p1__2614_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"matches-some-precondition?","matches-some-precondition?",2123072832,null),(new cljs.core.List(null,p1__2614_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
);
});

schema.core.CondPre.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.cons.call(null,new cljs.core.Symbol(null,"cond-pre","cond-pre",-923707731,null),cljs.core.map.call(null,schema.core.explain,self__.schemas));
});

schema.core.CondPre.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schemas","schemas",-2079365190,null)], null);
});

schema.core.CondPre.cljs$lang$type = true;

schema.core.CondPre.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/CondPre",null,(1),null));
});

schema.core.CondPre.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/CondPre");
});

/**
 * Positional factory function for schema.core/CondPre.
 */
schema.core.__GT_CondPre = (function schema$core$__GT_CondPre(schemas){
return (new schema.core.CondPre(schemas,null,null,null));
});

/**
 * Factory function for schema.core/CondPre, taking a map of keywords to field values.
 */
schema.core.map__GT_CondPre = (function schema$core$map__GT_CondPre(G__2619){
var extmap__4424__auto__ = (function (){var G__2632 = cljs.core.dissoc.call(null,G__2619,new cljs.core.Keyword(null,"schemas","schemas",575070579));
if(cljs.core.record_QMARK_.call(null,G__2619)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2632);
} else {
return G__2632;
}
})();
return (new schema.core.CondPre(new cljs.core.Keyword(null,"schemas","schemas",575070579).cljs$core$IFn$_invoke$arity$1(G__2619),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.CondPre.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.CondPre.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A replacement for `either` that constructs a conditional schema
 * based on the schema spec preconditions of the component schemas.
 * 
 * Given a datum, the preconditions for each schema (which typically
 * check just the outermost class) are tested against the datum in turn.
 * The first schema whose precondition matches is greedily selected,
 * and the datum is validated against that schema.  Unlike `either`,
 * a validation failure is final (and there is no backtracking to try
 * other schemas that might match).
 * 
 * Thus, `cond-pre` is only suitable for schemas with mutually exclusive
 * preconditions (e.g., s/Int and s/Str).  If this doesn't hold
 * (e.g. {:a s/Int} and {:b s/Str}), you must use `conditional` instead
 * and provide an explicit condition for distinguishing the cases.
 * 
 * EXPERIMENTAL
 */
schema.core.cond_pre = (function schema$core$cond_pre(var_args){
var args__4736__auto__ = [];
var len__4730__auto___2636 = arguments.length;
var i__4731__auto___2637 = (0);
while(true){
if((i__4731__auto___2637 < len__4730__auto___2636)){
args__4736__auto__.push((arguments[i__4731__auto___2637]));

var G__2638 = (i__4731__auto___2637 + (1));
i__4731__auto___2637 = G__2638;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return schema.core.cond_pre.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

schema.core.cond_pre.cljs$core$IFn$_invoke$arity$variadic = (function (schemas){
return (new schema.core.CondPre(schemas,null,null,null));
});

schema.core.cond_pre.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
schema.core.cond_pre.cljs$lang$applyTo = (function (seq2635){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq2635));
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Constrained = (function (schema,postcondition,post_name,__meta,__extmap,__hash){
this.schema = schema;
this.postcondition = postcondition;
this.post_name = post_name;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Constrained.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Constrained.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2641,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2645 = k2641;
var G__2645__$1 = (((G__2645 instanceof cljs.core.Keyword))?G__2645.fqn:null);
switch (G__2645__$1) {
case "schema":
return self__.schema;

break;
case "postcondition":
return self__.postcondition;

break;
case "post-name":
return self__.post_name;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2641,else__4388__auto__);

}
});

schema.core.Constrained.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2646){
var vec__2647 = p__2646;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2647,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2647,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Constrained.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Constrained{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"postcondition","postcondition",-737101222),self__.postcondition],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"post-name","post-name",491455269),self__.post_name],null))], null),self__.__extmap));
});

schema.core.Constrained.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2640){
var self__ = this;
var G__2640__$1 = this;
return (new cljs.core.RecordIter((0),G__2640__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"postcondition","postcondition",-737101222),new cljs.core.Keyword(null,"post-name","post-name",491455269)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Constrained.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Constrained.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Constrained(self__.schema,self__.postcondition,self__.post_name,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Constrained.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (3 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Constrained.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (725895648 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Constrained.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2642,other2643){
var self__ = this;
var this2642__$1 = this;
return (((!((other2643 == null)))) && ((this2642__$1.constructor === other2643.constructor)) && (cljs.core._EQ_.call(null,this2642__$1.schema,other2643.schema)) && (cljs.core._EQ_.call(null,this2642__$1.postcondition,other2643.postcondition)) && (cljs.core._EQ_.call(null,this2642__$1.post_name,other2643.post_name)) && (cljs.core._EQ_.call(null,this2642__$1.__extmap,other2643.__extmap)));
});

schema.core.Constrained.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null,new cljs.core.Keyword(null,"post-name","post-name",491455269),null,new cljs.core.Keyword(null,"postcondition","postcondition",-737101222),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Constrained(self__.schema,self__.postcondition,self__.post_name,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Constrained.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2640){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2650 = cljs.core.keyword_identical_QMARK_;
var expr__2651 = k__4393__auto__;
if(cljs.core.truth_(pred__2650.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2651))){
return (new schema.core.Constrained(G__2640,self__.postcondition,self__.post_name,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2650.call(null,new cljs.core.Keyword(null,"postcondition","postcondition",-737101222),expr__2651))){
return (new schema.core.Constrained(self__.schema,G__2640,self__.post_name,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2650.call(null,new cljs.core.Keyword(null,"post-name","post-name",491455269),expr__2651))){
return (new schema.core.Constrained(self__.schema,self__.postcondition,G__2640,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Constrained(self__.schema,self__.postcondition,self__.post_name,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2640),null));
}
}
}
});

schema.core.Constrained.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"postcondition","postcondition",-737101222),self__.postcondition,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"post-name","post-name",491455269),self__.post_name,null))], null),self__.__extmap));
});

schema.core.Constrained.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2640){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Constrained(self__.schema,self__.postcondition,self__.post_name,G__2640,self__.__extmap,self__.__hash));
});

schema.core.Constrained.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Constrained.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Constrained.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema], null)], null),null,schema.spec.core.precondition.call(null,this$__$1,self__.postcondition,((function (this$__$1){
return (function (p1__2639_SHARP_){
return (new cljs.core.List(null,self__.post_name,(new cljs.core.List(null,p1__2639_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
));
});

schema.core.Constrained.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"constrained","constrained",-2057147788,null),(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),(new cljs.core.List(null,self__.post_name,null,(1),null)),(2),null)),(3),null));
});

schema.core.Constrained.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.Symbol(null,"postcondition","postcondition",903430305,null),new cljs.core.Symbol(null,"post-name","post-name",2131986796,null)], null);
});

schema.core.Constrained.cljs$lang$type = true;

schema.core.Constrained.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Constrained",null,(1),null));
});

schema.core.Constrained.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Constrained");
});

/**
 * Positional factory function for schema.core/Constrained.
 */
schema.core.__GT_Constrained = (function schema$core$__GT_Constrained(schema__$1,postcondition,post_name){
return (new schema.core.Constrained(schema__$1,postcondition,post_name,null,null,null));
});

/**
 * Factory function for schema.core/Constrained, taking a map of keywords to field values.
 */
schema.core.map__GT_Constrained = (function schema$core$map__GT_Constrained(G__2644){
var extmap__4424__auto__ = (function (){var G__2653 = cljs.core.dissoc.call(null,G__2644,new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"postcondition","postcondition",-737101222),new cljs.core.Keyword(null,"post-name","post-name",491455269));
if(cljs.core.record_QMARK_.call(null,G__2644)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2653);
} else {
return G__2653;
}
})();
return (new schema.core.Constrained(new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2644),new cljs.core.Keyword(null,"postcondition","postcondition",-737101222).cljs$core$IFn$_invoke$arity$1(G__2644),new cljs.core.Keyword(null,"post-name","post-name",491455269).cljs$core$IFn$_invoke$arity$1(G__2644),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Constrained.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Constrained.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A schema with an additional post-condition.  Differs from `conditional`
 * with a single schema, in that the predicate checked *after* the main
 * schema.  This can lead to better error messages, and is often better
 * suited for coercion.
 */
schema.core.constrained = (function schema$core$constrained(var_args){
var G__2656 = arguments.length;
switch (G__2656) {
case 2:
return schema.core.constrained.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return schema.core.constrained.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

schema.core.constrained.cljs$core$IFn$_invoke$arity$2 = (function (s,p_QMARK_){
return schema.core.constrained.call(null,s,p_QMARK_,cljs.core.symbol.call(null,schema.utils.fn_name.call(null,p_QMARK_)));
});

schema.core.constrained.cljs$core$IFn$_invoke$arity$3 = (function (s,p_QMARK_,pred_name){
if(cljs.core.ifn_QMARK_.call(null,p_QMARK_)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Not a function: %s",p_QMARK_)));
}

return (new schema.core.Constrained(s,p_QMARK_,pred_name,null,null,null));
});

schema.core.constrained.cljs$lang$maxFixedArity = 3;


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {schema.core.HasPrecondition}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {schema.spec.core.CoreSpec}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Both = (function (schemas,__meta,__extmap,__hash){
this.schemas = schemas;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Both.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Both.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2660,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2664 = k2660;
var G__2664__$1 = (((G__2664 instanceof cljs.core.Keyword))?G__2664.fqn:null);
switch (G__2664__$1) {
case "schemas":
return self__.schemas;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2660,else__4388__auto__);

}
});

schema.core.Both.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2665){
var vec__2666 = p__2665;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2666,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2666,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Both.prototype.schema$spec$core$CoreSpec$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Both.prototype.schema$spec$core$CoreSpec$subschemas$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return self__.schemas;
});

schema.core.Both.prototype.schema$spec$core$CoreSpec$checker$arity$2 = (function (this$,params){
var self__ = this;
var this$__$1 = this;
return cljs.core.reduce.call(null,((function (this$__$1){
return (function (f,t){
return ((function (this$__$1){
return (function (x){
var tx = t.call(null,x);
if(schema.utils.error_QMARK_.call(null,tx)){
return tx;
} else {
return f.call(null,(function (){var or__4131__auto__ = tx;
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
return x;
}
})());
}
});
;})(this$__$1))
});})(this$__$1))
,cljs.core.map.call(null,((function (this$__$1){
return (function (p1__2658_SHARP_){
return schema.spec.core.sub_checker.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),p1__2658_SHARP_], null),params);
});})(this$__$1))
,cljs.core.reverse.call(null,self__.schemas)));
});

schema.core.Both.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Both{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schemas","schemas",575070579),self__.schemas],null))], null),self__.__extmap));
});

schema.core.Both.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2659){
var self__ = this;
var G__2659__$1 = this;
return (new cljs.core.RecordIter((0),G__2659__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schemas","schemas",575070579)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Both.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Both.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Both(self__.schemas,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Both.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Both.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (1189778852 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Both.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2661,other2662){
var self__ = this;
var this2661__$1 = this;
return (((!((other2662 == null)))) && ((this2661__$1.constructor === other2662.constructor)) && (cljs.core._EQ_.call(null,this2661__$1.schemas,other2662.schemas)) && (cljs.core._EQ_.call(null,this2661__$1.__extmap,other2662.__extmap)));
});

schema.core.Both.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schemas","schemas",575070579),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Both(self__.schemas,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Both.prototype.schema$core$HasPrecondition$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Both.prototype.schema$core$HasPrecondition$precondition$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.apply.call(null,cljs.core.every_pred,cljs.core.map.call(null,cljs.core.comp.call(null,schema.core.precondition,schema.core.spec),self__.schemas));
});

schema.core.Both.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2659){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2669 = cljs.core.keyword_identical_QMARK_;
var expr__2670 = k__4393__auto__;
if(cljs.core.truth_(pred__2669.call(null,new cljs.core.Keyword(null,"schemas","schemas",575070579),expr__2670))){
return (new schema.core.Both(G__2659,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Both(self__.schemas,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2659),null));
}
});

schema.core.Both.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schemas","schemas",575070579),self__.schemas,null))], null),self__.__extmap));
});

schema.core.Both.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2659){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Both(self__.schemas,G__2659,self__.__extmap,self__.__hash));
});

schema.core.Both.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Both.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Both.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return this$__$1;
});

schema.core.Both.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.cons.call(null,new cljs.core.Symbol(null,"both","both",1246882687,null),cljs.core.map.call(null,schema.core.explain,self__.schemas));
});

schema.core.Both.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schemas","schemas",-2079365190,null)], null);
});

schema.core.Both.cljs$lang$type = true;

schema.core.Both.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Both",null,(1),null));
});

schema.core.Both.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Both");
});

/**
 * Positional factory function for schema.core/Both.
 */
schema.core.__GT_Both = (function schema$core$__GT_Both(schemas){
return (new schema.core.Both(schemas,null,null,null));
});

/**
 * Factory function for schema.core/Both, taking a map of keywords to field values.
 */
schema.core.map__GT_Both = (function schema$core$map__GT_Both(G__2663){
var extmap__4424__auto__ = (function (){var G__2672 = cljs.core.dissoc.call(null,G__2663,new cljs.core.Keyword(null,"schemas","schemas",575070579));
if(cljs.core.record_QMARK_.call(null,G__2663)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2672);
} else {
return G__2672;
}
})();
return (new schema.core.Both(new cljs.core.Keyword(null,"schemas","schemas",575070579).cljs$core$IFn$_invoke$arity$1(G__2663),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Both.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Both.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * A value that must satisfy every schema in schemas.
 * 
 * DEPRECATED: prefer 'conditional' with a single condition
 * instead, or `constrained`.
 * 
 * When used with coercion, coerces each schema in sequence.
 */
schema.core.both = (function schema$core$both(var_args){
var args__4736__auto__ = [];
var len__4730__auto___2675 = arguments.length;
var i__4731__auto___2676 = (0);
while(true){
if((i__4731__auto___2676 < len__4730__auto___2675)){
args__4736__auto__.push((arguments[i__4731__auto___2676]));

var G__2677 = (i__4731__auto___2676 + (1));
i__4731__auto___2676 = G__2677;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return schema.core.both.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

schema.core.both.cljs$core$IFn$_invoke$arity$variadic = (function (schemas){
return (new schema.core.Both(schemas,null,null,null));
});

schema.core.both.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
schema.core.both.cljs$lang$applyTo = (function (seq2674){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq2674));
});

/**
 * if the predicate returns truthy, use the if-schema, otherwise use the else-schema
 */
schema.core.if$ = (function schema$core$if(pred,if_schema,else_schema){
return schema.core.conditional.call(null,pred,if_schema,cljs.core.constantly.call(null,true),else_schema);
});
schema.core.var_name = (function schema$core$var_name(v){
var map__2678 = cljs.core.meta.call(null,v);
var map__2678__$1 = (((((!((map__2678 == null))))?(((((map__2678.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__2678.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__2678):map__2678);
var ns = cljs.core.get.call(null,map__2678__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var name = cljs.core.get.call(null,map__2678__$1,new cljs.core.Keyword(null,"name","name",1843675177));
return cljs.core.symbol.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)].join(''));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Recursive = (function (derefable,__meta,__extmap,__hash){
this.derefable = derefable;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Recursive.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Recursive.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2681,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2685 = k2681;
var G__2685__$1 = (((G__2685 instanceof cljs.core.Keyword))?G__2685.fqn:null);
switch (G__2685__$1) {
case "derefable":
return self__.derefable;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2681,else__4388__auto__);

}
});

schema.core.Recursive.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2686){
var vec__2687 = p__2686;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2687,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2687,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Recursive.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Recursive{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"derefable","derefable",377265868),self__.derefable],null))], null),self__.__extmap));
});

schema.core.Recursive.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2680){
var self__ = this;
var G__2680__$1 = this;
return (new cljs.core.RecordIter((0),G__2680__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"derefable","derefable",377265868)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Recursive.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Recursive.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Recursive(self__.derefable,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Recursive.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Recursive.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (1521498755 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Recursive.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2682,other2683){
var self__ = this;
var this2682__$1 = this;
return (((!((other2683 == null)))) && ((this2682__$1.constructor === other2683.constructor)) && (cljs.core._EQ_.call(null,this2682__$1.derefable,other2683.derefable)) && (cljs.core._EQ_.call(null,this2682__$1.__extmap,other2683.__extmap)));
});

schema.core.Recursive.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"derefable","derefable",377265868),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Recursive(self__.derefable,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Recursive.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2680){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2690 = cljs.core.keyword_identical_QMARK_;
var expr__2691 = k__4393__auto__;
if(cljs.core.truth_(pred__2690.call(null,new cljs.core.Keyword(null,"derefable","derefable",377265868),expr__2691))){
return (new schema.core.Recursive(G__2680,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Recursive(self__.derefable,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2680),null));
}
});

schema.core.Recursive.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"derefable","derefable",377265868),self__.derefable,null))], null),self__.__extmap));
});

schema.core.Recursive.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2680){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Recursive(self__.derefable,G__2680,self__.__extmap,self__.__hash));
});

schema.core.Recursive.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Recursive.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Recursive.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),cljs.core.deref.call(null,self__.derefable)], null)], null));
});

schema.core.Recursive.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"recursive","recursive",-1935549897,null),(new cljs.core.List(null,(((self__.derefable instanceof cljs.core.Var))?(new cljs.core.List(null,new cljs.core.Symbol(null,"var","var",870848730,null),(new cljs.core.List(null,schema.core.var_name.call(null,self__.derefable),null,(1),null)),(2),null)):new cljs.core.Symbol(null,"...","...",-1926939749,null)),null,(1),null)),(2),null));
});

schema.core.Recursive.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"derefable","derefable",2017797395,null)], null);
});

schema.core.Recursive.cljs$lang$type = true;

schema.core.Recursive.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Recursive",null,(1),null));
});

schema.core.Recursive.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Recursive");
});

/**
 * Positional factory function for schema.core/Recursive.
 */
schema.core.__GT_Recursive = (function schema$core$__GT_Recursive(derefable){
return (new schema.core.Recursive(derefable,null,null,null));
});

/**
 * Factory function for schema.core/Recursive, taking a map of keywords to field values.
 */
schema.core.map__GT_Recursive = (function schema$core$map__GT_Recursive(G__2684){
var extmap__4424__auto__ = (function (){var G__2693 = cljs.core.dissoc.call(null,G__2684,new cljs.core.Keyword(null,"derefable","derefable",377265868));
if(cljs.core.record_QMARK_.call(null,G__2684)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2693);
} else {
return G__2693;
}
})();
return (new schema.core.Recursive(new cljs.core.Keyword(null,"derefable","derefable",377265868).cljs$core$IFn$_invoke$arity$1(G__2684),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Recursive.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Recursive.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * Support for (mutually) recursive schemas by passing a var that points to a schema,
 * e.g (recursive #'ExampleRecursiveSchema).
 */
schema.core.recursive = (function schema$core$recursive(schema__$1){
if((((!((schema__$1 == null))))?(((((schema__$1.cljs$lang$protocol_mask$partition0$ & (32768))) || ((cljs.core.PROTOCOL_SENTINEL === schema__$1.cljs$core$IDeref$))))?true:(((!schema__$1.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IDeref,schema__$1):false)):cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IDeref,schema__$1))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Not an IDeref: %s",schema__$1)));
}

return (new schema.core.Recursive(schema__$1,null,null,null));
});
schema.core.atom_QMARK_ = (function schema$core$atom_QMARK_(x){
if((!((x == null)))){
if((((x.cljs$lang$protocol_mask$partition1$ & (16384))) || ((cljs.core.PROTOCOL_SENTINEL === x.cljs$core$IAtom$)))){
return true;
} else {
if((!x.cljs$lang$protocol_mask$partition1$)){
return cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IAtom,x);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IAtom,x);
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Atomic = (function (schema,__meta,__extmap,__hash){
this.schema = schema;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Atomic.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Atomic.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2698,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2702 = k2698;
var G__2702__$1 = (((G__2702 instanceof cljs.core.Keyword))?G__2702.fqn:null);
switch (G__2702__$1) {
case "schema":
return self__.schema;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2698,else__4388__auto__);

}
});

schema.core.Atomic.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2703){
var vec__2704 = p__2703;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2704,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2704,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Atomic.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Atomic{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null))], null),self__.__extmap));
});

schema.core.Atomic.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2697){
var self__ = this;
var G__2697__$1 = this;
return (new cljs.core.RecordIter((0),G__2697__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Atomic.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Atomic.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Atomic(self__.schema,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Atomic.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Atomic.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (1019346599 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Atomic.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2699,other2700){
var self__ = this;
var this2699__$1 = this;
return (((!((other2700 == null)))) && ((this2699__$1.constructor === other2700.constructor)) && (cljs.core._EQ_.call(null,this2699__$1.schema,other2700.schema)) && (cljs.core._EQ_.call(null,this2699__$1.__extmap,other2700.__extmap)));
});

schema.core.Atomic.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Atomic(self__.schema,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Atomic.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2697){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2707 = cljs.core.keyword_identical_QMARK_;
var expr__2708 = k__4393__auto__;
if(cljs.core.truth_(pred__2707.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2708))){
return (new schema.core.Atomic(G__2697,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Atomic(self__.schema,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2697),null));
}
});

schema.core.Atomic.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null))], null),self__.__extmap));
});

schema.core.Atomic.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2697){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Atomic(self__.schema,G__2697,self__.__extmap,self__.__hash));
});

schema.core.Atomic.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Atomic.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Atomic.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.collection.collection_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,schema.core.atom_QMARK_,((function (this$__$1){
return (function (p1__975__976__auto__){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"atom?","atom?",-1007535292,null),(new cljs.core.List(null,p1__975__976__auto__,null,(1),null)),(2),null));
});})(this$__$1))
),cljs.core.atom,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.one_element.call(null,true,self__.schema,((function (this$__$1){
return (function (item_fn,coll){
item_fn.call(null,cljs.core.deref.call(null,coll));

return null;
});})(this$__$1))
)], null),((function (this$__$1){
return (function (_,xs,___$1){
return cljs.core.atom.call(null,cljs.core.first.call(null,xs));
});})(this$__$1))
);
});

schema.core.Atomic.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"atom","atom",1243487874,null),(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),null,(1),null)),(2),null));
});

schema.core.Atomic.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema","schema",58529736,null)], null);
});

schema.core.Atomic.cljs$lang$type = true;

schema.core.Atomic.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Atomic",null,(1),null));
});

schema.core.Atomic.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Atomic");
});

/**
 * Positional factory function for schema.core/Atomic.
 */
schema.core.__GT_Atomic = (function schema$core$__GT_Atomic(schema__$1){
return (new schema.core.Atomic(schema__$1,null,null,null));
});

/**
 * Factory function for schema.core/Atomic, taking a map of keywords to field values.
 */
schema.core.map__GT_Atomic = (function schema$core$map__GT_Atomic(G__2701){
var extmap__4424__auto__ = (function (){var G__2710 = cljs.core.dissoc.call(null,G__2701,new cljs.core.Keyword(null,"schema","schema",-1582001791));
if(cljs.core.record_QMARK_.call(null,G__2701)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2710);
} else {
return G__2710;
}
})();
return (new schema.core.Atomic(new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2701),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Atomic.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Atomic.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * An atom containing a value matching 'schema'.
 */
schema.core.atom = (function schema$core$atom(schema__$1){
return schema.core.__GT_Atomic.call(null,schema__$1);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.RequiredKey = (function (k,__meta,__extmap,__hash){
this.k = k;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.RequiredKey.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.RequiredKey.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2713,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2717 = k2713;
var G__2717__$1 = (((G__2717 instanceof cljs.core.Keyword))?G__2717.fqn:null);
switch (G__2717__$1) {
case "k":
return self__.k;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2713,else__4388__auto__);

}
});

schema.core.RequiredKey.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2718){
var vec__2719 = p__2718;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2719,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2719,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.RequiredKey.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.RequiredKey{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"k","k",-2146297393),self__.k],null))], null),self__.__extmap));
});

schema.core.RequiredKey.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2712){
var self__ = this;
var G__2712__$1 = this;
return (new cljs.core.RecordIter((0),G__2712__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"k","k",-2146297393)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.RequiredKey.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.RequiredKey.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.RequiredKey(self__.k,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.RequiredKey.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.RequiredKey.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1805575094 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.RequiredKey.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2714,other2715){
var self__ = this;
var this2714__$1 = this;
return (((!((other2715 == null)))) && ((this2714__$1.constructor === other2715.constructor)) && (cljs.core._EQ_.call(null,this2714__$1.k,other2715.k)) && (cljs.core._EQ_.call(null,this2714__$1.__extmap,other2715.__extmap)));
});

schema.core.RequiredKey.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"k","k",-2146297393),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.RequiredKey(self__.k,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.RequiredKey.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2712){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2722 = cljs.core.keyword_identical_QMARK_;
var expr__2723 = k__4393__auto__;
if(cljs.core.truth_(pred__2722.call(null,new cljs.core.Keyword(null,"k","k",-2146297393),expr__2723))){
return (new schema.core.RequiredKey(G__2712,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.RequiredKey(self__.k,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2712),null));
}
});

schema.core.RequiredKey.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"k","k",-2146297393),self__.k,null))], null),self__.__extmap));
});

schema.core.RequiredKey.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2712){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.RequiredKey(self__.k,G__2712,self__.__extmap,self__.__hash));
});

schema.core.RequiredKey.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.RequiredKey.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"k","k",-505765866,null)], null);
});

schema.core.RequiredKey.cljs$lang$type = true;

schema.core.RequiredKey.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/RequiredKey",null,(1),null));
});

schema.core.RequiredKey.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/RequiredKey");
});

/**
 * Positional factory function for schema.core/RequiredKey.
 */
schema.core.__GT_RequiredKey = (function schema$core$__GT_RequiredKey(k){
return (new schema.core.RequiredKey(k,null,null,null));
});

/**
 * Factory function for schema.core/RequiredKey, taking a map of keywords to field values.
 */
schema.core.map__GT_RequiredKey = (function schema$core$map__GT_RequiredKey(G__2716){
var extmap__4424__auto__ = (function (){var G__2725 = cljs.core.dissoc.call(null,G__2716,new cljs.core.Keyword(null,"k","k",-2146297393));
if(cljs.core.record_QMARK_.call(null,G__2716)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2725);
} else {
return G__2725;
}
})();
return (new schema.core.RequiredKey(new cljs.core.Keyword(null,"k","k",-2146297393).cljs$core$IFn$_invoke$arity$1(G__2716),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});

/**
 * A required key in a map
 */
schema.core.required_key = (function schema$core$required_key(k){
if((k instanceof cljs.core.Keyword)){
return k;
} else {
return (new schema.core.RequiredKey(k,null,null,null));
}
});
schema.core.required_key_QMARK_ = (function schema$core$required_key_QMARK_(ks){
return (((ks instanceof cljs.core.Keyword)) || ((ks instanceof schema.core.RequiredKey)));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.OptionalKey = (function (k,__meta,__extmap,__hash){
this.k = k;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.OptionalKey.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.OptionalKey.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2728,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2732 = k2728;
var G__2732__$1 = (((G__2732 instanceof cljs.core.Keyword))?G__2732.fqn:null);
switch (G__2732__$1) {
case "k":
return self__.k;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2728,else__4388__auto__);

}
});

schema.core.OptionalKey.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2733){
var vec__2734 = p__2733;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2734,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2734,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.OptionalKey.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.OptionalKey{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"k","k",-2146297393),self__.k],null))], null),self__.__extmap));
});

schema.core.OptionalKey.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2727){
var self__ = this;
var G__2727__$1 = this;
return (new cljs.core.RecordIter((0),G__2727__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"k","k",-2146297393)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.OptionalKey.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.OptionalKey.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.OptionalKey(self__.k,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.OptionalKey.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.OptionalKey.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1508333161 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.OptionalKey.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2729,other2730){
var self__ = this;
var this2729__$1 = this;
return (((!((other2730 == null)))) && ((this2729__$1.constructor === other2730.constructor)) && (cljs.core._EQ_.call(null,this2729__$1.k,other2730.k)) && (cljs.core._EQ_.call(null,this2729__$1.__extmap,other2730.__extmap)));
});

schema.core.OptionalKey.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"k","k",-2146297393),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.OptionalKey(self__.k,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.OptionalKey.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2727){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2737 = cljs.core.keyword_identical_QMARK_;
var expr__2738 = k__4393__auto__;
if(cljs.core.truth_(pred__2737.call(null,new cljs.core.Keyword(null,"k","k",-2146297393),expr__2738))){
return (new schema.core.OptionalKey(G__2727,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.OptionalKey(self__.k,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2727),null));
}
});

schema.core.OptionalKey.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"k","k",-2146297393),self__.k,null))], null),self__.__extmap));
});

schema.core.OptionalKey.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2727){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.OptionalKey(self__.k,G__2727,self__.__extmap,self__.__hash));
});

schema.core.OptionalKey.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.OptionalKey.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"k","k",-505765866,null)], null);
});

schema.core.OptionalKey.cljs$lang$type = true;

schema.core.OptionalKey.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/OptionalKey",null,(1),null));
});

schema.core.OptionalKey.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/OptionalKey");
});

/**
 * Positional factory function for schema.core/OptionalKey.
 */
schema.core.__GT_OptionalKey = (function schema$core$__GT_OptionalKey(k){
return (new schema.core.OptionalKey(k,null,null,null));
});

/**
 * Factory function for schema.core/OptionalKey, taking a map of keywords to field values.
 */
schema.core.map__GT_OptionalKey = (function schema$core$map__GT_OptionalKey(G__2731){
var extmap__4424__auto__ = (function (){var G__2740 = cljs.core.dissoc.call(null,G__2731,new cljs.core.Keyword(null,"k","k",-2146297393));
if(cljs.core.record_QMARK_.call(null,G__2731)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2740);
} else {
return G__2740;
}
})();
return (new schema.core.OptionalKey(new cljs.core.Keyword(null,"k","k",-2146297393).cljs$core$IFn$_invoke$arity$1(G__2731),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});

/**
 * An optional key in a map
 */
schema.core.optional_key = (function schema$core$optional_key(k){
return (new schema.core.OptionalKey(k,null,null,null));
});
schema.core.optional_key_QMARK_ = (function schema$core$optional_key_QMARK_(ks){
return (ks instanceof schema.core.OptionalKey);
});
schema.core.explicit_schema_key = (function schema$core$explicit_schema_key(ks){
if((ks instanceof cljs.core.Keyword)){
return ks;
} else {
if((ks instanceof schema.core.RequiredKey)){
return ks.k;
} else {
if(schema.core.optional_key_QMARK_.call(null,ks)){
return ks.k;
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Bad explicit key: %s",ks)));

}
}
}
});
schema.core.specific_key_QMARK_ = (function schema$core$specific_key_QMARK_(ks){
return ((schema.core.required_key_QMARK_.call(null,ks)) || (schema.core.optional_key_QMARK_.call(null,ks)));
});
schema.core.map_entry_ctor = (function schema$core$map_entry_ctor(p__2742){
var vec__2743 = p__2742;
var k = cljs.core.nth.call(null,vec__2743,(0),null);
var v = cljs.core.nth.call(null,vec__2743,(1),null);
var coll = vec__2743;
return (new cljs.core.MapEntry(k,v,null));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.MapEntry = (function (key_schema,val_schema,__meta,__extmap,__hash){
this.key_schema = key_schema;
this.val_schema = val_schema;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.MapEntry.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.MapEntry.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2747,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2751 = k2747;
var G__2751__$1 = (((G__2751 instanceof cljs.core.Keyword))?G__2751.fqn:null);
switch (G__2751__$1) {
case "key-schema":
return self__.key_schema;

break;
case "val-schema":
return self__.val_schema;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2747,else__4388__auto__);

}
});

schema.core.MapEntry.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2752){
var vec__2753 = p__2752;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2753,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2753,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.MapEntry.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.MapEntry{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726),self__.key_schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619),self__.val_schema],null))], null),self__.__extmap));
});

schema.core.MapEntry.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2746){
var self__ = this;
var G__2746__$1 = this;
return (new cljs.core.RecordIter((0),G__2746__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726),new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.MapEntry.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.MapEntry.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.MapEntry(self__.key_schema,self__.val_schema,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.MapEntry.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.MapEntry.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-804356212 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.MapEntry.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2748,other2749){
var self__ = this;
var this2748__$1 = this;
return (((!((other2749 == null)))) && ((this2748__$1.constructor === other2749.constructor)) && (cljs.core._EQ_.call(null,this2748__$1.key_schema,other2749.key_schema)) && (cljs.core._EQ_.call(null,this2748__$1.val_schema,other2749.val_schema)) && (cljs.core._EQ_.call(null,this2748__$1.__extmap,other2749.__extmap)));
});

schema.core.MapEntry.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726),null,new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.MapEntry(self__.key_schema,self__.val_schema,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.MapEntry.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2746){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2756 = cljs.core.keyword_identical_QMARK_;
var expr__2757 = k__4393__auto__;
if(cljs.core.truth_(pred__2756.call(null,new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726),expr__2757))){
return (new schema.core.MapEntry(G__2746,self__.val_schema,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2756.call(null,new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619),expr__2757))){
return (new schema.core.MapEntry(self__.key_schema,G__2746,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.MapEntry(self__.key_schema,self__.val_schema,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2746),null));
}
}
});

schema.core.MapEntry.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726),self__.key_schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619),self__.val_schema,null))], null),self__.__extmap));
});

schema.core.MapEntry.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2746){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.MapEntry(self__.key_schema,self__.val_schema,G__2746,self__.__extmap,self__.__hash));
});

schema.core.MapEntry.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.MapEntry.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.MapEntry.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.collection.collection_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,schema.core.map_entry_ctor,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.one_element.call(null,true,self__.key_schema,((function (this$__$1){
return (function (item_fn,e){
item_fn.call(null,cljs.core.key.call(null,e));

return e;
});})(this$__$1))
),schema.spec.collection.one_element.call(null,true,self__.val_schema,((function (this$__$1){
return (function (item_fn,e){
item_fn.call(null,cljs.core.val.call(null,e));

return null;
});})(this$__$1))
)], null),((function (this$__$1){
return (function (p__2759,p__2760,_){
var vec__2761 = p__2759;
var k = cljs.core.nth.call(null,vec__2761,(0),null);
var vec__2764 = p__2760;
var xk = cljs.core.nth.call(null,vec__2764,(0),null);
var xv = cljs.core.nth.call(null,vec__2764,(1),null);
var temp__4655__auto__ = schema.utils.error_val.call(null,xk);
if(cljs.core.truth_(temp__4655__auto__)){
var k_err = temp__4655__auto__;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k_err,new cljs.core.Symbol(null,"invalid-key","invalid-key",-1461682245,null)], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,schema.utils.error_val.call(null,xv)], null);
}
});})(this$__$1))
);
});

schema.core.MapEntry.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"map-entry","map-entry",329617471,null),(new cljs.core.List(null,schema.core.explain.call(null,self__.key_schema),(new cljs.core.List(null,schema.core.explain.call(null,self__.val_schema),null,(1),null)),(2),null)),(3),null));
});

schema.core.MapEntry.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"key-schema","key-schema",543870801,null),new cljs.core.Symbol(null,"val-schema","val-schema",-374242092,null)], null);
});

schema.core.MapEntry.cljs$lang$type = true;

schema.core.MapEntry.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/MapEntry",null,(1),null));
});

schema.core.MapEntry.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/MapEntry");
});

/**
 * Positional factory function for schema.core/MapEntry.
 */
schema.core.__GT_MapEntry = (function schema$core$__GT_MapEntry(key_schema,val_schema){
return (new schema.core.MapEntry(key_schema,val_schema,null,null,null));
});

/**
 * Factory function for schema.core/MapEntry, taking a map of keywords to field values.
 */
schema.core.map__GT_MapEntry = (function schema$core$map__GT_MapEntry(G__2750){
var extmap__4424__auto__ = (function (){var G__2767 = cljs.core.dissoc.call(null,G__2750,new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726),new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619));
if(cljs.core.record_QMARK_.call(null,G__2750)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2767);
} else {
return G__2767;
}
})();
return (new schema.core.MapEntry(new cljs.core.Keyword(null,"key-schema","key-schema",-1096660726).cljs$core$IFn$_invoke$arity$1(G__2750),new cljs.core.Keyword(null,"val-schema","val-schema",-2014773619).cljs$core$IFn$_invoke$arity$1(G__2750),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.MapEntry.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.MapEntry.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

schema.core.map_entry = (function schema$core$map_entry(key_schema,val_schema){
return (new schema.core.MapEntry(key_schema,val_schema,null,null,null));
});
schema.core.find_extra_keys_schema = (function schema$core$find_extra_keys_schema(map_schema){
var key_schemata = cljs.core.remove.call(null,schema.core.specific_key_QMARK_,cljs.core.keys.call(null,map_schema));
if((cljs.core.count.call(null,key_schemata) < (2))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"More than one non-optional/required key schemata: %s",cljs.core.vec.call(null,key_schemata))));
}

return cljs.core.first.call(null,key_schemata);
});
schema.core.explain_kspec = (function schema$core$explain_kspec(kspec){
if(schema.core.specific_key_QMARK_.call(null,kspec)){
if((kspec instanceof cljs.core.Keyword)){
return kspec;
} else {
return (new cljs.core.List(null,((schema.core.required_key_QMARK_.call(null,kspec))?new cljs.core.Symbol(null,"required-key","required-key",1624616412,null):((schema.core.optional_key_QMARK_.call(null,kspec))?new cljs.core.Symbol(null,"optional-key","optional-key",988406145,null):null)),(new cljs.core.List(null,schema.core.explicit_schema_key.call(null,kspec),null,(1),null)),(2),null));
}
} else {
return schema.core.explain.call(null,kspec);
}
});
schema.core.map_elements = (function schema$core$map_elements(this$){
var extra_keys_schema = schema.core.find_extra_keys_schema.call(null,this$);
var duplicate_keys_2784 = cljs.core.mapv.call(null,schema.core.explain_kspec,cljs.core.apply.call(null,cljs.core.concat,cljs.core.filter.call(null,((function (extra_keys_schema){
return (function (p1__2769_SHARP_){
return (cljs.core.count.call(null,p1__2769_SHARP_) > (1));
});})(extra_keys_schema))
,cljs.core.vals.call(null,cljs.core.group_by.call(null,schema.core.explicit_schema_key,cljs.core.keys.call(null,cljs.core.dissoc.call(null,this$,extra_keys_schema)))))));
if(cljs.core.empty_QMARK_.call(null,duplicate_keys_2784)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Schema has multiple variants of the same explicit key: %s",duplicate_keys_2784)));
}

var without_extra_keys_schema = cljs.core.dissoc.call(null,this$,extra_keys_schema);
return cljs.core.concat.call(null,(function (){var iter__4523__auto__ = ((function (without_extra_keys_schema,extra_keys_schema){
return (function schema$core$map_elements_$_iter__2771(s__2772){
return (new cljs.core.LazySeq(null,((function (without_extra_keys_schema,extra_keys_schema){
return (function (){
var s__2772__$1 = s__2772;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2772__$1);
if(temp__4657__auto__){
var s__2772__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2772__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2772__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2774 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2773 = (0);
while(true){
if((i__2773 < size__4522__auto__)){
var vec__2775 = cljs.core._nth.call(null,c__4521__auto__,i__2773);
var k = cljs.core.nth.call(null,vec__2775,(0),null);
var v = cljs.core.nth.call(null,vec__2775,(1),null);
cljs.core.chunk_append.call(null,b__2774,(function (){var rk = schema.core.explicit_schema_key.call(null,k);
var required_QMARK_ = schema.core.required_key_QMARK_.call(null,k);
return schema.spec.collection.one_element.call(null,required_QMARK_,schema.core.map_entry.call(null,schema.core.eq.call(null,rk),v),((function (i__2773,rk,required_QMARK_,vec__2775,k,v,c__4521__auto__,size__4522__auto__,b__2774,s__2772__$2,temp__4657__auto__,without_extra_keys_schema,extra_keys_schema){
return (function (item_fn,m){
var e = cljs.core.find.call(null,m,rk);
if(cljs.core.truth_(e)){
item_fn.call(null,e);
} else {
if(required_QMARK_){
item_fn.call(null,schema.utils.error.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rk,new cljs.core.Symbol(null,"missing-required-key","missing-required-key",709961446,null)], null)));
} else {
}
}

if(cljs.core.truth_(e)){
return cljs.core.dissoc.call(null,m,rk);
} else {
return m;
}
});})(i__2773,rk,required_QMARK_,vec__2775,k,v,c__4521__auto__,size__4522__auto__,b__2774,s__2772__$2,temp__4657__auto__,without_extra_keys_schema,extra_keys_schema))
);
})());

var G__2785 = (i__2773 + (1));
i__2773 = G__2785;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2774),schema$core$map_elements_$_iter__2771.call(null,cljs.core.chunk_rest.call(null,s__2772__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2774),null);
}
} else {
var vec__2778 = cljs.core.first.call(null,s__2772__$2);
var k = cljs.core.nth.call(null,vec__2778,(0),null);
var v = cljs.core.nth.call(null,vec__2778,(1),null);
return cljs.core.cons.call(null,(function (){var rk = schema.core.explicit_schema_key.call(null,k);
var required_QMARK_ = schema.core.required_key_QMARK_.call(null,k);
return schema.spec.collection.one_element.call(null,required_QMARK_,schema.core.map_entry.call(null,schema.core.eq.call(null,rk),v),((function (rk,required_QMARK_,vec__2778,k,v,s__2772__$2,temp__4657__auto__,without_extra_keys_schema,extra_keys_schema){
return (function (item_fn,m){
var e = cljs.core.find.call(null,m,rk);
if(cljs.core.truth_(e)){
item_fn.call(null,e);
} else {
if(required_QMARK_){
item_fn.call(null,schema.utils.error.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [rk,new cljs.core.Symbol(null,"missing-required-key","missing-required-key",709961446,null)], null)));
} else {
}
}

if(cljs.core.truth_(e)){
return cljs.core.dissoc.call(null,m,rk);
} else {
return m;
}
});})(rk,required_QMARK_,vec__2778,k,v,s__2772__$2,temp__4657__auto__,without_extra_keys_schema,extra_keys_schema))
);
})(),schema$core$map_elements_$_iter__2771.call(null,cljs.core.rest.call(null,s__2772__$2)));
}
} else {
return null;
}
break;
}
});})(without_extra_keys_schema,extra_keys_schema))
,null,null));
});})(without_extra_keys_schema,extra_keys_schema))
;
return iter__4523__auto__.call(null,without_extra_keys_schema);
})(),(cljs.core.truth_(extra_keys_schema)?(function (){var specific_keys = cljs.core.set.call(null,cljs.core.map.call(null,schema.core.explicit_schema_key,cljs.core.keys.call(null,without_extra_keys_schema)));
var vec__2781 = cljs.core.find.call(null,this$,extra_keys_schema);
var ks = cljs.core.nth.call(null,vec__2781,(0),null);
var vs = cljs.core.nth.call(null,vec__2781,(1),null);
var restricted_ks = schema.core.constrained.call(null,ks,((function (specific_keys,vec__2781,ks,vs,without_extra_keys_schema,extra_keys_schema){
return (function (p1__2770_SHARP_){
return (!(cljs.core.contains_QMARK_.call(null,specific_keys,p1__2770_SHARP_)));
});})(specific_keys,vec__2781,ks,vs,without_extra_keys_schema,extra_keys_schema))
);
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.all_elements.call(null,schema.core.map_entry.call(null,restricted_ks,vs))], null);
})():null));
});
schema.core.map_error = (function schema$core$map_error(){
return (function (_,elts,extra){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.concat.call(null,cljs.core.keep.call(null,schema.utils.error_val,elts),(function (){var iter__4523__auto__ = (function schema$core$map_error_$_iter__2786(s__2787){
return (new cljs.core.LazySeq(null,(function (){
var s__2787__$1 = s__2787;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2787__$1);
if(temp__4657__auto__){
var s__2787__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2787__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2787__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2789 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2788 = (0);
while(true){
if((i__2788 < size__4522__auto__)){
var vec__2790 = cljs.core._nth.call(null,c__4521__auto__,i__2788);
var k = cljs.core.nth.call(null,vec__2790,(0),null);
var ___$1 = cljs.core.nth.call(null,vec__2790,(1),null);
cljs.core.chunk_append.call(null,b__2789,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,new cljs.core.Symbol(null,"disallowed-key","disallowed-key",-1877785633,null)], null));

var G__2796 = (i__2788 + (1));
i__2788 = G__2796;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2789),schema$core$map_error_$_iter__2786.call(null,cljs.core.chunk_rest.call(null,s__2787__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2789),null);
}
} else {
var vec__2793 = cljs.core.first.call(null,s__2787__$2);
var k = cljs.core.nth.call(null,vec__2793,(0),null);
var ___$1 = cljs.core.nth.call(null,vec__2793,(1),null);
return cljs.core.cons.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,new cljs.core.Symbol(null,"disallowed-key","disallowed-key",-1877785633,null)], null),schema$core$map_error_$_iter__2786.call(null,cljs.core.rest.call(null,s__2787__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__4523__auto__.call(null,extra);
})()));
});
});
schema.core.map_spec = (function schema$core$map_spec(this$){
return schema.spec.collection.collection_spec.call(null,schema.spec.core.precondition.call(null,this$,cljs.core.map_QMARK_,(function (p1__975__976__auto__){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"map?","map?",-1780568534,null),(new cljs.core.List(null,p1__975__976__auto__,null,(1),null)),(2),null));
})),(function (p1__2797_SHARP_){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,p1__2797_SHARP_);
}),schema.core.map_elements.call(null,this$),schema.core.map_error.call(null));
});
schema.core.map_explain = (function schema$core$map_explain(this$){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__4523__auto__ = (function schema$core$map_explain_$_iter__2798(s__2799){
return (new cljs.core.LazySeq(null,(function (){
var s__2799__$1 = s__2799;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__2799__$1);
if(temp__4657__auto__){
var s__2799__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__2799__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__2799__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__2801 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__2800 = (0);
while(true){
if((i__2800 < size__4522__auto__)){
var vec__2802 = cljs.core._nth.call(null,c__4521__auto__,i__2800);
var k = cljs.core.nth.call(null,vec__2802,(0),null);
var v = cljs.core.nth.call(null,vec__2802,(1),null);
cljs.core.chunk_append.call(null,b__2801,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.explain_kspec.call(null,k),schema.core.explain.call(null,v)], null));

var G__2808 = (i__2800 + (1));
i__2800 = G__2808;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2801),schema$core$map_explain_$_iter__2798.call(null,cljs.core.chunk_rest.call(null,s__2799__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__2801),null);
}
} else {
var vec__2805 = cljs.core.first.call(null,s__2799__$2);
var k = cljs.core.nth.call(null,vec__2805,(0),null);
var v = cljs.core.nth.call(null,vec__2805,(1),null);
return cljs.core.cons.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.explain_kspec.call(null,k),schema.core.explain.call(null,v)], null),schema$core$map_explain_$_iter__2798.call(null,cljs.core.rest.call(null,s__2799__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__4523__auto__.call(null,this$);
})());
});
cljs.core.PersistentArrayMap.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

cljs.core.PersistentArrayMap.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var this$__$1 = this;
return schema.core.map_spec.call(null,this$__$1);
});

cljs.core.PersistentArrayMap.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var this$__$1 = this;
return schema.core.map_explain.call(null,this$__$1);
});

cljs.core.PersistentHashMap.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

cljs.core.PersistentHashMap.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var this$__$1 = this;
return schema.core.map_spec.call(null,this$__$1);
});

cljs.core.PersistentHashMap.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var this$__$1 = this;
return schema.core.map_explain.call(null,this$__$1);
});
cljs.core.PersistentHashSet.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

cljs.core.PersistentHashSet.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var this$__$1 = this;
if(cljs.core._EQ_.call(null,cljs.core.count.call(null,this$__$1),(1))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Set schema must have exactly one element")));
}

return schema.spec.collection.collection_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,cljs.core.set_QMARK_,((function (this$__$1){
return (function (p1__975__976__auto__){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"set?","set?",1636014792,null),(new cljs.core.List(null,p1__975__976__auto__,null,(1),null)),(2),null));
});})(this$__$1))
),cljs.core.set,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.all_elements.call(null,cljs.core.first.call(null,this$__$1))], null),((function (this$__$1){
return (function (_,xs,___$1){
return cljs.core.set.call(null,cljs.core.keep.call(null,schema.utils.error_val,xs));
});})(this$__$1))
);
});

cljs.core.PersistentHashSet.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.set.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.explain.call(null,cljs.core.first.call(null,this$__$1))], null));
});
schema.core.queue_QMARK_ = (function schema$core$queue_QMARK_(x){
return (x instanceof cljs.core.PersistentQueue);
});
schema.core.as_queue = (function schema$core$as_queue(col){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.PersistentQueue.EMPTY,col);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Queue = (function (schema,__meta,__extmap,__hash){
this.schema = schema;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Queue.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Queue.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2810,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2814 = k2810;
var G__2814__$1 = (((G__2814 instanceof cljs.core.Keyword))?G__2814.fqn:null);
switch (G__2814__$1) {
case "schema":
return self__.schema;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2810,else__4388__auto__);

}
});

schema.core.Queue.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2815){
var vec__2816 = p__2815;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2816,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2816,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Queue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Queue{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null))], null),self__.__extmap));
});

schema.core.Queue.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2809){
var self__ = this;
var G__2809__$1 = this;
return (new cljs.core.RecordIter((0),G__2809__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Queue.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Queue.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Queue(self__.schema,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Queue.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (1 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Queue.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1542973436 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Queue.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2811,other2812){
var self__ = this;
var this2811__$1 = this;
return (((!((other2812 == null)))) && ((this2811__$1.constructor === other2812.constructor)) && (cljs.core._EQ_.call(null,this2811__$1.schema,other2812.schema)) && (cljs.core._EQ_.call(null,this2811__$1.__extmap,other2812.__extmap)));
});

schema.core.Queue.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Queue(self__.schema,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Queue.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2809){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2819 = cljs.core.keyword_identical_QMARK_;
var expr__2820 = k__4393__auto__;
if(cljs.core.truth_(pred__2819.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2820))){
return (new schema.core.Queue(G__2809,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Queue(self__.schema,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2809),null));
}
});

schema.core.Queue.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null))], null),self__.__extmap));
});

schema.core.Queue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2809){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Queue(self__.schema,G__2809,self__.__extmap,self__.__hash));
});

schema.core.Queue.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Queue.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Queue.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.collection.collection_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,schema.core.queue_QMARK_,((function (this$__$1){
return (function (p1__975__976__auto__){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"queue?","queue?",-880510795,null),(new cljs.core.List(null,p1__975__976__auto__,null,(1),null)),(2),null));
});})(this$__$1))
),schema.core.as_queue,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.all_elements.call(null,self__.schema)], null),((function (this$__$1){
return (function (_,xs,___$1){
return schema.core.as_queue.call(null,cljs.core.keep.call(null,schema.utils.error_val,xs));
});})(this$__$1))
);
});

schema.core.Queue.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"queue","queue",-1198599890,null),(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),null,(1),null)),(2),null));
});

schema.core.Queue.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema","schema",58529736,null)], null);
});

schema.core.Queue.cljs$lang$type = true;

schema.core.Queue.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Queue",null,(1),null));
});

schema.core.Queue.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Queue");
});

/**
 * Positional factory function for schema.core/Queue.
 */
schema.core.__GT_Queue = (function schema$core$__GT_Queue(schema__$1){
return (new schema.core.Queue(schema__$1,null,null,null));
});

/**
 * Factory function for schema.core/Queue, taking a map of keywords to field values.
 */
schema.core.map__GT_Queue = (function schema$core$map__GT_Queue(G__2813){
var extmap__4424__auto__ = (function (){var G__2822 = cljs.core.dissoc.call(null,G__2813,new cljs.core.Keyword(null,"schema","schema",-1582001791));
if(cljs.core.record_QMARK_.call(null,G__2813)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2822);
} else {
return G__2822;
}
})();
return (new schema.core.Queue(new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2813),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Queue.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Queue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

/**
 * Defines a schema satisfied by instances of clojure.lang.PersistentQueue
 *   (clj.core/PersistentQueue in ClojureScript) whose values satisfy x.
 */
schema.core.queue = (function schema$core$queue(x){
return (new schema.core.Queue(x,null,null,null));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.One = (function (schema,optional_QMARK_,name,__meta,__extmap,__hash){
this.schema = schema;
this.optional_QMARK_ = optional_QMARK_;
this.name = name;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.One.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.One.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2825,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2829 = k2825;
var G__2829__$1 = (((G__2829 instanceof cljs.core.Keyword))?G__2829.fqn:null);
switch (G__2829__$1) {
case "schema":
return self__.schema;

break;
case "optional?":
return self__.optional_QMARK_;

break;
case "name":
return self__.name;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2825,else__4388__auto__);

}
});

schema.core.One.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2830){
var vec__2831 = p__2830;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2831,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2831,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.One.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.One{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"optional?","optional?",1184638129),self__.optional_QMARK_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"name","name",1843675177),self__.name],null))], null),self__.__extmap));
});

schema.core.One.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2824){
var self__ = this;
var G__2824__$1 = this;
return (new cljs.core.RecordIter((0),G__2824__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"optional?","optional?",1184638129),new cljs.core.Keyword(null,"name","name",1843675177)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.One.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.One.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.One(self__.schema,self__.optional_QMARK_,self__.name,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.One.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (3 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.One.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-197981045 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.One.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2826,other2827){
var self__ = this;
var this2826__$1 = this;
return (((!((other2827 == null)))) && ((this2826__$1.constructor === other2827.constructor)) && (cljs.core._EQ_.call(null,this2826__$1.schema,other2827.schema)) && (cljs.core._EQ_.call(null,this2826__$1.optional_QMARK_,other2827.optional_QMARK_)) && (cljs.core._EQ_.call(null,this2826__$1.name,other2827.name)) && (cljs.core._EQ_.call(null,this2826__$1.__extmap,other2827.__extmap)));
});

schema.core.One.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null,new cljs.core.Keyword(null,"name","name",1843675177),null,new cljs.core.Keyword(null,"optional?","optional?",1184638129),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.One(self__.schema,self__.optional_QMARK_,self__.name,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.One.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2824){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2834 = cljs.core.keyword_identical_QMARK_;
var expr__2835 = k__4393__auto__;
if(cljs.core.truth_(pred__2834.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2835))){
return (new schema.core.One(G__2824,self__.optional_QMARK_,self__.name,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2834.call(null,new cljs.core.Keyword(null,"optional?","optional?",1184638129),expr__2835))){
return (new schema.core.One(self__.schema,G__2824,self__.name,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2834.call(null,new cljs.core.Keyword(null,"name","name",1843675177),expr__2835))){
return (new schema.core.One(self__.schema,self__.optional_QMARK_,G__2824,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.One(self__.schema,self__.optional_QMARK_,self__.name,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2824),null));
}
}
}
});

schema.core.One.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"optional?","optional?",1184638129),self__.optional_QMARK_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"name","name",1843675177),self__.name,null))], null),self__.__extmap));
});

schema.core.One.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2824){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.One(self__.schema,self__.optional_QMARK_,self__.name,G__2824,self__.__extmap,self__.__hash));
});

schema.core.One.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.One.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.Symbol(null,"optional?","optional?",-1469797640,null),new cljs.core.Symbol(null,"name","name",-810760592,null)], null);
});

schema.core.One.cljs$lang$type = true;

schema.core.One.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/One",null,(1),null));
});

schema.core.One.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/One");
});

/**
 * Positional factory function for schema.core/One.
 */
schema.core.__GT_One = (function schema$core$__GT_One(schema__$1,optional_QMARK_,name){
return (new schema.core.One(schema__$1,optional_QMARK_,name,null,null,null));
});

/**
 * Factory function for schema.core/One, taking a map of keywords to field values.
 */
schema.core.map__GT_One = (function schema$core$map__GT_One(G__2828){
var extmap__4424__auto__ = (function (){var G__2837 = cljs.core.dissoc.call(null,G__2828,new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"optional?","optional?",1184638129),new cljs.core.Keyword(null,"name","name",1843675177));
if(cljs.core.record_QMARK_.call(null,G__2828)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2837);
} else {
return G__2837;
}
})();
return (new schema.core.One(new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2828),new cljs.core.Keyword(null,"optional?","optional?",1184638129).cljs$core$IFn$_invoke$arity$1(G__2828),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(G__2828),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});

/**
 * A single required element of a sequence (not repeated, the implicit default)
 */
schema.core.one = (function schema$core$one(schema__$1,name){
return (new schema.core.One(schema__$1,false,name,null,null,null));
});
/**
 * A single optional element of a sequence (not repeated, the implicit default)
 */
schema.core.optional = (function schema$core$optional(schema__$1,name){
return (new schema.core.One(schema__$1,true,name,null,null,null));
});
/**
 * Parses and validates a sequence schema, returning a vector in the form
 *   [singles multi] where singles is a sequence of 'one' and 'optional' schemas
 *   and multi is the rest-schema (which may be nil). A valid sequence schema is
 *   a vector in the form [one* optional* rest-schema?].
 */
schema.core.parse_sequence_schema = (function schema$core$parse_sequence_schema(s){
var vec__2842 = cljs.core.split_with.call(null,(function (p1__2839_SHARP_){
return (((p1__2839_SHARP_ instanceof schema.core.One)) && (cljs.core.not.call(null,new cljs.core.Keyword(null,"optional?","optional?",1184638129).cljs$core$IFn$_invoke$arity$1(p1__2839_SHARP_))));
}),s);
var required = cljs.core.nth.call(null,vec__2842,(0),null);
var more = cljs.core.nth.call(null,vec__2842,(1),null);
var vec__2845 = cljs.core.split_with.call(null,((function (vec__2842,required,more){
return (function (p1__2840_SHARP_){
var and__4120__auto__ = (p1__2840_SHARP_ instanceof schema.core.One);
if(and__4120__auto__){
return new cljs.core.Keyword(null,"optional?","optional?",1184638129).cljs$core$IFn$_invoke$arity$1(p1__2840_SHARP_);
} else {
return and__4120__auto__;
}
});})(vec__2842,required,more))
,more);
var optional = cljs.core.nth.call(null,vec__2845,(0),null);
var more__$1 = cljs.core.nth.call(null,vec__2845,(1),null);
if((((cljs.core.count.call(null,more__$1) <= (1))) && (cljs.core.not_any_QMARK_.call(null,((function (vec__2842,required,more,vec__2845,optional,more__$1){
return (function (p1__2841_SHARP_){
return (p1__2841_SHARP_ instanceof schema.core.One);
});})(vec__2842,required,more,vec__2845,optional,more__$1))
,more__$1)))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"%s is not a valid sequence schema; %s%s%s",s,"a valid sequence schema consists of zero or more `one` elements, ","followed by zero or more `optional` elements, followed by an optional ","schema that will match the remaining elements.")));
}

return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.concat.call(null,required,optional),cljs.core.first.call(null,more__$1)], null);
});
cljs.core.PersistentVector.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

cljs.core.PersistentVector.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var this$__$1 = this;
return schema.spec.collection.collection_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (x){
return (((x == null)) || (cljs.core.sequential_QMARK_.call(null,x)));
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2848_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"sequential?","sequential?",1102351463,null),(new cljs.core.List(null,p1__2848_SHARP_,null,(1),null)),(2),null));
});})(this$__$1))
),cljs.core.vec,(function (){var vec__2849 = schema.core.parse_sequence_schema.call(null,this$__$1);
var singles = cljs.core.nth.call(null,vec__2849,(0),null);
var multi = cljs.core.nth.call(null,vec__2849,(1),null);
return cljs.core.reduce.call(null,((function (vec__2849,singles,multi,this$__$1){
return (function (more,s){
if(cljs.core.not.call(null,s.optional_QMARK_)){
return cljs.core.cons.call(null,schema.spec.collection.one_element.call(null,true,schema.core.named.call(null,s.schema,s.name),((function (vec__2849,singles,multi,this$__$1){
return (function (item_fn,x){
var temp__4655__auto__ = cljs.core.seq.call(null,x);
if(temp__4655__auto__){
var x__$1 = temp__4655__auto__;
item_fn.call(null,cljs.core.first.call(null,x__$1));

return cljs.core.rest.call(null,x__$1);
} else {
item_fn.call(null,schema.utils.error.call(null,schema.utils.make_ValidationError.call(null,s.schema,new cljs.core.Keyword("schema.core","missing","schema.core/missing",1420181325),(new cljs.core.Delay(((function (temp__4655__auto__,vec__2849,singles,multi,this$__$1){
return (function (){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"present?","present?",-1810613791,null),(new cljs.core.List(null,s.name,null,(1),null)),(2),null));
});})(temp__4655__auto__,vec__2849,singles,multi,this$__$1))
,null)),null)));

return null;
}
});})(vec__2849,singles,multi,this$__$1))
),more);
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.optional_tail.call(null,schema.core.named.call(null,s.schema,s.name),((function (vec__2849,singles,multi,this$__$1){
return (function (item_fn,x){
var temp__4657__auto__ = cljs.core.seq.call(null,x);
if(temp__4657__auto__){
var x__$1 = temp__4657__auto__;
item_fn.call(null,cljs.core.first.call(null,x__$1));

return cljs.core.rest.call(null,x__$1);
} else {
return null;
}
});})(vec__2849,singles,multi,this$__$1))
,more)], null);
}
});})(vec__2849,singles,multi,this$__$1))
,(cljs.core.truth_(multi)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.spec.collection.all_elements.call(null,multi)], null):null),cljs.core.reverse.call(null,singles));
})(),((function (this$__$1){
return (function (_,elts,extra){
var head = cljs.core.mapv.call(null,schema.utils.error_val,elts);
var G__2852 = head;
if(cljs.core.seq.call(null,extra)){
return cljs.core.conj.call(null,G__2852,schema.utils.error_val.call(null,schema.utils.error.call(null,schema.utils.make_ValidationError.call(null,null,extra,(new cljs.core.Delay(((function (G__2852,head,this$__$1){
return (function (){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"has-extra-elts?","has-extra-elts?",-1376562869,null),(new cljs.core.List(null,cljs.core.count.call(null,extra),null,(1),null)),(2),null));
});})(G__2852,head,this$__$1))
,null)),null))));
} else {
return G__2852;
}
});})(this$__$1))
);
});

cljs.core.PersistentVector.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var this$__$1 = this;
var vec__2853 = schema.core.parse_sequence_schema.call(null,this$__$1);
var singles = cljs.core.nth.call(null,vec__2853,(0),null);
var multi = cljs.core.nth.call(null,vec__2853,(1),null);
var G__2856 = cljs.core.mapv.call(null,((function (vec__2853,singles,multi,this$__$1){
return (function (s){
return (new cljs.core.List(null,(cljs.core.truth_(s.optional_QMARK_)?new cljs.core.Symbol(null,"optional","optional",-600484260,null):new cljs.core.Symbol(null,"one","one",-1719427865,null)),(new cljs.core.List(null,schema.core.explain.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(s)),(new cljs.core.List(null,new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(s),null,(1),null)),(2),null)),(3),null));
});})(vec__2853,singles,multi,this$__$1))
,singles);
if(cljs.core.truth_(multi)){
return cljs.core.conj.call(null,G__2856,schema.core.explain.call(null,multi));
} else {
return G__2856;
}
});
/**
 * A schema for a pair of schemas and their names
 */
schema.core.pair = (function schema$core$pair(first_schema,first_name,second_schema,second_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,first_schema,first_name),schema.core.one.call(null,second_schema,second_name)], null);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.Record = (function (klass,schema,__meta,__extmap,__hash){
this.klass = klass;
this.schema = schema;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.Record.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.Record.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2861,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2865 = k2861;
var G__2865__$1 = (((G__2865 instanceof cljs.core.Keyword))?G__2865.fqn:null);
switch (G__2865__$1) {
case "klass":
return self__.klass;

break;
case "schema":
return self__.schema;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2861,else__4388__auto__);

}
});

schema.core.Record.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2866){
var vec__2867 = p__2866;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2867,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2867,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.Record.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.Record{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"klass","klass",-1386752349),self__.klass],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null))], null),self__.__extmap));
});

schema.core.Record.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2860){
var self__ = this;
var G__2860__$1 = this;
return (new cljs.core.RecordIter((0),G__2860__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"klass","klass",-1386752349),new cljs.core.Keyword(null,"schema","schema",-1582001791)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.Record.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.Record.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.Record(self__.klass,self__.schema,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.Record.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.Record.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1486476872 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.Record.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2862,other2863){
var self__ = this;
var this2862__$1 = this;
return (((!((other2863 == null)))) && ((this2862__$1.constructor === other2863.constructor)) && (cljs.core._EQ_.call(null,this2862__$1.klass,other2863.klass)) && (cljs.core._EQ_.call(null,this2862__$1.schema,other2863.schema)) && (cljs.core._EQ_.call(null,this2862__$1.__extmap,other2863.__extmap)));
});

schema.core.Record.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null,new cljs.core.Keyword(null,"klass","klass",-1386752349),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.Record(self__.klass,self__.schema,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.Record.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2860){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2870 = cljs.core.keyword_identical_QMARK_;
var expr__2871 = k__4393__auto__;
if(cljs.core.truth_(pred__2870.call(null,new cljs.core.Keyword(null,"klass","klass",-1386752349),expr__2871))){
return (new schema.core.Record(G__2860,self__.schema,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2870.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__2871))){
return (new schema.core.Record(self__.klass,G__2860,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.Record(self__.klass,self__.schema,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2860),null));
}
}
});

schema.core.Record.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"klass","klass",-1386752349),self__.klass,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null))], null),self__.__extmap));
});

schema.core.Record.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2860){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.Record(self__.klass,self__.schema,G__2860,self__.__extmap,self__.__hash));
});

schema.core.Record.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.Record.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Record.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.collection.collection_spec.call(null,(function (){var p = schema.spec.core.precondition.call(null,this$__$1,((function (this$__$1){
return (function (p1__2857_SHARP_){
return (p1__2857_SHARP_ instanceof self__.klass);
});})(this$__$1))
,((function (this$__$1){
return (function (p1__2858_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"instance?","instance?",1075939923,null),(new cljs.core.List(null,self__.klass,(new cljs.core.List(null,p1__2858_SHARP_,null,(1),null)),(2),null)),(3),null));
});})(this$__$1))
);
var temp__4655__auto__ = new cljs.core.Keyword(null,"extra-validator-fn","extra-validator-fn",1562905865).cljs$core$IFn$_invoke$arity$1(this$__$1);
if(cljs.core.truth_(temp__4655__auto__)){
var evf = temp__4655__auto__;
return cljs.core.some_fn.call(null,p,schema.spec.core.precondition.call(null,this$__$1,evf,((function (evf,temp__4655__auto__,p,this$__$1){
return (function (p1__2859_SHARP_){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"passes-extra-validation?","passes-extra-validation?",-1964809231,null),(new cljs.core.List(null,p1__2859_SHARP_,null,(1),null)),(2),null));
});})(evf,temp__4655__auto__,p,this$__$1))
));
} else {
return p;
}
})(),new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,this$__$1)),schema.core.map_elements.call(null,self__.schema),schema.core.map_error.call(null));
});

schema.core.Record.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"record","record",861424668,null),(new cljs.core.List(null,cljs.core.symbol.call(null,cljs.core.pr_str.call(null,self__.klass)),(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),null,(1),null)),(2),null)),(3),null));
});

schema.core.Record.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"klass","klass",253779178,null),new cljs.core.Symbol(null,"schema","schema",58529736,null)], null);
});

schema.core.Record.cljs$lang$type = true;

schema.core.Record.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/Record",null,(1),null));
});

schema.core.Record.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/Record");
});

/**
 * Positional factory function for schema.core/Record.
 */
schema.core.__GT_Record = (function schema$core$__GT_Record(klass,schema__$1){
return (new schema.core.Record(klass,schema__$1,null,null,null));
});

/**
 * Factory function for schema.core/Record, taking a map of keywords to field values.
 */
schema.core.map__GT_Record = (function schema$core$map__GT_Record(G__2864){
var extmap__4424__auto__ = (function (){var G__2873 = cljs.core.dissoc.call(null,G__2864,new cljs.core.Keyword(null,"klass","klass",-1386752349),new cljs.core.Keyword(null,"schema","schema",-1582001791));
if(cljs.core.record_QMARK_.call(null,G__2864)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2873);
} else {
return G__2873;
}
})();
return (new schema.core.Record(new cljs.core.Keyword(null,"klass","klass",-1386752349).cljs$core$IFn$_invoke$arity$1(G__2864),new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__2864),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.Record.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.Record.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

schema.core.record_STAR_ = (function schema$core$record_STAR_(klass,schema__$1,map_constructor){
if(cljs.core.map_QMARK_.call(null,schema__$1)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Expected map, got %s",schema.utils.type_of.call(null,schema__$1))));
}

return cljs.core.with_meta.call(null,(new schema.core.Record(klass,schema__$1,null,null,null)),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),map_constructor], null));
});
schema.core.explain_input_schema = (function schema$core$explain_input_schema(input_schema){
var vec__2881 = cljs.core.split_with.call(null,(function (p1__2879_SHARP_){
return (p1__2879_SHARP_ instanceof schema.core.One);
}),input_schema);
var required = cljs.core.nth.call(null,vec__2881,(0),null);
var more = cljs.core.nth.call(null,vec__2881,(1),null);
return cljs.core.concat.call(null,cljs.core.map.call(null,((function (vec__2881,required,more){
return (function (p1__2880_SHARP_){
return schema.core.explain.call(null,p1__2880_SHARP_.schema);
});})(vec__2881,required,more))
,required),((cljs.core.seq.call(null,more))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"&","&",-2144855648,null),cljs.core.mapv.call(null,schema.core.explain,more)], null):null));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {schema.core.Schema}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
schema.core.FnSchema = (function (output_schema,input_schemas,__meta,__extmap,__hash){
this.output_schema = output_schema;
this.input_schemas = input_schemas;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.core.FnSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.core.FnSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k2885,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__2889 = k2885;
var G__2889__$1 = (((G__2889 instanceof cljs.core.Keyword))?G__2889.fqn:null);
switch (G__2889__$1) {
case "output-schema":
return self__.output_schema;

break;
case "input-schemas":
return self__.input_schemas;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k2885,else__4388__auto__);

}
});

schema.core.FnSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__2890){
var vec__2891 = p__2890;
var k__4408__auto__ = cljs.core.nth.call(null,vec__2891,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__2891,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.core.FnSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.core.FnSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"output-schema","output-schema",272504137),self__.output_schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805),self__.input_schemas],null))], null),self__.__extmap));
});

schema.core.FnSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__2884){
var self__ = this;
var G__2884__$1 = this;
return (new cljs.core.RecordIter((0),G__2884__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output-schema","output-schema",272504137),new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.core.FnSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.core.FnSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.core.FnSchema(self__.output_schema,self__.input_schemas,self__.__meta,self__.__extmap,self__.__hash));
});

schema.core.FnSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
});

schema.core.FnSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-2054647546 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.core.FnSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this2886,other2887){
var self__ = this;
var this2886__$1 = this;
return (((!((other2887 == null)))) && ((this2886__$1.constructor === other2887.constructor)) && (cljs.core._EQ_.call(null,this2886__$1.output_schema,other2887.output_schema)) && (cljs.core._EQ_.call(null,this2886__$1.input_schemas,other2887.input_schemas)) && (cljs.core._EQ_.call(null,this2886__$1.__extmap,other2887.__extmap)));
});

schema.core.FnSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"output-schema","output-schema",272504137),null,new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.core.FnSchema(self__.output_schema,self__.input_schemas,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.core.FnSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__2884){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__2894 = cljs.core.keyword_identical_QMARK_;
var expr__2895 = k__4393__auto__;
if(cljs.core.truth_(pred__2894.call(null,new cljs.core.Keyword(null,"output-schema","output-schema",272504137),expr__2895))){
return (new schema.core.FnSchema(G__2884,self__.input_schemas,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__2894.call(null,new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805),expr__2895))){
return (new schema.core.FnSchema(self__.output_schema,G__2884,self__.__meta,self__.__extmap,null));
} else {
return (new schema.core.FnSchema(self__.output_schema,self__.input_schemas,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__2884),null));
}
}
});

schema.core.FnSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"output-schema","output-schema",272504137),self__.output_schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805),self__.input_schemas,null))], null),self__.__extmap));
});

schema.core.FnSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__2884){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.core.FnSchema(self__.output_schema,self__.input_schemas,G__2884,self__.__extmap,self__.__hash));
});

schema.core.FnSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.core.FnSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.FnSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.leaf.leaf_spec.call(null,schema.spec.core.precondition.call(null,this$__$1,cljs.core.ifn_QMARK_,((function (this$__$1){
return (function (p1__975__976__auto__){
return (new cljs.core.List(null,new cljs.core.Symbol(null,"ifn?","ifn?",-2106461064,null),(new cljs.core.List(null,p1__975__976__auto__,null,(1),null)),(2),null));
});})(this$__$1))
));
});

schema.core.FnSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if((cljs.core.count.call(null,self__.input_schemas) > (1))){
return cljs.core.list_STAR_.call(null,new cljs.core.Symbol(null,"=>*","=>*",1909690043,null),schema.core.explain.call(null,self__.output_schema),cljs.core.map.call(null,schema.core.explain_input_schema,self__.input_schemas));
} else {
return cljs.core.list_STAR_.call(null,new cljs.core.Symbol(null,"=>","=>",-813269641,null),schema.core.explain.call(null,self__.output_schema),schema.core.explain_input_schema.call(null,cljs.core.first.call(null,self__.input_schemas)));
}
});

schema.core.FnSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"output-schema","output-schema",1913035664,null),new cljs.core.Symbol(null,"input-schemas","input-schemas",658376722,null)], null);
});

schema.core.FnSchema.cljs$lang$type = true;

schema.core.FnSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.core/FnSchema",null,(1),null));
});

schema.core.FnSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.core/FnSchema");
});

/**
 * Positional factory function for schema.core/FnSchema.
 */
schema.core.__GT_FnSchema = (function schema$core$__GT_FnSchema(output_schema,input_schemas){
return (new schema.core.FnSchema(output_schema,input_schemas,null,null,null));
});

/**
 * Factory function for schema.core/FnSchema, taking a map of keywords to field values.
 */
schema.core.map__GT_FnSchema = (function schema$core$map__GT_FnSchema(G__2888){
var extmap__4424__auto__ = (function (){var G__2897 = cljs.core.dissoc.call(null,G__2888,new cljs.core.Keyword(null,"output-schema","output-schema",272504137),new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805));
if(cljs.core.record_QMARK_.call(null,G__2888)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__2897);
} else {
return G__2897;
}
})();
return (new schema.core.FnSchema(new cljs.core.Keyword(null,"output-schema","output-schema",272504137).cljs$core$IFn$_invoke$arity$1(G__2888),new cljs.core.Keyword(null,"input-schemas","input-schemas",-982154805).cljs$core$IFn$_invoke$arity$1(G__2888),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


schema.core.FnSchema.prototype.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL;

schema.core.FnSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (s__731__auto__,w__732__auto__,___733__auto__){
var s__731__auto____$1 = this;
return cljs.core._write.call(null,w__732__auto__,schema.core.explain.call(null,s__731__auto____$1));
});

schema.core.arity = (function schema$core$arity(input_schema){
if(cljs.core.seq.call(null,input_schema)){
if((cljs.core.last.call(null,input_schema) instanceof schema.core.One)){
return cljs.core.count.call(null,input_schema);
} else {
return Number.MAX_VALUE;
}
} else {
return (0);
}
});
/**
 * A function outputting a value in output schema, whose argument vector must match one of
 * input-schemas, each of which should be a sequence schema.
 * Currently function schemas are purely descriptive; they validate against any function,
 * regardless of actual input and output types.
 */
schema.core.make_fn_schema = (function schema$core$make_fn_schema(output_schema,input_schemas){
if(cljs.core.seq.call(null,input_schemas)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Function must have at least one input schema")));
}

if(cljs.core.every_QMARK_.call(null,cljs.core.vector_QMARK_,input_schemas)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Each arity must be a vector.")));
}

if(cljs.core.truth_(cljs.core.apply.call(null,cljs.core.distinct_QMARK_,cljs.core.map.call(null,schema.core.arity,input_schemas)))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Arities must be distinct")));
}

return (new schema.core.FnSchema(output_schema,cljs.core.sort_by.call(null,schema.core.arity,input_schemas),null,null,null));
});
/**
 * Records name in schema's metadata.
 */
schema.core.schema_with_name = (function schema$core$schema_with_name(schema__$1,name){
if((((!((schema__$1 == null))))?(((((schema__$1.cljs$lang$protocol_mask$partition0$ & (262144))) || ((cljs.core.PROTOCOL_SENTINEL === schema__$1.cljs$core$IWithMeta$))))?true:(((!schema__$1.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IWithMeta,schema__$1):false)):cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IWithMeta,schema__$1))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Named schema (such as the right-most `s/defalias` arg) must support metadata: %s",schema.utils.type_of.call(null,schema__$1))));
}

return cljs.core.vary_meta.call(null,schema__$1,cljs.core.assoc,new cljs.core.Keyword(null,"name","name",1843675177),name);
});
/**
 * Returns the name of a schema attached via schema-with-name (or defschema).
 */
schema.core.schema_name = (function schema$core$schema_name(schema__$1){
return new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,schema__$1));
});
/**
 * Returns the namespace of a schema attached via defschema.
 */
schema.core.schema_ns = (function schema$core$schema_ns(schema__$1){
return new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,schema__$1));
});
/**
 * Get the current global schema validation setting.
 */
schema.core.fn_validation_QMARK_ = (function schema$core$fn_validation_QMARK_(){
return cljs.core.deref.call(null,schema.utils.use_fn_validation);
});
/**
 * Globally turn on (or off) schema validation for all s/fn and s/defn instances.
 */
schema.core.set_fn_validation_BANG_ = (function schema$core$set_fn_validation_BANG_(on_QMARK_){
return cljs.core.reset_BANG_.call(null,schema.utils.use_fn_validation,on_QMARK_);
});
/**
 * A var that can be rebound to a function to customize the behavior
 *   of fn validation. When fn validation is on and `fn-validator` is
 *   bound to a function, normal argument and return value checks will
 *   be substituted with a call to this function with five arguments:
 * 
 *  direction   - :input or :output
 *  fn-name     - a symbol, the function's name
 *  schema      - the schema for the arglist or the return value
 *  checker     - a precompiled checker to check a value against
 *                the schema
 *  value       - the actual arglist or return value
 * 
 *   The function's return value will be ignored.
 */
schema.core.fn_validator = null;
/**
 * Attach the schema to fn f at runtime, extractable by fn-schema.
 */
schema.core.schematize_fn = (function schema$core$schematize_fn(f,schema__$1){
return cljs.core.vary_meta.call(null,f,cljs.core.assoc,new cljs.core.Keyword(null,"schema","schema",-1582001791),schema__$1);
});
/**
 * Produce the schema for a function defined with s/fn or s/defn.
 */
schema.core.fn_schema = (function schema$core$fn_schema(f){
if(cljs.core.fn_QMARK_.call(null,f)){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Non-function %s",schema.utils.type_of.call(null,f))));
}

var or__4131__auto__ = schema.utils.class_schema.call(null,schema.utils.fn_schema_bearer.call(null,f));
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
var m__711__auto__ = cljs.core.meta.call(null,f);
var k__712__auto__ = new cljs.core.Keyword(null,"schema","schema",-1582001791);
var temp__4655__auto__ = cljs.core.find.call(null,m__711__auto__,k__712__auto__);
if(cljs.core.truth_(temp__4655__auto__)){
var pair__713__auto__ = temp__4655__auto__;
return cljs.core.val.call(null,pair__713__auto__);
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Key %s not found in %s",k__712__auto__,m__711__auto__)));
}
}
});
if((typeof schema !== 'undefined') && (typeof schema.core !== 'undefined') && (typeof schema.core._STAR_elide_defprotocol_instrumentation_STAR_ !== 'undefined')){
} else {
/**
 * If the s/defprotocol instrumentation strategy is problematic
 *  for your platform, set atom to true and instrumentation will not
 *  be performed.
 * 
 *  Defaults to false.
 */
schema.core._STAR_elide_defprotocol_instrumentation_STAR_ = cljs.core.atom.call(null,false);
}
/**
 * If true, elide s/defprotocol instrumentation.
 * 
 *   Instrumentation is elided for any of the following cases:
 *   *   @*elide-defprotocol-instrumentation* is true during s/defprotocol macroexpansion
 *   *   @*elide-defprotocol-instrumentation* is true during s/defprotocol evaluation
 */
schema.core.instrument_defprotocol_QMARK_ = (function schema$core$instrument_defprotocol_QMARK_(){
return cljs.core.not.call(null,cljs.core.deref.call(null,schema.core._STAR_elide_defprotocol_instrumentation_STAR_));
});
/**
 * Sets the maximum length of value to be output before it is contracted to a prettier name.
 */
schema.core.set_max_value_length_BANG_ = (function schema$core$set_max_value_length_BANG_(max_length){
return cljs.core.reset_BANG_.call(null,schema.utils.max_value_length,max_length);
});

//# sourceMappingURL=core.js.map
