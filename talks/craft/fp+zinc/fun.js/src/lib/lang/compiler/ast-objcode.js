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

export default {
    access: (i) => new Access(i),
    closure: (i) => new Closure(i),
    returns: new Returns(),
    apply: new Apply(),
    constant: (c) => new Constant(c)
}
