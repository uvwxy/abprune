describe("A suite", function () {

    var exampleState = {
        getSuccessors : function(max){
            // returns a list of states, one for each possible move
        },

        isMovePossible : function(){
            // checks whether any party can move
        },

        getScore : function(){
            // returns the evaluation of the this state
        }
    };
    var myAbPrune = new ABPrune(10, null);

    it('should have depth set', function () {
        expect(myAbPrune._depth).toBe(10);
    });


});