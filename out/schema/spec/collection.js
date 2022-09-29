// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('schema.spec.collection');
goog.require('cljs.core');
goog.require('schema.utils');
goog.require('schema.spec.core');
schema.spec.collection.element_transformer = (function schema$spec$collection$element_transformer(e,params,then){
if(cljs.core.vector_QMARK_.call(null,e)){
var G__994 = cljs.core.first.call(null,e);
var G__994__$1 = (((G__994 instanceof cljs.core.Keyword))?G__994.fqn:null);
switch (G__994__$1) {
case "schema.spec.collection/optional":
return schema.spec.collection.sequence_transformer.call(null,cljs.core.next.call(null,e),params,then);

break;
case "schema.spec.collection/remaining":
var _ = ((cljs.core._EQ_.call(null,(2),cljs.core.count.call(null,e)))?null:(function(){throw (new Error(schema.utils.format_STAR_.call(null,"remaining can have only one schema.")))})());
var c = schema.spec.core.sub_checker.call(null,cljs.core.second.call(null,e),params);
return ((function (_,c,G__994,G__994__$1){
return (function (res,x){
cljs.core.swap_BANG_.call(null,res,cljs.core.into,cljs.core.map.call(null,c,x));

return then.call(null,res,null);
});
;})(_,c,G__994,G__994__$1))

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__994__$1)].join('')));

}
} else {
var parser = new cljs.core.Keyword(null,"parser","parser",-1543495310).cljs$core$IFn$_invoke$arity$1(e);
var c = schema.spec.core.sub_checker.call(null,e,params);
return ((function (parser,c){
return (function (res,x){
return then.call(null,res,parser.call(null,((function (parser,c){
return (function (t){
return cljs.core.swap_BANG_.call(null,res,cljs.core.conj,((schema.utils.error_QMARK_.call(null,t))?t:c.call(null,t)));
});})(parser,c))
,x));
});
;})(parser,c))
}
});
schema.spec.collection.sequence_transformer = (function schema$spec$collection$sequence_transformer(elts,params,then){
if(cljs.core.not_any_QMARK_.call(null,(function (p1__996_SHARP_){
return ((cljs.core.vector_QMARK_.call(null,p1__996_SHARP_)) && (cljs.core._EQ_.call(null,cljs.core.first.call(null,p1__996_SHARP_),new cljs.core.Keyword("schema.spec.collection","remaining","schema.spec.collection/remaining",-421177821))));
}),cljs.core.butlast.call(null,elts))){
} else {
throw (new Error(schema.utils.format_STAR_.call(null,"Remaining schemas must be in tail position.")));
}

return cljs.core.reduce.call(null,(function (f,e){
return schema.spec.collection.element_transformer.call(null,e,params,f);
}),then,cljs.core.reverse.call(null,elts));
});
schema.spec.collection.has_error_QMARK_ = (function schema$spec$collection$has_error_QMARK_(l){
return cljs.core.some.call(null,schema.utils.error_QMARK_,l);
});
schema.spec.collection.subschemas = (function schema$spec$collection$subschemas(elt){
if(cljs.core.map_QMARK_.call(null,elt)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(elt)], null);
} else {
if(cljs.core.vector_QMARK_.call(null,elt)){
} else {
throw (new Error("Assert failed: (vector? elt)"));
}

if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("schema.spec.collection","remaining","schema.spec.collection/remaining",-421177821),null,new cljs.core.Keyword("schema.spec.collection","optional","schema.spec.collection/optional",-854614927),null], null), null).call(null,cljs.core.first.call(null,elt)))){
} else {
throw (new Error("Assert failed: (#{:schema.spec.collection/remaining :schema.spec.collection/optional} (first elt))"));
}

return cljs.core.mapcat.call(null,schema.spec.collection.subschemas,cljs.core.next.call(null,elt));
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
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
schema.spec.collection.CollectionSpec = (function (pre,konstructor,elements,on_error,__meta,__extmap,__hash){
this.pre = pre;
this.konstructor = konstructor;
this.elements = elements;
this.on_error = on_error;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.spec.collection.CollectionSpec.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k998,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__1002 = k998;
var G__1002__$1 = (((G__1002 instanceof cljs.core.Keyword))?G__1002.fqn:null);
switch (G__1002__$1) {
case "pre":
return self__.pre;

break;
case "konstructor":
return self__.konstructor;

break;
case "elements":
return self__.elements;

break;
case "on-error":
return self__.on_error;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k998,else__4388__auto__);

}
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__1003){
var vec__1004 = p__1003;
var k__4408__auto__ = cljs.core.nth.call(null,vec__1004,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__1004,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.spec.collection.CollectionSpec.prototype.schema$spec$core$CoreSpec$ = cljs.core.PROTOCOL_SENTINEL;

schema.spec.collection.CollectionSpec.prototype.schema$spec$core$CoreSpec$subschemas$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.mapcat.call(null,schema.spec.collection.subschemas,self__.elements);
});

schema.spec.collection.CollectionSpec.prototype.schema$spec$core$CoreSpec$checker$arity$2 = (function (this$,params){
var self__ = this;
var this$__$1 = this;
var konstructor__$1 = (cljs.core.truth_(new cljs.core.Keyword(null,"return-walked?","return-walked?",-1684646015).cljs$core$IFn$_invoke$arity$1(params))?self__.konstructor:((function (this$__$1){
return (function (_){
return null;
});})(this$__$1))
);
var t = schema.spec.collection.sequence_transformer.call(null,self__.elements,params,((function (konstructor__$1,this$__$1){
return (function (_,x){
return x;
});})(konstructor__$1,this$__$1))
);
return ((function (konstructor__$1,t,this$__$1){
return (function (x){
var or__4131__auto__ = self__.pre.call(null,x);
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
var res = cljs.core.atom.call(null,cljs.core.PersistentVector.EMPTY);
var remaining = t.call(null,res,x);
var res__$1 = cljs.core.deref.call(null,res);
if(cljs.core.truth_((function (){var or__4131__auto____$1 = cljs.core.seq.call(null,remaining);
if(or__4131__auto____$1){
return or__4131__auto____$1;
} else {
return schema.spec.collection.has_error_QMARK_.call(null,res__$1);
}
})())){
return schema.utils.error.call(null,self__.on_error.call(null,x,res__$1,remaining));
} else {
return konstructor__$1.call(null,res__$1);
}
}
});
;})(konstructor__$1,t,this$__$1))
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.spec.collection.CollectionSpec{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"pre","pre",2118456869),self__.pre],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),self__.konstructor],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"elements","elements",657646735),self__.elements],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"on-error","on-error",1728533530),self__.on_error],null))], null),self__.__extmap));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__997){
var self__ = this;
var G__997__$1 = this;
return (new cljs.core.RecordIter((0),G__997__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"pre","pre",2118456869),new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),new cljs.core.Keyword(null,"elements","elements",657646735),new cljs.core.Keyword(null,"on-error","on-error",1728533530)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.spec.collection.CollectionSpec(self__.pre,self__.konstructor,self__.elements,self__.on_error,self__.__meta,self__.__extmap,self__.__hash));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (4 + cljs.core.count.call(null,self__.__extmap));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (1800698765 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this999,other1000){
var self__ = this;
var this999__$1 = this;
return (((!((other1000 == null)))) && ((this999__$1.constructor === other1000.constructor)) && (cljs.core._EQ_.call(null,this999__$1.pre,other1000.pre)) && (cljs.core._EQ_.call(null,this999__$1.konstructor,other1000.konstructor)) && (cljs.core._EQ_.call(null,this999__$1.elements,other1000.elements)) && (cljs.core._EQ_.call(null,this999__$1.on_error,other1000.on_error)) && (cljs.core._EQ_.call(null,this999__$1.__extmap,other1000.__extmap)));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"pre","pre",2118456869),null,new cljs.core.Keyword(null,"elements","elements",657646735),null,new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),null,new cljs.core.Keyword(null,"on-error","on-error",1728533530),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.spec.collection.CollectionSpec(self__.pre,self__.konstructor,self__.elements,self__.on_error,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__997){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__1007 = cljs.core.keyword_identical_QMARK_;
var expr__1008 = k__4393__auto__;
if(cljs.core.truth_(pred__1007.call(null,new cljs.core.Keyword(null,"pre","pre",2118456869),expr__1008))){
return (new schema.spec.collection.CollectionSpec(G__997,self__.konstructor,self__.elements,self__.on_error,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__1007.call(null,new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),expr__1008))){
return (new schema.spec.collection.CollectionSpec(self__.pre,G__997,self__.elements,self__.on_error,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__1007.call(null,new cljs.core.Keyword(null,"elements","elements",657646735),expr__1008))){
return (new schema.spec.collection.CollectionSpec(self__.pre,self__.konstructor,G__997,self__.on_error,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__1007.call(null,new cljs.core.Keyword(null,"on-error","on-error",1728533530),expr__1008))){
return (new schema.spec.collection.CollectionSpec(self__.pre,self__.konstructor,self__.elements,G__997,self__.__meta,self__.__extmap,null));
} else {
return (new schema.spec.collection.CollectionSpec(self__.pre,self__.konstructor,self__.elements,self__.on_error,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__997),null));
}
}
}
}
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"pre","pre",2118456869),self__.pre,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),self__.konstructor,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"elements","elements",657646735),self__.elements,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"on-error","on-error",1728533530),self__.on_error,null))], null),self__.__extmap));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__997){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.spec.collection.CollectionSpec(self__.pre,self__.konstructor,self__.elements,self__.on_error,G__997,self__.__extmap,self__.__hash));
});

schema.spec.collection.CollectionSpec.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.spec.collection.CollectionSpec.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"pre","pre",-535978900,null),new cljs.core.Symbol(null,"konstructor","konstructor",218206970,null),new cljs.core.Symbol(null,"elements","elements",-1996789034,null),new cljs.core.Symbol(null,"on-error","on-error",-925902239,null)], null);
});

schema.spec.collection.CollectionSpec.cljs$lang$type = true;

schema.spec.collection.CollectionSpec.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.spec.collection/CollectionSpec",null,(1),null));
});

schema.spec.collection.CollectionSpec.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.spec.collection/CollectionSpec");
});

/**
 * Positional factory function for schema.spec.collection/CollectionSpec.
 */
schema.spec.collection.__GT_CollectionSpec = (function schema$spec$collection$__GT_CollectionSpec(pre,konstructor,elements,on_error){
return (new schema.spec.collection.CollectionSpec(pre,konstructor,elements,on_error,null,null,null));
});

/**
 * Factory function for schema.spec.collection/CollectionSpec, taking a map of keywords to field values.
 */
schema.spec.collection.map__GT_CollectionSpec = (function schema$spec$collection$map__GT_CollectionSpec(G__1001){
var extmap__4424__auto__ = (function (){var G__1010 = cljs.core.dissoc.call(null,G__1001,new cljs.core.Keyword(null,"pre","pre",2118456869),new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557),new cljs.core.Keyword(null,"elements","elements",657646735),new cljs.core.Keyword(null,"on-error","on-error",1728533530));
if(cljs.core.record_QMARK_.call(null,G__1001)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__1010);
} else {
return G__1010;
}
})();
return (new schema.spec.collection.CollectionSpec(new cljs.core.Keyword(null,"pre","pre",2118456869).cljs$core$IFn$_invoke$arity$1(G__1001),new cljs.core.Keyword(null,"konstructor","konstructor",-1422324557).cljs$core$IFn$_invoke$arity$1(G__1001),new cljs.core.Keyword(null,"elements","elements",657646735).cljs$core$IFn$_invoke$arity$1(G__1001),new cljs.core.Keyword(null,"on-error","on-error",1728533530).cljs$core$IFn$_invoke$arity$1(G__1001),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});

/**
 * A collection represents a collection of elements, each of which is itself
 * schematized.  At the top level, the collection has a precondition
 * (presumably on the overall type), a constructor for the collection from a
 * sequence of items, an element spec, and a function that constructs a
 * descriptive error on failure.
 * 
 * The element spec is a nested list structure, in which the leaf elements each
 * provide an element schema, parser (allowing for efficient processing of structured
 * collections), and optional error wrapper.  Each item in the list can be a leaf
 * element or an `optional` nested element spec (see below).  In addition, the final
 * element can be a `remaining` schema (see below).
 * 
 * Note that the `optional` carries no semantics with respect to validation;
 * the user must ensure that the parser enforces the desired semantics, which
 * should match the structure of the spec for proper generation.
 */
schema.spec.collection.collection_spec = (function schema$spec$collection$collection_spec(pre,konstructor,elements,on_error){
return schema.spec.collection.__GT_CollectionSpec.call(null,pre,konstructor,elements,on_error);
});
/**
 * All remaining elements must match schema s
 */
schema.spec.collection.remaining = (function schema$spec$collection$remaining(s){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("schema.spec.collection","remaining","schema.spec.collection/remaining",-421177821),s], null);
});
/**
 * If any more elements are present, they must match the elements in 'ss'
 */
schema.spec.collection.optional = (function schema$spec$collection$optional(var_args){
var args__4736__auto__ = [];
var len__4730__auto___1013 = arguments.length;
var i__4731__auto___1014 = (0);
while(true){
if((i__4731__auto___1014 < len__4730__auto___1013)){
args__4736__auto__.push((arguments[i__4731__auto___1014]));

var G__1015 = (i__4731__auto___1014 + (1));
i__4731__auto___1014 = G__1015;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((0) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((0)),(0),null)):null);
return schema.spec.collection.optional.cljs$core$IFn$_invoke$arity$variadic(argseq__4737__auto__);
});

schema.spec.collection.optional.cljs$core$IFn$_invoke$arity$variadic = (function (ss){
return cljs.core.vec.call(null,cljs.core.cons.call(null,new cljs.core.Keyword("schema.spec.collection","optional","schema.spec.collection/optional",-854614927),ss));
});

schema.spec.collection.optional.cljs$lang$maxFixedArity = (0);

/** @this {Function} */
schema.spec.collection.optional.cljs$lang$applyTo = (function (seq1012){
var self__4718__auto__ = this;
return self__4718__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq1012));
});

schema.spec.collection.all_elements = (function schema$spec$collection$all_elements(schema__$1){
return schema.spec.collection.remaining.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),schema__$1,new cljs.core.Keyword(null,"parser","parser",-1543495310),(function (coll){
throw (new Error("should never be not called"));
})], null));
});
schema.spec.collection.one_element = (function schema$spec$collection$one_element(required_QMARK_,schema__$1,parser){
var base = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),schema__$1,new cljs.core.Keyword(null,"parser","parser",-1543495310),parser], null);
if(cljs.core.truth_(required_QMARK_)){
return base;
} else {
return schema.spec.collection.optional.call(null,base);
}
});
schema.spec.collection.optional_tail = (function schema$spec$collection$optional_tail(schema__$1,parser,more){
return cljs.core.into.call(null,schema.spec.collection.optional.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),schema__$1,new cljs.core.Keyword(null,"parser","parser",-1543495310),parser], null)),more);
});

//# sourceMappingURL=collection.js.map
