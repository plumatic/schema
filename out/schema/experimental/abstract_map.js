// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('schema.experimental.abstract_map');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('schema.core');
goog.require('schema.spec.core');
goog.require('schema.spec.variant');

/**
 * @interface
 */
schema.experimental.abstract_map.PExtensibleSchema = function(){};

schema.experimental.abstract_map.extend_schema_BANG_ = (function schema$experimental$abstract_map$extend_schema_BANG_(this$,extension,schema_name,dispatch_values){
if((((!((this$ == null)))) && ((!((this$.schema$experimental$abstract_map$PExtensibleSchema$extend_schema_BANG_$arity$4 == null)))))){
return this$.schema$experimental$abstract_map$PExtensibleSchema$extend_schema_BANG_$arity$4(this$,extension,schema_name,dispatch_values);
} else {
var x__4433__auto__ = (((this$ == null))?null:this$);
var m__4434__auto__ = (schema.experimental.abstract_map.extend_schema_BANG_[goog.typeOf(x__4433__auto__)]);
if((!((m__4434__auto__ == null)))){
return m__4434__auto__.call(null,this$,extension,schema_name,dispatch_values);
} else {
var m__4431__auto__ = (schema.experimental.abstract_map.extend_schema_BANG_["_"]);
if((!((m__4431__auto__ == null)))){
return m__4431__auto__.call(null,this$,extension,schema_name,dispatch_values);
} else {
throw cljs.core.missing_protocol.call(null,"PExtensibleSchema.extend-schema!",this$);
}
}
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
schema.experimental.abstract_map.SchemaExtension = (function (schema_name,base_schema,extended_schema,explain_value,__meta,__extmap,__hash){
this.schema_name = schema_name;
this.base_schema = base_schema;
this.extended_schema = extended_schema;
this.explain_value = explain_value;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k3013,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__3017 = k3013;
var G__3017__$1 = (((G__3017 instanceof cljs.core.Keyword))?G__3017.fqn:null);
switch (G__3017__$1) {
case "schema-name":
return self__.schema_name;

break;
case "base-schema":
return self__.base_schema;

break;
case "extended-schema":
return self__.extended_schema;

break;
case "explain-value":
return self__.explain_value;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k3013,else__4388__auto__);

}
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__3018){
var vec__3019 = p__3018;
var k__4408__auto__ = cljs.core.nth.call(null,vec__3019,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__3019,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.experimental.abstract-map.SchemaExtension{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema-name","schema-name",1666725119),self__.schema_name],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"base-schema","base-schema",527173635),self__.base_schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626),self__.extended_schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"explain-value","explain-value",2127057723),self__.explain_value],null))], null),self__.__extmap));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__3012){
var self__ = this;
var G__3012__$1 = this;
return (new cljs.core.RecordIter((0),G__3012__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schema-name","schema-name",1666725119),new cljs.core.Keyword(null,"base-schema","base-schema",527173635),new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626),new cljs.core.Keyword(null,"explain-value","explain-value",2127057723)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,self__.base_schema,self__.extended_schema,self__.explain_value,self__.__meta,self__.__extmap,self__.__hash));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (4 + cljs.core.count.call(null,self__.__extmap));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-1387856825 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this3014,other3015){
var self__ = this;
var this3014__$1 = this;
return (((!((other3015 == null)))) && ((this3014__$1.constructor === other3015.constructor)) && (cljs.core._EQ_.call(null,this3014__$1.schema_name,other3015.schema_name)) && (cljs.core._EQ_.call(null,this3014__$1.base_schema,other3015.base_schema)) && (cljs.core._EQ_.call(null,this3014__$1.extended_schema,other3015.extended_schema)) && (cljs.core._EQ_.call(null,this3014__$1.explain_value,other3015.explain_value)) && (cljs.core._EQ_.call(null,this3014__$1.__extmap,other3015.__extmap)));
});

schema.experimental.abstract_map.SchemaExtension.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.experimental.abstract_map.SchemaExtension.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.extended_schema], null)], null));
});

schema.experimental.abstract_map.SchemaExtension.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"extend-schema","extend-schema",1297250995,null),(new cljs.core.List(null,self__.schema_name,(new cljs.core.List(null,schema.core.schema_name.call(null,self__.base_schema),(new cljs.core.List(null,schema.core.explain.call(null,self__.explain_value),null,(1),null)),(2),null)),(3),null)),(4),null));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"base-schema","base-schema",527173635),null,new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626),null,new cljs.core.Keyword(null,"explain-value","explain-value",2127057723),null,new cljs.core.Keyword(null,"schema-name","schema-name",1666725119),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,self__.base_schema,self__.extended_schema,self__.explain_value,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__3012){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__3022 = cljs.core.keyword_identical_QMARK_;
var expr__3023 = k__4393__auto__;
if(cljs.core.truth_(pred__3022.call(null,new cljs.core.Keyword(null,"schema-name","schema-name",1666725119),expr__3023))){
return (new schema.experimental.abstract_map.SchemaExtension(G__3012,self__.base_schema,self__.extended_schema,self__.explain_value,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__3022.call(null,new cljs.core.Keyword(null,"base-schema","base-schema",527173635),expr__3023))){
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,G__3012,self__.extended_schema,self__.explain_value,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__3022.call(null,new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626),expr__3023))){
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,self__.base_schema,G__3012,self__.explain_value,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__3022.call(null,new cljs.core.Keyword(null,"explain-value","explain-value",2127057723),expr__3023))){
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,self__.base_schema,self__.extended_schema,G__3012,self__.__meta,self__.__extmap,null));
} else {
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,self__.base_schema,self__.extended_schema,self__.explain_value,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__3012),null));
}
}
}
}
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema-name","schema-name",1666725119),self__.schema_name,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"base-schema","base-schema",527173635),self__.base_schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626),self__.extended_schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"explain-value","explain-value",2127057723),self__.explain_value,null))], null),self__.__extmap));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__3012){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.experimental.abstract_map.SchemaExtension(self__.schema_name,self__.base_schema,self__.extended_schema,self__.explain_value,G__3012,self__.__extmap,self__.__hash));
});

schema.experimental.abstract_map.SchemaExtension.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.experimental.abstract_map.SchemaExtension.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"schema-name","schema-name",-987710650,null),new cljs.core.Symbol(null,"base-schema","base-schema",-2127262134,null),new cljs.core.Symbol(null,"extended-schema","extended-schema",949689901,null),new cljs.core.Symbol(null,"explain-value","explain-value",-527378046,null)], null);
});

schema.experimental.abstract_map.SchemaExtension.cljs$lang$type = true;

schema.experimental.abstract_map.SchemaExtension.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.experimental.abstract-map/SchemaExtension",null,(1),null));
});

schema.experimental.abstract_map.SchemaExtension.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.experimental.abstract-map/SchemaExtension");
});

/**
 * Positional factory function for schema.experimental.abstract-map/SchemaExtension.
 */
schema.experimental.abstract_map.__GT_SchemaExtension = (function schema$experimental$abstract_map$__GT_SchemaExtension(schema_name,base_schema,extended_schema,explain_value){
return (new schema.experimental.abstract_map.SchemaExtension(schema_name,base_schema,extended_schema,explain_value,null,null,null));
});

/**
 * Factory function for schema.experimental.abstract-map/SchemaExtension, taking a map of keywords to field values.
 */
schema.experimental.abstract_map.map__GT_SchemaExtension = (function schema$experimental$abstract_map$map__GT_SchemaExtension(G__3016){
var extmap__4424__auto__ = (function (){var G__3025 = cljs.core.dissoc.call(null,G__3016,new cljs.core.Keyword(null,"schema-name","schema-name",1666725119),new cljs.core.Keyword(null,"base-schema","base-schema",527173635),new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626),new cljs.core.Keyword(null,"explain-value","explain-value",2127057723));
if(cljs.core.record_QMARK_.call(null,G__3016)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__3025);
} else {
return G__3025;
}
})();
return (new schema.experimental.abstract_map.SchemaExtension(new cljs.core.Keyword(null,"schema-name","schema-name",1666725119).cljs$core$IFn$_invoke$arity$1(G__3016),new cljs.core.Keyword(null,"base-schema","base-schema",527173635).cljs$core$IFn$_invoke$arity$1(G__3016),new cljs.core.Keyword(null,"extended-schema","extended-schema",-690841626).cljs$core$IFn$_invoke$arity$1(G__3016),new cljs.core.Keyword(null,"explain-value","explain-value",2127057723).cljs$core$IFn$_invoke$arity$1(G__3016),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});


/**
* @constructor
 * @implements {schema.experimental.abstract_map.PExtensibleSchema}
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
schema.experimental.abstract_map.AbstractSchema = (function (sub_schemas,dispatch_key,schema,open_QMARK_,__meta,__extmap,__hash){
this.sub_schemas = sub_schemas;
this.dispatch_key = dispatch_key;
this.schema = schema;
this.open_QMARK_ = open_QMARK_;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k3029,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__3033 = k3029;
var G__3033__$1 = (((G__3033 instanceof cljs.core.Keyword))?G__3033.fqn:null);
switch (G__3033__$1) {
case "sub-schemas":
return self__.sub_schemas;

break;
case "dispatch-key":
return self__.dispatch_key;

break;
case "schema":
return self__.schema;

break;
case "open?":
return self__.open_QMARK_;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k3029,else__4388__auto__);

}
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__3034){
var vec__3035 = p__3034;
var k__4408__auto__ = cljs.core.nth.call(null,vec__3035,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__3035,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#schema.experimental.abstract-map.AbstractSchema{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027),self__.sub_schemas],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510),self__.dispatch_key],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"open?","open?",1238443125),self__.open_QMARK_],null))], null),self__.__extmap));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__3028){
var self__ = this;
var G__3028__$1 = this;
return (new cljs.core.RecordIter((0),G__3028__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027),new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510),new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"open?","open?",1238443125)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,self__.dispatch_key,self__.schema,self__.open_QMARK_,self__.__meta,self__.__extmap,self__.__hash));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (4 + cljs.core.count.call(null,self__.__extmap));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (-171767789 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this3030,other3031){
var self__ = this;
var this3030__$1 = this;
return (((!((other3031 == null)))) && ((this3030__$1.constructor === other3031.constructor)) && (cljs.core._EQ_.call(null,this3030__$1.sub_schemas,other3031.sub_schemas)) && (cljs.core._EQ_.call(null,this3030__$1.dispatch_key,other3031.dispatch_key)) && (cljs.core._EQ_.call(null,this3030__$1.schema,other3031.schema)) && (cljs.core._EQ_.call(null,this3030__$1.open_QMARK_,other3031.open_QMARK_)) && (cljs.core._EQ_.call(null,this3030__$1.__extmap,other3031.__extmap)));
});

schema.experimental.abstract_map.AbstractSchema.prototype.schema$core$Schema$ = cljs.core.PROTOCOL_SENTINEL;

schema.experimental.abstract_map.AbstractSchema.prototype.schema$core$Schema$spec$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return schema.spec.variant.variant_spec.call(null,schema.spec.core._PLUS_no_precondition_PLUS_,cljs.core.concat.call(null,(function (){var iter__4523__auto__ = ((function (this$__$1){
return (function schema$experimental$abstract_map$iter__3038(s__3039){
return (new cljs.core.LazySeq(null,((function (this$__$1){
return (function (){
var s__3039__$1 = s__3039;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__3039__$1);
if(temp__4657__auto__){
var s__3039__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__3039__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__3039__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__3041 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__3040 = (0);
while(true){
if((i__3040 < size__4522__auto__)){
var vec__3042 = cljs.core._nth.call(null,c__4521__auto__,i__3040);
var k = cljs.core.nth.call(null,vec__3042,(0),null);
var s = cljs.core.nth.call(null,vec__3042,(1),null);
cljs.core.chunk_append.call(null,b__3041,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),((function (i__3040,vec__3042,k,s,c__4521__auto__,size__4522__auto__,b__3041,s__3039__$2,temp__4657__auto__,this$__$1){
return (function (p1__3027_SHARP_){
return cljs.core._EQ_.call(null,cljs.core.keyword.call(null,self__.dispatch_key.call(null,p1__3027_SHARP_)),cljs.core.keyword.call(null,k));
});})(i__3040,vec__3042,k,s,c__4521__auto__,size__4522__auto__,b__3041,s__3039__$2,temp__4657__auto__,this$__$1))
,new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null));

var G__3057 = (i__3040 + (1));
i__3040 = G__3057;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__3041),schema$experimental$abstract_map$iter__3038.call(null,cljs.core.chunk_rest.call(null,s__3039__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__3041),null);
}
} else {
var vec__3045 = cljs.core.first.call(null,s__3039__$2);
var k = cljs.core.nth.call(null,vec__3045,(0),null);
var s = cljs.core.nth.call(null,vec__3045,(1),null);
return cljs.core.cons.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guard","guard",-873147811),((function (vec__3045,k,s,s__3039__$2,temp__4657__auto__,this$__$1){
return (function (p1__3027_SHARP_){
return cljs.core._EQ_.call(null,cljs.core.keyword.call(null,self__.dispatch_key.call(null,p1__3027_SHARP_)),cljs.core.keyword.call(null,k));
});})(vec__3045,k,s,s__3039__$2,temp__4657__auto__,this$__$1))
,new cljs.core.Keyword(null,"schema","schema",-1582001791),s], null),schema$experimental$abstract_map$iter__3038.call(null,cljs.core.rest.call(null,s__3039__$2)));
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
return iter__4523__auto__.call(null,cljs.core.deref.call(null,self__.sub_schemas));
})(),(cljs.core.truth_(self__.open_QMARK_)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),cljs.core.assoc.call(null,self__.schema,self__.dispatch_key,schema.core.Keyword,schema.core.Any,schema.core.Any)], null)], null):null)),((function (this$__$1){
return (function (v){
return (new cljs.core.List(null,cljs.core.set.call(null,cljs.core.keys.call(null,cljs.core.deref.call(null,self__.sub_schemas))),(new cljs.core.List(null,(new cljs.core.List(null,self__.dispatch_key,(new cljs.core.List(null,v,null,(1),null)),(2),null)),null,(1),null)),(2),null));
});})(this$__$1))
);
});

schema.experimental.abstract_map.AbstractSchema.prototype.schema$core$Schema$explain$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return (new cljs.core.List(null,new cljs.core.Symbol(null,"abstract-map-schema","abstract-map-schema",90468397,null),(new cljs.core.List(null,self__.dispatch_key,(new cljs.core.List(null,schema.core.explain.call(null,self__.schema),(new cljs.core.List(null,cljs.core.set.call(null,cljs.core.keys.call(null,cljs.core.deref.call(null,self__.sub_schemas))),null,(1),null)),(2),null)),(3),null)),(4),null));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"schema","schema",-1582001791),null,new cljs.core.Keyword(null,"open?","open?",1238443125),null,new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027),null,new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,self__.dispatch_key,self__.schema,self__.open_QMARK_,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__3028){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__3048 = cljs.core.keyword_identical_QMARK_;
var expr__3049 = k__4393__auto__;
if(cljs.core.truth_(pred__3048.call(null,new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027),expr__3049))){
return (new schema.experimental.abstract_map.AbstractSchema(G__3028,self__.dispatch_key,self__.schema,self__.open_QMARK_,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__3048.call(null,new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510),expr__3049))){
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,G__3028,self__.schema,self__.open_QMARK_,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__3048.call(null,new cljs.core.Keyword(null,"schema","schema",-1582001791),expr__3049))){
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,self__.dispatch_key,G__3028,self__.open_QMARK_,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__3048.call(null,new cljs.core.Keyword(null,"open?","open?",1238443125),expr__3049))){
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,self__.dispatch_key,self__.schema,G__3028,self__.__meta,self__.__extmap,null));
} else {
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,self__.dispatch_key,self__.schema,self__.open_QMARK_,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__3028),null));
}
}
}
}
});

schema.experimental.abstract_map.AbstractSchema.prototype.schema$experimental$abstract_map$PExtensibleSchema$ = cljs.core.PROTOCOL_SENTINEL;

schema.experimental.abstract_map.AbstractSchema.prototype.schema$experimental$abstract_map$PExtensibleSchema$extend_schema_BANG_$arity$4 = (function (this$,extension,schema_name,dispatch_values){
var self__ = this;
var this$__$1 = this;
var sub_schema = cljs.core.assoc.call(null,cljs.core.merge.call(null,self__.schema,extension),self__.dispatch_key,cljs.core.apply.call(null,schema.core.enum$,dispatch_values));
var ext_schema = schema.core.schema_with_name.call(null,(new schema.experimental.abstract_map.SchemaExtension(schema_name,this$__$1,sub_schema,extension,null,null,null)),cljs.core.name.call(null,schema_name));
cljs.core.swap_BANG_.call(null,self__.sub_schemas,cljs.core.merge,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__4523__auto__ = ((function (sub_schema,ext_schema,this$__$1){
return (function schema$experimental$abstract_map$iter__3051(s__3052){
return (new cljs.core.LazySeq(null,((function (sub_schema,ext_schema,this$__$1){
return (function (){
var s__3052__$1 = s__3052;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__3052__$1);
if(temp__4657__auto__){
var s__3052__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__3052__$2)){
var c__4521__auto__ = cljs.core.chunk_first.call(null,s__3052__$2);
var size__4522__auto__ = cljs.core.count.call(null,c__4521__auto__);
var b__3054 = cljs.core.chunk_buffer.call(null,size__4522__auto__);
if((function (){var i__3053 = (0);
while(true){
if((i__3053 < size__4522__auto__)){
var k = cljs.core._nth.call(null,c__4521__auto__,i__3053);
cljs.core.chunk_append.call(null,b__3054,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,ext_schema], null));

var G__3058 = (i__3053 + (1));
i__3053 = G__3058;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__3054),schema$experimental$abstract_map$iter__3051.call(null,cljs.core.chunk_rest.call(null,s__3052__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__3054),null);
}
} else {
var k = cljs.core.first.call(null,s__3052__$2);
return cljs.core.cons.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,ext_schema], null),schema$experimental$abstract_map$iter__3051.call(null,cljs.core.rest.call(null,s__3052__$2)));
}
} else {
return null;
}
break;
}
});})(sub_schema,ext_schema,this$__$1))
,null,null));
});})(sub_schema,ext_schema,this$__$1))
;
return iter__4523__auto__.call(null,dispatch_values);
})()));

return ext_schema;
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027),self__.sub_schemas,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510),self__.dispatch_key,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"schema","schema",-1582001791),self__.schema,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"open?","open?",1238443125),self__.open_QMARK_,null))], null),self__.__extmap));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__3028){
var self__ = this;
var this__4384__auto____$1 = this;
return (new schema.experimental.abstract_map.AbstractSchema(self__.sub_schemas,self__.dispatch_key,self__.schema,self__.open_QMARK_,G__3028,self__.__extmap,self__.__hash));
});

schema.experimental.abstract_map.AbstractSchema.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

schema.experimental.abstract_map.AbstractSchema.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"sub-schemas","sub-schemas",731677500,null),new cljs.core.Symbol(null,"dispatch-key","dispatch-key",-1920816259,null),new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.Symbol(null,"open?","open?",-1415992644,null)], null);
});

schema.experimental.abstract_map.AbstractSchema.cljs$lang$type = true;

schema.experimental.abstract_map.AbstractSchema.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"schema.experimental.abstract-map/AbstractSchema",null,(1),null));
});

schema.experimental.abstract_map.AbstractSchema.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"schema.experimental.abstract-map/AbstractSchema");
});

/**
 * Positional factory function for schema.experimental.abstract-map/AbstractSchema.
 */
schema.experimental.abstract_map.__GT_AbstractSchema = (function schema$experimental$abstract_map$__GT_AbstractSchema(sub_schemas,dispatch_key,schema__$1,open_QMARK_){
return (new schema.experimental.abstract_map.AbstractSchema(sub_schemas,dispatch_key,schema__$1,open_QMARK_,null,null,null));
});

/**
 * Factory function for schema.experimental.abstract-map/AbstractSchema, taking a map of keywords to field values.
 */
schema.experimental.abstract_map.map__GT_AbstractSchema = (function schema$experimental$abstract_map$map__GT_AbstractSchema(G__3032){
var extmap__4424__auto__ = (function (){var G__3055 = cljs.core.dissoc.call(null,G__3032,new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027),new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510),new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Keyword(null,"open?","open?",1238443125));
if(cljs.core.record_QMARK_.call(null,G__3032)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__3055);
} else {
return G__3055;
}
})();
return (new schema.experimental.abstract_map.AbstractSchema(new cljs.core.Keyword(null,"sub-schemas","sub-schemas",-908854027).cljs$core$IFn$_invoke$arity$1(G__3032),new cljs.core.Keyword(null,"dispatch-key","dispatch-key",733619510).cljs$core$IFn$_invoke$arity$1(G__3032),new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(G__3032),new cljs.core.Keyword(null,"open?","open?",1238443125).cljs$core$IFn$_invoke$arity$1(G__3032),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});

var ufv3060_3066 = schema.utils.use_fn_validation;
var output_schema3059_3067 = schema.core.Any;
var input_schema3061_3068 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,schema.core.Keyword,cljs.core.with_meta(new cljs.core.Symbol(null,"dispatch-key","dispatch-key",-1920816259,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("s","Keyword","s/Keyword",-850066400,null)], null))),schema.core.one.call(null,schema.core.pred.call(null,cljs.core.map_QMARK_),cljs.core.with_meta(new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),cljs.core.list(new cljs.core.Symbol("s","pred","s/pred",-727014287,null),new cljs.core.Symbol(null,"map?","map?",-1780568534,null))], null)))], null);
var input_checker3062_3069 = (new cljs.core.Delay(((function (ufv3060_3066,output_schema3059_3067,input_schema3061_3068){
return (function (){
return schema.core.checker.call(null,input_schema3061_3068);
});})(ufv3060_3066,output_schema3059_3067,input_schema3061_3068))
,null));
var output_checker3063_3070 = (new cljs.core.Delay(((function (ufv3060_3066,output_schema3059_3067,input_schema3061_3068,input_checker3062_3069){
return (function (){
return schema.core.checker.call(null,output_schema3059_3067);
});})(ufv3060_3066,output_schema3059_3067,input_schema3061_3068,input_checker3062_3069))
,null));
var ret__2250__auto___3071 = /**
 * Inputs: [dispatch-key :- s/Keyword schema :- (s/pred map?)]
 * 
 *   A schema representing an 'abstract class' map that must match at least one concrete
 * subtype (indicated by the value of dispatch-key, a keyword).  Add subtypes by calling
 * `extend-schema`.
 */
schema.experimental.abstract_map.abstract_map_schema = ((function (ufv3060_3066,output_schema3059_3067,input_schema3061_3068,input_checker3062_3069,output_checker3063_3070){
return (function schema$experimental$abstract_map$abstract_map_schema(G__3064,G__3065){
var validate__789__auto__ = cljs.core.deref.call(null,ufv3060_3066);
if(cljs.core.truth_(validate__789__auto__)){
var args__790__auto___3072 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [G__3064,G__3065], null);
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"input","input",556931961),cljs.core.with_meta(new cljs.core.Symbol(null,"abstract-map-schema","abstract-map-schema",90468397,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A schema representing an 'abstract class' map that must match at least one concrete\n   subtype (indicated by the value of dispatch-key, a keyword).  Add subtypes by calling\n   `extend-schema`."], null)),input_schema3061_3068,cljs.core.deref.call(null,input_checker3062_3069),args__790__auto___3072);
} else {
var temp__4657__auto___3073 = cljs.core.deref.call(null,input_checker3062_3069).call(null,args__790__auto___3072);
if(cljs.core.truth_(temp__4657__auto___3073)){
var error__791__auto___3074 = temp__4657__auto___3073;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Input to %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"abstract-map-schema","abstract-map-schema",90468397,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A schema representing an 'abstract class' map that must match at least one concrete\n   subtype (indicated by the value of dispatch-key, a keyword).  Add subtypes by calling\n   `extend-schema`."], null)),cljs.core.pr_str.call(null,error__791__auto___3074)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),input_schema3061_3068,new cljs.core.Keyword(null,"value","value",305978217),args__790__auto___3072,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___3074], null));
} else {
}
}
} else {
}

var o__792__auto__ = (function (){var dispatch_key = G__3064;
var schema__$1 = G__3065;
while(true){
return (new schema.experimental.abstract_map.AbstractSchema(cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY),dispatch_key,schema__$1,false,null,null,null));
break;
}
})();
if(cljs.core.truth_(validate__789__auto__)){
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"output","output",-1105869043),cljs.core.with_meta(new cljs.core.Symbol(null,"abstract-map-schema","abstract-map-schema",90468397,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A schema representing an 'abstract class' map that must match at least one concrete\n   subtype (indicated by the value of dispatch-key, a keyword).  Add subtypes by calling\n   `extend-schema`."], null)),output_schema3059_3067,cljs.core.deref.call(null,output_checker3063_3070),o__792__auto__);
} else {
var temp__4657__auto___3075 = cljs.core.deref.call(null,output_checker3063_3070).call(null,o__792__auto__);
if(cljs.core.truth_(temp__4657__auto___3075)){
var error__791__auto___3076 = temp__4657__auto___3075;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Output of %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"abstract-map-schema","abstract-map-schema",90468397,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"A schema representing an 'abstract class' map that must match at least one concrete\n   subtype (indicated by the value of dispatch-key, a keyword).  Add subtypes by calling\n   `extend-schema`."], null)),cljs.core.pr_str.call(null,error__791__auto___3076)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),output_schema3059_3067,new cljs.core.Keyword(null,"value","value",305978217),o__792__auto__,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___3076], null));
} else {
}
}
} else {
}

return o__792__auto__;
});})(ufv3060_3066,output_schema3059_3067,input_schema3061_3068,input_checker3062_3069,output_checker3063_3070))
;
schema.utils.declare_class_schema_BANG_.call(null,schema.utils.fn_schema_bearer.call(null,schema.experimental.abstract_map.abstract_map_schema),schema.core.__GT_FnSchema.call(null,output_schema3059_3067,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [input_schema3061_3068], null)));

var ufv3078_3084 = schema.utils.use_fn_validation;
var output_schema3077_3085 = schema.core.Any;
var input_schema3079_3086 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [schema.core.one.call(null,schema.core.Keyword,cljs.core.with_meta(new cljs.core.Symbol(null,"dispatch-key","dispatch-key",-1920816259,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("s","Keyword","s/Keyword",-850066400,null)], null))),schema.core.one.call(null,schema.core.pred.call(null,cljs.core.map_QMARK_),cljs.core.with_meta(new cljs.core.Symbol(null,"schema","schema",58529736,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"schema","schema",-1582001791),cljs.core.list(new cljs.core.Symbol("s","pred","s/pred",-727014287,null),new cljs.core.Symbol(null,"map?","map?",-1780568534,null))], null)))], null);
var input_checker3080_3087 = (new cljs.core.Delay(((function (ufv3078_3084,output_schema3077_3085,input_schema3079_3086){
return (function (){
return schema.core.checker.call(null,input_schema3079_3086);
});})(ufv3078_3084,output_schema3077_3085,input_schema3079_3086))
,null));
var output_checker3081_3088 = (new cljs.core.Delay(((function (ufv3078_3084,output_schema3077_3085,input_schema3079_3086,input_checker3080_3087){
return (function (){
return schema.core.checker.call(null,output_schema3077_3085);
});})(ufv3078_3084,output_schema3077_3085,input_schema3079_3086,input_checker3080_3087))
,null));
var ret__2250__auto___3089 = /**
 * Inputs: [dispatch-key :- s/Keyword schema :- (s/pred map?)]
 * 
 *   Like abstract-map-schema, but allows unknown types to validate (for, e.g. forward
 * compatibility).
 */
schema.experimental.abstract_map.open_abstract_map_schema = ((function (ufv3078_3084,output_schema3077_3085,input_schema3079_3086,input_checker3080_3087,output_checker3081_3088){
return (function schema$experimental$abstract_map$open_abstract_map_schema(G__3082,G__3083){
var validate__789__auto__ = cljs.core.deref.call(null,ufv3078_3084);
if(cljs.core.truth_(validate__789__auto__)){
var args__790__auto___3090 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [G__3082,G__3083], null);
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"input","input",556931961),cljs.core.with_meta(new cljs.core.Symbol(null,"open-abstract-map-schema","open-abstract-map-schema",-1952869235,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like abstract-map-schema, but allows unknown types to validate (for, e.g. forward\n   compatibility)."], null)),input_schema3079_3086,cljs.core.deref.call(null,input_checker3080_3087),args__790__auto___3090);
} else {
var temp__4657__auto___3091 = cljs.core.deref.call(null,input_checker3080_3087).call(null,args__790__auto___3090);
if(cljs.core.truth_(temp__4657__auto___3091)){
var error__791__auto___3092 = temp__4657__auto___3091;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Input to %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"open-abstract-map-schema","open-abstract-map-schema",-1952869235,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like abstract-map-schema, but allows unknown types to validate (for, e.g. forward\n   compatibility)."], null)),cljs.core.pr_str.call(null,error__791__auto___3092)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),input_schema3079_3086,new cljs.core.Keyword(null,"value","value",305978217),args__790__auto___3090,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___3092], null));
} else {
}
}
} else {
}

var o__792__auto__ = (function (){var dispatch_key = G__3082;
var schema__$1 = G__3083;
while(true){
return (new schema.experimental.abstract_map.AbstractSchema(cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY),dispatch_key,schema__$1,true,null,null,null));
break;
}
})();
if(cljs.core.truth_(validate__789__auto__)){
if(cljs.core.truth_(schema.core.fn_validator)){
schema.core.fn_validator.call(null,new cljs.core.Keyword(null,"output","output",-1105869043),cljs.core.with_meta(new cljs.core.Symbol(null,"open-abstract-map-schema","open-abstract-map-schema",-1952869235,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like abstract-map-schema, but allows unknown types to validate (for, e.g. forward\n   compatibility)."], null)),output_schema3077_3085,cljs.core.deref.call(null,output_checker3081_3088),o__792__auto__);
} else {
var temp__4657__auto___3093 = cljs.core.deref.call(null,output_checker3081_3088).call(null,o__792__auto__);
if(cljs.core.truth_(temp__4657__auto___3093)){
var error__791__auto___3094 = temp__4657__auto___3093;
throw cljs.core.ex_info.call(null,schema.utils.format_STAR_.call(null,"Output of %s does not match schema: \n\n\t \u001B[0;33m  %s \u001B[0m \n\n",cljs.core.with_meta(new cljs.core.Symbol(null,"open-abstract-map-schema","open-abstract-map-schema",-1952869235,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"schema","schema",-1582001791),new cljs.core.Symbol("schema.core","Any","schema.core/Any",-1891898271,null),new cljs.core.Keyword(null,"doc","doc",1913296891),"Like abstract-map-schema, but allows unknown types to validate (for, e.g. forward\n   compatibility)."], null)),cljs.core.pr_str.call(null,error__791__auto___3094)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("schema.core","error","schema.core/error",1991454308),new cljs.core.Keyword(null,"schema","schema",-1582001791),output_schema3077_3085,new cljs.core.Keyword(null,"value","value",305978217),o__792__auto__,new cljs.core.Keyword(null,"error","error",-978969032),error__791__auto___3094], null));
} else {
}
}
} else {
}

return o__792__auto__;
});})(ufv3078_3084,output_schema3077_3085,input_schema3079_3086,input_checker3080_3087,output_checker3081_3088))
;
schema.utils.declare_class_schema_BANG_.call(null,schema.utils.fn_schema_bearer.call(null,schema.experimental.abstract_map.open_abstract_map_schema),schema.core.__GT_FnSchema.call(null,output_schema3077_3085,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [input_schema3079_3086], null)));

schema.experimental.abstract_map.sub_schemas = (function schema$experimental$abstract_map$sub_schemas(abstract_schema){
return cljs.core.deref.call(null,abstract_schema.sub_schemas);
});

//# sourceMappingURL=abstract_map.js.map
