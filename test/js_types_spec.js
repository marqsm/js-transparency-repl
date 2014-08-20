var expect = chai.expect;

describe("Sanity checks that console evaluates similarly to browser", function() {
    it("{} + 0 results to NaN", function() {
        expect(isNaN({} + 0)).to.equal(true);
    });
})


describe("Type checks", function() {

    describe("ADD WTFs + normal cases work as expected", function() {
        it("EQUALS(ADD([], []), '')", function() {
            expect(ADD([], [])).to.equal('');
        });

        it("[] + {} == '[object Object]'", function() {
            expect(ADD([], {})).to.equal('[object Object]');
        });

        it("ADD({}, []) == 0", function() {
            expect(ADD({}, [])).to.equal('[object Object]');
        });

        it("{} + []", function() {
            expect({} + []).to.equal('[object Object]');
        });

        it("Normal cases", function() {
            expect(ADD(1, 2)).to.equal(3);
            expect(ADD("a", "b")).to.equal("ab");
            expect(ADD("a", 1)).to.equal("a1");
            expect(ADD(1, "b")).to.equal("1b");
        });
    });


    describe("IS_STRING", function() {
        it("Should be able to recognize strings", function() {
            expect(IS_STRING('asdf')).to.equal(true);
            expect(IS_STRING(false)).to.equal(false);
            expect(IS_STRING(null)).to.equal(false);
            expect(IS_STRING(101)).to.equal(false);
        });
    });

    describe("IS_NUMBER", function() {
        it("Should be able to recognize numbers", function() {
            expect(IS_NUMBER(101)).to.equal(true);
            expect(IS_NUMBER('asdf')).to.equal(false);
            expect(IS_NUMBER(false)).to.equal(false);
            expect(IS_NUMBER(null)).to.equal(false);
        });
    });

    describe("IS_BOOLEAN", function() {
        it("Should be able to recognize booleans", function() {
            expect(IS_BOOLEAN('asdf')).to.equal(false);
            expect(IS_BOOLEAN(false)).to.equal(true);
            expect(IS_BOOLEAN(true)).to.equal(true);
            expect(IS_BOOLEAN(94)).to.equal(false);
            expect(IS_BOOLEAN([1, 2])).to.equal(false);
            expect(IS_BOOLEAN(null)).to.equal(false);
        });
    });

    describe("EQUALS", function() {
        it("numbers", function() {
            expect(EQUALS(10, 1)).to.equal(false);
            expect(EQUALS(10, 10)).to.equal(true);
        });
        it("Strings", function() {
            expect(EQUALS("a", "a")).to.equal(true);
            expect(EQUALS("ab", "ac")).to.equal(false);
            expect(EQUALS("ab", 10)).to.equal(false);
            expect(EQUALS("ab", false)).to.equal(false);
            expect(EQUALS("ab", null)).to.equal(false);
            expect(EQUALS("ab", undefined)).to.equal(false);
            expect(EQUALS("ab", NaN)).to.equal(false);
        });
        it("Booleans", function() {
            expect(EQUALS(true, true)).to.equal(true);
            expect(EQUALS(false, false)).to.equal(true);
            expect(EQUALS(true, false)).to.equal(false);
            expect(EQUALS(false, true)).to.equal(false);
        });

        it("numbers", function() {
            expect(EQUALS(10, 10)).to.equal(true);
            expect(EQUALS(10, 1)).to.equal(false);
            expect(EQUALS(10, "a")).to.equal(false);
            expect(EQUALS(10, NaN)).to.equal(false);
        });

        it("NaN", function() {
            expect(EQUALS(NaN, NaN)).to.equal(false);
            expect(EQUALS(undefined, NaN)).to.equal(false);
            expect(EQUALS(null, NaN)).to.equal(false);
            expect(EQUALS("", NaN)).to.equal(false);
            expect(EQUALS(1, NaN)).to.equal(false);
            expect(EQUALS(false, NaN)).to.equal(false);
            expect(EQUALS({}, NaN)).to.equal(false);
        });

        it("Arrays", function() {
            var a = [1, 2, 3]
            expect(EQUALS(a, a)).to.equal(true);
            expect(EQUALS(a, [1, 2, 3])).to.equal(false);
            expect(EQUALS(a, {})).to.equal(false);
            expect(EQUALS(a, "1,2,3")).to.equal(true);
        });

        it("Objects", function() {
            var a = {'foo':'bar'},
                b = a;

            expect(EQUALS(a, b)).to.equal(true);
            expect(EQUALS(a, {'foo':'bar'})).to.equal(false);
            expect(EQUALS(a, {})).to.equal(false);
            expect(EQUALS(a, undefined)).to.equal(false);
            expect(EQUALS(a, true)).to.equal(false);
            expect(EQUALS(a, null)).to.equal(false);
            expect(EQUALS(a, "")).to.equal(false);
            expect(EQUALS(a, ['foo', 'bar'])).to.equal(false);
            expect(EQUALS(a, "[object Object]")).to.equal(true);
        });


    });




});