# &eta;-conversion in Swift 3+

&lambda;-caculus is a formal system expression computation based on application and abstraction. 
In addition a set of transformation rules define a equational theory dedicated to the expression
manipulation. This set contains in particular transformation rules dedicated to the reduction process
based on &alpha;-conversion, &beta;-reduction and &eta;-conversion. 

The &alpha;-conversion allow bound any variable name to be changed. The &beta;-reduction explains
the application in terms of substitution. Finally the &eta;-conversion stated &lambda;x.(f x) &Leftrightarrow; f
whenever x does not appear free in f.

## Defining Functions

In Swift a function is defined by a name, a set of named arguments and a returned type. For instance we can
simply define the addition with the following function `add`.

```Swift
func add(a: Int) -> (Int) -> Int {
    return { b in a + b }
}
```

Then calling this function in Swift can be easily done but this requires the argument names. Sweet Objective-C
expressivity legacy!

```Swift
add(a:1)(2)
```

It's important to notice the difference between a function definition from an anonymous function. In the first
case the argument name is required when such argument name is prohibited when applying a closure. Why this 
difference? Because of function redefinition principle in Swfit.

## Function redefinition 

In order to increase expressivity each argument name can be defined or simply ignored. This is done adding a 
new name before the parameter name if we want to distinguish the argument name from the parameter name. In 
addition `_` means no specific argument name. 

Then we can define `add`  with a DSL point of view ignoring the name of the first parameter and naming the second 
one `to`. 

```Swift
func add(_ a: Int) -> (Int) -> Int {
    return { b in a + b }
}
```

Then calling this function reflect the argument names convention chosen in the specification.

```Swift
add(1)(2)
```

## Losing a transformation rule!

Back to these definitions each function has:
- the same name i.e. `add` and 
- the same signature i.e. `Int -> Int -> Int`

Only argument names make the difference between these functions. Well based on this 
what can we learn and what can we do when we want to deal with &eta;-conversion? 

As mentioned in the introduction the &eta;-conversion stated &lambda;x.(f x) &longleftrightarrow;<sub>&eta;</sub> f whenever x does not appear free in f. This can be separated in two transformation rules:
- &eta;-expansion stated f &longrightarrow;<sub>&eta;</sub> &lambda;x.(f x)
- &eta;-reduction stated &lambda;x.(f x) &longrightarrow;<sub>&eta;</sub> f 

### The &eta;-expansion

In Swift the &eta;-expansion is verified since function can be naturally referenced in the langage. But this can't 
always be done because of this function overloading capability.

```Swift
let increment_1 = add(a:1)
let increment_2 = add(1)
```

This can also be expressed applying the &eta;-expansion transformation rule as follow:

```Swift
let increment_1_eta_expanded = { b in add(a:1)(b) }
let increment_2_eta_expanded = { b in add(1)(b)   }
```

As we can see since a functional expression can expressed it's expansion can therefor 
be also expressed. So far so
good!

### The &eta;-reduction

If we have a list of integers we can for instance apply this `add` on each element. 
This can be done calling the `map` function as follow:

```Swift
let l = [1,2].map{ b in add(b) }
```

The mapped function can be simply reduced applying the &eta;-reduction transformation rule.

```Swift
let l_eta_reduced : [(Int -> Int] = [1,2].map(add)
```

This seems quite natural but here we face a little problem. In fact which `add` is applied since two definitions exist.
So lets try compiling the code and see what's is going one! 

```Swift
error: repl.swift:18:19: error: ambiguous use of 'add'
let l_eta_reduced : [Int -> Int] = [1,2].map(add)
                                         ^
repl.swift:3:6: note: found this candidate
func add(a: Int) -> (Int) -> Int {
     ^
repl.swift:6:6: note: found this candidate
func add(_ a: Int) -> (Int) -> Int {
     ^
```

Here the compiler is not able to choose the add function because the signatures are equivalent. Only parameter name
differs but it's not - and unfortunately cannot - be used when specifying the mapped function.

As a consequence the &eta;-reduction cannot be applied which invalidates the &eta;-conversion transformation rule!

## Redefinition in classes

In the previous sections we try to apply &eta-conversion in presence of functions. So now lets try with function 
redefinitions in a class.

```Swift
class MyInt {
  static func add(a:Int) -> (Int) -> Int { 
    return { b in a + b}
  }  
  static func add(_ a:Int) -> (Int) -> Int { 
    return { b in a + b}
  }
}
```

The previous integers list transformation can be transposed using a class prefix for the function selection.

```Swift
let l = [1,2].map{ b in MyInt.add(a:b) }
```

From this expression we can try to apply the &eta;-reduction

```Swift
let l_eta_reduced : [(Int) -> Int] = [1,2].map(MyInt.add) 
```

 Once again the compiler raises the same kind of error. 

```Swift
error: repl.swift:9:46: error: ambiguous use of 'add'
let l_eta_reduced : [(Int) -> Int] = [1,2].map(MyInt.add)
                                               ^
repl.swift:2:15: note: found this candidate
  static func add(a:Int) -> (Int) -> Int { 
              ^
repl.swift:5:15: note: found this candidate
  static func add(_ a:Int) -> (Int) -> Int { 
              ^
```

Fortunately we have the same behavior but unlike functions each class method 
can be expressed adding parameter names. Then the previous expression can be 
more precise as shown in the next example.

```Swift
let l_eta_reducted = [1,2].map(MyInt.add(a:))
```

In this last approach we are able to distinguish two methods with same profile
using parameter names involving the &eta;-reduction transformation rule. Therefor
the &eta;-conversion is guarantee when we deal with method in classes only!

## Expressiveness & Inconsistency

The argument naming convention came from Objective-C. This legacy has been applied 
for expressivness purpose. For instance delegates in iOS use this capability when a 
method has the same semantic but with different contexts. 

Unfortunately the reverse of the medal is the difficulty of the expressiveness when we 
want to use all transformation rules - mainly the &eta;-conversion - when the code is 
designed using functionnal programming paradigm. Finally the expressivity is not the 
same when we manipulate functions or static method class implying a inconsistency in 
the language!

Fortunately Swift is a young langage and we can hope this &eta;-conversion will be 
overcome enabling function qualification with parameter names because such evolution does 
not imply backward incompatibilities.