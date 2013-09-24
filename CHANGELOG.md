## 0.1.5
 * Add annotated arglists to functions defined with `s/defn` (fixes #18)

## 0.1.4
 * Added Regex as a primitive schema type
 * Added Inst as a primitive schema type
 * Added Uuid as a primitive schema type

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
