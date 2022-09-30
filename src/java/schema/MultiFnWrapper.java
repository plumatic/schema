package schema;

import clojure.lang.*;

public class MultiFnWrapper extends MultiFn{
  MultiFn inner; // starts null, then changes to MultiFn but never back.
  // combinator from defmethod -> defmethod
  IFn wrapper;  // starts null, then changes to MultiFn but never back.

  static final Var println = RT.var("clojure.core", "println"); //dbg

  private MultiFnWrapper(String name, IFn dispatchFn, Object defaultDispatchVal, IRef hierarchy) {
    super(name, dispatchFn, defaultDispatchVal, hierarchy);
    this.inner = null;
    this.wrapper = null;
  }
  public static MultiFnWrapper schemaWrapperCreator(String name, MultiFn inner, IFn wrapper) {
    MultiFnWrapper mfw = new MultiFnWrapper(name, inner.dispatchFn, inner.defaultDispatchVal, inner.hierarchy);
    mfw.inner = inner;
    mfw.wrapper = wrapper;
    return mfw;
  }

  public MultiFn getWrappedMultimethod() {
    if (inner != null) {
      return inner;
    } else {
      throw new AssertionError("inner is nil");
    }
  }

  // MultiFn routes all invocation logic through getMethod(), so we prepare the wrapper here.
  // doesn't intercept calls to dispatchFn.
  public IFn getMethod(Object dispatchVal) {
    final IFn f = inner.getMethod(dispatchVal);
    println.invoke("getMethod called");
    return ((f != null) ? (IFn)wrapper.invoke(f) : null);
  }

  public MultiFn reset(){
    inner.reset();
    return this;
  }

  public MultiFn addMethod(Object dispatchVal, IFn method) {
    inner.addMethod(dispatchVal, method);
    return this;
  }

  public MultiFn removeMethod(Object dispatchVal) {
    inner.removeMethod(dispatchVal);
    return this;
  }

  public MultiFn preferMethod(Object dispatchValX, Object dispatchValY) {
    inner.preferMethod(dispatchValX, dispatchValY);
    return this;
  }

  // allow uninstrumented methods to leak
  public IPersistentMap getMethodTable() {
    // the 4-arity MultiFn constructor calls this.getMethodTable(), but `this.inner` will
    // be uninitialized at that point, since super() calls must go first. The method returns {}
    // at that point anyway, so just hardcode it. Factory function sets this.inner right after.
    return (inner != null) ? inner.getMethodTable() : PersistentHashMap.EMPTY;
  }
  public IPersistentMap getPreferTable() {
    return inner.getPreferTable();
  }
}
