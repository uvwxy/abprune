describe("A suite", function () {


    var myAbPrune = new ABPrune(10, null);

    it('should have depth set', function () {
        expect(myAbPrune._depth).toBe(10);
    });


});