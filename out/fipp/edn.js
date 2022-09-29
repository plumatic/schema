// Compiled by ClojureScript 1.10.520 {:target :nodejs}
goog.provide('fipp.edn');
goog.require('cljs.core');
goog.require('fipp.ednize');
goog.require('fipp.visit');
goog.require('fipp.engine');
fipp.edn.pretty_coll = (function fipp$edn$pretty_coll(p__5837,open,xs,sep,close,f){
var map__5838 = p__5837;
var map__5838__$1 = (((((!((map__5838 == null))))?(((((map__5838.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__5838.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__5838):map__5838);
var printer = map__5838__$1;
var print_level = cljs.core.get.call(null,map__5838__$1,new cljs.core.Keyword(null,"print-level","print-level",-1825423733));
var print_length = cljs.core.get.call(null,map__5838__$1,new cljs.core.Keyword(null,"print-length","print-length",1931866356));
var printer__$1 = (function (){var G__5840 = printer;
if(cljs.core.truth_(print_level)){
return cljs.core.update.call(null,G__5840,new cljs.core.Keyword(null,"print-level","print-level",-1825423733),cljs.core.dec);
} else {
return G__5840;
}
})();
var xform = cljs.core.comp.call(null,(cljs.core.truth_(print_length)?cljs.core.take.call(null,print_length):cljs.core.identity),cljs.core.map.call(null,((function (printer__$1,map__5838,map__5838__$1,printer,print_level,print_length){
return (function (p1__5836_SHARP_){
return f.call(null,printer__$1,p1__5836_SHARP_);
});})(printer__$1,map__5838,map__5838__$1,printer,print_level,print_length))
),cljs.core.interpose.call(null,sep));
var ys = ((((function (){var or__4131__auto__ = print_level;
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
return (1);
}
})() > (0)))?cljs.core.sequence.call(null,xform,xs):"#");
var ellipsis = (cljs.core.truth_((function (){var and__4120__auto__ = print_length;
if(cljs.core.truth_(and__4120__auto__)){
return cljs.core.seq.call(null,cljs.core.drop.call(null,print_length,xs));
} else {
return and__4120__auto__;
}
})())?new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),sep,"..."], null):null);
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"group","group",582596132),open,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),ys,ellipsis], null),close], null);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {fipp.visit.IVisitor}
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
fipp.edn.EdnPrinter = (function (symbols,print_meta,print_length,print_level,__meta,__extmap,__hash){
this.symbols = symbols;
this.print_meta = print_meta;
this.print_length = print_length;
this.print_level = print_level;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
fipp.edn.EdnPrinter.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__4385__auto__,k__4386__auto__){
var self__ = this;
var this__4385__auto____$1 = this;
return this__4385__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__4386__auto__,null);
});

fipp.edn.EdnPrinter.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__4387__auto__,k5842,else__4388__auto__){
var self__ = this;
var this__4387__auto____$1 = this;
var G__5846 = k5842;
var G__5846__$1 = (((G__5846 instanceof cljs.core.Keyword))?G__5846.fqn:null);
switch (G__5846__$1) {
case "symbols":
return self__.symbols;

break;
case "print-meta":
return self__.print_meta;

break;
case "print-length":
return self__.print_length;

break;
case "print-level":
return self__.print_level;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k5842,else__4388__auto__);

}
});

fipp.edn.EdnPrinter.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__4404__auto__,f__4405__auto__,init__4406__auto__){
var self__ = this;
var this__4404__auto____$1 = this;
return cljs.core.reduce.call(null,((function (this__4404__auto____$1){
return (function (ret__4407__auto__,p__5847){
var vec__5848 = p__5847;
var k__4408__auto__ = cljs.core.nth.call(null,vec__5848,(0),null);
var v__4409__auto__ = cljs.core.nth.call(null,vec__5848,(1),null);
return f__4405__auto__.call(null,ret__4407__auto__,k__4408__auto__,v__4409__auto__);
});})(this__4404__auto____$1))
,init__4406__auto__,this__4404__auto____$1);
});

fipp.edn.EdnPrinter.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__4399__auto__,writer__4400__auto__,opts__4401__auto__){
var self__ = this;
var this__4399__auto____$1 = this;
var pr_pair__4402__auto__ = ((function (this__4399__auto____$1){
return (function (keyval__4403__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,cljs.core.pr_writer,""," ","",opts__4401__auto__,keyval__4403__auto__);
});})(this__4399__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__4400__auto__,pr_pair__4402__auto__,"#fipp.edn.EdnPrinter{",", ","}",opts__4401__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"symbols","symbols",1211743),self__.symbols],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),self__.print_meta],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"print-length","print-length",1931866356),self__.print_length],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"print-level","print-level",-1825423733),self__.print_level],null))], null),self__.__extmap));
});

fipp.edn.EdnPrinter.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__5841){
var self__ = this;
var G__5841__$1 = this;
return (new cljs.core.RecordIter((0),G__5841__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"symbols","symbols",1211743),new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),new cljs.core.Keyword(null,"print-length","print-length",1931866356),new cljs.core.Keyword(null,"print-level","print-level",-1825423733)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
});

fipp.edn.EdnPrinter.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__4383__auto__){
var self__ = this;
var this__4383__auto____$1 = this;
return self__.__meta;
});

fipp.edn.EdnPrinter.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__4380__auto__){
var self__ = this;
var this__4380__auto____$1 = this;
return (new fipp.edn.EdnPrinter(self__.symbols,self__.print_meta,self__.print_length,self__.print_level,self__.__meta,self__.__extmap,self__.__hash));
});

fipp.edn.EdnPrinter.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__4389__auto__){
var self__ = this;
var this__4389__auto____$1 = this;
return (4 + cljs.core.count.call(null,self__.__extmap));
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$ = cljs.core.PROTOCOL_SENTINEL;

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_record$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return fipp.visit.visit.call(null,this$__$1,fipp.ednize.record__GT_tagged.call(null,x));
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_meta$arity$3 = (function (this$,m,x){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.print_meta)){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"align","align",1964212802),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),"^",fipp.visit.visit.call(null,this$__$1,m)], null),new cljs.core.Keyword(null,"line","line",212345235),fipp.visit.visit_STAR_.call(null,this$__$1,x)], null);
} else {
return fipp.visit.visit_STAR_.call(null,this$__$1,x);
}
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_number$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.pr_str.call(null,x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_pattern$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.pr_str.call(null,x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_unknown$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return fipp.visit.visit.call(null,this$__$1,fipp.ednize.edn.call(null,x));
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_symbol$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.str.cljs$core$IFn$_invoke$arity$1(x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_seq$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
var temp__4655__auto__ = self__.symbols.call(null,cljs.core.first.call(null,x));
if(cljs.core.truth_(temp__4655__auto__)){
var pretty = temp__4655__auto__;
return pretty.call(null,this$__$1,x);
} else {
return fipp.edn.pretty_coll.call(null,this$__$1,"(",x,new cljs.core.Keyword(null,"line","line",212345235),")",fipp.visit.visit);
}
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_boolean$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.str.cljs$core$IFn$_invoke$arity$1(x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_tagged$arity$2 = (function (this$,p__5851){
var self__ = this;
var map__5852 = p__5851;
var map__5852__$1 = (((((!((map__5852 == null))))?(((((map__5852.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__5852.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__5852):map__5852);
var tag = cljs.core.get.call(null,map__5852__$1,new cljs.core.Keyword(null,"tag","tag",-1290361223));
var form = cljs.core.get.call(null,map__5852__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"group","group",582596132),"#",cljs.core.pr_str.call(null,tag),(cljs.core.truth_((function (){var or__4131__auto__ = (function (){var and__4120__auto__ = self__.print_meta;
if(cljs.core.truth_(and__4120__auto__)){
return cljs.core.meta.call(null,form);
} else {
return and__4120__auto__;
}
})();
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
return (!(cljs.core.coll_QMARK_.call(null,form)));
}
})())?" ":null),fipp.visit.visit.call(null,this$__$1,form)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_keyword$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.str.cljs$core$IFn$_invoke$arity$1(x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_map$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return fipp.edn.pretty_coll.call(null,this$__$1,"{",x,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),",",new cljs.core.Keyword(null,"line","line",212345235)], null),"}",((function (this$__$1){
return (function (printer,p__5854){
var vec__5855 = p__5854;
var k = cljs.core.nth.call(null,vec__5855,(0),null);
var v = cljs.core.nth.call(null,vec__5855,(1),null);
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),fipp.visit.visit.call(null,printer,k)," ",fipp.visit.visit.call(null,printer,v)], null);
});})(this$__$1))
);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_nil$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),"nil"], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_character$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.pr_str.call(null,x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_string$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.pr_str.call(null,x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_var$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),cljs.core.str.cljs$core$IFn$_invoke$arity$1(x)], null);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_set$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return fipp.edn.pretty_coll.call(null,this$__$1,"#{",x,new cljs.core.Keyword(null,"line","line",212345235),"}",fipp.visit.visit);
});

fipp.edn.EdnPrinter.prototype.fipp$visit$IVisitor$visit_vector$arity$2 = (function (this$,x){
var self__ = this;
var this$__$1 = this;
return fipp.edn.pretty_coll.call(null,this$__$1,"[",x,new cljs.core.Keyword(null,"line","line",212345235),"]",fipp.visit.visit);
});

fipp.edn.EdnPrinter.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__4381__auto__){
var self__ = this;
var this__4381__auto____$1 = this;
var h__4243__auto__ = self__.__hash;
if((!((h__4243__auto__ == null)))){
return h__4243__auto__;
} else {
var h__4243__auto____$1 = ((function (h__4243__auto__,this__4381__auto____$1){
return (function (coll__4382__auto__){
return (222486956 ^ cljs.core.hash_unordered_coll.call(null,coll__4382__auto__));
});})(h__4243__auto__,this__4381__auto____$1))
.call(null,this__4381__auto____$1);
self__.__hash = h__4243__auto____$1;

return h__4243__auto____$1;
}
});

fipp.edn.EdnPrinter.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this5843,other5844){
var self__ = this;
var this5843__$1 = this;
return (((!((other5844 == null)))) && ((this5843__$1.constructor === other5844.constructor)) && (cljs.core._EQ_.call(null,this5843__$1.symbols,other5844.symbols)) && (cljs.core._EQ_.call(null,this5843__$1.print_meta,other5844.print_meta)) && (cljs.core._EQ_.call(null,this5843__$1.print_length,other5844.print_length)) && (cljs.core._EQ_.call(null,this5843__$1.print_level,other5844.print_level)) && (cljs.core._EQ_.call(null,this5843__$1.__extmap,other5844.__extmap)));
});

fipp.edn.EdnPrinter.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__4394__auto__,k__4395__auto__){
var self__ = this;
var this__4394__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),null,new cljs.core.Keyword(null,"print-level","print-level",-1825423733),null,new cljs.core.Keyword(null,"print-length","print-length",1931866356),null,new cljs.core.Keyword(null,"symbols","symbols",1211743),null], null), null),k__4395__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__4394__auto____$1),self__.__meta),k__4395__auto__);
} else {
return (new fipp.edn.EdnPrinter(self__.symbols,self__.print_meta,self__.print_length,self__.print_level,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__4395__auto__)),null));
}
});

fipp.edn.EdnPrinter.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__4392__auto__,k__4393__auto__,G__5841){
var self__ = this;
var this__4392__auto____$1 = this;
var pred__5858 = cljs.core.keyword_identical_QMARK_;
var expr__5859 = k__4393__auto__;
if(cljs.core.truth_(pred__5858.call(null,new cljs.core.Keyword(null,"symbols","symbols",1211743),expr__5859))){
return (new fipp.edn.EdnPrinter(G__5841,self__.print_meta,self__.print_length,self__.print_level,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__5858.call(null,new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),expr__5859))){
return (new fipp.edn.EdnPrinter(self__.symbols,G__5841,self__.print_length,self__.print_level,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__5858.call(null,new cljs.core.Keyword(null,"print-length","print-length",1931866356),expr__5859))){
return (new fipp.edn.EdnPrinter(self__.symbols,self__.print_meta,G__5841,self__.print_level,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__5858.call(null,new cljs.core.Keyword(null,"print-level","print-level",-1825423733),expr__5859))){
return (new fipp.edn.EdnPrinter(self__.symbols,self__.print_meta,self__.print_length,G__5841,self__.__meta,self__.__extmap,null));
} else {
return (new fipp.edn.EdnPrinter(self__.symbols,self__.print_meta,self__.print_length,self__.print_level,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__4393__auto__,G__5841),null));
}
}
}
}
});

fipp.edn.EdnPrinter.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__4397__auto__){
var self__ = this;
var this__4397__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"symbols","symbols",1211743),self__.symbols,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),self__.print_meta,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"print-length","print-length",1931866356),self__.print_length,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"print-level","print-level",-1825423733),self__.print_level,null))], null),self__.__extmap));
});

fipp.edn.EdnPrinter.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__4384__auto__,G__5841){
var self__ = this;
var this__4384__auto____$1 = this;
return (new fipp.edn.EdnPrinter(self__.symbols,self__.print_meta,self__.print_length,self__.print_level,G__5841,self__.__extmap,self__.__hash));
});

fipp.edn.EdnPrinter.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__4390__auto__,entry__4391__auto__){
var self__ = this;
var this__4390__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__4391__auto__)){
return this__4390__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__4391__auto__,(0)),cljs.core._nth.call(null,entry__4391__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__4390__auto____$1,entry__4391__auto__);
}
});

fipp.edn.EdnPrinter.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"symbols","symbols",1641743270,null),new cljs.core.Symbol(null,"print-meta","print-meta",-1620321171,null),new cljs.core.Symbol(null,"print-length","print-length",-722569413,null),new cljs.core.Symbol(null,"print-level","print-level",-184892206,null)], null);
});

fipp.edn.EdnPrinter.cljs$lang$type = true;

fipp.edn.EdnPrinter.cljs$lang$ctorPrSeq = (function (this__4428__auto__){
return (new cljs.core.List(null,"fipp.edn/EdnPrinter",null,(1),null));
});

fipp.edn.EdnPrinter.cljs$lang$ctorPrWriter = (function (this__4428__auto__,writer__4429__auto__){
return cljs.core._write.call(null,writer__4429__auto__,"fipp.edn/EdnPrinter");
});

/**
 * Positional factory function for fipp.edn/EdnPrinter.
 */
fipp.edn.__GT_EdnPrinter = (function fipp$edn$__GT_EdnPrinter(symbols,print_meta,print_length,print_level){
return (new fipp.edn.EdnPrinter(symbols,print_meta,print_length,print_level,null,null,null));
});

/**
 * Factory function for fipp.edn/EdnPrinter, taking a map of keywords to field values.
 */
fipp.edn.map__GT_EdnPrinter = (function fipp$edn$map__GT_EdnPrinter(G__5845){
var extmap__4424__auto__ = (function (){var G__5861 = cljs.core.dissoc.call(null,G__5845,new cljs.core.Keyword(null,"symbols","symbols",1211743),new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),new cljs.core.Keyword(null,"print-length","print-length",1931866356),new cljs.core.Keyword(null,"print-level","print-level",-1825423733));
if(cljs.core.record_QMARK_.call(null,G__5845)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__5861);
} else {
return G__5861;
}
})();
return (new fipp.edn.EdnPrinter(new cljs.core.Keyword(null,"symbols","symbols",1211743).cljs$core$IFn$_invoke$arity$1(G__5845),new cljs.core.Keyword(null,"print-meta","print-meta",1034114598).cljs$core$IFn$_invoke$arity$1(G__5845),new cljs.core.Keyword(null,"print-length","print-length",1931866356).cljs$core$IFn$_invoke$arity$1(G__5845),new cljs.core.Keyword(null,"print-level","print-level",-1825423733).cljs$core$IFn$_invoke$arity$1(G__5845),null,cljs.core.not_empty.call(null,extmap__4424__auto__),null));
});

fipp.edn.pprint = (function fipp$edn$pprint(var_args){
var G__5864 = arguments.length;
switch (G__5864) {
case 1:
return fipp.edn.pprint.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return fipp.edn.pprint.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

fipp.edn.pprint.cljs$core$IFn$_invoke$arity$1 = (function (x){
return fipp.edn.pprint.call(null,x,cljs.core.PersistentArrayMap.EMPTY);
});

fipp.edn.pprint.cljs$core$IFn$_invoke$arity$2 = (function (x,options){
var defaults = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"symbols","symbols",1211743),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"print-length","print-length",1931866356),cljs.core._STAR_print_length_STAR_,new cljs.core.Keyword(null,"print-level","print-level",-1825423733),cljs.core._STAR_print_level_STAR_,new cljs.core.Keyword(null,"print-meta","print-meta",1034114598),cljs.core._STAR_print_meta_STAR_], null);
var printer = fipp.edn.map__GT_EdnPrinter.call(null,cljs.core.merge.call(null,defaults,options));
var _STAR_print_meta_STAR__orig_val__5865 = cljs.core._STAR_print_meta_STAR_;
var _STAR_print_meta_STAR__temp_val__5866 = false;
cljs.core._STAR_print_meta_STAR_ = _STAR_print_meta_STAR__temp_val__5866;

try{return fipp.engine.pprint_document.call(null,fipp.visit.visit.call(null,printer,x),options);
}finally {cljs.core._STAR_print_meta_STAR_ = _STAR_print_meta_STAR__orig_val__5865;
}});

fipp.edn.pprint.cljs$lang$maxFixedArity = 2;


//# sourceMappingURL=edn.js.map
