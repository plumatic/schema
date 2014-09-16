## 0.2.7
 * **Deprecate** old `^{:s schema}` syntax for providing schemas.
 * Add `isa` schema for Clojure hierarchies.
 * Preserve the types of maps (including Records) when coercing with map schemas.
 * Smarter code generation in s/defrecord to avoid dead code warnings
 * Fix printed form of s/Str in ClojureScript
 * Make some internal fns public to simplify third-part schema extensions
 * Walking records with map schemas preserves the record type
 * Proper explain for s/Str

## 0.2.6
 * Memoize walker computation, providing much faster checker compilation for graph-structured schemas

## 0.2.5 
 * Add `normalized-defn-args` helper fn for defining `s/defn`-like macros.
 * Map schemas correctly validate against struct-maps

## 0.2.4
 * Fixed an issue that could cause ClojureScript compilation to fail
 * Generalize `s/recursive` to work on artibrary refs
 * Add `s/Symbol` as a cross-platfor primitive

## 0.2.3
 * Improved explains for primitives & primitive arrays
 * More robust double coercions
 * Fix cljs warning about extending js/Function
 * Import schema.macros/defmulti in schema.core

## 0.2.2
 * Add validated `s/def`.
 * Add validated `s/defmethod`.
 * Add `Bool` coercions.

## 0.2.1
 * Add `Bool` to cross-platform primitives
 * Fix several minor bugs
 * Replace cljs-test with headless clojurescript.test.

## 0.2.0
 * **breaking change:** Cross-platform leaves String and Number are now Str and Num (the former caused warnings and broke AOT).
 * Replaced core Schema protocol method `check` with `walker`, for increased speed and versatility
 * Support for schema-driven transformations/coercion
 * Schemas for primitive arrays (`longs`, etc)
 * Schematized `letfn` 

## 0.1.10 
 * Remove non-dev dependency on cljx

## 0.1.9
 * Support for pre/postcondition maps in `s/defn`
 * Support for recursive schemas in Clojure
 * Fixes for sm/defn and sm/defrecord with cljs advanced compilation

## 0.1.8
 * Works with advanced compilation in cljs (at least sometimes)

## 0.1.7
 * More small bugfixes
 * Better validation error messages in cljs

## 0.1.6
 * Minor bugfixes (thanks various contributors)
 * Extend schema protocol to regex (thanks [AlexBaranosky](https://github.com/AlexBaranosky)).
 * Add `:never-validate` meta option

## 0.1.5
 * Fix regression in primitive handling introduced in 0.1.4

## 0.1.4
 * Added Regex, Inst, and Uuid as primitive schema types (thanks [jwhitlark](https://github.com/jwhitlark))
 * Add annotated arglists to functions defined with `s/defn` (thanks [danielneal](https://github.com/danielneal))
 * Add `set-fn-validation!` to schema.core, to globally turn validation on or off.
 * Add `:always-validate` metadata on fn/defn name to unconditionally use validation.

## 0.1.3
 * Fix compatibility with Clojurescript 1889 (removal of format)

## 0.1.2
 * Validate returns the value on success
 * Sequence schemas only match sequential? things, to match map and set
 * Implementation of `defschema` puts name in metadata, rather than generating named schema
 * Improved error messages and stack traces for `s/defn`

## 0.1.1
 * Bugfix: with-fn-validation persisting after Exception

## 0.1.0
 * Initial release
