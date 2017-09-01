import { stream } from 'parser-combinator';
import parser from '../../lib/lang/analyzer/parser';
import ast from '../../lib/lang/analyzer/ast';

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit
 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

export default {
    setUp: function(done) {
        done();
    },

    'parse number': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString('42')).value,
                       ast.constant(42),
                       'should accept number.');
        test.done();
    },

    'parse string': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString('"42"')).value,
                       ast.constant('42'),
                       'should accept string.');
        test.done();
    },

    'parse character': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("'4'")).value,
                       ast.constant('4'),
                       'should accept character.');
        test.done();
    },

    'parse native': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString('native "+" 2')).value,
                       ast.native('+', 2),
                       'should accept native.');
        test.done();
    },

    'parse ident': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("anIdent")).value,
                       ast.ident('anIdent'),
                       'should accept ident.');
        test.done();
    },

    'parse identity abstraction': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("a -> a")).value,
                       ast.abstraction('a',ast.ident('a')),
                       'should accept abstraction.');
        test.done();
    },

    'parse true abstraction': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("a b -> a ")).value,
                       ast.abstraction('a',ast.abstraction('b',ast.ident('a'))),
                       'should accept abstraction.');
        test.done();
    },

    'parse simple application': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("a b")).value,
                       ast.application(ast.ident('a'), ast.ident('b')),
                       'should accept application.');
        test.done();
    },

    'parse simple left associativity': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("a b c")).value,
                       ast.application(ast.application(ast.ident('a'), ast.ident('b')), ast.ident('c')),
                       'should accept application.');
        test.done();
    },

    'parse simple right associativity': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("a (b c)")).value,
                       ast.application(ast.ident('a'), ast.application(ast.ident('b'), ast.ident('c'))),
                       'should accept application.');
        test.done();
    },

    'parse number in block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString('(42)')).value,
                       ast.constant(42),
                       'should accept number.');
        test.done();
    },

    'parse string in block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString('("42")')).value,
                       ast.constant('42'),
                       'should accept string.');
        test.done();
    },

    'parse character in block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("('4')")).value,
                       ast.constant('4'),
                       'should accept character.');
        test.done();
    },

    'parse native in a block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString('(native "+" 2)')).value,
                       ast.native('+', 2),
                       'should accept native in a block.');
        test.done();
    },

    'parse ident in a block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("(anIdent)")).value,
                       ast.ident('anIdent'),
                       'should accept ident in a block.');
        test.done();
    },

    'parse identity abstraction in a block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("(a -> a)")).value,
                       ast.abstraction('a',ast.ident('a')),
                       'should accept abstraction in a block.');
        test.done();
    },

    'parse true abstraction in a block': function(test) {
        test.expect(1);
        test.deepEqual(parser.expression(stream.ofString("(a b -> a)")).value,
                       ast.abstraction('a',ast.abstraction('b',ast.ident('a'))),
                       'should accept abstraction in a block.');
        test.done();
    },

}
