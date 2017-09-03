/*
 * fun.js
 * https://github.com/d-plaindoux/talks_n_blog/blob/master/talks/craft/fp%2Bzinc/.js
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

class /*abstract*/ Objcode {
    constructor() {
        if (this.constructor.name === Objcode.name) {
            throw new TypeError("Abstract class");
        }
    }
}

class Access extends Objcode {

    constructor(index) {
        super();
        this.index = index;
    }

    visit(visitor) {
        return visitor.access(this);
    }

}

class Closure extends Objcode {

    constructor(instructions) {
        super();
        this.instructions = instructions;
    }

    visit(visitor) {
        return visitor.closure(this);
    }

}

class Returns extends Objcode {

    visit(visitor) {
        return visitor.returns();
    }

}

class Apply extends Objcode {

    visit(visitor) {
        return visitor.apply();
    }

}

// Extra instructions

class Constant extends Objcode {

    // Number|String|Char -> Objcode
    constructor(value) {
        super();
        this.value = value;
    }

    // Visitor 'a -> 'a
    visit(visitor) {
        return visitor.constant(this);
    }

}

class Ident extends Objcode {

    // Number -> Objcode
    constructor(name) {
        super();
        this.name = name;
    }

    // Visitor 'a -> 'a
    visit(visitor) {
        return visitor.ident(this);
    }

}

class Native extends Objcode {
    // String, Number -> Objcode
    constructor(name) {
        super();
        this.name = name;
    }

    // Visitor 'a -> 'a
    visit(visitor) {
        return visitor.native(this);
    }

}

// -----------------------------------------------------------------------------

class /*abstract*/ EntityObjcode {
    constructor() {
        if (this.constructor.name === EntityObjcode.name) {
            throw new TypeError("Abstract class");
        }
    }
}

class Definition extends EntityObjcode {
    // String, Objcode -> Objcode
    constructor(name, code) {
        super();
        this.name = name;
        this.code = code;
    }

    // Visitor 'a -> 'a
    visit(visitor) {
        return visitor.definition(this);
    }
}

class Main extends EntityObjcode {
    // Objcode -> Objcode
    constructor(code) {
        super();
        this.code = code;
    }

    // Visitor 'a -> 'a
    visit(visitor) {
        return visitor.main(this);
    }
}

export default {
    access: (i) => new Access(i),
    closure: (i) => new Closure(i),
    returns: new Returns(),
    apply: new Apply(),
    ident: (c) => new Ident(c),
    constant: (c) => new Constant(c),
    native: (n) => new Native(n),
    definition: (n,e) => new Definition(n,e),
    main: (e) => new Main(e)
}
