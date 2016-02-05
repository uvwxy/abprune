describe("The ABPrune engine", function () {

    // Game rules: each player picks a place in the array.
    // Game score is the sum of chosen indices.
    var game = {
        createInitState: function (size) {
            var state = {};
            this._copyFunctions(state);
            // Setup empty game [0,1,2,...,size-1]
            state.data = Array(size).fill(0);
            return state;
        },
        _copyFunctions: function(state){
            state.getSuccessors = this.getSuccessors;
            state.isGameOver = this.isGameOver;
            state.getScore = this.getScore;
            state.isMoveValid = this.isMoveValid;
            state._copyFunctions = this._copyFunctions;
        },
        getSuccessors: function (max) {
            var succs = [];
            // returns a list of states, one for each possible move
            if (!this.isGameOver()) {
                for (var move = 0; move < this.data.length; move++){
                    if (this.isMoveValid(move, max ? 1 : 2)){
                        var s = { data : this.data.slice(0) };
                        s.data[move] = max ? 1 : 2;
                        s.move = move;
                        this._copyFunctions(s);
                        succs.push(s)
                    }
                }
            }
            return succs;
        },
        isMoveValid: function(location, playerId) {
            return this.data[location] == 0;
        },
        isGameOver: function () {
            // checks whether any party can move
            for (var i = 0; i < this.data.length; i++){
                if (this.data[i] == 0){
                    return false;
                }
            }
            return true;
        },

        getScore: function (playerId) {
            this.score = this.data.reduce(function (pV, cV, cI) {
                return pV + (cV == playerId ? cI : 0);
            }, 0);

            return this.score;
        }
    };


    it('should create correct initial state', function(){
        var state = game.createInitState(10);

        expect(state.data.length).toBe(10);
    });

    it('should calculate correct score', function(){
        var state = game.createInitState(10);
        state.data[5] = 1;

        expect(state.getScore(1)).toBe(5);

        state.data[4] = 1;
        expect(state.getScore(1)).toBe(9);

        state.data[3] = 2;
        expect(state.getScore(1)).toBe(9);
        expect(state.getScore(2)).toBe(3);

        state.data = [0,1,0];
        expect(state.getScore(1)).toBe(1);

        state.data = [0, 0, 1];
        expect(state.getScore(1)).toBe(2);
    });

    it('should have depth set', function () {
        var myAbPrune = new ABPrune(10, null);
        expect(myAbPrune._depth).toBe(10);
    });

    it('should use isGameOver correctly', function () {
        var state = game.createInitState(10);

        expect(state.isGameOver()).toBe(false);

        state.data = Array(10).fill(1);

        expect(state.isGameOver()).toBe(true);
    });

    it('should use isMoveValid correctly', function(){
        var state = game.createInitState(3);

        state.data[1] = 1;

        expect(state.isMoveValid(0, 1)).toBe(true);
        expect(state.isMoveValid(1, 1)).toBe(false);
        expect(state.isMoveValid(2, 1)).toBe(true);
        expect(state.isMoveValid(0, 2)).toBe(true);
        expect(state.isMoveValid(1, 2)).toBe(false);
        expect(state.isMoveValid(2, 2)).toBe(true);
    });

    it('should use getSuccessors correctly', function(){
        var state = game.createInitState(3);

        var succs = state.getSuccessors(true);

        expect(succs[0].data).toEqual([1,0,0])
        expect(succs[1].data).toEqual([0,1,0]);
        expect(succs[2].data).toEqual([0,0,1]);

        succs = state.getSuccessors(false);

        expect(succs[0].data).toEqual([2,0,0])
        expect(succs[1].data).toEqual([0,2,0]);
        expect(succs[2].data).toEqual([0,0,2]);

    });

    it('should be able to use _copyFunctions correctly', function(){
        var state = game.createInitState(3);

        var stateClone = {data : [1,1,1]};
        state._copyFunctions(stateClone);
        expect(stateClone.getScore(1)).toBe(3);
    });

    it('should calculate depth 0 correctly', function () {
        var state = game.createInitState(3);
        var ab = new ABPrune(0, state);
        var result = ab.minmax();
        expect(result.score).toBe(0)
        expect(result).toBe(state);
    });

    it('should calculate depth 10, with no moves left', function () {
        var state = game.createInitState(3);
        state.data = [1,1,1];
        state.score = 3;
        var ab = new ABPrune(10, state);
        var result = ab.minmax();
        expect(result.score).toBe(3);
        expect(result).toEqual(state);
    });

    it('should calculate depth 1 correctly', function () {
        var state = game.createInitState(3);
        var ab = new ABPrune(1, state);
        var result = ab.minmax();
        expect(result.data).toEqual([0,0,1]);
        expect(result.score).toBe(2);
        expect(result.move).toBe(2);
    });

    it('should calculate depth 7 correctly', function () {
        var state = game.createInitState(7);
        var ab = new ABPrune(7, state);
        var result = ab.minmax();
        expect(result.data).toEqual([0,0,0,0,0,0,1]);
        expect(result.score).toBe(12);
        expect(result.move).toBe(6)
    });

    it('should equals minmax to alphabeta', function(){

    });
});